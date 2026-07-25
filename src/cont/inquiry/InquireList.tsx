import React, { useEffect, useState } from 'react'
import styles from './Inquire.module.css'
import { Link } from 'react-router-dom'
import axios from 'axios';

interface InquiryVO {
    inum: number;
    ititle: string;
    iwriter: string;
    icontent: string;
    imgn: string;
    membernum: number;
    idate: string;
}

const InquireList: React.FC = () => {
    //2. 서버데이터 JsonArray를 자바스크립트 배열로 저장할 useState 만들기
    const [inquiryList, setInquiryList] = useState<InquiryVO[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1); //cPate의 기본 1값을 초기화
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);

    //<검색>을 위한 useState를 추가한다.
    const [searchType, setSearchType] = useState('1');
    const [searchValue, setSearchValue] = useState('');

    const backendUrl = process.env.REACT_APP_BACK_END_URL;

    //3. 초기화 시->useEffect를 사용해서  axios를 사용해서 서버측 데이트를 반아 와서 useState에 저장하기
    //http://192.168.0.195/myictstudy/imgfile/
    const imageBasePath = `${backendUrl}/imgfile/`;


    // currentPage 상태가 바뀔 때마다 스크롤을 맨 위로 올림
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [currentPage]);

    const fetchInquiryList = async (page: number) => {
        try {
            console.log(backendUrl);
            const urls = `${backendUrl}/api/inquiry/inquiryList`;
            const response = await axios.get(urls, {
                params: {
                    cPage: page,
                    searchType: searchType,
                    searchValue: searchValue
                }
            });
            console.log(response.data.data);
            //useState에 배치
            setInquiryList(response.data.data);
            setTotalItems(response.data.totalItems);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
            setStartPage(response.data.startPage);
            setEndPage(response.data.endPage);
        } catch (error) {
            console.error("데이터 가져오기 실패:" + error);
        }
    }
    //4. useEffect를 사용해서 서버로 비동기식으로 접속해서 데이터를 가져오는 설정
    useEffect(() => {
        fetchInquiryList(currentPage);
    }, [currentPage])

    //page Handler 
    const pageChange = (page: number) => {
        setCurrentPage(page);
    }
    //검색 버튼 클릭시에 1페이지 부터 검색!
    const searchFunction = () => {
        fetchInquiryList(1);
    }
    return (
        <div className={styles.container}>
            <table className={styles.boardTable}>
                <thead>
                    <tr><td colSpan={5}>여기는 페이지{currentPage}</td></tr>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        inquiryList.map((item) => (
                            <tr key={item.inum}>
                                <td>{item.inum}</td>
                                <td>
                                    <Link to={`/inquiry/detail/${item.inum}`}
                                        className={styles.titleLink}
                                    >{item.ititle}</Link>
                                </td>
                                <td>{item.iwriter}</td>
                                <td>{item.imgn ? (
                                    <img src={`${imageBasePath}${item.imgn}`}
                                        alt={item.ititle} style={{ width: '80px', height: 'auto' }}
                                    />) : ("No Image")}
                                </td>

                                <td>{item.idate}</td>
                            </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <th colSpan={5} className='text-center align-middle'>
                            <select onChange={(e) => { setSearchType(e.target.value) }}>
                                <option value="1">작성자</option>
                                <option value="2">제목</option>
                                <option value="3">내용</option>
                            </select>
                            <input type="text" onChange={(e) => { setSearchValue(e.target.value) }} />
                            <button className='btn btn-warning' onClick={searchFunction}>검색</button>
                        </th>
                    </tr>
                    <tr>
                        <td colSpan={6} style={{ textAlign: "center" }}>

                            <nav>
                                <ul className="pagination justify-content-center">
                                    {startPage > 1 && (
                                        <li className="page-item">
                                            <button className="page-link"
                                                onClick={() => { pageChange(startPage - 1) }}>
                                                이전</button>
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


                                    {/*
                                NextPage 출력하기 : totalPage 보다 endPage 적을 때 다음페이지가 
                                있는 것으로 계산        
                                */}
                                    {endPage < totalPages && (
                                        <li className="page-item">
                                            <button className="page-link" onClick={() => { pageChange(endPage + 1) }}>
                                                다음</button>
                                        </li>
                                    )}
                                </ul>
                            </nav>
                        </td>
                    </tr>
                </tfoot>
            </table>


            {/* UpBoardForm.tsx  */}
            <Link to="/InquireForm" className={styles.button}>
                글쓰기
            </Link>

            {/* <Link to="/InquireDetail" className={styles.button}>
                디테일로 이동하기 위한 버튼
            </Link> */}
        </div>
    )
}

export default InquireList