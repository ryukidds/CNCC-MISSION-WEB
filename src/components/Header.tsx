'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close menus when route changes
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/about', label: t('소개', 'About') },
    { href: '/about#pillars', label: t('사역', 'Ministries') },
    { href: '/global', label: t('해외지부', 'Global') },
    { href: '/projects', label: t('소식', 'News') },
    { href: '/support', label: t('후원 안내', 'Support & Giving') },
  ];

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className={`header-container ${isScrolled || isMobileMenuOpen ? 'solid-mode' : ''}`}>
        {/* Main Navbar */}
        <div className="main-navbar">
          <div className="container nav-content">
            {/* Left Group */}
            <div className="nav-group-left">
              <Link href="/" className="logo-link">
                <Image src="/logo.svg" alt="CNCC Logo" className="logo-img" width={154} height={48} priority />
              </Link>
            </div>

            <nav className="desktop-nav-links" aria-label={t('주요 메뉴', 'Primary navigation')}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={pathname === link.href.split('#')[0] ? 'active' : ''}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Group */}
            <div className="nav-group-right">
              <div className="language-switch" aria-label={t('언어 선택', 'Language selector')}>
                <button
                  type="button"
                  onClick={() => setLanguage('ko')}
                  className={language === 'ko' ? 'active' : ''}
                  aria-pressed={language === 'ko'}
                >
                  KO
                </button>
                <span aria-hidden="true">|</span>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={language === 'en' ? 'active' : ''}
                  aria-pressed={language === 'en'}
                >
                  EN
                </button>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="nav-item-btn menu-toggle-btn"
                aria-label="Open Menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu size={22} strokeWidth={1.8} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Navigation Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="drawer-overlay-container"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="mobile-drawer"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="drawer-header">
                <Link href="/" className="logo-link">
                  <Image src="/logo.svg" alt="CNCC Logo" className="drawer-logo-img" width={193} height={60} priority />
                </Link>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="drawer-close-btn"
                  aria-label="Close Menu"
                >
                  <X size={28} />
                </button>
              </div>
              
              <nav className="drawer-nav-links">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`drawer-nav-item ${pathname === link.href ? 'active' : ''}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="drawer-footer-info">
                <span className="info-label">{t('소속 및 지부', 'Based in')}</span>
                <p className="info-text">{t('서울 본부 / 글로벌 선교 지부', 'Seoul HQ / Global Branch Sites')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles */}
      <style jsx global>{`
        .header-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100;
          background-color: transparent;
          border-bottom: 1px solid transparent;
          transition: all var(--transition-smooth);
        }

        .header-container.solid-mode {
          background-color: var(--bg-white);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: none;
        }

        .header-container:not(.solid-mode) .desktop-nav-links a,
        .header-container:not(.solid-mode) .nav-item-btn {
          color: var(--primary-dark);
        }

        .header-container:not(.solid-mode) .desktop-nav-links a:hover,
        .header-container:not(.solid-mode) .desktop-nav-links a.active {
          color: var(--primary-dark);
        }

        .header-container:not(.solid-mode) .language-switch button {
          color: #6b7a90;
        }

        .header-container:not(.solid-mode) .language-switch button.active,
        .header-container:not(.solid-mode) .language-switch button:hover {
          color: var(--primary-dark);
        }

        .main-navbar {
          height: var(--header-height);
          display: flex;
          align-items: center;
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          position: relative;
        }

        .nav-group-left {
          display: flex;
          align-items: center;
          flex: 0 0 220px;
        }

        .nav-group-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 28px;
          flex: 0 0 220px;
        }

        .logo-link {
          display: flex;
          align-items: center;
        }

        .logo-img {
          height: 48px;
          width: auto;
          display: block;
          transition: filter var(--transition-fast);
        }

        .nav-item-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 1.15rem;
          transition: var(--transition-fast);
          cursor: pointer;
          border: none;
          background: none;
          padding: 6px 12px;
        }

        .nav-item-btn:hover {
          color: var(--primary) !important;
        }

        .menu-toggle-btn {
          display: none;
        }

        .desktop-nav-links {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 48px;
          white-space: nowrap;
        }

        .desktop-nav-links a {
          color: #111111;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: -0.25px;
          transition: var(--transition-fast);
        }

        .desktop-nav-links a:hover,
        .desktop-nav-links a.active {
          color: var(--primary-dark);
        }

        .language-switch {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 1rem;
          font-weight: 600;
          transition: var(--transition-fast);
        }

        .language-switch button {
          color: #a4a7ad;
          font-size: inherit;
          font-weight: inherit;
          transition: var(--transition-fast);
        }

        .language-switch button.active {
          color: #111111;
        }

        .language-switch span {
          opacity: 0.45;
        }

        .language-switch button:hover {
          color: #111111;
        }

        @media (max-width: 900px) {
          .desktop-nav-links {
            display: none;
          }
          .menu-toggle-btn {
            display: inline-flex;
            width: 32px;
            height: 32px;
            align-items: center;
            justify-content: center;
            padding: 0;
            line-height: 1;
          }
          .nav-group-left {
            flex: 1 1 auto;
            gap: 0;
          }
          .nav-group-right {
            flex: 0 0 auto;
            gap: 14px;
          }
        }

        /* Full Screen Navigation Drawer CSS */
        .drawer-overlay-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 43, 91, 0.25);
          backdrop-filter: blur(4px);
          z-index: 150;
        }

        .mobile-drawer {
          position: absolute;
          top: 0;
          right: 0;
          width: 40%;
          min-width: 340px;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(15px);
          box-shadow: var(--shadow-lg);
          padding: 60px 4%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .mobile-drawer {
            width: 100%;
            padding: 40px 6%;
          }
        }

        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .drawer-logo-img {
          height: 60px;
          width: auto;
          display: block;
        }

        .drawer-close-btn {
          color: var(--text-dark);
          transition: var(--transition-fast);
          background: none;
          border: none;
          cursor: pointer;
        }

        .drawer-close-btn:hover {
          color: var(--primary);
          transform: scale(1.1);
        }

        .drawer-nav-links {
          display: flex;
          flex-direction: column;
          gap: 28px;
          margin-top: 40px;
          margin-bottom: auto;
        }

        .drawer-nav-item {
          font-family: var(--font-sans);
          font-size: 2.8rem;
          font-weight: 600;
          color: var(--text-dark);
          transition: all var(--transition-smooth);
          line-height: 1.1;
          display: block;
        }

        .drawer-nav-item:hover,
        .drawer-nav-item.active {
          color: var(--primary);
          padding-left: 12px;
        }

        .drawer-footer-info {
          border-top: 1px solid var(--border-color);
          padding-top: 30px;
          margin-top: 40px;
        }

        .drawer-footer-info .info-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 6px;
        }

        .drawer-footer-info .info-text {
          font-size: 0.9rem;
          color: var(--text-muted);
          font-weight: 600;
        }
      `}</style>
    </>
  );
};
export default Header;
