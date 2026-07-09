'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Search, X, Globe2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { language, setLanguage, d, t } = useLanguage();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMinistriesDropdownOpen, setIsMinistriesDropdownOpen] = useState(false);

  // Scroll detection to handle sticky header transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsMinistriesDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/about', label: t('선교회 소개', 'About CNCC') },
    { href: '/projects', label: t('블로그 & 소식', 'Blog & News') },
    { href: '/global', label: t('해외 지부', 'Global Branches') },
    { href: '/support', label: t('후원 안내', 'Support & Giving') },
  ];

  const isHome = pathname === '/';
  const transparentMode = isHome && !isScrolled;

  return (
    <>
      <header className={`header-container ${transparentMode ? 'transparent-mode' : 'solid-mode'}`}>
        {/* Main Navbar */}
        <div className="main-navbar">
          <div className="container nav-content">
            {/* Left Group */}
            <div className="nav-group-left">
              <Link href="/" className="logo-link">
                <img src="/logo.svg" alt="CNCC Logo" className="logo-img" style={{ height: '48px', width: 'auto' }} />
              </Link>
              
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="nav-item-btn menu-toggle-btn"
                aria-label="Open Menu"
              >
                <span>Menu</span>
                <span className="hamburger-icon">☰</span>
              </button>

              <div 
                className="nav-dropdown-wrapper"
                onMouseEnter={() => setIsMinistriesDropdownOpen(true)}
                onMouseLeave={() => setIsMinistriesDropdownOpen(false)}
              >
                <button 
                  className="nav-item-btn dropdown-trigger"
                  onClick={() => setIsMinistriesDropdownOpen(!isMinistriesDropdownOpen)}
                >
                  <span>{t('사역 영역', 'Ministries')}</span>
                  <span className="chevron-icon">⌵</span>
                </button>
                <AnimatePresence>
                  {isMinistriesDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="nav-dropdown-menu"
                    >
                      <Link href="/about#pillars" className="dropdown-menu-item">{t('사역 전체보기', 'All Ministries')}</Link>
                      <Link href="/ministries/worship" className="dropdown-menu-item">{t('회복 및 예배 사역', 'Restoration & Worship')}</Link>
                      <Link href="/ministries/missions" className="dropdown-menu-item">{t('국내외 선교 활동', 'Domestic & Global Missions')}</Link>
                      <Link href="/ministries/service" className="dropdown-menu-item">{t('선교예배', 'Mission Worship')}</Link>
                      <Link href="/ministries/enterprises" className="dropdown-menu-item">{t('선교사업', 'Mission Enterprises')}</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Group */}
            <div className="nav-group-right">
              <Link href="/support" className="nav-text-link support-link">
                <span>{t('후원 안내', 'Support')}</span>
                <span className="arrow-icon">↗</span>
              </Link>

              <button 
                onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
                className="nav-item-btn lang-select-btn"
              >
                <Globe2 size={18} />
                <span>{language === 'ko' ? 'KO' : 'EN'}</span>
                <span className="chevron-icon">⌵</span>
              </button>

              <Link href="/support" className="btn-donate-pill">
                <span>{t('후원하기', 'Donate')}</span>
                <span className="plus-icon">+</span>
              </Link>

              <button 
                onClick={() => setIsSearchOpen(true)}
                className="search-toggle-btn"
                aria-label="Search"
              >
                <Search size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="search-overlay"
          >
            <button 
              onClick={() => setIsSearchOpen(false)} 
              className="search-close-btn"
              aria-label="Close search"
            >
              <X size={32} />
            </button>
            
            <div className="search-form-container">
              <p className="search-label">{t('검색어를 입력하세요', 'Type to search the site')}</p>
              <form onSubmit={(e) => { e.preventDefault(); alert(`Search for: ${searchQuery}`); setIsSearchOpen(false); }} className="search-form">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('검색...', 'Search...')} 
                  autoFocus 
                  className="search-input"
                />
                <button type="submit" className="search-submit-btn">
                  <Search size={28} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Navigation Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="drawer-overlay-container"
          >
            <div className="mobile-drawer">
              <div className="drawer-header">
                <Link href="/" className="logo-link">
                  <img src="/logo.svg" alt="CNCC Logo" className="drawer-logo-img" style={{ height: '60px', width: 'auto' }} />
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
          transition: all var(--transition-smooth);
        }

        .header-container.transparent-mode {
          position: absolute;
          background-color: transparent;
          border-bottom: none;
          box-shadow: none;
        }

        .header-container.solid-mode {
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: var(--shadow-sm);
        }

        .main-navbar {
          height: 90px;
          display: flex;
          align-items: center;
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
        }

        .nav-group-left {
          display: flex;
          align-items: center;
          gap: 48px;
        }

        .nav-group-right {
          display: flex;
          align-items: center;
          gap: 28px;
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

        .transparent-mode .logo-img {
          filter: brightness(0) invert(1);
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

        .transparent-mode .nav-item-btn {
          color: var(--text-light);
        }

        .solid-mode .nav-item-btn {
          color: var(--text-dark);
        }

        .nav-item-btn:hover {
          color: var(--primary) !important;
        }

        .hamburger-icon {
          font-size: 1.1rem;
          line-height: 1;
        }

        .chevron-icon {
          font-size: 0.75rem;
          margin-top: -2px;
        }

        .nav-dropdown-wrapper {
          position: relative;
        }

        .nav-dropdown-menu {
          position: absolute;
          top: calc(100% + 10px);
          left: 0;
          background-color: var(--bg-white);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          min-width: 170px;
          z-index: 10;
          padding: 8px 0;
        }

        .dropdown-menu-item {
          padding: 10px 18px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-dark);
          transition: var(--transition-fast);
        }

        .dropdown-menu-item:hover {
          background-color: var(--secondary-light);
          color: var(--primary);
        }

        .nav-text-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 1.15rem;
          font-weight: 600;
          transition: var(--transition-fast);
        }

        .transparent-mode .nav-text-link {
          color: var(--text-light);
        }

        .solid-mode .nav-text-link {
          color: var(--text-dark);
        }

        .nav-text-link:hover {
          color: var(--primary) !important;
        }

        .arrow-icon {
          font-size: 0.8rem;
        }

        /* Pill-shaped Donate Button */
        .btn-donate-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 26px;
          font-weight: 600;
          font-size: 1.1rem;
          border-radius: 30px;
          transition: all var(--transition-fast);
          height: 48px;
        }

        .transparent-mode .btn-donate-pill {
          background-color: rgba(255, 255, 255, 0.15);
          color: var(--text-light);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .solid-mode .btn-donate-pill {
          background-color: var(--secondary-light);
          color: var(--text-dark);
          border: 1px solid var(--border-color);
        }

        .btn-donate-pill:hover {
          background-color: var(--primary) !important;
          color: var(--text-light) !important;
          border-color: var(--primary) !important;
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }

        .plus-icon {
          font-weight: 700;
        }

        .search-toggle-btn {
          transition: var(--transition-fast);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border: none;
          background: none;
          cursor: pointer;
        }

        .transparent-mode .search-toggle-btn {
          color: var(--text-light);
        }

        .solid-mode .search-toggle-btn {
          color: var(--text-dark);
        }

        .search-toggle-btn:hover {
          color: var(--primary) !important;
        }

        @media (max-width: 900px) {
          .nav-group-left {
            gap: 20px;
          }
          .nav-group-right {
            gap: 12px;
          }
          .support-link,
          .btn-donate-pill {
            display: none;
          }
        }

        /* Search Overlay CSS */
        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 43, 91, 0.98);
          z-index: 200;
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(--text-light);
        }

        .search-close-btn {
          position: absolute;
          top: 40px;
          right: 40px;
          color: var(--secondary);
          transition: var(--transition-fast);
          background: none;
          border: none;
          cursor: pointer;
        }

        .search-close-btn:hover {
          color: var(--text-light);
          transform: rotate(90deg);
        }

        .search-form-container {
          width: 90%;
          max-width: 600px;
        }

        .search-label {
          font-size: 0.85rem;
          color: var(--secondary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
        }

        .search-form {
          display: flex;
          align-items: center;
          border-bottom: 2px solid var(--secondary);
          padding-bottom: 8px;
        }

        .search-input {
          background: none;
          border: none;
          color: var(--text-light);
          font-size: 2rem;
          width: 100%;
          font-family: var(--font-sans);
        }

        .search-input:focus {
          outline: none;
        }

        .search-submit-btn {
          color: var(--secondary);
          transition: var(--transition-fast);
          background: none;
          border: none;
          cursor: pointer;
        }

        .search-submit-btn:hover {
          color: var(--text-light);
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
          font-family: var(--font-serif);
          font-size: 2.8rem;
          font-weight: 400;
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
          font-weight: 700;
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
