import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../comp/AuthProvider';


const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const location = useLocation();
  const [searchParams] = useSearchParams();
  let from = '/';
  const state = location.state as { from?: Location | string };

  if (state?.from) {
    if (typeof state.from == 'string') {
      from = state.from;
    } else if (typeof state.from === 'object') {
      from = (state.from as Location).pathname;
    }

  } else if (searchParams.get('from')) {
    from = searchParams.get('from')!;
  }
  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitLogin = async (e?: React.SubmitEvent) => {
    if (e) e.preventDefault();
    if (!formData.email || !formData.password) {
      setMessage('이메일과 비밀번호를 입력해주세요.');
      return;
    } else {
      const result = await login(formData.email, formData.password);
      if (result === 'success') {
        setMessage('로그인 성공!');
        
        //{replace:true} 웹페이지 에서 로그인 이후 이동 하는 경로 , 뒤로 가기를 막아주는 역할
        navigate(from, {replace:true});
      } else if (result === 'fail') {
        setMessage('아이디 또는 비밀번호가 틀렸습니다.');
      } else {
        setMessage('서버 오류');
      }
    }

  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '50px',
      height: '100vh'
    }}>
      <form
        onSubmit={submitLogin}
        style={{
          width: '300px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '12px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          textAlign: 'center',
          backgroundColor: '#fff'
        }}>

        <h2 style={{ marginBottom: '20px' }}>로그인</h2>

        {/* 이메일 입력창 */}
        <input
          name="email"
          value={formData.email}
          onChange={inputChange}
          placeholder="이메일"
          style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
        />

        {/* 비밀번호 입력창 */}
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={inputChange}
          placeholder="비밀번호"
          style={{ width: '100%', padding: '8px', marginBottom: '15px', boxSizing: 'border-box' }}
        />

        {/* 로그인 버튼 */}
        <button
          type="submit"
          style={{ width: '100%', padding: '10px', backgroundColor: '#0360d9', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          로그인
        </button>
        
        {/* 안내 메시지 */}
        <p style={{ marginTop: '10px', color: 'red', fontSize: '14px' }}>{message}</p>

      </form>
      {/* 하단 회원가입 이동 링크 */}
      <div className="login-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
        <span className="footer-text" style={{ color: '#666', marginRight: '5px' }}>
          아직 회원이 아니신가요?
        </span>
        <Link
          to="/user/signup"
          className="signup-link"
          style={{ color: '#0360d9', fontWeight: 'bold', textDecoration: 'none' }}
        >
          회원가입하기
        </Link>
      </div>
    </div >
  );
};

export default Login;