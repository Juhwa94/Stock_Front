import React, { FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface MemberForm {
  email: string;
  pwd1: string;
  pwd2: string;
  nick: string;
  name: string;
  phone: string;
  addr: string;
  authority: string;
}

const Signup: React.FC = () => {
  const [form, setForm] = useState<MemberForm>({
    email: '',
    pwd1: '',
    pwd2: '',
    nick: '',
    name: '',
    phone: '',
    addr: '',
    authority: 'MEMBER'
  });
  
  const [code, setCode] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [nickMessage, setNickMessage] = useState('');
  const [isNickChecked, setIsNickChecked] = useState(false);



  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  // 약관 상태 관리
  const [agreements, setAgreements] = useState<string[]>([]);

  const navigate = useNavigate();
  const urls = process.env.REACT_APP_BACK_END_URL;
  console.log("BACKEND URL =", urls);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    //  이메일 인증 상태 초기화
    if (name === 'email') {
      setIsEmailChecked(false);
      setIsEmailVerified(false);
      setEmailMessage('');
    }
  };
  // 이메일 중복 확인 
  const emailDuplicateCheck = async () => {
    if (!form.email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    try {
      const res = await axios.get(
        `${urls}/api/member/emailCheck`,
        {
          params: {
            email: form.email
          }
        }
      );
      if (res.data === 0) {
        alert('사용 가능한 이메일입니다.');
        setEmailMessage('사용 가능한 이메일입니다.');
        setIsEmailChecked(true);
      } else {
        setEmailMessage('이미 사용 중인 이메일입니다.');
        setIsEmailChecked(false);
      }
    } catch (error: any) {
      console.log(error);
      alert("이메일 중복 확인 오류");
    }
  };

  // 이메일 인증 요청
  const emailCheck = async () => {
    try {
      const res = await axios.post(`${urls}/api/auth/emailCheck`, {
        email: form.email,
      });
      if (res.data === 0) {
        alert('인증 번호가 발송되었습니다.');
        setEmailMessage('인증 번호가 발송되었습니다.');
        setIsEmailVerified(false);
      } else {
        alert('이미 가입된 이메일입니다.');
        setEmailMessage('이미 사용 중인 이메일입니다.');
      }
    } catch (error) {
      alert('이메일 인증 오류가 발생했습니다.');
      console.error(error);
    }
  };

  // 인증번호 확인
  const checkEmailCode = async () => {
    try {
      const res = await axios.post(`${urls}/api/auth/emailCheck/certi`, {
        email: form.email,
        code: code
      });
      const result = res.data;
      if (result.success) {
        alert('이메일 인증 성공!');
        setIsEmailVerified(true);
      } else {
        if (result.reason === 'exceeded') {
          alert('5회 이상 인증번호를 틀려 더 이상 시도할 수 없습니다.\n다시 인증번호를 요청하세요.');
        } else if (result.reason === 'expired') {
          alert('인증번호 유효시간이 만료되었습니다.\n다시 인증번호를 요청하세요.');
        } else if (result.reason === 'wrong') {
          alert('인증번호가 일치하지 않습니다.');
        }
      }
    } catch (err) {
      alert('인증번호 확인 오류');
      console.error(err);
    }
  };
  // 닉네임 입력 시 실시간 중복 체크
  useEffect(() => {
    // 닉네임이 비어있으면 메시지 초기화
    if (!form.nick.trim()) {
      setNickMessage('');
      setIsNickChecked(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.post(`${urls}/api/auth/nickCheck`, {
          nick: form.nick,
        });

        if (res.data === 0) {
          setNickMessage('사용 가능한 닉네임입니다.');
          setIsNickChecked(true);
        } else {
          setNickMessage('이미 사용 중인 닉네임입니다.');
          setIsNickChecked(false);
        }
      } catch (error) {
        console.error('닉네임 중복 체크 오류:', error);
        setNickMessage('닉네임 중복 확인 중 오류 발생');
        setIsNickChecked(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [form.nick, urls]);

  //전체 동의 체크박스 핸들러
  const handleAllAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setAgreements(['terms', 'privacy']);
    } else {
      setAgreements([]);
    }
  };

  // 개별 체크박스 핸들러
  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setAgreements([...agreements, value]);
    } else {
      setAgreements(agreements.filter((item) => item !== value));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isEmailVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }
    if (form.pwd1 !== form.pwd2) {
      alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
      return;
    }
    if (!isNickChecked) {
      alert('닉네임을 올바르게 입력해 주세요.');
      return;
    }
    const hasTerms = agreements.includes('terms');
    const hasPrivacy = agreements.includes('privacy');
    if (!hasTerms || !hasPrivacy) {
      alert('필수 약관에 동의하셔야 가입이 가능합니다.');
      return;
    }

    try {
      const res = await axios.post(`${urls}/api/member/signup`, {
        pwd: form.pwd1,
        name: form.name,
        nick: form.nick,
        email: form.email,
        mphone: form.phone,
        storeaddr: form.addr,
        logintype: "LOCAL",
        authority: form.authority,
        marketingAgree: agreements.includes('marketing') ? 'Y' : 'N'
      });

      if (res.status === 200 || res.data.success) {
        alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
        navigate('/user/login');
      }
    } catch (error) {
      alert('회원가입 처리 중 오류가 발생했습니다.');
      console.error(error);
    }
  };
  //약관동의 모달팝업
  const openModal = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
    setShowModal(true);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '650px' }}>
      <form onSubmit={handleSubmit} className="p-4 bg-light border rounded">
        <h2 className="text-center mb-4">회원가입</h2>
        {/* 이메일 */}
        <div className="mb-3 row align-items-center">
          <label htmlFor="email" className="col-sm-3 col-form-label fw-bold">이메일</label>
          <div className="col-sm-6">
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              disabled={isEmailChecked}
              required
            />
          </div>
          <div className="col-sm-3">
            <button type="button" className="btn btn-outline-primary w-100" onClick={emailCheck} disabled={isEmailVerified}>인증요청</button>
          </div>
          {/* {idMessage && <div className="col-12 text-info small mt-1 ps-3">{idMessage}</div>} */}
          {emailMessage && <div className="col-12 text-success small mt-1 ps-3">{emailMessage}</div>}
        </div>

        {/* 인증번호 */}
        <div className="mb-3 row">
          <label htmlFor="code" className="col-sm-3 col-form-label fw-bold">이메일 인증번호</label>
          <div className="col-sm-6">
            <input
              type="text"
              id="code"
              className="form-control"
              value={code}
              onChange={e => setCode(e.target.value)}
              disabled={isEmailVerified}
            />
          </div>
          <div className="col-sm-3">
            <button type="button" className="btn btn-outline-primary w-100" onClick={checkEmailCode} disabled={isEmailVerified}>확인</button>
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="mb-3 row">
          <label htmlFor="pwd1" className="col-sm-3 col-form-label fw-bold">비밀번호</label>
          <div className="col-sm-9">
            <input
              type="password"
              name="pwd1"
              className="form-control"
              value={form.pwd1}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* 비밀번호 재확인 */}
        <div className="mb-3 row">
          <label htmlFor="pwd2" className="col-sm-3 col-form-label fw-bold">비밀번호 재확인</label>
          <div className="col-sm-9">
            <input
              type="password"
              name="pwd2"
              className="form-control"
              value={form.pwd2}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* 이름 입력란 */}
        <div className="mb-3 row">
          <label htmlFor="name" className="col-sm-3 col-form-label fw-bold">이름</label>
          <div className="col-sm-9">
            <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
          </div>
        </div>
        {/* 닉네임 */}
        <div className="mb-3 row">
          <label htmlFor="nick" className="col-sm-3 col-form-label fw-bold">닉네임</label>
          <div className="col-sm-9">
            <input
              type="text"
              name="nick"
              className="form-control"
              value={form.nick}
              onChange={handleChange}
              required
            />
            {nickMessage && (
              <p style={{ color: isNickChecked ? 'green' : 'red', fontSize: '13px' }}>
                {nickMessage}
              </p>
            )}
          </div>
        </div>
        {/* 전화번호 입력란 */}
        <div className="mb-3 row">
          <label htmlFor="phone" className="col-sm-3 col-form-label fw-bold">전화번호</label>
          <div className="col-sm-9">
            <input type="text" name="phone" className="form-control" placeholder="010-0000-0000" value={form.phone} onChange={handleChange} required />
          </div>
        </div>
        {/* 권한 선택 */}
        <div className="mb-3 row">
          <label className="col-sm-3 col-form-label fw-bold">
            가입 유형
          </label>
          <div className="col-sm-9 d-flex gap-4 align-items-center">
            <div className="form-check">
              <input className="form-check-input" type="radio" name="authority" value="MEMBER"checked={form.authority === 'MEMBER'}
                onChange={handleChange}/>
              <label className="form-check-label">
                일반회원
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="authority" value="ADMIN"
                checked={form.authority === 'ADMIN'} onChange={handleChange}/>
              <label className="form-check-label">
                관리자
              </label>
            </div>
          </div>
        </div>
        
        {/* 주소 입력란 */}
        <div className="mb-3 row">
          <label htmlFor="addr" className="col-sm-3 col-form-label fw-bold">주소</label>
          <div className="col-sm-9">
            <input type="text" name="addr" className="form-control" placeholder="도로명 주소를 입력하세요"
              value={form.addr} onChange={handleChange} required={form.authority === 'MEMBER'}/>
          </div>
        </div>
        {/* 약관동의  */}
        <div className="mb-4 p-3 border rounded bg-white">
          <div className="form-check mb-2 pb-2 border-bottom fw-bold">
            <input
              className="form-check-input"
              type="checkbox"
              id="all-agree"
              onChange={handleAllAgreementChange}
              checked={agreements.length === 2}
            />
            <label className="form-check-label" htmlFor="all-agree">전체 동의하기</label>
          </div>

          {/* 서비스 이용약관 */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="terms" id="terms" onChange={handleAgreementChange} checked={agreements.includes("terms")} />
              <label className="form-check-label" htmlFor="terms">서비스 이용약관 동의 <span className="text-danger">(필수)</span></label>
            </div>
            {/* 클릭 시 openModal 함수 호출 */}
            <button
              type="button"
              className="btn btn-link btn-sm text-decoration-none text-secondary"
              onClick={() => openModal(
                '서비스 이용약관',
                `제1조 (목적)
본 약관은 "북마인드 재고관리 시스템"(이하 "시스템")이 제공하는 회원 서비스 및 도서 주문, 재고 조회 관련 제반 서비스의 이용 조건과 절차를 규정함을 목적으로 합니다.

제2조 (회원의 의무)
1. 회원은 가입 시 정확한 정보를 기재해야 하며, 타인의 정보를 도용할 경우 서비스 이용이 제한될 수 있습니다.
2. 회원은 시스템 내 도서 데이터 및 재고 정보를 상업적인 목적으로 무단 복제하거나 배포할 수 없습니다.

제3조 (서비스의 제공 및 변경)
1. 본 시스템은 도서 검색, 실시간 재고 확인, 가맹점별 도서 주문 및 예약 서비스를 제공합니다.
2. 시스템은 유지보수 또는 점검을 위해 사전 공지 후 서비스 제공을 일시적으로 중단할 수 있습니다.`)}
            >
              [보기]
            </button>
          </div>

          {/* 개인정보 수집 */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="privacy" id="privacy" onChange={handleAgreementChange} checked={agreements.includes("privacy")} />
              <label className="form-check-label" htmlFor="privacy">개인정보 수집 및 이용 동의 <span className="text-danger">(필수)</span></label>
            </div>
            <button
              type="button"
              className="btn btn-link btn-sm text-decoration-none text-secondary"
              onClick={() => openModal(
                '개인정보 수집 및 이용 동의',
                `주식회사 북마인드는 회원가입 및 재고관리 서비스 제공을 위해 아래와 같이 개인정보를 수집·이용합니다.

1. 수집 및 이용 목적
- 회원 식별 및 가입 의사 확인
- 도서 주문, 예약, 배송 및 고객 상담 처리
- 재고 변동 및 주문 내역 알림 제공

2. 수집하는 개인정보 항목
- [필수] 이메일 주소, 비밀번호, 닉네임

3. 보유 및 이용 기간
- 회원 탈퇴 시 즉시 파기
- 단, 전자상거래법 등 관계 법령의 규정에 따라 보존할 필요가 있는 경우 해당 기간(5년) 동안 안전하게 보관합니다.

※ 귀하는 본 동의를 거부할 권리가 있으나, 거부 시 회원가입 및 서비스 이용이 제한됩니다.`)}
            >
              [보기]
            </button>
          </div>
        </div>

        {/* 버튼 */}
        <div className="d-flex justify-content-between mt-4">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>뒤로가기</button>
          <button type="submit" className="btn btn-primary">회원가입</button>
        </div>
      </form>
      {showModal && (
        <>
          {/* 모달 창 본체 */}
          <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">{modalTitle}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body" style={{ whiteSpace: 'pre-wrap' }}>
                  {modalContent}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={() => setShowModal(false)}>확인</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Signup;