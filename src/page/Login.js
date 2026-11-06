import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authAPI';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    try {
      // Gọi hàm login từ authApi đã được tối ưu
      const user = await authApi.login(email, password);

      if (!user) {
        setError('Email hoặc mật khẩu không chính xác.');
        return;
      }

      // Kiểm tra trạng thái tài khoản (Inactive / active)
      if (user.status && user.status.toLowerCase() === 'inactive') {
        setError('Tai khoan da bi khoa');
        return;
      }

      // Lưu session vào localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Chuyển hướng đến trang danh sách môn học
      navigate('/subject');

    } catch (err) {
      console.error('Login error:', err);
      setError('Đã xảy ra lỗi kết nối đến máy chủ.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{
        width: '400px',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>Sign In</h2>
        
        {error && (
          <p style={{ color: 'red', fontSize: '14px', textAlign: 'center', fontWeight: 'bold', marginBottom: '15px' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Email</label>
            <input
              type="text"
              placeholder="email of student or lecturer"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}