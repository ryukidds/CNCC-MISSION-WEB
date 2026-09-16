'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  
  // Login states
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Change password mode states
  const [isChangingMode, setIsChangingMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Common states
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // If already authenticated, redirect to admin dashboard
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('cncc-admin-token');
      if (token === 'authenticated') {
        router.push('/admin');
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('cncc-admin-token', 'authenticated');
        router.push('/admin');
      } else {
        setError(data.message || '비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      setError('로그인 처리 중 네트워크 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword.length < 4) {
      setError('새 비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호와 확인 입력이 일치하지 않습니다.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('비밀번호가 성공적으로 변경되었습니다! 변경된 새 비밀번호로 로그인해 주세요.');
        setIsChangingMode(false);
        setPassword(newPassword);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (err) {
      setError('비밀번호 변경 중 네트워크 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
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
          <h2>{isChangingMode ? '관리자 비밀번호 변경' : '관리자 로그인'}</h2>
          <p>
            {isChangingMode
              ? '현재 비밀번호 확인 후 새로운 관리자 비밀번호로 변경합니다.'
              : '게시글 작성 및 사역/연혁 콘텐츠 관리를 위한 관리자 인증 페이지입니다.'}
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMsg && (
          <div className="success-message">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {!isChangingMode ? (
          // ================= LOGIN FORM =================
          <form onSubmit={handleLogin} className="login-form">
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
                  placeholder="비밀번호 입력 (기본: cncc1234)"
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

            <button type="submit" className="login-btn" disabled={submitting}>
              {submitting ? '인증 확인 중...' : '관리자 대시보드 접속'}
            </button>

            <div className="action-row">
              <button
                type="button"
                className="change-mode-btn"
                onClick={() => {
                  setIsChangingMode(true);
                  setError('');
                  setSuccessMsg('');
                }}
              >
                <KeyRound size={15} />
                <span>비밀번호 변경하기</span>
              </button>
            </div>
          </form>
        ) : (
          // ================= CHANGE PASSWORD FORM =================
          <form onSubmit={handleChangePassword} className="login-form">
            <div className="form-group">
              <label htmlFor="current-pw">현재 비밀번호</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="current-pw"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  placeholder="현재 비밀번호 입력"
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="new-pw">새 비밀번호 (최소 4자리)</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="new-pw"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={4}
                  placeholder="새로운 비밀번호 입력"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="toggle-btn"
                  aria-label="비밀번호 보기 토글"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-pw">새 비밀번호 확인</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="confirm-pw"
                  type={showNewPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="새로운 비밀번호 재입력"
                />
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={submitting}>
              {submitting ? '변경 저장 중...' : '비밀번호 변경 완료'}
            </button>

            <div className="action-row">
              <button
                type="button"
                className="change-mode-btn"
                onClick={() => {
                  setIsChangingMode(false);
                  setError('');
                }}
              >
                <ArrowLeft size={15} />
                <span>로그인 화면으로 돌아가기</span>
              </button>
            </div>
          </form>
        )}

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
          padding: 44px 38px;
          box-shadow: 0 20px 40px rgba(0, 43, 91, 0.08);
          border: 1px solid #e2e8f0;
        }

        .login-header {
          text-align: center;
          margin-bottom: 28px;
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
          font-size: 1.65rem;
          color: #002B5B;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .login-header p {
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.5;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
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
          margin-bottom: 8px;
        }

        .success-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 0.88rem;
          font-weight: 600;
          text-align: center;
          margin-bottom: 8px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-group label {
          font-size: 0.86rem;
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
          font-size: 0.98rem;
          font-weight: 700;
          transition: background-color 0.2s ease, transform 0.15s ease;
          margin-top: 4px;
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-btn:hover:not(:disabled) {
          background-color: #001f42;
          transform: translateY(-1px);
        }

        .action-row {
          display: flex;
          justify-content: center;
          margin-top: 2px;
        }

        .change-mode-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: #64748b;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 6px;
          transition: color 0.2s, background-color 0.2s;
        }

        .change-mode-btn:hover {
          color: #002B5B;
          background-color: #f1f5f9;
        }

        .login-footer {
          margin-top: 24px;
          text-align: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 18px;
        }

        .login-footer :global(.back-link) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
          font-size: 0.88rem;
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
