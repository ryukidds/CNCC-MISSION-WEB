'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { PageTransition } from '@/components/FramerTransitions';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const { t } = useLanguage();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If already logged in, redirect to admin panel
    const token = sessionStorage.getItem('cncc-admin-token');
    if (token === 'authenticated') {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock password for demo local database safety
    if (password === 'cncc1234') {
      sessionStorage.setItem('cncc-admin-token', 'authenticated');
      router.push('/admin');
    } else {
      setError(t('비밀번호가 올바르지 않습니다. (초기 비번: cncc1234)', 'Incorrect password. (Initial PW: cncc1234)'));
    }
  };

  return (
    <PageTransition>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header text-center">
            <div className="shield-icon-box">
              <ShieldCheck size={36} />
            </div>
            <h2>CNCC CMS Portal</h2>
            <p>{t('관리자 인증이 필요합니다.', 'Administrator authentication required.')}</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-control">
              <label>{t('관리자 비밀번호', 'Admin Password')}</label>
              <div className="password-input-wrapper">
                <Lock size={16} className="input-lock-icon" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  required
                  placeholder={t('비밀번호 입력...', 'Enter password...')}
                  className="password-input"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="pw-toggle-btn"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary login-submit-btn">
              {t('로그인', 'Authenticate')}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          background-color: var(--bg-light);
          padding: 40px 24px;
        }

        .login-card {
          background-color: var(--bg-white);
          border: 1px solid var(--border-color);
          border-radius: 0;
          padding: 48px 40px;
          width: 100%;
          max-width: 440px;
          box-shadow: var(--shadow-premium);
        }

        .shield-icon-box {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: var(--secondary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
        }

        .login-header h2 {
          font-family: var(--font-sans);
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .login-header p {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 32px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .error-message {
          background-color: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fca5a5;
          border-radius: 0;
          padding: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          text-align: center;
        }

        .form-control {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-control label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary);
        }

        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-lock-icon {
          position: absolute;
          left: 12px;
          color: var(--text-muted);
        }

        .password-input {
          width: 100%;
          border: 1px solid var(--border-color);
          border-radius: 0;
          padding: 12px 40px 12px 36px;
          font-family: inherit;
          font-size: 0.9rem;
          background-color: var(--bg-light);
          transition: var(--transition-fast);
        }

        .password-input:focus {
          outline: none;
          border-color: var(--primary);
          background-color: var(--bg-white);
          box-shadow: 0 0 0 2px rgba(0, 43, 91, 0.1);
        }

        .pw-toggle-btn {
          position: absolute;
          right: 12px;
          color: var(--text-muted);
          transition: var(--transition-fast);
        }

        .pw-toggle-btn:hover {
          color: var(--primary);
        }

        .login-submit-btn {
          width: 100%;
          justify-content: center;
          margin-top: 10px;
        }
      `}</style>
    </PageTransition>
  );
}
