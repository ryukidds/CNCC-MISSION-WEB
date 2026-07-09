'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { PageTransition, ScrollReveal, StaggerContainer, StaggerItem } from '@/components/FramerTransitions';

type Branch = {
  id: string;
  country: string;
  countryKo: string;
  city: string;
  cityKo: string;
  address: string;
  addressKo: string;
  contact: string;
};

export default function GlobalBranches() {
  const { t, d } = useLanguage();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeCountry, setActiveCountry] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.branches) {
          setBranches(data.branches);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching branches:', err);
        setLoading(false);
      });
  }, []);

  // Extract unique countries
  const uniqueCountries = ['All', ...Array.from(new Set(branches.map(b => b.country)))];

  const getCountryLabel = (country: string) => {
    if (country === 'All') return t('전체보기', 'All Locations');
    const branch = branches.find(b => b.country === country);
    return branch ? d({ ko: branch.countryKo, en: branch.country }) : country;
  };

  const filteredBranches = activeCountry === 'All' 
    ? branches 
    : branches.filter(b => b.country === activeCountry);

  return (
    <PageTransition>
      {/* 1. Header Section */}
      <section className="global-header-section">
        <div className="container">
          <ScrollReveal>
            <span className="banner-tag">{t('네트워크', 'GLOBAL NETWORK')}</span>
            <h1>{t('CNCC 해외 지부', 'CNCC Global Branches')}</h1>
            <p className="banner-desc">
              {t(
                '우리는 사람과 문화, 교회의 경계를 넘나들며 복음을 실천하기 위해 세계 곳곳의 현지 지부들과 유기적으로 동역하고 있습니다.',
                'We work in partnership with local branches around the world to practice the Gospel across people, cultures, and church borders.'
              )}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Map & Filter Segment */}
      <section className="section-padding global-main-section">
        <div className="container">
          {/* Countries Filters */}
          <ScrollReveal>
            <div className="countries-tabs">
              {uniqueCountries.map((country) => (
                <button
                  key={country}
                  onClick={() => setActiveCountry(country)}
                  className={`country-tab-btn ${activeCountry === country ? 'active' : ''}`}
                >
                  <span>{getCountryLabel(country)}</span>
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Branches Grid */}
          {loading ? (
            <div className="loader-box">
              <div className="spinner"></div>
            </div>
          ) : filteredBranches.length === 0 ? (
            <div className="text-center no-branches">
              <p>{t('해당 국가에 등록된 지부가 없습니다.', 'No branches registered for this country.')}</p>
            </div>
          ) : (
            <StaggerContainer>
              <div className="branches-grid">
                {filteredBranches.map((branch) => (
                  <StaggerItem key={branch.id}>
                    <div className="branch-card">
                      <div className="branch-card-header">
                        <span className="country-badge">
                          {d({ ko: branch.countryKo, en: branch.country })}
                        </span>
                        <h3>{d({ ko: branch.cityKo, en: branch.city })}</h3>
                      </div>
                      <div className="branch-card-body">
                        <div className="branch-info-row">
                          <span>{d({ ko: branch.addressKo, en: branch.address })}</span>
                        </div>
                        {branch.contact && (
                        <div className="branch-info-row">
                          <a href={`tel:${branch.contact}`} className="contact-link">{branch.contact}</a>
                        </div>
                        )}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          )}
        </div>
      </section>

      <style jsx>{`
        /* Header Segment */
        .global-header-section {
          background-color: var(--primary-dark);
          color: var(--text-light);
          padding: 104px 0 112px 0;
          border-bottom: 1px solid rgba(0, 43, 91, 0.12);
          background-image: linear-gradient(90deg, rgba(0, 43, 91, 0.9), rgba(0, 43, 91, 0.72)), url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
        }

        .banner-tag {
          font-size: 0.8rem;
          color: var(--accent);
          font-weight: 700;
          letter-spacing: 0.14em;
          display: block;
          margin-bottom: 16px;
        }

        .global-header-section h1 {
          color: var(--text-light);
          font-size: 3.2rem;
          margin-bottom: 24px;
          max-width: 820px;
        }

        .banner-desc {
          font-size: 1.15rem;
          color: var(--secondary);
          max-width: 720px;
          line-height: 1.6;
        }

        /* Filter Tabs */
        .global-main-section {
          background-color: var(--bg-light);
        }

        .countries-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 56px;
          flex-wrap: wrap;
        }

        .country-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--bg-white);
          border: 1px solid var(--border-color);
          padding: 12px 24px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-dark);
          transition: var(--transition-fast);
        }

        .country-tab-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .country-tab-btn.active {
          background-color: var(--primary);
          border-color: var(--primary);
          color: var(--text-light);
          box-shadow: var(--shadow-sm);
        }

        /* Branch Grid & Cards */
        .branches-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          max-width: 1000px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .branches-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        .branch-card {
          background-color: transparent;
          padding: 0 0 32px;
          border-bottom: 1px solid var(--border-color);
          transition: var(--transition-smooth);
        }

        .branch-card:hover {
          border-color: rgba(86, 223, 207, 0.45);
        }

        .branch-card-header {
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
        }

        .country-badge {
          background-color: var(--secondary-light);
          color: var(--primary);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: inline-block;
          margin-bottom: 10px;
        }

        .branch-card-header h3 {
          font-size: 1.4rem;
          font-family: var(--font-sans);
          font-weight: 700;
        }

        .branch-card-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .branch-info-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .contact-link {
          font-weight: 600;
          color: var(--primary);
          transition: var(--transition-fast);
        }

        .contact-link:hover {
          color: var(--accent);
        }

        /* Utility classes */
        .loader-box {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--secondary);
          border-top: 4px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .no-branches {
          padding: 50px;
          color: var(--text-muted);
        }
      `}</style>
    </PageTransition>
  );
}
