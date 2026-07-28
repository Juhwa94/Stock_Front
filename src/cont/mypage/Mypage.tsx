import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useAuth } from '../../comp/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

interface UserInfo {
  nick: string;
  name: string;
  grade: string;
  storeaddr: string;
  regdate: string;

  membernum: number;
  mypost: number;
  commentCount: number;
}

const MyPage: React.FC = () => {
  const { member } = useAuth();
  const navigate = useNavigate();
  const BACK_URL = process.env.REACT_APP_BACK_END_URL;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [mypost, setMypost] = useState<any[]>([]);
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
          nick: res.data.nick || '',
          name: res.data.name || '',
          grade: res.data.grade || '',
          storeaddr: res.data.storeaddr || '',
          regdate: res.data.regdate || '',


          membernum: res.data.membernum,
          mypost: res.data.mypost ?? 0,
          commentCount: res.data.commentCount ?? 0
        });

      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }
    };

    getMyInfo();
  }, [member?.email, BACK_URL]);
  useEffect(() => {

    const getMyPosts = async () => {
      try {
        const res = await axios.get(
          `${BACK_URL}/api/community/mypost`,
          {
            params: {
              membernum: member?.mnum
            },
            withCredentials: true
          }
        );

        console.log(res.data);
        console.log("여기");
        setMypost(res.data);

      } catch (err) {
        console.error(err);
      }
    };

    getMyPosts();

  }, []);
  // 로딩 상태 (데이터 불러오기 전)
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
            <h2 className="fw-bold mb-2">{userInfo.nick}</h2>
            <p className="text-muted mb-1 small">
              {userInfo.name} ({userInfo.grade})
            </p>
            <p className="mb-1">{userInfo.storeaddr}</p>
            <p className="text-muted mb-0">가입일 : {userInfo.regdate}</p>
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

      {/* 하단 콘텐츠 영역 */}
      <div
        className="border rounded p-4 position-relative"
        style={{ minHeight: '300px' }}
      >
        <span className="badge border text-dark position-absolute top-0 start-0 m-3 bg-white">
          PostList
        </span>

        <div
          className="d-flex flex-column align-items-start"
          style={{ minHeight: '220px' }}
        >
          <div className="mt-3">
            {mypost.length === 0 ? (
              <div className="text-center text-muted py-5">
                작성한 게시글이 없습니다.
              </div>
            ) : (
              mypost.map((post) => (
                <div
                  key={post.cnum}
                  className="border-bottom py-3 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <Link
                      to={`/community/detail/${post.cnum}`}
                      className="text-decoration-none fw-bold text-dark"
                    >
                      {post.ctitle}
                    </Link>

                    <div className="text-muted small mt-1">
                      {post.cdate}
                    </div>
                  </div>

                  <div className="text-muted">
                    조회수 {post.chit}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;