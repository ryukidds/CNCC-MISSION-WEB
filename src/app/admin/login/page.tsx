'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If already authenticated, redirect to admin dashboard
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('cncc-admin-token');
      if (token === 'authenticated') {
        router.push('/admin');
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'cncc1234';
    
    if (password === correctPassword) {
      sessionStorage.setItem('cncc-admin-token', 'authenticated');
      router.push('/admin');
    } else {
      setError('비밀번호가 올바르지 않습니다. (초기 비밀번호: cncc1234)');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-box">
            <Image src="/logo.svg" alt="CNCC Logo" width={150} height={46} priority />
          </div>
          <div className="badge">
            <ShieldCheck size={18} />
            <span>선교회 CMS 관리자 시스템</span>
          </div>
          <h2>관리자 로그인</h2>
          <p>게시글 작성 및 사역/연혁 콘텐츠 관리를 위한 관리자 인증 페이지입니다.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="admin-pw">관리자 비밀번호</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="admin-pw"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
                placeholder="비밀번호를 입력하세요 (기본: cncc1234)"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-btn"
                aria-label="비밀번호 보기 토글"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn">
            관리자 대시보드 접속
          </button>
        </form>

        <div className="login-footer">
          <Link href="/" className="back-link">
            <ArrowLeft size={16} />
            <span>메인 홈페이지로 이동</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;
        }

        .login-card {
          background-color: #ffffff;
          width: 100%;
          max-width: 460px;
          border-radius: 20px;
          padding: 48px 40px;
          box-shadow: 0 20px 40px rgba(0, 43, 91, 0.08);
          border: 1px solid #e2e8f0;
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-box {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #f0fdfa;
          color: #0d9488;
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 700;
          margin-bottom: 16px;
          border: 1px solid #ccfbf1;
        }

        .login-header h2 {
          font-size: 1.7rem;
          color: #002B5B;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .login-header p {
          font-size: 0.92rem;
          color: #64748b;
          line-height: 1.5;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .error-message {
          background-color: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 0.88rem;
          font-weight: 600;
          text-align: center;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.88rem;
          font-weight: 700;
          color: #002B5B;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-wrapper :global(.input-icon) {
          position: absolute;
          left: 14px;
          color: #94a3b8;
        }

        .input-wrapper input {
          width: 100%;
          height: 48px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 0 44px 0 42px;
          font-size: 0.95rem;
          background-color: #f8fafc;
          transition: all 0.2s ease;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #56DFCF;
          background-color: #ffffff;
          box-shadow: 0 0 0 3px rgba(86, 223, 207, 0.25);
        }

        .toggle-btn {
          position: absolute;
          right: 14px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          padding: 4px;
        }

        .toggle-btn:hover {
          color: #002B5B;
        }

        .login-btn {
          width: 100%;
          height: 48px;
          background-color: #002B5B;
          color: #ffffff;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          transition: background-color 0.2s ease, transform 0.15s ease;
          margin-top: 8px;
        }

        .login-btn:hover {
          background-color: #001f42;
          transform: translateY(-1px);
        }

        .login-footer {
          margin-top: 28px;
          text-align: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 20px;
        }

        .login-footer :global(.back-link) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 600;
          transition: color 0.2s;
        }

        .login-footer :global(.back-link:hover) {
          color: #002B5B;
        }
      `}</style>
    </div>
  );
}
