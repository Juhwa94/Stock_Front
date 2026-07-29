import React, { useState } from 'react';
import styles from './Inquire.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../comp/AuthProvider';

interface InquireVO {
    inum?: number;
    ititle: string;
    iwriter: string;
    icontent: string;
    imgn?: string;
    idate?: string;
    membernum: number;
    secret: string;
    mfile?: File | null;
}

const backendUrl = process.env.REACT_APP_BACK_END_URL;

const InquireForm: React.FC = () => {

    const { member } = useAuth();
    const navigate = useNavigate();

    const [preview, setPreview] =
        useState<string | ArrayBuffer | null>(null);

    const [formData, setFormData] = useState<InquireVO>({
        ititle: '',
        iwriter: member?.nick || '',
        icontent: '',
        membernum: member?.mnum || 0,
        secret: 'N',
        mfile: null
    });

    const formChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const fileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        if (e.target.files) {

            const file = e.target.files[0];

            const reader = new FileReader();

            reader.onloadend = () => {
                setPreview(reader.result);
            };

            reader.readAsDataURL(file);

            setFormData({
                ...formData,
                mfile: file
            });
        }
    };

    const secretChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        setFormData({
            ...formData,
            secret: e.target.checked ? "Y" : "N"
        });
    };


    const myFormSubmit = async (
        e: React.SubmitEvent
    ) => {

        e.preventDefault();

        const data = new FormData();

        data.append("ititle", formData.ititle);
        data.append("iwriter", formData.iwriter);
        data.append("icontent", formData.icontent);
        data.append("membernum",
            formData.membernum.toString());

        data.append("secret", formData.secret);

        if (formData.mfile) {
            data.append("mfile", formData.mfile);
        }

        try {

            const url =
                `${backendUrl}/api/inquiry/inquiryAdd`;

            await axios.post(url, data, {
                headers: {
                    "Content-Type":
                        "multipart/form-data"
                }
            });

            alert("문의가 등록되었습니다.");

            navigate("/inquiry");

        } catch (error) {

            console.log(error);
            alert("등록 실패");

        }

    };

    return (

        <div className={styles.container}>

            <h2 className={styles.title}>
                문의하기
            </h2>

            <form
                className={styles.form}
                onSubmit={myFormSubmit}
            >

                <table className={styles.boardTable}>
                    <tbody>

                        <tr>
                            <th>제목</th>
                            <td>
                                <input
                                    type="text"
                                    name="ititle"
                                    className={styles.input}
                                    onChange={formChange}
                                    required
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>작성자</th>
                            <td>
                                <input
                                    type="text"
                                    value={member?.nick || ""}
                                    readOnly
                                    className={styles.input}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>비밀글</th>
                            <td>
                                <label>
                                    <input
                                        type="checkbox"
                                        onChange={secretChange}
                                    />
                                    비밀글로 등록하기
                                </label>
                            </td>
                        </tr>

                        <tr>
                            <th>내용</th>
                            <td>
                                <textarea
                                    name="icontent"
                                    onChange={formChange}
                                    required
                                    style={{
                                        width: "95%",
                                        height: "250px",
                                        padding: "15px",
                                        resize: "none"
                                    }}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th>이미지</th>
                            <td>
                                <input
                                    type="file"
                                    onChange={fileChange}
                                />
                            </td>
                        </tr>

                        {
                            preview && (

                                <tr>
                                    <td
                                        colSpan={2}
                                        style={{
                                            textAlign:
                                                "center"
                                        }}
                                    >
                                        <img
                                            src={
                                                preview as string
                                            }
                                            alt="미리보기"
                                            width={200}
                                        />
                                    </td>
                                </tr>

                            )
                        }

                    </tbody>

                    <tfoot>
                        <tr>
                            <td
                                colSpan={2}
                                className={
                                    styles.buttonArea
                                }
                            >
                                <button
                                    type="submit"
                                    className={
                                        styles.button
                                    }
                                >
                                    등록하기
                                </button>

                                <button
                                    type="button"
                                    className={
                                        styles.button
                                    }
                                    onClick={() =>
                                        navigate(-1)
                                    }
                                >
                                    돌아가기
                                </button>

                            </td>
                        </tr>
                    </tfoot>

                </table>

            </form>

        </div>

    );
};

export default InquireForm;