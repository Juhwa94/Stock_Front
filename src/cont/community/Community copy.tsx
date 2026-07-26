import React, { useState } from 'react';
import { Link } from 'react-router-dom';
//게시글
function Community() {
  // 학원에서 배우는 가장 기초적인 상태 관리 변수 (페이지 및 검색어)
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  // [도면 데이터 보급고] image_0eda7d.jpg의 텍스트와 100% 일치하는 더미 데이터
  const pinnedCommunitys = [
    { id: 1, title: '제 17회 서울 디자인 페스티벌', date: '2026. x. xx' },
    { id: 2, title: '런던 디자인 페어', date: '2026. x. xx' },
  ];

  const regularCommunitys = [
    { id: 3, title: '브랜드MD 채용 공고', date: '2026. x. xx' },
    { id: 4, title: '소소 프로젝트 다섯 번째 소소 프로젝트 작가님을 모집합니다.', date: '2026. x. xx' },
    { id: 5, title: '오브젝트 홍대점 팝업 스토어', date: '2026. x. xx' },
    { id: 6, title: '백지장 : 종이장터', date: '2026. x. xx' },
    { id: 7, title: '현대백화점 무역센터점 WE MARKET', date: '2026. x. xx' },
    { id: 8, title: '경력 디자이너 채용', date: '2026. x. xx' },
  ];

  return (
    // 전체 배경 (도면 이미지와 동일한 다크 매트 블랙 인프라)
    <div style={{ backgroundColor: '#ffffff', color: '#000000', padding: '40px', fontFamily: 'monospace', maxWidth: '700px', margin: '0 auto' }}>
      
      {/* [최상단 헤더 관문] */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '4px' }}>[ 북 마인드     게시글 ]</span>
         <button style={{ backgroundColor: 'transparent', color: '#000000', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>
          [게시글 등록]
        </button>
      </div>

      {/* 소소문구 특유의 ASCII 격자 보더라인 (+-------+) */}
      <div style={{ color: '#888888', marginBottom: '15px', letterSpacing: '0.5px' }}>
        <hr />
      </div>

      {/* [📌 1단계: 상단 핀 고정 중요 공지 구역] */}
      <div style={{ padding: '0 5px', marginBottom: '15px' }}>
        {pinnedCommunitys.map((Community) => (
          <div key={Community.id} style={{ margin: '20px 0', fontSize: '18px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <span style={{ marginRight: '12px' }}>📌</span>
            <span style={{ fontWeight: 'bold', letterSpacing: '0.5px' }}>
              [ 게시글 ] {Community.title}
            </span>
          </div>
        ))}
      </div>

      {/* 격자 분리선 */}
      <div style={{ color: '#888888', marginBottom: '10px' }}>
        <hr/>
      </div>

      {/* [2단계: 하단 일반 공지사항 명부 구역] */}
      <div style={{ padding: '0 5px' }}>
        {regularCommunitys.map((Community) => (
          <div key={Community.id}>
            {/* 점선 스트랩 구조 */}
            <div style={{ color: '#000000', fontSize: '12px', margin: '5px 0' }}>
              <hr/>
            </div>
            <div style={{ padding: '10px 0', cursor: 'pointer' }}>
              <div style={{ fontSize: '13px', color: '#000000', marginBottom: '6px' }}>
                [ 게시글 ] {Community.title}
              </div>
              <div style={{ fontSize: '11px', color: '#888888' }}>
                북 마인드 {Community.date}
              </div>
            </div>
          </div>
        ))}
        {/* 리스트 마지막 경계 점선 */}
        <div style={{ color: '#000000', fontSize: '12px', margin: '5px 0' }}>
          <hr/>
        </div>
      </div>

      {/* [3단계: 하단 페이징 버튼 관제 구역] */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '35px 0 25px 0', fontSize: '13px', color: '#000000' }}>
        <span style={{ margin: '0 8px', color: '#000000', fontWeight: 'bold', cursor: 'pointer' }}>[1]</span>
        <span style={{ margin: '0 8px', cursor: 'pointer' }}>2</span>
        <span style={{ margin: '0 8px', cursor: 'pointer' }}>3</span>
        <span style={{ margin: '0 8px', cursor: 'pointer' }}>4</span>
        <span style={{ margin: '0 8px', cursor: 'pointer' }}>5</span>
        <span style={{ margin: '0 8px', cursor: 'pointer' }}>[다음]</span>
      </div>

      {/* [4단계: 최하단 관리 액션 바 및 정밀 검색창 통합 구역] */}
      <div style={{ color: '#000000', letterSpacing: '0.2px' }}>
        <hr/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', fontSize: '13px' }}>
        
        {/* 좌측 관리 기능 보급선 */}
        <div>
          {/* <span style={{ cursor: 'pointer', marginRight: '6px' }}>[ 조회 ]</span> */}
          {/* <span style={{ cursor: 'pointer', margin: '0 6px' }}>[ 수정 ]</span>
          <span style={{ cursor: 'pointer', marginLeft: '6px' }}>[ 삭제 ]</span> */}
        </div>

        {/* 우측 통합 검색 통신망 (새롭게 개량된 부분) */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#444444', marginRight: '10px' }}></span>
          <span>[ 검색 ] </span>
          <input 
            type="text" 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #E0E0E0', color: '#FFFFFF', marginLeft: '5px', width: '120px', outline: 'none' }}
          />
          <span style={{ marginLeft: '5px', cursor: 'pointer' }}>🔍</span>
          {/* <span style={{ color: '#444444', marginLeft: '10px' }}>|</span> */}
        </div>

      </div>
      <div style={{ color: '#000000', marginTop: '5px', letterSpacing: '0.2px' }}>
       <hr/>
      </div>

    </div>
  );
}

export default Community;