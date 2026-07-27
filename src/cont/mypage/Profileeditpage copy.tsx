import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DaumPostcode, { Address } from 'react-daum-postcode';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { useAuth } from '../../comp/AuthProvider';

interface ProfileForm {
    nick: string;
    name: string;
    grade: string;
    storeaddr: string;
    storeaddrDetail: string;
    phoneFirst: string;
    phoneMiddle: string;
    phoneLast: string;
    email: string;
    smsAgree: boolean;
    emailAgree: boolean;
    regdate: string;
}

const ProfileEditPage = () => {
    const navigate = useNavigate();
    const { member, logout } = useAuth();
    const BACK_URL = process.env.REACT_APP_BACK_END_URL;

    const [loading, setLoading] = useState(true);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const [isEditingNick, setIsEditingNick] = useState(false);
    const [tempNick, setTempNick] = useState('');
    // 기존 닉네임 상태일 때는 기본값을 true로 설정
    const [isNickChecked, setIsNickChecked] = useState(true);

    const [form, setForm] = useState<ProfileForm>({
        nick: '',
        name: '',
        grade: '',
        storeaddr: '',
        storeaddrDetail: '',
        phoneFirst: '010',
        phoneMiddle: '',
        phoneLast: '',
        email: '',
        smsAgree: false,
        emailAgree: false,
        regdate: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!member?.email) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(
                    `${BACK_URL}/api/member/mypage`,
                    {
                        params: {
                            email: member?.email
                        }
                    }
                );

                const data = response.data;

                setForm({
                    nick: data.nick || '',
                    name: data.name || '',
                    grade: data.grade || '',
                    storeaddr: data.storeaddr ?? '',
                    storeaddrDetail: '',
                    phoneFirst: '010',
                    phoneMiddle: '',
                    phoneLast: '',
                    email: data.email || '',
                    smsAgree: false,
                    emailAgree: false,
                    regdate: data.regdate || ''
                });
            } catch (error) {
                console.error(error);
                alert("회원정보 조회 실패");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [member, BACK_URL]);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;
        setForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, checked } = event.target;
        setForm((previousForm) => ({
            ...previousForm,
            [name]: checked,
        }));
    };

    const handleNumberChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = event.target;
        const numberOnlyValue = value.replace(/[^0-9]/g, '');

        setForm((previousForm) => ({
            ...previousForm,
            [name]: numberOnlyValue,
        }));
    };

    // 닉네임 수정 시작
    const handleStartNickEdit = () => {
        setTempNick(form.nick);
        setIsEditingNick(true);
        setIsNickChecked(false);
    };

    // 닉네임 중복확인 및 반영
    const handleSaveNick = async () => {
        const trimmedNick = tempNick.trim();
        if (!trimmedNick) {
            alert('닉네임을 입력해주세요.');
            return;
        }

        // 기존 닉네임과 같으면 중복검사 생략
        if (trimmedNick !== form.nick) {
            try {
                const res = await axios.post(`${BACK_URL}/api/auth/nickCheck`, {
                    nick: trimmedNick,
                });

                if (res.data !== 0) {
                    setIsNickChecked(false);
                    alert('이미 사용 중인 닉네임입니다.');
                    return;
                }

                setIsNickChecked(true);
            } catch (error) {
                console.error(error);
                setIsNickChecked(false);
                alert('닉네임 확인 중 오류가 발생했습니다.');
                return;
            }
        } else {
            setIsNickChecked(true);
        }

        setForm((prev) => ({
            ...prev,
            nick: trimmedNick,
        }));
        setIsEditingNick(false);
    };

    // 카카오 우편번호 검색 완료 핸들러
    const handleCompleteAddress = (data: Address) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        setForm((prev) => ({
            ...prev,
            storeaddr: fullAddress,
        }));

        setIsAddressModalOpen(false);
    };

    const canSave = Boolean(
        form.nick.trim() &&
        form.name.trim() &&
        form.email.trim() &&
        form.phoneFirst.trim() &&
        form.phoneMiddle.trim() &&
        form.phoneLast.trim() &&
        form.storeaddr.trim() &&
        isNickChecked
    );

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!form.nick.trim()) {
            alert("닉네임을 입력해주세요.");
            return;
        }
        if (!form.phoneMiddle || !form.phoneLast) {
            alert('휴대전화 번호를 입력해주세요.');
            return;
        }
        if (!form.email.trim()) {
            alert('이메일을 입력해주세요.');
            return;
        }

        const fullStoreAddress = form.storeaddrDetail
            ? `${form.storeaddr} ${form.storeaddrDetail.trim()}`
            : form.storeaddr;

        try {
            const requestData = await axios.post(
                `${BACK_URL}/api/member/update`,
                {
                    nick: form.nick,
                    mphone: [
                        form.phoneFirst,
                        form.phoneMiddle,
                        form.phoneLast,
                    ].join('-'),
                    email: form.email.trim(),
                    storeaddr: fullStoreAddress,
                    smsAgree: form.smsAgree ? 'Y' : 'N',
                    emailAgree: form.emailAgree ? 'Y' : 'N',
                }
            );

            console.log('회원정보 수정 요청:', requestData);
            alert('기본정보가 저장되었습니다.');
        } catch (error) {
            console.error('회원정보 수정 실패:', error);
            alert('기본정보 저장에 실패했습니다.');
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleWithdraw = async () => {
        if (!window.confirm("정말 탈퇴하시겠습니까?")) {
            return;
        }
        try {
            await axios.delete(
                `${BACK_URL}/api/member/withdraw`,
                {
                    params: {
                        num: member?.mnum
                    }
                }
            );
            await logout();

            alert("회원 탈퇴가 완료되었습니다.");
            navigate("/");
        } catch (error) {
            console.error("탈퇴 실패", error);
            alert("회원 탈퇴 처리 중 오류가 발생했습니다.");
        }
    };

    if (loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: '500px' }}
            >
                <div className="text-center">
                    <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                    >
                        <span className="visually-hidden">로딩 중</span>
                    </div>
                    <p className="text-secondary mb-0">
                        회원정보를 불러오는 중입니다.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <main className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-xl-10">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-bottom py-4 px-4 px-md-5">
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                        width: '46px',
                                        height: '46px',
                                        fontSize: '20px',
                                    }}
                                >
                                    👤
                                </div>
                                <div>
                                    <h2 className="h4 fw-bold mb-1">
                                        기본정보 관리
                                    </h2>
                                    <p className="text-secondary mb-0">
                                        회원님의 기본정보와 수신 설정을 관리합니다.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card-body p-4 p-md-5">
                            <form onSubmit={handleSubmit}>
                                <section className="mb-5">
                                    <h3 className="h6 fw-bold text-primary mb-3">
                                        회원 기본정보
                                    </h3>

                                    <div className="border rounded-3 overflow-hidden">
                                        {/* 닉네임 */}
                                        <div className="row g-0 border-bottom">
                                            <div className="col-md-3 bg-light px-4 py-3 fw-semibold d-flex align-items-center">
                                                닉네임
                                            </div>
                                            <div className="col-md-9 px-4 py-3">
                                                {isEditingNick ? (
                                                    <div className="d-flex align-items-center gap-2" style={{ maxWidth: '360px' }}>
                                                        <input
                                                            type="text"
                                                            value={tempNick}
                                                            onChange={(e) => setTempNick(e.target.value)}
                                                            className="form-control form-control-sm"
                                                            placeholder="새 닉네임 입력"
                                                            maxLength={20}
                                                            autoFocus
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={handleSaveNick}
                                                            className="btn btn-primary btn-sm text-nowrap"
                                                        >
                                                            완료
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsEditingNick(false)}
                                                            className="btn btn-outline-secondary btn-sm text-nowrap"
                                                        >
                                                            취소
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex align-items-center gap-3">
                                                        <span>{form.nick}</span>
                                                        <button
                                                            type="button"
                                                            onClick={handleStartNickEdit}
                                                            className="btn btn-outline-secondary btn-sm"
                                                        >
                                                            수정하기
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 성명 */}
                                        <div className="row g-0 border-bottom">
                                            <div className="col-md-3 bg-light px-4 py-3 fw-semibold">
                                                성명
                                            </div>
                                            <div className="col-md-9 px-4 py-3">
                                                <div className="d-flex flex-wrap align-items-center gap-3">
                                                    <span>{form.name}</span>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary btn-sm"
                                                    >
                                                        인적사항 변경
                                                    </button>
                                                </div>
                                                <p className="small text-secondary mt-2 mb-0">
                                                    이름, 생년월일, 성별이 변경된 경우 본인 확인을 통해 수정할 수 있습니다.
                                                </p>
                                            </div>
                                        </div>

                                        {/* 멤버등급 */}
                                        <div className="row g-0 border-bottom">
                                            <div className="col-md-3 bg-light px-4 py-3 fw-semibold">
                                                멤버등급
                                            </div>
                                            <div className="col-md-9 px-4 py-3">
                                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                                                    {form.grade}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 지점 주소 */}
                                        <div className="row g-0 border-bottom">
                                            <div className="col-md-3 bg-light px-4 py-3 fw-semibold">
                                                지점 주소
                                            </div>
                                            <div className="col-md-9 px-4 py-3">
                                                <div className="d-flex gap-2 mb-2">
                                                    <input
                                                        type="text"
                                                        name="storeaddr"
                                                        value={form.storeaddr}
                                                        readOnly
                                                        className="form-control bg-light"
                                                        placeholder="주소 검색 버튼을 클릭하세요"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsAddressModalOpen(true)}
                                                        className="btn btn-outline-primary text-nowrap"
                                                    >
                                                        주소 검색
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    name="storeaddrDetail"
                                                    value={form.storeaddrDetail}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    placeholder="상세주소를 입력해 주세요 (예: 101동 202호)"
                                                />
                                            </div>
                                        </div>

                                        {/* 가입날짜 */}
                                        <div className="row g-0">
                                            <div className="col-md-3 bg-light px-4 py-3 fw-semibold">
                                                가입날짜
                                            </div>
                                            <div className="col-md-9 px-4 py-3">
                                                {form.regdate}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* 연락처 정보 */}
                                <section className="mb-5">
                                    <h3 className="h6 fw-bold text-primary mb-3">
                                        연락처 정보
                                    </h3>

                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label htmlFor="phoneFirst" className="form-label fw-semibold">
                                                휴대전화
                                            </label>
                                            <div className="row g-2">
                                                <div className="col-4">
                                                    <select
                                                        id="phoneFirst"
                                                        name="phoneFirst"
                                                        value={form.phoneFirst}
                                                        onChange={handleChange}
                                                        className="form-select"
                                                    >
                                                        <option value="010">010</option>
                                                        <option value="011">011</option>
                                                        <option value="016">016</option>
                                                        <option value="017">017</option>
                                                        <option value="018">018</option>
                                                        <option value="019">019</option>
                                                    </select>
                                                </div>
                                                <div className="col-4">
                                                    <input
                                                        type="text"
                                                        name="phoneMiddle"
                                                        value={form.phoneMiddle}
                                                        onChange={handleNumberChange}
                                                        maxLength={4}
                                                        inputMode="numeric"
                                                        className="form-control"
                                                        placeholder="0000"
                                                    />
                                                </div>
                                                <div className="col-4">
                                                    <input
                                                        type="text"
                                                        name="phoneLast"
                                                        value={form.phoneLast}
                                                        onChange={handleNumberChange}
                                                        maxLength={4}
                                                        inputMode="numeric"
                                                        className="form-control"
                                                        placeholder="0000"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="email" className="form-label fw-semibold">
                                                이메일
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                maxLength={100}
                                                className="form-control"
                                                placeholder="example@email.com"
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* 하단 버튼 */}
                                <div className="d-flex align-items-center pt-3 border-top">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="btn btn-outline-secondary px-4"
                                    >
                                        취소
                                    </button>

                                    <div className="ms-auto d-flex align-items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handleWithdraw}
                                            className="btn btn-link text-danger text-decoration-none px-3"
                                        >
                                            회원탈퇴
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!canSave}
                                            className="btn btn-primary px-5"
                                        >
                                            저장하기
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProfileEditPage;