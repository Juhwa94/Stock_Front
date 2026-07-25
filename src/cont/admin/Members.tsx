import React, { useEffect, useState } from 'react';
import styles from "./adminManage.module.css"
import axios from 'axios';

interface MemberVO {
  mnum: number;
  name: string;
  nick: string;
  email: string;
  mphone: string;
  storeaddr: string;
  grade: string;
  authority: string;
  regdate: string;
}

const Members: React.FC = () => {
  const backendUrl = process.env.REACT_APP_BACK_END_URL;

  const [memberList, setMeberList] = useState<MemberVO[]>([]);

  // 페이징처리 관련 어딜가나 페이징 처리 하실때는 그대로 사용
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // cPage의 기본 1값을 초기화
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);

  // <검색>을 위한 useState를 추가한다.
  const [searchType, setSearchType] = useState('1');
  const [searchValue, setSearchValue] = useState('');

  // 선택된 회원의 mnum
  const [checkedMembers, setCheckedMembers] = useState<number[]>([]);

  const [grade, setGrade] = useState("");


  const fetchMemberList = async (page: number) => {
    try {
      const urls = `${backendUrl}/api/member/memberList`;
      const response = await axios.get(urls, {
        params: {
          cPage: page,
          searchType: searchType,
          searchValue: searchValue
        }
      });
      setMeberList(response.data.data);
      setTotalItems(response.data.totalItems);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setStartPage(response.data.startPage);
      setEndPage(response.data.endPage);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchMemberList(currentPage);
  }, [currentPage])

  // page Handler
  const pageChange = (page: number) => {
    setCurrentPage(page);
  }

  // 검색 버튼 클릭시에 1페이지 부터 검색!
  const searchFunction = () => {
    fetchMemberList(1);
  }

  const updateGrade = async () => {

    if (checkedMembers.length === 0) {
      alert("회원을 선택하세요.");
      return;
    }

    if (grade === "") {
      alert("변경할 등급을 선택하세요.");
      return;
    }

    try {
      await axios.put(
        `${backendUrl}/api/member/updateGrade`,
        {
          memberNums: checkedMembers,
          grade: grade
        }
      );

      alert("등급이 변경되었습니다.");

      setCheckedMembers([]);
      fetchMemberList(currentPage);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.memberContainer}>

      <h2>회원관리</h2>

      <table className={styles.memberTable}>
        <thead>
          <tr>
            <th>토글</th>
            <th>이름</th>
            <th>이메일</th>
            <th>닉네임</th>
            <th>회원등급</th>
            <th>권한</th>
          </tr>
        </thead>

        <tbody>
          {/* 회원 목록 영역 */}
          {memberList.map((member) => (
            <tr key={member.mnum}>
              <td>
                <input
                  type="checkbox"
                  checked={checkedMembers.includes(member.mnum)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCheckedMembers([...checkedMembers, member.mnum]);
                    } else {
                      setCheckedMembers(
                        checkedMembers.filter(num => num !== member.mnum)
                      );
                    }
                  }}
                />
              </td>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.nick}</td>
              <td>
                {member.grade === "REGULAR"
                  ? "일반회원"
                  : member.grade === "VIP"
                    ? "우수회원"
                    : member.grade === "WITHDRAWN"
                      ? "탈퇴회원"
                      : member.grade}
              </td>
              <td>{member.authority}</td>
            </tr>
          ))}

        </tbody>

        <tfoot>
          {/* 검색 영역 */}
          <tr>
            <th colSpan={6} className='text-center align-middle'>
              <select onChange={(e) => { setSearchType(e.target.value) }}>
                <option value="1">회원명</option>
                <option value="2">이메일</option>
                <option value="3">권한</option>
              </select>
              <input type="text" onChange={(e) => { setSearchValue(e.target.value) }} />
              <button className='btn btn-warning' onClick={searchFunction}>검색</button>
            </th>
          </tr>


          {/* 페이징 영역 */}
          <tr>
            <td colSpan={7}>
              <div className={styles.pagination}>

              </div>
            </td>
          </tr>

        </tfoot>

      </table>


      {/* 선택한 회원 등급 변경 */}
      <div style={{ marginTop: "20px" }}>
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        >
          <option value="">등급 선택</option>
          <option value="REGULAR">일반회원</option>
          <option value="VIP">VIP</option>
          <option value="WITHDRAWN">탈퇴</option>
        </select>

        <button onClick={updateGrade}>
          선택 회원 등급 변경
        </button>
      </div>

    </div>
  );
};

export default Members;