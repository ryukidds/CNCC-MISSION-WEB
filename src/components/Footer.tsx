'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowUp, Heart, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="footer-section">
      <div className="container">
        {/* Middle Segment: Info and Links */}
        <div className="footer-middle">
          <div className="footer-info-side">
            <Link href="/" className="footer-logo">
              <img src="/logo.svg" alt="CNCC Logo" className="footer-logo-img" style={{ height: '54px', width: 'auto' }} />
            </Link>
            <p className="footer-desc">
              {t(
                'CNCC 선교회는 하나님의 임재 앞에서 살아가는 ‘코람데오’의 태도로 회복과 치유, 그리고 새로운 피조물로의 변화를 이끄는 공동체입니다.',
                'CNCC Missionary leads restoration, holistic healing, and transformation into new creations in the presence of God.'
              )}
            </p>
            <ul className="footer-contact-list">
              <li>
                <Phone size={14} />
                <span>010-6518-5874</span>
              </li>
              <li>
                <Mail size={14} />
                <span>info@cncc.org</span>
              </li>
              <li>
                <MapPin size={14} />
                <span>{t('서울특별시 강남구 역삼로 78길 18, 5층', '18, Yeoksam-ro 78-gil, Gangnam-gu, Seoul, 5F')}</span>
              </li>
            </ul>
          </div>

          <div className="footer-menu-side">
            <div className="footer-links-grid">
              <div className="footer-link-col">
                <h3>{t('선교회 안내', 'Information')}</h3>
                <ul>
                  <li><Link href="/about">{t('선교회 소개', 'About Us')}</Link></li>
                  <li><Link href="/about#vision">{t('비전 & 미션', 'Vision & Mission')}</Link></li>
                  <li><Link href="/about#timeline">{t('선교회 연혁', 'Our History')}</Link></li>
                </ul>
              </div>
              
              <div className="footer-link-col">
                <h3>{t('사역 소식', 'Ministries')}</h3>
                <ul>
                  <li><Link href="/projects">{t('선교회 소식 / 블로그', 'Blog & News')}</Link></li>
                  <li><Link href="/global">{t('해외 선교 지부', 'Global Branches')}</Link></li>
                </ul>
              </div>
            </div>

            <div className="footer-social-media">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Linkedin">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Segment: Copyright & Back-to-Top */}
        <div className="footer-bottom">
          <div className="footer-copyright-row">
            <p className="copyright">
              {t(
                'Copyright © 2026 CNCC 선교회 (CNCC) | 사업자번호 및 지부 세부 사항은 문의 바랍니다.',
                'Copyright © 2026 CNCC Missionary. All rights reserved.'
              )}
            </p>
            <span className="footer-divider">|</span>
            <Link href="/admin" className="footer-admin-link">
              {t('관리자 CMS', 'CMS Admin')}
            </Link>
          </div>
          
          <button 
            onClick={handleScrollToTop} 
            className="back-to-top-btn"
            aria-label="Back to Top"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .footer-section {
          background-color: var(--primary-dark);
          color: var(--secondary);
          padding-top: 80px;
          padding-bottom: 40px;
          border-top: 2px solid var(--accent);
        }

        .footer-middle {
          display: flex;
          justify-content: space-between;
          gap: 60px;
          padding-bottom: 60px;
          margin-bottom: 30px;
        }

        @media (max-width: 900px) {
          .footer-middle {
            flex-direction: column;
            gap: 40px;
          }
        }

        .footer-info-side {
          flex: 1;
          max-width: 45%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        @media (max-width: 900px) {
          .footer-info-side {
            max-width: 100%;
          }
        }

        .footer-logo {
          display: inline-flex;
          align-items: center;
        }

        .footer-logo-img {
          height: 54px;
          width: auto;
          display: block;
          filter: brightness(0) invert(1);
        }

        .footer-desc {
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.7);
        }

        .footer-contact-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }

        .footer-contact-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .footer-menu-side {
          flex: 1;
          max-width: 50%;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        @media (max-width: 900px) {
          .footer-menu-side {
            max-width: 100%;
          }
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px;
        }

        @media (max-width: 600px) {
          .footer-links-grid {
            grid-template-columns: 1fr;
          }
        }

        .footer-link-col h3 {
          color: rgba(255, 255, 255, 0.45);
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 20px;
          font-family: var(--font-sans);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .footer-link-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-link-col ul a {
          font-size: 1.3rem;
          color: var(--text-light);
          font-weight: 600;
          transition: var(--transition-fast);
        }

        .footer-link-col ul a:hover {
          color: var(--accent);
          padding-left: 6px;
        }

        .footer-social-media {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-social-media a {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.6);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-social-media a:hover {
          background-color: var(--accent);
          color: var(--text-light);
          border-color: var(--accent);
          transform: translateY(-4px);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .footer-copyright-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .footer-divider {
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.8rem;
        }

        .footer-admin-link {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.45);
          transition: var(--transition-fast);
        }

        .footer-admin-link:hover {
          color: var(--accent);
          text-decoration: underline;
        }

        .copyright {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .back-to-top-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .back-to-top-btn:hover {
          background-color: var(--accent);
          color: var(--text-light);
          transform: translateY(-4px);
        }
      `}</style>
    </footer>
  );
};
export default Footer;
