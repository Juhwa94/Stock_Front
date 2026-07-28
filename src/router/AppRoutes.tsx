import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../cont/Home'


import Inquiry from '../cont/inquiry/Inquiry'
//import Management from '../cont/management/Management'

import Member from '../cont/member/Member'
import Notice from '../cont/notice/Notice'
import Order from '../cont/order/Order'
import Revenue from '../cont/revenue/Revenue'
import Login from '../cont/member/Login'
import Signup from '../cont/member/Signup'

import Inquirecomm from '../cont/inquiry/Inquirecomm'
import InquireList from '../cont/inquiry/InquireList'
import InquireDetail from '../cont/inquiry/InquireDetail'

import MyPage from '../cont/mypage/Mypage'
import ProfileEditPage from '../cont/mypage/Profileeditpage'

import Admin from '../cont/admin/Admin'
import Members from '../cont/admin/Members'
import InquireForm from '../cont/inquiry/InquireForm'
import NoticeDetail from '../cont/notice/NoticeDetail'
import CommunityDetail from '../cont/community/CommunityDetail'
import CommForm from '../cont/community/commForm'
import Community from '../cont/community/Community'
import NommForm from '../cont/notice/nommForm'
import AdminNotice from '../cont/notice/AdminNotice'
import StockForm from '../cont/stock/StockForm'
import MyStockList from '../cont/stock/MyStockList'
import StockList from '../cont/stock/StockList'
import StockDetail from '../cont/stock/StockDetail'
import Product from '../cont/product/Product'
import ProtectedRoute from './ProtectedRoute'





// 라우터란?
// 사용자가 입력한 주소를 감지하는 역할을 하며, 
// 여러 환경에서 동작할 수 있도록 여러 종유의 라우터 컴포넌트를 제공
// 라우터 기본 구성
{/* 
<Router> --> App.tsx에서 최상위 요소로 사용
  <Routes>
    <Route path='/컴포넌트 실행위치' element={<컴포넌트 />} />
  </Routes>
</Router> 

AppRoutes의 구성
1. routeList에 자바스크립트 객체 형태로 패스와 라우터 하고자 하는 컴포넌트 정의
2. routeList를 Routes안에 Route 형태로 뿌려준다(작성한다)
3. 결국 routeList에 입력한 값들을 아래처럼 만들어 내기위해 AppRoutes 컴포넌트를 작성하였다
<Routes>
    <Route path='/컴포넌트 실행위치1' element={<컴포넌트1 />} />
    <Route path='/컴포넌트 실행위치2' element={<컴포넌트2 />} />
    <Route path='/컴포넌트 실행위치3' element={<컴포넌트3 />} />
    <Route path='/컴포넌트 실행위치4' element={<컴포넌트4 />} />
    <Route path='/컴포넌트 실행위치5' element={<컴포넌트5 />} />
    ...
  </Routes>
*/}
interface RouteItem {
    path: string;
    element: React.ReactElement;
    private?: boolean;
    role?: string;
}

const AppRoutes: React.FC = () => {
    const routeList: RouteItem[] = [
        // ************************ 사용법 ************************
        // { path: '/위치(url)', element: <컴포넌트명 />},
        { path: '/', element: <Home />},     
        { path: '/member', element: <Member />},
       
        
      
      

        { path: '/order', element: <Order />},
        { path: '/user/login', element: <Login/>},
        { path: '/user/signup', element: <Signup />},
        { path: '/revenue', element: <Revenue/>},
      
        
      

       

       
        { path: '/stockForm', element: <StockForm />},
        { path: '/myStockList', element: <MyStockList />},
        { path: '/admin/stockList', element: <StockList />},
        { path: '/stock/stockDetail/:SNUM', element: <StockDetail />},

        { path: '/product', element: <Product />, private: true},
        // { path: '/notice', element: <Notice />},
        { path: '/order', element: <Order />, private: true},
        { path: '/user/login', element: <Login /> },
        { path: '/user/signup', element: <Signup /> },
        { path: '/revenue', element: <Revenue />, private: true  },


        // { path: '/notice', element: <Notice /> },
        // { path: '/notice/detail', element: <NoticeDetail /> },

        // { path: '/community', element: <Community /> },
        // { path: '/community/detail', element: <CommunityDetail /> },
        // { path: '/community/form', element: <CommForm />, private: true },

        // { path: '/communityform', element: <UpCommunityForm/>},
        // { path: '/communityform', element: <UpCommunityForm/>},

        { path: '/inquiry', element: <InquireList /> },
        { path: '/Inquirecomm', element: <Inquirecomm /> },
        { path: '/InquireForm', element: <InquireForm /> },
        // { path: '/InquireDetail', element: <InquireDetail/>},
        { path: "/inquiry/detail/:num", element: <InquireDetail /> },
        { path: "/reply/list/:num", element: <Inquirecomm /> },



        { path: '/admin/member', element: <Members /> },


        { path: '/admin/member', element: <Members />},
        { path: '/admin', element: <Admin />},
       

        
        
        
        { path: '/mypage', element: <MyPage />, private: true },
        { path: '/profileeditpage', element: <ProfileEditPage />, private: true },

        // { path: '/survey', element: <SurveyAddForm /> },
        // { path: '/admin/surveymanagement', element: <SurveyManagement /> },
        // { path: '/admin/surveyupdate', element: <SurveyUpdate /> },



        // <Route path="/login" element={<Login />} />
        // <Route path="/signup" element={<Signup />} />
        // <Route path="/dashboard" element={<Dashboard />} />

        // 커뮤니티
        { path: '/community', element: <Community />},
        { path: '/community/detail/:num', element: <CommunityDetail />},
        { path: '/community/form', element: <CommForm/>},
        // { path: '/community', element: <Community /> },
        // { path: '/community/detail/:num', element: <CommunityDetail />, private: true },

        // 공지사항
        { path: '/notice', element: <Notice />},
        { path: '/notice/detail/:num', element: <NoticeDetail />},
       
        { path: "/admin/notice", element: <AdminNotice /> },
        { path: "/admin/notice/form", element: <NommForm /> },
        { path: "/admin/notice/update/:num", element: <NommForm /> },
        
        // 문의
        { path: '/inquiry', element: <InquireList /> },
        { path: '/Inquirecomm', element: <Inquirecomm /> },
        { path: '/InquireForm', element: <InquireForm /> },
        { path: '/InquireDetail', element: <InquireDetail /> },

        // 관리자
        { path: '/admin/member', element: <Members />, private: true },
        { path: '/admin', element: <Admin />, private: true },

        // <Route path="/login" element={<Login />} />
        // <Route path="/signup" element={<Signup />} />
        // <Route path="/dashboard" element={<Dashboard />} />

    ];

    return (

        <Routes>
            {
                routeList.map((route, idx) => {
                    console.log("Home", Home);
                    console.log("Admin", Admin);
                    console.log("ProtectedRoute", ProtectedRoute);
                    console.log("Members", Members);

                    console.log(
                        "ROUTE",
                        idx,
                        route.path,
                        route.element
                    );
                    if (!React.isValidElement(route.element)) {
                        console.log("문제 Route 발견:", route);
                    }
                    if (route.private) {

                        return (
                            <Route
                                key={idx}
                                element={<ProtectedRoute />}
                            >
                                <Route
                                    path={route.path}
                                    element={route.element}
                                />
                            </Route>
                        )

                    }


                    return (
                        <Route
                            key={idx}
                            path={route.path}
                            element={route.element}
                        />
                    )

                })
            }
        </Routes>
    );
};
export default AppRoutes;
