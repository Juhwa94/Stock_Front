import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './commdetail.module.css';
import community from './Community';

//게시글 상세 페이지

interface CommunityVO { // 1
  cnum: number;
  ctitle: string;
  cwriter: string;
  ccontent: string;
  cimgn?: string;
  chit: number;
  cdate: string;
  membernum:number;
}
const CommunityDetail: React.FC = () => {

  const backendUrl = process.env.REACT_APP_BACK_END_URL;
  const imageBasePath = `${backendUrl}/imgfile/`;
  const navigate = useNavigate();
  const { num } = useParams<{ num: string }>(); // 3
  const [community, setCommunity] = useState<CommunityVO | null>(null);
  //상세조회
  useEffect(() => {
    const detailServer = async () => {
      try {
      const url = `${backendUrl}/api/community/detail?num=${num}`;
      const resp = await axios.get<CommunityVO>(url);
      setCommunity(resp.data);
      } catch (error) {

         console.error("상세조회 실패 :", error);
      }     
    };

    if (num) {
    detailServer();
    }
    
  }, [num, backendUrl]);

  //삭제
  const deleteCommunity = async () => {
    if (!community) return;

    const check = window.confirm("게시글을 삭제하시겠습니까?");

    if(!check) return;

    try {
      await axios.delete(
        `${backendUrl}/api/community/delete`,
        {
          params: {
            num: community.cnum
          }
        }
      );

      alert("게시글이 삭제되었습니다.");

      navigate("/community");

    } catch (error) {

      console.error("삭제 실패 :", error);

      alert("삭제 중 오류가 발생했습니다.");

    }
  };
  if (!community) {
    return (
      <div className={styles.loading}>게시글을 불러오는 중입니다...</div>
    );
  }

return (
    <div className={styles.container}>

        {/* 카테고리 */}
        <div className={styles.category}>
            [ 게시글 ]
        </div>

        {/* 제목 */}
        <h2 className={styles.title}>
            {community.ctitle}
        </h2>

        {/* 작성 정보 */}
        <div className={styles.info}>
            <span>작성자 : {community.cwriter}</span>
            <span>작성일 : {community.cdate}</span>
            <span>조회수 : {community.chit}</span>
        </div>

        {/* 본문 */}
        <div className={styles.content}>
            {community.ccontent}
        </div>

        {/* 이미지 */}
        {community.cimgn && (
            <div className={styles.imageBox}>
                <img
                    src={`${imageBasePath}${community.cimgn}`}
                    alt={community.ctitle}
                    className={styles.image}
                />
            </div>
        )}

        {/* 버튼 */}
        <div className={styles.buttonArea}>

            <Link
                to="/community"
                className={styles.button}
            >
                목록
            </Link>

            <Link
                to={`/community/update/${community.cnum}`}
                className={styles.button}
            >
                수정
            </Link>

            <button
                onClick={deleteCommunity}
                className={styles.deleteButton}
            >
                삭제
            </button>

        </div>

        {/* Footer */}
        <div className={styles.footer}>

            {/* 회사 정보 */}
            <div>
                <span className={styles.footerTitle}>
                    대표 OOO
                </span>
                <br />
                사업자 번호 000-00-00000
                <br />
                통신판매업 0000-서울00-0000
                <br />
                주소 서울특별시 00 00000 0 (00) 2층
                <br />
                이용약관 개인정보처리방침
                <br />
                T. 00-0000-0000
                <br />
                E. 000000@gmail.com
            </div>

            {/* 사이트 메뉴 */}
            <div>
                <div className={styles.footerLink}>
                    북 마인드 소개
                </div>

                <div className={styles.footerLink}>
                    입점처 안내
                </div>

                <div className={styles.footerLink}>
                    대량 주문 / 커스텀
                </div>
            </div>

            {/* 게시판 */}
            <div>
                <div className={styles.footerLink}>
                    공지사항
                </div>

                <div className={styles.footerLink}>
                    문의사항
                </div>

                <div className={styles.footerLink}>
                    사용후기
                </div>
            </div>

        </div>

    </div>
)
}

export default CommunityDetail