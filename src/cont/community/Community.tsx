import React, {useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './community.module.css'
import axios from 'axios';

interface CommunityVO {
cnum : number;
chit : number;
ctitle : string;
cwriter : string;
ccontent : string;
cimgn : string;
cdate : string;
membernum : number;
}

const Community: React.FC = () => {
  const backendUrl = process.env.REACT_APP_BACK_END_URL;
  const [communityList, setCommunityList] = useState<CommunityVO[]>([])

    // const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(1);

    // <검색>을 위한 useState를 추가한다.
    const [searchType, setSearchType] = useState('1');
    const [searchValue, setSearchValue] = useState('');



    // 3. 초기화 시 -> useEffect를 사용해서 axios를 사용해서 서버측 데이터를 받아 와서 useState에 저장하기
    // http://192.168.0.45/projectBack/imgfile/;
    // const imageBasePath = `${backendUrl}/imgfile/`;

    // cPage값 page 서버로 전송
    const fetchcommunityList = async (page: number) => {

        try {
            const urls = `${backendUrl}/api/community/coList`;
            const response = await axios.get(urls, {
                params: {
                    cPage: page,
                    searchType: searchType,
                    searchValue: searchValue
                }
            });
            console.log(response.data.data);
            // useState에 배치
            setCommunityList(response.data.data);
            // setTotalItems(response.data.totalItems);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
            setStartPage(response.data.startPage);
            setEndPage(response.data.endPage);
        } catch (error) {
            console.error(error);
        }
    }
    // 4. useEffect 를 사용해서 서버로 비동기식으로 접속해서 데이터를 가져오는 설정
    useEffect(() => {
        fetchcommunityList(currentPage);
    }, [currentPage, searchType, searchValue]);

    // page Handler
    const pageChange = (page: number) => {
        setCurrentPage(page);
    }

    // 검색 버튼 클릭시에 1페이지 부터 검색!
    const searchFunction = () => {
        fetchcommunityList(1);
        setCurrentPage(1);
        
    }
    
return (
    <div className={styles.container}>

        {/* 제목 */}
        <div className={styles.header}>
            <h2 className={styles.title}>커뮤니티 게시판</h2>

            <Link
                to="/community/form"
                className={styles.writeButton}
            >
                글쓰기
            </Link>
        </div>

        {/* 게시글 목록 */}
        <table className={styles.boardTable}>

          <thead>
    <tr>
        <th>제목</th>
        <th>작성자</th>
        <th>조회수</th>
        <th>작성일</th>
    </tr>
</thead>

<tbody>

{communityList.length > 0 ? (

    communityList.map((item) => (

        <tr key={item.cnum}>

            <td>
                <Link
                    to={`/community/detail/${item.cnum}`}
                    className={styles.titleLink}
                >
                    {item.ctitle}
                </Link>
            </td>

            <td>{item.cwriter}</td>
            <td>{item.chit}</td>
            <td>{item.cdate}</td>

        </tr>

    ))

) : (

    <tr>
        <td colSpan={4} className={styles.noData}>
            등록된 게시글이 없습니다.
        </td>
    </tr>

)}

</tbody>

        </table>

        {/* 검색 */}
        <div className={styles.searchArea}>

            <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className={styles.select}
            >

                <option value="1">작성자</option>
                <option value="2">제목</option>
                <option value="3">내용</option>

            </select>

            <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className={styles.searchInput}
                placeholder="검색어를 입력하세요."
            />

            <button
                className={styles.searchButton}
                onClick={searchFunction}
            >
                검색
            </button>

        </div>

        {/* 페이지 */}
        <div className={styles.pagination}>

            {startPage > 1 && (

                <button
                    className={styles.pageButton}
                    onClick={() => pageChange(startPage - 1)}
                >
                    이전
                </button>

            )}

            {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
            ).map((page) => (

                <button
                    key={page}
                    onClick={() => pageChange(page)}
                    className={
                        page === currentPage
                            ? styles.activePage
                            : styles.pageButton
                    }
                >
                    {page}
                </button>

            ))}

            {endPage < totalPages && (

                <button
                    className={styles.pageButton}
                    onClick={() => pageChange(endPage + 1)}
                >
                    다음
                </button>

            )}

        </div>

    </div>
);
}
export default Community