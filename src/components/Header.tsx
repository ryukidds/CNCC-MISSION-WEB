'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Menu, X, ChevronDown, ArrowUpRight, Images } from 'lucide-react';
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

  type SubLink = { href: string; label: string; desc?: string; featured?: boolean };
  type NavLink = { href: string; label: string; children?: SubLink[] };

  const navLinks: NavLink[] = [
    { href: '/about', label: t('소개', 'About') },
    {
      href: '/about#pillars',
      label: t('사역', 'Ministries'),
      children: [
        { href: '/ministries/worship', label: t('회복 및 예배 사역', 'Restoration & Worship') },
        { href: '/ministries/missions', label: t('국내외 선교 활동', 'Domestic & Global Missions') },
        { href: '/ministries/service', label: t('선교예배', 'Mission Worship') },
        { href: '/ministries/enterprises', label: t('선교사업', 'Mission Enterprises') },
        {
          href: '/gallery',
          label: t('현장 갤러리', 'Field Gallery'),
          desc: t('선교 현장의 순간들을 사진으로 만나보세요', 'Moments from the mission field'),
          featured: true,
        },
      ],
    },
    { href: '/global', label: t('해외지부', 'Global') },
    { href: '/projects', label: t('소식', 'News') },
    { href: '/support', label: t('후원 안내', 'Support & Giving') },
  ];

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const isLinkActive = (link: NavLink) =>
    pathname === link.href.split('#')[0] ||
    Boolean(link.children?.some((child) => pathname === child.href));

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
                <div
                  key={link.href}
                  className="nav-item"
                  onMouseEnter={() => link.children && setOpenDropdown(link.href)}
                  onMouseLeave={() => link.children && setOpenDropdown(null)}
                  onFocus={() => link.children && setOpenDropdown(link.href)}
                  onBlur={(e) => {
                    if (link.children && !e.currentTarget.contains(e.relatedTarget as Node)) {
                      setOpenDropdown(null);
                    }
                  }}
                >
                  <Link
                    href={link.href}
                    className={`nav-top-link ${isLinkActive(link) ? 'active' : ''}`}
                    aria-haspopup={link.children ? 'true' : undefined}
                    aria-expanded={link.children ? openDropdown === link.href : undefined}
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown
                        size={14}
                        strokeWidth={2.2}
                        className={`nav-chevron ${openDropdown === link.href ? 'open' : ''}`}
                        aria-hidden="true"
                      />
                    )}
                  </Link>

                  {link.children && (
                    <AnimatePresence>
                      {openDropdown === link.href && (
                        <motion.div
                          className="nav-dropdown"
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <motion.ul
                            className="nav-dropdown-list"
                            initial="hidden"
                            animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } } }}
                          >
                            {link.children.map((child) => (
                              <motion.li
                                key={child.href}
                                variants={{
                                  hidden: { opacity: 0, y: 6 },
                                  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
                                }}
                                className={child.featured ? 'is-featured' : ''}
                              >
                                <Link
                                  href={child.href}
                                  className={`nav-dropdown-link ${pathname === child.href ? 'active' : ''}`}
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  {child.featured && (
                                    <span className="nav-dropdown-icon" aria-hidden="true">
                                      <Images size={16} strokeWidth={1.8} />
                                    </span>
                                  )}
                                  <span className="nav-dropdown-text">
                                    <span className="nav-dropdown-label">{child.label}</span>
                                    {child.desc && <span className="nav-dropdown-desc">{child.desc}</span>}
                                  </span>
                                  <ArrowUpRight size={14} className="nav-dropdown-arrow" aria-hidden="true" />
                                </Link>
                              </motion.li>
                            ))}
                          </motion.ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
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
                  <div key={link.href} className="drawer-nav-group">
                    <div className="drawer-nav-row">
                      <Link
                        href={link.href}
                        className={`drawer-nav-item ${isLinkActive(link) ? 'active' : ''}`}
                      >
                        {link.label}
                      </Link>
                      {link.children && (
                        <button
                          type="button"
                          className={`drawer-expand-btn ${mobileExpanded === link.href ? 'open' : ''}`}
                          onClick={() => setMobileExpanded((prev) => (prev === link.href ? null : link.href))}
                          aria-label={t('하위 메뉴 열기', 'Toggle submenu')}
                          aria-expanded={mobileExpanded === link.href}
                        >
                          <ChevronDown size={26} strokeWidth={1.8} />
                        </button>
                      )}
                    </div>
                    {link.children && (
                      <AnimatePresence initial={false}>
                        {mobileExpanded === link.href && (
                          <motion.ul
                            className="drawer-sub-list"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          >
                            {link.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className={`drawer-sub-item ${child.featured ? 'is-featured' : ''} ${pathname === child.href ? 'active' : ''}`}
                                >
                                  {child.featured && <Images size={18} strokeWidth={1.8} aria-hidden="true" />}
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
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

        .header-container:not(.solid-mode) .desktop-nav-links .nav-top-link,
        .header-container:not(.solid-mode) .nav-item-btn {
          color: var(--primary-dark);
        }

        .header-container:not(.solid-mode) .desktop-nav-links .nav-top-link:hover,
        .header-container:not(.solid-mode) .desktop-nav-links .nav-top-link.active {
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

        .desktop-nav-links .nav-top-link {
          color: #111111;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: -0.25px;
          transition: var(--transition-fast);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          position: relative;
          height: var(--header-height);
        }

        .desktop-nav-links .nav-top-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 18px;
          height: 2px;
          border-radius: 2px;
          background: var(--primary);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .desktop-nav-links .nav-item:hover .nav-top-link::after,
        .desktop-nav-links .nav-top-link.active::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        .desktop-nav-links .nav-top-link:hover,
        .desktop-nav-links .nav-top-link.active {
          color: var(--primary-dark);
        }

        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
        }

        .nav-chevron {
          opacity: 0.55;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s;
        }

        .nav-chevron.open {
          transform: rotate(180deg);
          opacity: 1;
        }

        .nav-dropdown {
          position: absolute;
          top: calc(100% - 6px);
          left: 50%;
          margin-left: -150px;
          width: 300px;
          padding-top: 6px;
          transform-origin: top center;
          z-index: 120;
        }

        .nav-dropdown-list {
          list-style: none;
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(0, 43, 91, 0.08);
          border-radius: 18px;
          padding: 10px;
          box-shadow: 0 24px 48px -12px rgba(0, 43, 91, 0.18), 0 2px 6px rgba(0, 43, 91, 0.04);
        }

        .nav-dropdown-list li.is-featured {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(0, 43, 91, 0.08);
        }

        .nav-dropdown-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 12px;
          color: var(--text-dark);
          font-size: 0.95rem;
          font-weight: 600;
          white-space: normal;
          transition: background-color 0.25s ease, color 0.25s ease;
        }

        .nav-dropdown-link:hover,
        .nav-dropdown-link.active {
          background-color: rgba(86, 223, 207, 0.12);
        }

        .nav-dropdown-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }

        .nav-dropdown-desc {
          font-size: 0.78rem;
          font-weight: 400;
          color: var(--text-muted);
        }

        .nav-dropdown-icon {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-dark);
          color: var(--primary);
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .nav-dropdown-link:hover .nav-dropdown-icon {
          transform: rotate(-8deg) scale(1.06);
        }

        .nav-dropdown-arrow {
          opacity: 0;
          transform: translate(-6px, 6px);
          transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          color: var(--primary-dark);
          flex-shrink: 0;
        }

        .nav-dropdown-link:hover .nav-dropdown-arrow {
          opacity: 1;
          transform: translate(0, 0);
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

        .drawer-nav-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .drawer-expand-btn {
          width: 44px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: var(--text-dark);
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.2s;
        }

        .drawer-expand-btn:hover {
          background-color: rgba(86, 223, 207, 0.12);
        }

        .drawer-expand-btn.open {
          transform: rotate(180deg);
          color: var(--primary);
        }

        .drawer-sub-list {
          list-style: none;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-left: 2px solid rgba(86, 223, 207, 0.5);
          margin-left: 4px;
        }

        .drawer-sub-list li:first-child {
          padding-top: 16px;
        }

        .drawer-sub-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0 8px 18px;
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-muted);
          transition: color 0.2s, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .drawer-sub-item:hover,
        .drawer-sub-item.active {
          color: var(--primary-dark);
          transform: translateX(6px);
        }

        .drawer-sub-item.is-featured {
          color: var(--primary-dark);
        }

        .drawer-sub-item.is-featured svg {
          color: var(--primary-hover);
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
