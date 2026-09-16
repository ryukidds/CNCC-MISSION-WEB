'use client';

import React from 'react';
import Image from 'next/image';

export default function Maintenance() {
  return (
    <div className="maintenance-wrapper">
      <div className="maintenance-card">
        {/* Logo */}
        <div className="maintenance-logo">
          <Image src="/logo.svg" alt="CNCC Logo" width={170} height={52} priority />
        </div>

        {/* Status Badge */}
        <div className="status-badge">
          <span className="pulsing-dot"></span>
          <span>홈페이지 시스템 점검 중</span>
        </div>

        {/* Main Title */}
        <h1 className="maintenance-title">
          더 나은 모습으로<br />
          곧 찾아뵙겠습니다
        </h1>

        <p className="maintenance-desc">
          현재 CNCC 선교회 공식 홈페이지 개편 및 시스템 점검 작업을 진행하고 있습니다.<br />
          이용에 불편을 드려 대단히 죄송하며, 빠른 시일 내에 새로운 서비스로 인사드리겠습니다.
        </p>

        {/* Information Box */}
        <div className="info-box">
          <div className="info-item">
            <span className="info-label">📞 문의 전화</span>
            <span className="info-val">010-6518-5874</span>
          </div>
          <div className="info-item">
            <span className="info-label">✉️ 대표 이메일</span>
            <span className="info-val">info@cncc.org</span>
          </div>
          <div className="info-item">
            <span className="info-label">📍 선교회 위치</span>
            <span className="info-val">서울특별시 강남구 역삼로 78길 18, 5층</span>
          </div>
          <div className="info-item">
            <span className="info-label">⛪ 정기 예배</span>
            <span className="info-val">매주 목요일 오후 7시 30분 (정상 진행)</span>
          </div>
          <div className="info-item highlight">
            <span className="info-label">💳 후원 계좌</span>
            <span className="info-val">신한은행 100-032-123456 (CNCC선교회)</span>
          </div>
        </div>

        <div className="action-row">
          <a href="tel:010-6518-5874" className="btn-call">
            📞 전화 문의
          </a>
          <a href="mailto:info@cncc.org" className="btn-email">
            ✉️ 이메일 문의
          </a>
        </div>

        <p className="copyright-text">
          &copy; {new Date().getFullYear()} CNCC MISSION. All rights reserved.
        </p>

        <div style={{ marginTop: '16px' }}>
          <a
            href="/admin/login"
            style={{
              fontSize: '0.8rem',
              color: '#94a3b8',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
          >
            🔒 관리자 로그인 및 사이트 미리보기
          </a>
        </div>
      </div>

      <style jsx>{`
        .maintenance-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;
        }

        .maintenance-card {
          background-color: #ffffff;
          max-width: 620px;
          width: 100%;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 43, 91, 0.08);
          border: 1px solid #e2e8f0;
          padding: 56px 44px;
          text-align: center;
        }

        .maintenance-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 28px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #e6fffa;
          color: #0d9488;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.88rem;
          font-weight: 700;
          margin-bottom: 24px;
          border: 1px solid #99f6e4;
        }

        .pulsing-dot {
          width: 8px;
          height: 8px;
          background-color: #0d9488;
          border-radius: 50%;
          animation: pulse 1.8s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(13, 148, 136, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(13, 148, 136, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(13, 148, 136, 0); }
        }

        .maintenance-title {
          font-size: 2.2rem;
          color: #002B5B;
          font-weight: 700;
          line-height: 1.35;
          margin-bottom: 18px;
          letter-spacing: -0.5px;
        }

        .maintenance-desc {
          font-size: 1.05rem;
          color: #475a70;
          line-height: 1.7;
          margin-bottom: 32px;
          word-break: keep-all;
        }

        .info-box {
          background-color: #f8fafc;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 20px 24px;
          text-align: left;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          color: #334155;
          flex-wrap: wrap;
          gap: 6px;
        }

        .info-item.highlight {
          padding-top: 10px;
          border-top: 1px dashed #cbd5e1;
          color: #002B5B;
          font-weight: 600;
        }

        .info-label {
          color: #64748b;
        }

        .info-val {
          font-weight: 600;
        }

        .action-row {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 28px;
        }

        .btn-call {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #56DFCF;
          color: #002B5B;
          padding: 12px 24px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 0.92rem;
          transition: transform 0.2s;
        }

        .btn-call:hover {
          transform: translateY(-2px);
          background-color: #3bbcb0;
        }

        .btn-email {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #002B5B;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 30px;
          font-weight: 700;
          font-size: 0.92rem;
          transition: transform 0.2s;
        }

        .btn-email:hover {
          transform: translateY(-2px);
          background-color: #001f42;
        }

        .copyright-text {
          font-size: 0.85rem;
          color: #94a3b8;
        }

        @media (max-width: 640px) {
          .maintenance-card {
            padding: 36px 20px;
          }
          .maintenance-title {
            font-size: 1.7rem;
          }
          .info-item {
            flex-direction: column;
            gap: 2px;
          }
          .action-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
