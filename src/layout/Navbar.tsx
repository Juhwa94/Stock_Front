import React from 'react'
import { NavLink } from 'react-router-dom'
import style from './navbar.module.css'
import DropdownNav from './DropdownNav'
import { useAuth } from '../comp/AuthProvider';
const Navbar: React.FC = () => {
    console.log("Navbar 실행됨");
    const { isLoggedIn } = useAuth();
    console.log("Navbar 로그인 상태:", isLoggedIn);
    console.log("Navbar 상태 :", isLoggedIn);
    const commonLinkClass = ({ isActive }: { isActive: boolean }) => {
        return isActive
            ? `${style.link} ${style.active}`
            : style.link;
    }

    return (
        // <nav style={{ marginTop: '10px' }}>
        //     <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
        //     <Link to="/board" style={{ marginRight: '10px' }}>게시판</Link>
        //     <Link to="/gallery" style={{ marginRight: '10px' }}>겔러리</Link>
        //     <Link to="/chart" style={{ marginRight: '10px' }}>차트</Link>
        //     <Link to="/community" style={{ marginRight: '10px' }}>커뮤니티</Link>
        //     <Link to="/diary">일기장</Link>
        // </nav>
        <nav className={style.navbar}>
            {/* <NavLink to="/" className={commonLinkClass}>Home</NavLink>
            <NavLink to="/hello" className={commonLinkClass}>배포 테스트</NavLink>
            <NavLink to="/board" className={commonLinkClass}>게시판</NavLink>
            <NavLink to="/gallery" className={commonLinkClass}>겔러리</NavLink>
            <NavLink to="/chart" className={commonLinkClass}>차트</NavLink> */}
            {/* <NavLink to="/community" className={commonLinkClass}>커뮤니티</NavLink> */}
            <DropdownNav />
            {/* <NavLink to="/notice" className={commonLinkClass}>공지 사항</NavLink>
            <NavLink to="/community" className={commonLinkClass}>커뮤 니티</NavLink> */}
            {isLoggedIn && (<NavLink to="/mypage"className={commonLinkClass}>마이페이지</NavLink>)}
        </nav>

    )
}

export default Navbar