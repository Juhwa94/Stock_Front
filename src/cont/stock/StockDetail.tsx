import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './stock.module.css'
import StockUpdate from './StockUpdate';
import { useAuth } from '../../comp/AuthProvider';

interface StockVO {
    SNUM: number;
    SNAME: string;
    SISBN: string;
    SCATEGORY: string;
    SPUBLISHER: string;
    SAUTHOR: string;
    SAMOUNT: number;
    SPRICE: number;
    MEMBERNUM: number;
    STOCKIMAGE?: string;
    STOCKNUM?: number;
}

const backendUrl = process.env.REACT_APP_BACK_END_URL;

const StockDetail: React.FC = () => {
    const [stock, setStock] = useState<StockVO[]>([]);
    const { SNUM } = useParams<{ SNUM: string }>();
    const { member } = useAuth();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedSnum, setSelectedSnum] = useState<number | null>(null);

    useEffect(() => {
        const detailServer = async () => {

            const url = `${backendUrl}/api/stock/stockDetail?snum=${SNUM}`;
            const resp = await axios.get(url);

            setStock(resp.data);
            console.log(resp.data);
        }

        detailServer();
    }, [SNUM]);

    const handleDelete = async () => {

        if (!window.confirm("정말 삭제하시겠습니까?")) {
            return;
        }

        try {
            await axios.delete(
                `${backendUrl}/api/stock/deleteStock?snum=${SNUM}`
            );

            alert("삭제 완료");
            navigate("/");

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
                        <th>도서명</th>
                        <td>{stock[0]?.SNAME}</td>
                    </tr>
                    <tr>
                        <th>ISBN</th>
                        <td>{stock[0]?.SISBN}</td>
                    </tr>
                    <tr>
                        <th>카테고리</th>
                        <td>{stock[0]?.SCATEGORY}</td>
                    </tr>
                    <tr>
                        <th>출판사</th>
                        <td>{stock[0]?.SPUBLISHER}</td>
                    </tr>
                    <tr>
                        <th>저자</th>
                        <td>{stock[0]?.SAUTHOR}</td>
                    </tr>
                    <tr>
                        <th>재고량</th>
                        <td>{stock[0]?.SAMOUNT}</td>
                    </tr>
                    <tr>
                        <th>개당 가격</th>
                        <td>{stock[0]?.SPRICE}</td>
                    </tr>
                    <tr>
                        <th>재고현황 이미지</th>
                        <td>
                            {stock[0]?.STOCKIMAGE && (
                                <img
                                    src={`${imageBasePath}${stock[0].STOCKIMAGE}`}
                                    alt="재고 이미지"
                                    className={styles.thumbnail}
                                    onClick={() => setShowModal(true)}
                                />
                            )}
                        </td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td colSpan={2}>
                            {stock[0]?.MEMBERNUM === member?.mnum && (<>
                                <button onClick={() => { setSelectedSnum(stock[0].SNUM); setShowUpdateModal(true); }}
                                >수정</button>
                                <button onClick={handleDelete}>삭제</button>
                            </>)}
                            <Link to="/" className={styles.listLink}>목록</Link>
                        </td>
                    </tr>
                </tfoot>
            </table>
            {
                showModal && (
                    <div
                        className={styles.modalBackground}
                        onClick={() => setShowModal(false)}
                    >
                        <div
                            className={styles.modalContent}
                            onClick={(e) => e.stopPropagation()}
                        >

                            {stock.map((item, index) => (
                                <div key={index} className={styles.fileItem}>
                                    <span>{item.STOCKIMAGE}</span>

                                    <img
                                        src={`${imageBasePath}${item.STOCKIMAGE}`}
                                        alt="재고 이미지"
                                    />
                                </div>
                            ))}

                            <button
                                onClick={() => setShowModal(false)}
                            >
                                닫기
                            </button>

                        </div>
                    </div>
                )
            }
            {
                showUpdateModal && selectedSnum && (
                    <div
                        className={styles.modalBackground}
                        onClick={() => setShowUpdateModal(false)}
                    >
                        <div
                            className={styles.modalContent}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <StockUpdate
                                snum={selectedSnum}
                                onClose={() => setShowUpdateModal(false)}
                            />
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default StockDetail;