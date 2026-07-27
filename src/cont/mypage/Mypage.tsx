import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useAuth } from '../../comp/AuthProvider'; // ProfileEditPage와 동일한 경로로 맞춰주세요!

interface UserInfo {
  nick: string;
  name: string;
  grade: string;
  storeaddr: string;
  regdate: string;

  //수정하기
  postCount: number;//게시물, postlist
  commentCount: number;//댓글
}

const MyPage: React.FC = () => {
  const { member } = useAuth(); 
  const navigate = useNavigate();
  const { member } = useAuth(); // AuthProvider에서 로그인 유저 정보 가져오기
  const BACK_URL = process.env.REACT_APP_BACK_END_URL;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const BACK_URL = process.env.REACT_APP_BACK_END_URL;
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  useEffect(() => {
    const getMyInfo = async () => {
    
      if (!member?.email) return;

      try {
        const res = await axios.get(
          `${BACK_URL}/api/member/mypage`,
          {
            params: { email: member.email },
            withCredentials: true
          }
        );

        console.log("마이페이지 데이터", res.data);

        setUserInfo({
          nick: res.data.nick,
          name: res.data.name,
          grade: res.data.grade,
          storeaddr: res.data.storeaddr,
          regdate: res.data.regdate,
          postCount: res.data.postCount ?? 0,
          commentCount: res.data.commentCount ?? 0
        });

        const data = response.data;

        // 백엔드에서 받은 데이터 세팅
        setForm({
          nick: data.nick || '',
          name: data.name || '',
          grade: data.grade || '',
          storeaddr: data.storeaddr || '',
          regdate: data.regdate || '',
          postCount: data.postCount ?? 0,
          commentCount: data.commentCount ?? 0,
        });
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [member, BACK_URL]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };


  if (!userInfo) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '500px' }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: '900px' }}>
      {/* 상단 프로필 영역 */}
      <div className="d-flex justify-content-between align-items-start pb-4 border-bottom">
        <div className="d-flex align-items-center gap-4">
          {/* 프로필 이미지 */}
          <div className="text-center">
            <div
              className="rounded-circle border shadow d-flex justify-content-center align-items-center overflow-hidden"
              style={{
                width: '140px',
                height: '140px',
                cursor: 'pointer',
                backgroundColor: '#f8f9fa',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="프로필"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div className="text-center text-secondary">
                  <div style={{ fontSize: '50px' }}>👤</div>
                  <small>사진 추가</small>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* 사용자 정보 */}
          <div>
            <h2 className='fw-bold mb-2'>{userInfo.nick}</h2>
            <p className='text-muted mb-1 small'>
              {userInfo.name} ({userInfo.grade})
            </p>
            <p className='mb-1'>{userInfo.storeaddr}</p>
            <p className='text-muted mb-0'>
              가입일 : {userInfo.regdate}
            </p>
            <p className="mb-1">{form.storeaddr}</p>
            <p className="text-muted mb-0">가입일 : {form.regdate}</p>
          </div>
        </div>

        {/* 프로필 편집 버튼 */}
        <button
          onClick={() => navigate('/ProfileEditPage')}
          className="btn px-4 py-3 border-0 fw-bold"
          style={{
            backgroundColor: '#d9d9d9',
            color: '#000',
            minWidth: '180px',
          }}
        >
          프로필 편집
        </button>
      </div>

      {/* 중앙 통계 영역 */}
      <div className="row text-center py-5">
        <div className="col-6">
          <div className="fs-2 fw-bold">게시물 : {form.postCount}</div>
        </div>
        <div className="col-6">
          <div className="fs-2 fw-bold">댓글 : {form.commentCount}</div>
        </div>
      </div>

      {/* 하단 콘텐츠 영역 */}
      <div
        className="border rounded p-4 position-relative"
        style={{ minHeight: '300px' }}
      >
        <span className="badge border text-dark position-absolute top-0 start-0 m-3 bg-white">
          PostList
        </span>

        <div
          className="d-flex justify-content-center align-items-center h-100"
          style={{ minHeight: '220px' }}
        >
          <h3 className="fw-bold text-dark mb-0">
            회원이 작성한 글 목록 리스트
          </h3>
        </div>
      </div>
    </div>
  );
};

export default MyPage;