import React, { useState } from 'react';
// 공지 사항 수정
function NoticeRe() {
  // 학원에서 배우는 가장 정석적인 input/textarea 상태 관리 (양방향 바인딩)
  const [title, setTitle] = useState('[ 공지 ] 온라인 숍 이용 및 배송 안내');
  const [content, setContent] = useState(
    `전화와 상담\n전화 : 02 - 2774 - 1228\n시간 : 오후 1시 ~ 오후 7시 / 주말 및 공휴일 휴무\n\n게시판 알림\n하나은행 000-000000-00000 (북마인드-000)\n입금 확인 시간은 주중 오후 3시입니다.\n오후 3시 이후에 입금해주신 경우 다음날 오후 3시에 입금 확인 처리 됩니다. 단, 통화중은 입금 확인 제외기\n\n은행 계정\n하나은행 000-000000-00000 (북마인드-000)\n결제 은행 하나은행 택배 주말 정체 결제 불편이 내용입니다.`
  );
  const [extraContent, setExtraContent] = useState(
    `배송\nCJ대한통운 - CJ대한통운 당일\n- 추적 URL: http://www.doorstore.co.kr/mainx.jsp\n기간\n3월 22일 수요일 - 3월 31일 금요일\n오후 2시부터 저녁 8시까지\n\n고환, 교환, 상무\n- 교환, 반품, 환불을 원하실 경우, 수령 후 3일이내 Q&A 게시판을 통해 관련 내용을 접수해주세요.\n- 소문로 문공과와 환송 팀임 택배사에서 그러니의 악으로 고롬, 환불을 위해 기서성이 정통합니다.\n- 매매 게시기 안동 통품 경비원 완송 기시님물의 약속 김스메 총식두시만 됩니다. 기시님의 엄역하는 징소후 안내됩니다. (단, 이 과정에서 발생하는 분실 및 배달 막도는 소소문구에서 책임지지\n- 단순 상임으로 인킨 고람, 반품실 경우 왕복 택배비 5,000원을 원원위시아 히허, 왕복 택배비(5,000원)달물이 확인 외이아 먹급 시미스가 원수됩니다.\n- 소소문구에 계통서 드직허민, 결들 후 고환, 반품, 환불 절차가 진행됩니다.\n- 콘의과외아 구매하신 새품문 모웍웍은 믹팅템에서 고환, 민원, 안동이 가능합니다. 단, 2주원 이내에 멈뭉해실 경우안안 가능합니다.\n- 오라라하 유플쟁이시 구광해쿠신 매한 상용은 Q&A 게시괄, 원으로 킹수 주시면, 내통 확인에 왁물 고환 및 환불를 인행합니다.\n\n오배송이나 제품 결정으로 인한 고환, 반품, 방통\n- 제품 품절 및 오배송의 경우, 반품불류는 소소문구에서 주명, 배송이 부명됩니다. 에베 Q&A 게시민을 통해 진면 내용을 정수해주셔야 합니다.\n- 구역의 우주직원 인택 제품이 제물 및 워능은 정우\n- 교환 및 반동 의사를 말하시 없으시고, 잉아마로 만동하섬 경우\n\n감사합니다.`
  );

  return (
    // 전체 다크 브릭 배경 레이아웃
    <div style={{ backgroundColor: '#ffffff', color: '#E0E0E0', padding: '30px', fontFamily: 'monospace', maxWidth: '750px', margin: '0 auto' }}>
      
      {/* 최상단 타이틀 뷰 */}
      <div style={{ fontSize: '14px', color: '#000000', marginBottom: '20px' }}>
         [ 공지 수정 ] 
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
          <button style={{ backgroundColor: '#333333', color: '#E0E0E0', border: '1px solid #555555', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>이미지 수정</button>
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
          저장
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

export default NoticeRe;