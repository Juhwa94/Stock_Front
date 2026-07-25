import React from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import DropdownNav from './DropdownNav';
import FloatingButton from '../floatButton/FloatingButton';
import styles from "../cont/admin/adminManage.module.css"
//import Navbar from '../components/navbar/Navbar'; /////
import Navbar from './Navbar';/////
import { useAuth } from '../comp/AuthProvider';//////
// children : 컴포넌트의 여는 태그와 닫는 태그 사이에 들어가는 내용을 의미하는 props
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

  const navigate = useNavigate();
  const { isLoggedIn, logout  } = useAuth();
  const { pathname } = useLocation();
  // /user 로 시작하는 모든 페이지
  const isSimpleLayout = pathname.startsWith('/user');

  const adminLayout = pathname.startsWith('/admin');

  // NavLink를 사용하는 목적이기도 하고 어제 메뉴구현시 설명
  // NavLink -> isActive 제공
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    // 활성화가 된 상태이면 style.active를 추가한다.
    isActive ? `${styles.link} ${styles.active}` : styles.link;



  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '40px auto 0',
        padding: '20px',
        border: '2px solid #ddd',
        backgroundColor: '#fff',
        borderRadius: '8px',
      }}
    >
      {adminLayout ? (
        <>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}><h1>프로젝트 로고</h1></Link>
        </>
      ) : !isSimpleLayout ? (
        <>
          <header
            style={{
              borderBottom: '2px solid black',
              marginBottom: '4px',
              padding: '10px 20px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h1>
              <Link
                to="/"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                프로젝트 로고
              </Link>
            </h1>

            <div className={styles.buttonContainer}>
              <button type="button" className={styles.customBtn} onClick={() => navigate('/admin')}>
                관리자 전환
              </button>

              {!isLoggedIn && (<>
                  <button type="button" className={styles.customBtn} onClick={() => navigate('/user/login')}>
                로그인
              </button>

                  <button type="button" className={styles.customBtn} onClick={() => navigate('/user/signup')}>
                회원가입
                </button></>
              )}
              {isLoggedIn && (
                <button type="button" className={styles.customBtn} onClick={logout}>
                로그아웃
                </button>
              )}
            </div>
          </header>
          {(!adminLayout && !isSimpleLayout) && <Navbar />}
        </>
      ) : (
        <>
          <header
            style={{
              marginBottom: '4px',
              padding: '10px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h1>
              <Link
                to="/"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                프로젝트 로고
              </Link>
            </h1>
          </header>
        </>
      )}

      <main>
        {adminLayout ?
          <div className={styles.admin_container}>
            {/* 사이드바 */}
            <aside className={styles.sidebar}>
              <div className={styles.sidebar_header}>
                <h3>관리자 메뉴</h3>
              </div>

              <nav className={styles.sidebar_nav}>
                <ul>
                  <li>
                    <NavLink to="/admin/member" className={`${styles.nav_item}`}>
                      회원 관리
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/admin/noticejoin" className={styles.nav_item}>
                      공지 등록
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/admin/surveymanagement" className={styles.nav_item}>
                      평가 관리
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </aside>

            {/* 관리자 컨텐츠 */}
            <section className={styles.admin_content} style={{ display: "flex", flexDirection: "column" }}>
              <button type="button" className={styles.transBtn} onClick={() => navigate('/')}>
                사용자 전환
              </button>
              {children}
            </section>
          </div> : children}

        {(!adminLayout && !isSimpleLayout) && <FloatingButton />}
      </main>

      {!isSimpleLayout && (
        <footer
          style={{
            padding: '10px',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          @프로젝트
        </footer>
      )}
    </div>
  );
};

export default Layout;