import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './Inquire.module.css'
import InquireComm from './Inquirecomm';

interface InquiryVO {
    inum: number;
    ititle: string;
    iwriter: string;
    icontent: string;
    imgn?: string;
    membernum : number;
    idate: string;
}

const backendUrl = process.env.REACT_APP_BACK_END_URL;

const InquiryDetail: React.FC = () => {

    const [inquiry, setInquiry] = useState<InquiryVO | null>(null);
    const { num } = useParams<{ num: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const detailServer = async () => {

            const url = `${backendUrl}/api/inquiry/detail?num=${num}`;
            const resp = await axios.get(url);

            setInquiry(resp.data);
        }

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
                        <td>{inquiry?.iwriter}</td>
                    </tr>

                    <tr>
                        <th>이미지</th>
                        <td>
                            {
                                inquiry?.imgn && (
                                    <img
                                        src={`${imageBasePath}${inquiry.imgn}`}
                                        alt="문의 이미지"
                                    />
                                )
                            }
                        </td>
                    </tr>

                    <tr>
                        <th>내용</th>
                        <td>{inquiry?.icontent}</td>
                    </tr>

                </tbody>

                <tfoot>
                    <tr>
                        <td colSpan={2}>

                            <button onClick={handleDelete}>삭제</button>
<<<<<<< HEAD

                            <Link to="/inquiry">
                                목록
                            </Link>
=======
                            <Link style={{}} to="/inquiry">목록</Link>
>>>>>>> 5ee7b0fb44037b4d85424631e0612cf09cf92419

                        </td>
                    </tr>
                </tfoot>
            </table>

            <hr />

            {/* 댓글 컴포넌트 */}
            <InquireComm num={num} />

        </div>
    )
}

export default InquiryDetail;