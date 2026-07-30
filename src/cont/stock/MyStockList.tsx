import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styles from './stock.module.css'
import { Link } from 'react-router-dom';

import { useAuth } from '../../comp/AuthProvider';

/*
{
            "HIT": 0,
            "NUM": 34,
            "WRITER": "작성자378",
            "GALLERYID": 34,
            "TITLE": "테스형임372",
            "IMAGENAME": "pm1.jpg",
            "CONTENT": "내용3727",
            "REIP": "192.168.0.45",
            "GDATE": "2026-07-03T00:54:09.000Z"
        },
여기서 키가 대문자인 이유는 back에서
*/
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
    // @RequestParam("images") MultipartFile[] images
    // File Interface는 javascript에서 파일을 접근할 수 있는 자바스크립트 객체이다.
    IMAGENAME?: string;
}
const MyStockList: React.FC = () => {
    const [myStockList, setMyStockList] = useState<StockVO[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1); // 기본 1값을 초기화
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    //<검색>을 위한 useState를 추가한다.
    const [searchType, setSearchType] = useState('1');
    const [searchValue, setSearchValue] = useState('');

    const { member } = useAuth();

    const backendUrl = process.env.REACT_APP_BACK_END_URL;

    const imageBasePath = `${backendUrl}/imgfile/stock/`;
    // ----------------------------------------------------------------------------
    const fetchMyStockList = async (page: number) => {
        const url = `${backendUrl}/api/stock/myStockList`
        try {
            const response = await axios.get(url, {
                params: {
                    cPage: page,
                    searchType: searchType,
                    searchValue: searchValue,
                    membernum: member?.mnum
                }
            })
            console.log(response.data.data);
            setMyStockList(response.data.data);
            setTotalItems(response.data.totalItems);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
            setStartPage(response.data.startPage);
            setEndPage(response.data.endPage);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchMyStockList(currentPage);
    }, [currentPage])
    // ----------------------------------------------------------------------------
    const pageChange = (page: number) => {
        setCurrentPage(page);
    }

    // 검색 버튼 클릭시에 1페이지 부터 검색!
    const searchFunction = () => {
        setCurrentPage(1);
        fetchMyStockList(1);
    }

    return (
        <div className={`${styles.stockContainer} ${styles.table_responsive}`}>
            <div className={styles.stockHeader}>
                <h2>재고관리</h2>

                <Link to="/stockForm" className={styles.registerBtn}>
                    재고등록
                </Link>
            </div>
            <table className={styles.stockTable}>
                <thead>
                    <tr>
                        <th>도서명</th>
                        <th>ISBN</th>
                        <th>카테고리</th>
                        <th>출판사</th>
                        <th>저자</th>
                        <th>재고량</th>
                    </tr>
                </thead>

                <tbody>
                    {/* 회원 목록 영역 */}
                    {myStockList.map((stock) => (
                        <tr key={stock.SNUM}>

                            <td>
                                <Link to={`/stock/stockDetail/${stock.SNUM}`}
                                    className={styles.titleLink}
                                >{stock.SNAME}</Link>
                            </td>
                            <td>{stock.SISBN}</td>
                            <td>{stock.SCATEGORY}</td>
                            <td>{stock.SPUBLISHER}</td>
                            <td>{stock.SAUTHOR}</td>
                            <td>{stock.SAMOUNT}</td>
                        </tr>
                    ))}
                </tbody>

                <tfoot>
                    {/* 검색 영역 */}
                    <tr>
                        <th colSpan={6} className='text-center align-middle'>
                            <select onChange={(e) => { setSearchType(e.target.value) }}>
                                <option value="1">ISBN</option>
                                <option value="2">도서명</option>
                                <option value="3">카테고리</option>
                                <option value="4">출판사</option>
                                <option value="5">저자</option>
                            </select>
                            <input type="text" onChange={(e) => { setSearchValue(e.target.value) }} />
                            <button className='btn btn-warning' onClick={searchFunction}>검색</button>
                        </th>
                    </tr>


                    {/* 페이징 영역 */}
                    <tr>
                        <td colSpan={7}>
                            <div className={styles.pagination}>
                                <nav>
                                    <ul className="pagination justify-content-center">
                                        {/* PrevPage 출력하기 : startPage > 1 보다 클때   
                                        Upboard List = 73
                                        검수용 : totalPages 8 / startPage: 6 / endPage : 8
                                    */}
                                        {startPage > 1 && (
                                            <li className="page-item">
                                                <button className="page-link" onClick={() => { pageChange(startPage - 1) }}>이전</button>
                                            </li>
                                        )}

                                        {/* 페이지 출력하기 */}
                                        {
                                            // startPage = 1 , endPage=3 => [1,2,3]이란 배열을 만들어 준다.
                                            Array.from({ length: endPage - startPage + 1 }, (xx, i) => i + startPage)
                                                .map((page) => (
                                                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                                                        <button className="page-link" onClick={() => { pageChange(page) }}>{page}</button>
                                                    </li>
                                                ))
                                        }

                                        {/* <li className="page-item active">
                                        <button className="page-link">2</button>
                                    </li> */}
                                        {/* NextPage 출력하기 : totalPage 보다 endPage 적을 때 다음페이지가 있는 것으로 계산  
                                검수용 : totalPages 8 / startPage: 1 / endPage : 5
                                */}
                                        {endPage < totalPages && (
                                            <li className="page-item">
                                                <button className="page-link" onClick={() => { pageChange(endPage + 1) }}>다음</button>
                                            </li>
                                        )}
                                    </ul>
                                </nav>
                            </div>
                        </td>
                    </tr>

                </tfoot>

            </table>
        </div>
    );
};
export default MyStockList;