import React from 'react';
import style from './navbar.module.css';
import { NavLink } from 'react-router-dom';

const DropdownNav: React.FC = () => {
    // 활성화 상태에 따른 스타일 적용 함수
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? `${style.link} ${style.active}` : style.link;

    return (
        <nav className={style.navbar}>
            {/* 1. 공지사항 */}
            <div className={style.navItem}>
                <NavLink to="/notice" className={linkClass}>
                    공지사항
                </NavLink>
            </div>

            {/* 2. 재고관리 */}
            <div className={`${style.navItem} ${style.hasDropdown}`}>
                <NavLink to="/management" className={linkClass}>
                    재고관리
                </NavLink>
                {/* 호버 시 나타날 드롭다운 메뉴 */}
                <div className={style.dropdownMenu}>
                    <NavLink to="/management" className={style.dropdownItem}>
                        재고등록
                    </NavLink>
                    <NavLink to="/management/list" className={style.dropdownItem}>
                        재고조회
                    </NavLink>
                </div>
            </div>

            {/* 3. 매출관리 */}
            <div className={style.navItem}>
                <NavLink to="/revenue" className={linkClass}>
                    매출관리
                </NavLink>
            </div>

            {/* 4. 발주관리 */}
            <div className={style.navItem}>
                <NavLink to="/order" className={linkClass}>
                    발주관리
                </NavLink>
            </div>
          <div className={style.navItem}>
            <NavLink to="/product" className={linkClass}>
            판매관리
            </NavLink>
          </div>

            {/* 5. 커뮤니티 */}
            <div className={style.navItem}>
                <NavLink to="/community" className={linkClass}>
                    커뮤니티
                </NavLink>
            </div>
        </nav>
    );
};

export default DropdownNav;