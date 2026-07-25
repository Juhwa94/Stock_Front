import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './Inquire.module.css'
import Inquirecomm from './Inquirecomm';

interface InquiryVO {
    inum: number;
    ititle: string;
    iwriter: string;
    icontent: string;
    imgn?: string;
    membernum : number;
    idate: string;
}

const backendUrl = process.env.REACT_APP_BACK_END_URL;

const InquiryDetail: React.FC = () => {
  const [inquiry, setInquiry] = useState<InquiryVO | null>(null);
  const { num } = useParams<{ num: string }>(); 
  const navigate = useNavigate(); // useNavigate hook 추가

  useEffect(() => {
    const detailServer = async () => {
      const url = `${backendUrl}/api/inquiry/detail?num=${num}`;
      const resp = await axios.get(url);
      setInquiry(resp.data);
    }
    detailServer();
  }, [num]);

  // 삭제 처리 함수
  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      // 서버 endpoint에 맞춰 URL 및 HTTP Method(delete/post 등)를 수정해 주세요.
      await axios.delete(`${backendUrl}/api/inquiry/delete?num=${num}`);
      alert('삭제 완료되었습니다.');
      navigate('/inquiry'); // 목록 페이지로 이동
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const imageBasePath = `${backendUrl}/imgfile/`;

  return (
    <div className={styles.container}>
        <h1>상세보기 예제</h1>
        <table className={styles.boardTable}>
            <tbody>
                <tr>
                    <th>번호</th>
                    <td>{inquiry?.inum}</td>
                </tr>
                <tr>
                    <th>제목</th>
                    <td>{inquiry?.ititle}</td>
                </tr>
                <tr>
                    <th>작성자</th>
                    <td>{inquiry?.iwriter}</td>
                </tr>
                <tr>
                    <th>이미지</th>
                    <td>  
                        {inquiry?.imgn && (
                            <img src={`${imageBasePath}${inquiry?.imgn}`} className='img-fluid mt-2' alt="문의 이미지"/>
                        )}
                    </td>
                </tr>
                <tr>
                    <th>내용</th>
                    <td>{inquiry?.icontent}</td>
                </tr>    
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={2} style={{textAlign:"center"}}>
                        <button className={styles.button} onClick={handleDelete}>삭제</button>&nbsp;  
                        <Link to="/inquiry" className={styles.button}>목록</Link>
                    </td>
                </tr>
            </tfoot>           
        </table>
        <hr />
    </div>
  )
}

export default InquiryDetail;