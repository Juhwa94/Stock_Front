import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './Inquire.module.css';
import InquireComm from './Inquirecomm';
import { useAuth } from '../../comp/AuthProvider';

interface InquiryVO {
    inum: number;
    ititle: string;
    iwriter: string;
    icontent: string;
    imgn?: string;
    membernum: number;
    idate: string;
    secret: string;
}

const backendUrl = process.env.REACT_APP_BACK_END_URL;

const InquiryDetail: React.FC = () => {

    const [inquiry, setInquiry] = useState<InquiryVO | null>(null);

    const { num } = useParams<{ num: string }>();
    const navigate = useNavigate();
    const { member } = useAuth();

    useEffect(() => {

        const detailServer = async () => {

            const url =
                `${backendUrl}/api/inquiry/detail?num=${num}`;

            const resp = await axios.get(url);

            setInquiry(resp.data);
        };

        detailServer();

    }, [num]);

    const handleDelete = async () => {

        if (!window.confirm("정말 삭제하시겠습니까?")) {
            return;
        }

        try {

            await axios.delete(
                `${backendUrl}/api/inquiry/delete?num=${num}`
            );

            alert("삭제 완료");
            navigate("/inquiry");

        } catch (error) {

            console.log(error);
            alert("삭제 실패");

        }
    };

    const imageBasePath = `${backendUrl}/imgfile/`;

    // 비밀글 확인 여부
    const canReadSecret =
        inquiry?.secret === "N" ||
        inquiry?.membernum === member?.mnum ||
        member?.authority === "ADMIN";

    return (
        <div className={styles.container}>

            <table className={styles.boardTable}>
                <tbody>

                    <tr>
                        <th>번호</th>
                        <td>{inquiry?.inum}</td>
                    </tr>

                    <tr>
                        <th>제목</th>
                        <td>{inquiry?.ititle}</td>
                    </tr>

                    <tr>
                        <th>작성자</th>
                        <td>
                            {
                                canReadSecret
                                    ? inquiry?.iwriter
                                    : "비공개"
                            }
                        </td>
                    </tr>

                    <tr>
                        <th>이미지</th>
                        <td>
                            {
                                canReadSecret &&
                                inquiry?.imgn && (
                                    <img
                                        src={`${imageBasePath}${inquiry.imgn}`}
                                        alt="문의 이미지"
                                    />
                                )
                            }

                            {
                                !canReadSecret &&
                                "비밀글입니다."
                            }
                        </td>
                    </tr>

                    <tr>
                        <th>내용</th>
                        <td>
                            {
                                canReadSecret
                                    ? inquiry?.icontent
                                    : "비밀글입니다."
                            }
                        </td>
                    </tr>

                </tbody>

                <tfoot>
                    <tr>
                        <td colSpan={2}>

                            <div className={styles.buttonArea}>

                                <button
                                    className={styles.button}
                                    onClick={handleDelete}
                                >
                                    삭제
                                </button>

                                <Link
                                    to="/inquiry"
                                    className={styles.button}
                                >
                                    목록
                                </Link>

                            </div>

                        </td>
                    </tr>
                </tfoot>

            </table>

            <hr />

            {
                canReadSecret ? (
                    <InquireComm num={num} />
                ) : (
                    <p
                        style={{
                            textAlign: "center",
                            padding: "20px"
                        }}
                    >
                        비밀글은 작성자와 관리자만 확인할 수 있습니다.
                    </p>
                )
            }

        </div>
    );
};

export default InquiryDetail;