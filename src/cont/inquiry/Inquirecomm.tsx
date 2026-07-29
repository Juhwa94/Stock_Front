import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../comp/AuthProvider';

interface InquireCommProps {
  num?: string;
}

interface CommentVO {
  membernum?: number;
  rnum?: number;
  rcode: number;
  rwriter: string;
  rcontent: string;
  rdate?: string;
}

const backendUrl = process.env.REACT_APP_BACK_END_URL;

const InquireComm: React.FC<InquireCommProps> = ({ num }) => {
  // 로그인한 회원 정보 가져오기
  const { member, isLoggedIn } = useAuth();

  // 댓글 목록
  const [rcomments, setRComments] = useState<CommentVO[]>([]);

  // 댓글 내용
  const [rcontent, setRContent] = useState('');

  // 댓글 조회
  const getComments = async () => {
    try {
      const url = `${backendUrl}/api/reply/list?num=${num}`;
      const response = await axios.get(url);
      setRComments(response.data);
    } catch (error) {
      console.log('댓글 조회 실패', error);
    }
  };

  // 게시글 번호가 바뀔 때마다 조회
  useEffect(() => {
    getComments();
  }, [num]);

  // 댓글 등록
  const commentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('로그인 후 댓글을 작성할 수 있습니다.');
      return;
    }

    if (!rcontent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    const commentData = {
      rcode: Number(num),
      rwriter: member?.nick,
      rcontent: rcontent,
    };

    try {
      await axios.post(`${backendUrl}/api/reply/add`, commentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setRContent('');
      getComments();
    } catch (error) {
      console.log('댓글 등록 실패', error);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '20px 0', fontFamily: 'sans-serif' }}>
      <h3 style={{ marginBottom: '15px', color: '#333' }}> 답글</h3>

      {/* 댓글 작성 폼 */}
      <form
        onSubmit={commentSubmit}
        style={{
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '16px',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
        }}
      >
        {/* 작성자 (닉네임) */}
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={member?.nick || ''}
            readOnly
            placeholder="로그인이 필요합니다"
            style={{
              border: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#333',
              outline: 'none',
              backgroundColor: 'transparent',
            }}
          />
        </div>

        {/* 댓글 입력창 */}
        <textarea
          style={{
            width: '100%',
            height: '100px',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: '14px',
            lineHeight: '1.5',
            color: '#4A5568',
            boxSizing: 'border-box',
          }}
          placeholder="비방, 욕설, 광고성 댓글은 사전 통보 없이 삭제될 수 있습니다."
          value={rcontent}
          onChange={(e) => setRContent(e.target.value)}
        />

        {/* 버튼 영역 (우측 정렬) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#7C66FF', // 이미지의 퍼플 색상
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px', // 이미지 스타일처럼 곡률을 넉넉히 지정
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(124, 102, 255, 0.3)', // 이미지 특유의 부드러운 그림자
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#6B54F2')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#7C66FF')}
          >
            댓글 작성
          </button>
        </div>
      </form>

      <hr style={{ border: '0.5px solid #F0F0F0', margin: '30px 0' }} />

      {/* 댓글 목록 */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {rcomments.map((comment) => (
          <li
            key={comment.rnum}
            style={{
              padding: '12px 0',
              borderBottom: '1px solid #F0F0F0',
            }}
          >
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <strong style={{ fontSize: '14px', color: '#2D3748' }}>{comment.rwriter}</strong>
              <small style={{ fontSize: '12px', color: '#A0AEC0' }}>{comment.rdate}</small>
            </div>
            <p style={{ margin: 0, fontSize: '14px', color: '#4A5568', lineHeight: '1.4' }}>
              {comment.rcontent}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InquireComm;