import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
interface Member {
  mnum: number;
  id?: string;
  name: string;
  email: string;
  nick?: string;
  authority?: string;
  grade?: string;
  storecode?: string;
  storeaddr?: string;
  mphone?: string;
}

interface AuthContextProps {
  member: Member | null;
  checkLogin: () => Promise<void>;
  isLoggedIn: boolean; //로그인 여부를 true / false

  login: (email: string, password: string) => Promise<'success' | 'fail' | 'error'>; //////
  logout: () => Promise<void>;
  updateMemberName: (name: string) => void;
  updateMemberEmail: (email: string) => void;
  loading: boolean;
}
// 1단계: Context 생성
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const backendUrl = process.env.REACT_APP_BACK_END_URL;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);  // loadin
  console.log("ddd");

  console.log("--------------------------------------")
  console.log(backendUrl);

  //로그인 상태를 체크 해주는 함수
  const checkLogin = async () => {
    try {

      const res = await axios.get(`${backendUrl}/api/login/session`, {
        withCredentials: true
      });
      console.log(res.data);
      console.log(res.data.mnum);
      if (res.data?.email) { ///////
        setMember(res.data); // 로그인 된 정보를 받아서 useState에 저장한다.
      } else {
        setMember(null); //로그인 상태가 아니라면 useState를 초기화 
      }
    } catch {
      setMember(null); // 문제가 발생해도 초기화 
    } finally {

      setLoading(false);
    }
  };

 const login = async (id: string, password: string): Promise<'success' | 'fail' | 'error'> => {
  try {
    const res = await axios.post(
      `${backendUrl}/api/login/dologin`,
      {
        email: id,
        pwd: password
      },
      {
        withCredentials: true
      }
    );

    console.log(res.data);

    if (res.data === 'success') {
      await checkLogin();
      return 'success';
    } else {
      return 'fail';
    }
  } catch {
    return 'error';
  }
};
  const logout = async () => {
    await axios.get(`${backendUrl}/api/login/dologout`, {
      withCredentials: true
    });
    setMember(null);
  };
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/user/login') {
      setLoading(false);
    } else {
      checkLogin();
    }

  }, []);
  //기존 member 정보는 유지하고 name만 새 값으로 변경
  const updateMemberName = (name: string) => {
    setMember(prev => (prev ? { ...prev, name } : prev));
  };
  //현재 로그인한 회원의 이메일만 수정하는 함수
  const updateMemberEmail = (email: string) => {
    setMember(prev => (prev ? { ...prev, email } : prev));
  };

  const isLoggedIn = member !== null;
  // 2단계: Context에 값 제공
  return (
    <AuthContext.Provider value={{
      member,
      isLoggedIn,
      checkLogin,
      login,
      logout,
      updateMemberName,
      updateMemberEmail,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
// 3단계: useAuth() 에서 값을 사용할 수 있도록 제공
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthContext 은 AuthProvider  안에서만 사용해야 합니다.');
  return context;
};
