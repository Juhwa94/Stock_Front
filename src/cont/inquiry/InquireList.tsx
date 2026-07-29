import React, { useEffect, useState } from 'react'
import styles from './Inquire.module.css'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../../comp/AuthProvider'; 

interface InquiryVO {
    inum: number;
    ititle: string;
    iwriter: string;
    icontent: string;
    imgn: string;
    membernum: number;
    idate: string;
    secret: string; // 추가
}

const InquireList: React.FC = () => {

    const [inquiryList, setInquiryList] = useState<InquiryVO[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);

    // 검색
    const [searchType, setSearchType] = useState('1');
    const [searchValue, setSearchValue] = useState('');

    const backendUrl = process.env.REACT_APP_BACK_END_URL;

    const imageBasePath = `${backendUrl}/imgfile/`;

    const { member } = useAuth();

    // 페이지 변경 시 스크롤 맨 위로
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [currentPage]);

    // 문의 목록 불러오기
    const fetchInquiryList = async (page: number) => {
        try {
            const urls = `${backendUrl}/api/inquiry/inquiryList`;

            const response = await axios.get(urls, {
                params: {
                    cPage: page,
                    searchType: searchType,
                    searchValue: searchValue
                }
            });

            setInquiryList(response.data.data);
            setTotalItems(response.data.totalItems);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
            setStartPage(response.data.startPage);
            setEndPage(response.data.endPage);

            console.log(response.data.data);

        } catch (error) {
            console.error("데이터 가져오기 실패 : ", error);
        }
    }

    // 초기 데이터 불러오기
    useEffect(() => {
        fetchInquiryList(currentPage);
    }, [currentPage]);

    // 페이지 이동
    const pageChange = (page: number) => {
        setCurrentPage(page);
    }

    // 검색
    const searchFunction = () => {
        fetchInquiryList(1);
    }

    return (
        <div className={styles.container}>
            <table className={styles.boardTable}>
                <thead>
                    <tr>
                        <td colSpan={5}>현재 페이지 : {currentPage}</td>
                    </tr>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>이미지</th>
                        <th>작성일</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        inquiryList.map((item) => (
                            <tr key={item.inum}>

                                <td>{item.inum}</td>

                                {/* 비밀글 표시 */}
                                <td>
                                    <Link
                                        to={`/inquiry/detail/${item.inum}`}
                                        className={styles.titleLink}
                                    >
                                        {item.secret === "Y"
                                            ? "비밀글입니다."
                                            : item.ititle}
                                    </Link>
                                </td>

                                <td>{item.secret === "N" ? item.iwriter : "비밀 작성자"}</td>

                                <td>
                                    { item.secret === "N" ? 
                                        item.imgn ? (
                                            <img
                                                src={`${imageBasePath}${item.imgn}`}
                                                alt={item.ititle}
                                                style={{
                                                    width: '80px',
                                                    height: 'auto'
                                                }}
                                            />
                                        ) : (
                                            "No Image"
                                        ) : "비밀 이미지"
                                    }
                                </td>

                                <td>{item.idate}</td>

                            </tr>
                        ))
                    }
                </tbody>

                <tfoot>

                    {/* 검색 */}
                    <tr>
                        <th colSpan={5} className='text-center align-middle'>

                            <select
                                onChange={(e) => {
                                    setSearchType(e.target.value)
                                }}
                            >
                                <option value="1">작성자</option>
                                <option value="2">제목</option>
                                <option value="3">내용</option>
                            </select>

                            <input
                                type="text"
                                onChange={(e) => {
                                    setSearchValue(e.target.value)
                                }}
                            />

                            <button
                                className='btn btn-warning'
                                onClick={searchFunction}
                            >
                                검색
                            </button>

                        </th>
                    </tr>

                    {/* 페이징 */}
                    <tr>
                        <td colSpan={6} style={{ textAlign: "center" }}>

                            <nav>
                                <ul className="pagination justify-content-center">

                                    {/* 이전 */}
                                    {
                                        startPage > 1 && (
                                            <li className="page-item">
                                                <button
                                                    className="page-link"
                                                    onClick={() => {
                                                        pageChange(startPage - 1)
                                                    }}
                                                >
                                                    이전
                                                </button>
                                            </li>
                                        )
                                    }

                                    {/* 페이지 번호 */}
                                    {
                                        Array.from(
                                            { length: endPage - startPage + 1 },
                                            (xx, i) => i + startPage
                                        ).map((page) => (
                                            <li
                                                key={page}
                                                className={`page-item ${page === currentPage ? 'active' : ''}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => {
                                                        pageChange(page)
                                                    }}
                                                >
                                                    {page}
                                                </button>
                                            </li>
                                        ))
                                    }

                                    {/* 다음 */}
                                    {
                                        endPage < totalPages && (
                                            <li className="page-item">
                                                <button
                                                    className="page-link"
                                                    onClick={() => {
                                                        pageChange(endPage + 1)
                                                    }}
                                                >
                                                    다음
                                                </button>
                                            </li>
                                        )
                                    }

                                </ul>
                            </nav>

                        </td>
                    </tr>

                </tfoot>
            </table>

            {/* 글쓰기 버튼 */}
            <Link
                to="/InquireForm"
                className={styles.button}
            >
                글쓰기
            </Link>

        </div>
    )
}

export default InquireList;