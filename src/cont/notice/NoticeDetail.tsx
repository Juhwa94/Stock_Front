import React, { useState } from 'react';
//공지 상세
function NoticeDetail() {
  // 학원에서 배우는 기초 문법: DB에서 공지사항 한 건을 읽어왔다고 가정하는 더미 데이터 상태
  const [notice, setNotice] = useState({
    title: '[ 공지 ] 온라인 숍 이용 및 배송 안내',
    content: `전화 상담

번호 : 02 - 2274 - 1228
시간 : 오후 1시 ~ 오후 7시 / 주말 및 공휴일 휴무

게시판 상담
게시판 답변은 공휴일을 제외하고, 24시간 내로 드립니다.

무통장 입금 계좌
하나은행 000-000000-00000 (예금주:000)
입금 확인 시간은 주중 오후 3시입니다.
오후 3시 이후에 입금해주실 경우 다음날 오후 3시에 입금 확인 처리 됩니다. 단, 공휴일은 입금 확인 처리가
불가하오니 양해 부탁드립니다.

배송
-택배사 : 만세운송

-배송기간 : 2~4일, 주말 공휴일 제외

-추적 : http://www.doorsetdoor.co.kr/main/index.jsp

-기타 : 배송이 지연될 경우 가입시 남겨주신 연락처로 연락을 드립니다.

-반송지 : 000 000 000 33, 2층 북 마인드 ( 00-0000-0000 )

*연말, 연시, 추석 등 휴일 배송 기간에는 택배 업무량이 많아 평소보다 하루 이틀 더 시간이 소요되는 경우가 발생됩니다.
양해 부탁드립니다.

감사합니다.`
  });

  return (
    // 이미지와 동일한 딥 차콜/블랙 인프라 배경
    <div style={{ backgroundColor: '#ffffff', color: '#000000', padding: '40px', fontFamily: 'monospace', maxWidth: '750px', margin: '0 auto', boxSizing: 'border-box' }}>
      
      {/* 1. 상단 타이틀 영역 */}
      <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '30px', letterSpacing: '0.5px' }}>
        {notice.title}
      </div>

      {/* 2. 본문 내용 출력 영역 (whiteSpace: 'pre-wrap'이 핵심 장갑입니다) */}
      <div style={{ fontSize: '13px', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: '#000000', marginBottom: '6px' }}>
        {notice.content}
      </div>

      {/* 3. 하단 격자 구분선 및 통합 푸터 구역 */}
      <div style={{ borderTop: '1px solid #333333', marginTop: '60px', paddingTop: '20px', fontSize: '11px', color: '#000000', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px', lineHeight: '1.8' }}>
        
        {/* 좌측 가맹점 정보 */}
        <div>
          <span style={{ fontWeight: 'bold', color: '#000000' }}>대표 OOO</span><br />
          사업자 번호 000-00-00000 통신판매업 0000-서울00-0000<br />
          주소 서울특별시 00 00000 0 ( 00 ) 2층<br />
          이용약관 이용약관 개인정보처리방침 호스팅 레몬24(주)<br />
          T. 00-0000-0000 E. 0000000@gmail.com
        </div>

        {/* 중간 내비게이션 링크 */}
        <div>
          <span style={{ color: '#000000', cursor: 'pointer' }}>북 마인드 소개</span><br />
          <span style={{ cursor: 'pointer' }}>입점처 안내</span><br />
          <span style={{ cursor: 'pointer' }}>대량 주문, 커스텀</span>
        </div>

        {/* 우측 게시판 링크 */}
        <div>
          <span style={{ color: '#000000', cursor: 'pointer' }}>공지사항</span><br />
          <span style={{ cursor: 'pointer' }}>문의사항</span><br />
          <span style={{ cursor: 'pointer' }}>사용후기</span>
        </div>

      </div>
       


      </div>
  );
}

export default NoticeDetail;