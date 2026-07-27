import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface UserInfo {
  nickname: string;
  name: string;
  grade: string;
  location: string;
  joinDate: string;
  postCount: number;
  commentCount: number;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const userInfo: UserInfo = {
    nickname: '닉네임',
    name: '홍길동',
    grade: 'A등급',
    location: '매장의 위치가 들어갈 자리입니다',
    joinDate: '2026-04-15',
    postCount: 0,
    commentCount: 0,
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className='container my-5' style={{ maxWidth: '900px' }}>
      {/* 상단 프로필 영역 */}
      <div className='d-flex justify-content-between align-items-start pb-4 border-bottom'>
        <div className='d-flex align-items-center gap-4'>
          {/* 프로필 이미지 */}
          <div className='text-center'>
            <div
              className='rounded-circle border shadow d-flex justify-content-center align-items-center overflow-hidden'
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
                  alt='프로필'
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div className='text-center text-secondary'>
                  <div style={{ fontSize: '50px' }}>👤</div>
                  <small>사진 추가</small>
                </div>
              )}
            </div>

            <input
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* 사용자 정보 */}
          <div>
            <h2 className='fw-bold mb-2'>{userInfo.nickname}</h2>
            <p className='text-muted mb-1 small'>
              {userInfo.name} ({userInfo.grade})
            </p>
            <p className='mb-1'>{userInfo.location}</p>
            <p className='text-muted mb-0'>
              가입일 : {userInfo.joinDate}
            </p>
          </div>
        </div>

        {/* 프로필 편집 버튼 */}
        <button
          onClick={() => navigate('/ProfileEditPage')}
          className='btn px-4 py-3 border-0 fw-bold'
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
      <div className='row text-center py-5'>
        <div className='col-6'>
          <div className='fs-2 fw-bold'>게시물 : {userInfo.postCount}</div>
        </div>
        <div className='col-6'>
          <div className='fs-2 fw-bold'>댓글 : {userInfo.commentCount}</div>
        </div>
      </div>

      {/* 하단 콘텐츠 영역 */}
      <div
        className='border rounded p-4 position-relative'
        style={{ minHeight: '300px' }}
      >
        <span className='badge border text-dark position-absolute top-0 start-0 m-3 bg-white'>
          PostList
        </span>

        <div
          className='d-flex justify-content-center align-items-center h-100'
          style={{ minHeight: '220px' }}
        >
          <h3 className='fw-bold text-dark mb-0'>
            회원이 작성한 글 목록 리스트
          </h3>
        </div>
      </div>
    </div>
  );
};

export default MyPage;