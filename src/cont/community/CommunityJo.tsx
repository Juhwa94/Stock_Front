import React, { useState } from 'react';
// 게시글 등록
function CommunityJo() {
  // 학원에서 배우는 가장 정석적인 input/textarea 상태 관리 (양방향 바인딩)
  const [title, setTitle] = useState('[행사] 소소문구 7주년 기념');
  const [content, setContent] = useState(
    `다가오는 3월 19일은 소소문구의 7번째 생일입니다. 올해도 어김없이 감사한 마음을 담아 선물을 준비했어요.`


  );
  const [extraContent, setExtraContent] = useState(
    `☝️선물 하나, 7,000원 할인 쿠폰

기간•3월 11일 수요일~31일 화요일 자정까지 쿠폰을 사용하실 수 있어요

대상•기존 회원분들과 새로운 가입자분들

기준•쿠폰을 사용하여 결제 완료하는 선착순 100분

방법•3만원이상 장바구니에 담으시면 결제창에 “쿠폰선택” 버튼이 있어요! `
  );

  return (
    // 전체 다크 브릭 배경 레이아웃
    <div style={{ backgroundColor: '#ffffff', color: '#E0E0E0', padding: '30px', fontFamily: 'monospace', maxWidth: '750px', margin: '0 auto' }}>
      
      {/* 최상단 타이틀 뷰 */}
      <div style={{ fontSize: '14px', color: '#000000', marginBottom: '20px' }}>
         [ 게시글 등록 ] 소소문구 7주년 기념
      </div>

      {/* 1. 제목 입력 필드 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', color: '#000000', marginBottom: '5px' }}>제목</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', backgroundColor: '#ffffff', border: '1px solid #444444', color: '#000000', padding: '10px', boxSizing: 'border-box', outline: 'none' }}
        />
      </div>

      {/* 2. 본문 내용 입력 필드 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', color: '#000000', marginBottom: '5px' }}>본문 내용</label>
        <textarea 
          // rows="10"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', backgroundColor: '#ffffff', border: '1px solid #444444', color: '#000000', padding: '10px', boxSizing: 'border-box', outline: 'none', resize: 'vertical', lineHeight: '1.6', fontSize: '12px' }}
        />
      </div>

      {/* 3. 본문 이미지 관리 필드 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', color: '#888888', marginBottom: '5px' }}>본문 이미지</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* 가상 이미지 박스 (도면 구현) */}
          <div style={{ width: '280px', height: '100px', backgroundColor: '#D9D9D9', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#555555', fontWeight: 'bold', fontSize: '14px' }}>
            🏪 online store
          </div>
          <button style={{ backgroundColor: '#333333', color: '#E0E0E0', border: '1px solid #555555', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>이미지 등록</button>
          <button style={{ backgroundColor: '#333333', color: '#E0E0E0', border: '1px solid #555555', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>삭제</button>
        </div>
      </div>

      {/* 4. 추가 내용 (하단 컴플라이언스) 필드 */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', fontSize: '13px', color: '#000000', marginBottom: '5px' }}>추가 내용 (하단)</label>
        <textarea 
          // rows="15"
          value={extraContent}
          onChange={(e) => setExtraContent(e.target.value)}
          style={{ width: '100%', backgroundColor: '#fffefe', border: '1px solid #444444', color: '#000000', padding: '10px', boxSizing: 'border-box', outline: 'none', resize: 'vertical', lineHeight: '1.6', fontSize: '12px' }}
        />
      </div>

      {/* 5. 중앙 통제 저장/취소 버튼 그룹 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
        <button style={{ backgroundColor: 'transparent', color: '#000000', border: '2px solid #000000', width: '140px', padding: '10px 0', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>
          등록
        </button>
        <button style={{ backgroundColor: 'transparent', color: '#000000', border: '2px solid #000000', width: '140px', padding: '10px 0', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>
          취소
        </button>
      </div>

      {/* [하단 전선 격선] */}
        <div style={{ borderTop: '1px solid #333333', paddingTop: '20px', fontSize: '11px', color: '#000000', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', lineHeight: '1.8' }}>
          {/* <div>
          <span style={{ fontWeight: 'bold', color: '#000000' }}>대표 OOO</span><br />
          사업자 번호 000-00-00000 통신판매업 0000-서울00-0000<br />
          주소 서울특별시 00 00000 0 ( 00 ) 2층<br />
          이용약관 이용약관 개인정보처리방침 호스팅 카페24(주)<br />
          T. 00-0000-0000 E. 0000000@gmail.com
        </div>
        <div>
          <span style={{ color: '#000000', cursor: 'pointer' }}>북 마인드 소개</span><br />
          <span style={{ cursor: 'pointer' }}>입점처 안내</span><br />
          <span style={{ cursor: 'pointer' }}>대량 주문, 커스텀</span>
        </div>
        <div>
          <span style={{ color: '#000000', cursor: 'pointer' }}>공지사항</span><br />
          <span style={{ cursor: 'pointer' }}>문의사항</span><br />
          <span style={{ cursor: 'pointer' }}>사용후기</span>
        </div>  */}
      </div> 

    </div>
  ); 
}

export default CommunityJo;