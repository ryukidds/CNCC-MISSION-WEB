'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { PageTransition, ScrollReveal } from '@/components/FramerTransitions';

type LocalizedText = {
  ko: string;
  en: string;
};

type HistoryItem = {
  id?: string;
  year: string;
  title: LocalizedText;
  desc: LocalizedText;
};

export default function About() {
  const { t, d } = useLanguage();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(0);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.history) {
          setHistory(data.history);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching history:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (history.length === 0) return;
    const rows = Array.from(document.querySelectorAll<HTMLElement>('.history-row-inner'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).getAttribute('data-history-index'));
            setActiveHistoryIndex(index);
          }
        });
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: 0 }
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [history.length]);

  return (
    <PageTransition>
      {/* 1. Header Banner */}
      <section className="about-hero-section">
        <div className="container">
          <ScrollReveal>
            <span className="banner-tag">{t('소개', 'ABOUT US')}</span>
            <h1>Coram Deo, A New Creation</h1>
            <p className="banner-desc">
              {t(
                'CNCC 선교회는 복음을 전하는 것과 더불어 삶의 전 영역에서 창조적 회복이 일어나도록 돕는 선교적 공동체입니다.',
                'CNCC Missionary is a missional community that facilitates creative restoration in all areas of life alongside preaching the Gospel.'
              )}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Core Philosophy & Intro */}
      <section className="section-padding intro-detail-section">
        <div className="container">
          <div className="intro-stack">
            <ScrollReveal className="intro-text-block">
              <span className="intro-label">{t('선교회 소개', 'WHO WE ARE')}</span>
              <h1 className="about-display-title">Restoration, Healing, and Transformation</h1>
              <div className="text-divider"></div>
              <p className="highlight-text">
                {t(
                  '코람데오(Coram Deo)는 하나님 앞에서라는 뜻입니다. 한 사람의 삶이 하나님 앞에서 반응할 때 하나님의 마음으로 다시 세워지고, 회복과 치유가 일어나며 그 한 영혼이 새로워지는 일(New Creation)에 집중하는 선교단체입니다.',
                  'Coram Deo means in the presence of God. When a person\'s life responds before God, they are rebuilt with God\'s heart, experiencing restoration and healing. We are a mission organization focused on the renewal of each soul as a New Creation.'
                )}
              </p>
              <p className="normal-text">
                {t(
                  'CNCC의 사역은 복음을 전하는 것과 더불어 삶의 전 영역에서 창조적 회복이 일어나도록 하나님의 마음을 전하여 사랑을 나누고 흘려보내는 것입니다.',
                  'CNCC\'s ministry goes beyond preaching the Gospel—we convey God\'s heart so that creative restoration may take place in every area of life, sharing and flowing His love.'
                )}
              </p>
              <p className="normal-text">
                {t(
                  '우리는 사회적 약자들에게 사랑을 실천하며, 목회 사역으로 인해 지친 목회자들의 회복을 돕고, 국내외 다양한 국가에서 예배 사역과 치유 사역을 진행하며 해외 선교사님들과 협력합니다.',
                  'We serve the marginalized with love, help restore weary pastors, conduct worship and healing ministries across multiple countries, and partner with overseas missionaries.'
                )}
              </p>
            </ScrollReveal>

            <ScrollReveal className="intro-points-block">
              <div className="intro-points-list">
                <div className="intro-point">
                  <span>01</span>
                  <p>{t('회복과 치유를 통한 예배 사역', 'Worship ministry through restoration and healing')}</p>
                </div>
                <div className="intro-point">
                  <span>02</span>
                  <p>{t('교단을 넘어 함께 드리는 선교예배', 'Mission worship that transcends denominations')}</p>
                </div>
                <div className="intro-point">
                  <span>03</span>
                  <p>{t('삶의 모든 영역에서 선교의 통로가 되는 사업', 'Enterprises that serve as channels of mission')}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. Mission Section */}
      <section className="section-padding mission-section" id="vision">
        <div className="container">
          <div className="mission-container">
            <ScrollReveal>
              <div className="mission-header text-center">
                <span className="section-subtitle">{t('미션', 'OUR MISSION')}</span>
                <h1 className="about-display-title">A Life of Honesty and Faithfulness Before God</h1>
                <div className="accent-line"></div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mission-text-list">
                <p>
                  {t(
                    'CNCC선교회는 하나님 앞에서 정직함으로 이웃을 사랑하며 거저 받은 것을 거저 베풀고 나누는 삶을 지향합니다. 우리는 한 사람을 귀하게 여기며, 그 한 사람이 복음 안에서 새로운 피조물로 거듭날 때, 그 변화가 개인을 넘어 가정과 교회, 사회 공동체까지 확장된다고 믿습니다.',
                    'CNCC Missionary pursues a life of loving neighbors with honesty before God, freely giving and sharing what we have freely received. We treasure each individual, believing that when one person is reborn as a new creation in the Gospel, that transformation extends beyond the individual to families, churches, and communities.'
                  )}
                </p>
                <p>
                  {t(
                    '우리는 하나님 앞에서 정직하며 충성되게 일하고, 주신 열매를 이웃과 나누는 삶을 살려고 노력합니다. 나눔은 하나님의 마음이며, 위로이며, 사랑이자 진정한 회복의 시작임을 알기에 우리는 복음의 능력으로 한 사람을 대하고 그를 통해 세워지는 한 영혼이 또 다른 공동체를 이룸을 기대합니다.',
                    'We strive to work honestly and faithfully before God, sharing the fruits He has given with our neighbors. Knowing that sharing is God\'s heart, His comfort, His love, and the true beginning of restoration, we engage each person with the power of the Gospel, expecting that one transformed soul will build another community.'
                  )}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3.5. Core Pillars (Restoration & Missions) */}
      <section className="section-padding pillars-section" id="pillars">
        <div className="container">
          <ScrollReveal>
            <div className="section-header text-center">
              <span className="section-subtitle">{t('사역 영역', 'CORE PILLARS')}</span>
              <h1 className="about-display-title">{t('세상을 세우는 선교의 통로', 'Four Pillars of Our Mission')}</h1>
              <div className="accent-line"></div>
            </div>
          </ScrollReveal>

          <div className="pillars-grid">
            {/* Pillar 1: 회복 및 예배 사역 */}
            <ScrollReveal>
              <Link href="/ministries/worship" className="pillar-card">
                <div className="pillar-card-header">
                  <span className="pillar-num">01</span>
                  <h3>{t('회복 및 예배 사역', 'Restoration & Worship')}</h3>
                </div>
                <p>
                  {t(
                    '사회적 약자들에게 사랑을 실천하며, 특히 목회 사역으로 인해 지친 목회자들의 회복을 돕는 예배 사역과 치유 사역, 그리고 멤버 케어를 중점으로 합니다.',
                    'We serve the marginalized with love, focusing on worship, inner healing, and dedicated member care programs to restore weary pastors.'
                  )}
                </p>
                <div className="pillar-sub-items">
                  <span className="pillar-sub-item">✦ {t('목회자 회복 사역', 'Pastoral Restoration')}</span>
                  <span className="pillar-sub-item">✦ {t('치유 사역 & 멤버 케어', 'Healing & Member Care')}</span>
                </div>
              </Link>
            </ScrollReveal>

            {/* Pillar 2: 국내외 선교 활동 */}
            <ScrollReveal>
              <Link href="/ministries/missions" className="pillar-card">
                <div className="pillar-card-header">
                  <span className="pillar-num">02</span>
                  <h3>{t('국내외 선교 활동', 'Domestic & Global Missions')}</h3>
                </div>
                <p>
                  {t(
                    '미국, 멕시코, 캐나다, 브라질, 태국, 두바이, 영국, 프랑스 등 다양한 국가에서 단기 선교 및 순회 선교 가운데 예배 사역과 치유 사역을 진행해 왔으며, 해외 선교사님들과 협력하며 그들의 사역을 적극 지원하고 있습니다.',
                    'We conduct short-term and itinerant worship and healing missions in US, Mexico, Canada, Brazil, Thailand, Dubai, UK, France, and actively support overseas missionaries.'
                  )}
                </p>
                <div className="pillar-sub-items">
                  <span className="pillar-sub-item">✦ {t('단기 선교 & 순회 사역', 'Short-term & Itinerant Missions')}</span>
                  <span className="pillar-sub-item">✦ {t('글로벌 선교 협력 지원', 'Missionary Partnerships')}</span>
                </div>
              </Link>
            </ScrollReveal>

            {/* Pillar 3: 선교예배 */}
            <ScrollReveal>
              <Link href="/ministries/service" className="pillar-card">
                <div className="pillar-card-header">
                  <span className="pillar-num">03</span>
                  <h3>{t('선교예배', 'Mission Worship')}</h3>
                </div>
                <p>
                  {t(
                    '교단을 초월하여 초대교회와 같은 모습으로 함께 드리는 예배입니다. 선교센터에서 열방과 선교지를 위해 중보하며 기도하고, 삶 가운데 역사하시는 하나님을 함께 예배하고 사모합니다.',
                    'Worship transcending denominations like the early church. We intercede for the nations and worship God who works in our daily lives.'
                  )}
                </p>
                <div className="pillar-sub-items" style={{ marginTop: 'auto' }}>
                  <span className="pillar-sub-item" style={{ backgroundColor: 'var(--primary)', color: 'var(--text-light)' }}>
                    ⏰ {t('정기 목요선교예배 : 매주 목요일 오후 7시 30분', 'Thursday Worship: Every Thurs 7:30 PM')}
                  </span>
                </div>
              </Link>
            </ScrollReveal>

            {/* Pillar 4: 선교사업 */}
            <ScrollReveal>
              <Link href="/ministries/enterprises" className="pillar-card">
                <div className="pillar-card-header">
                  <span className="pillar-num">04</span>
                  <h3>{t('선교사업', 'Mission Enterprises')}</h3>
                </div>
                <p>
                  {t(
                    '꼬망쎄(대치점, 평택고덕점), CNCC학원(잠실캠퍼스, 대치캠퍼스), CNCC국제학교, CNCC유학컨설팅을 운영하며 모든 사업장을 선교센터로 여기고 있습니다. 외식 및 교육 사업의 전문적이고 체계적인 운영을 넘어, 꼬망쎄의 무료 반찬 나눔과 지역사회 기부, 교육 소외계층을 위한 장학 지원 등 실질적이고 따뜻한 섬김을 통해 지역사회와 다음 세대를 세우는 선교의 통로가 되기를 소망합니다.',
                    'Operating Commencer, CNCC Academy, CNCC International School, CNCC Study Abroad Consulting as mission centers. We extend our professional businesses to serve the community through free side-dish sharing, local donations, and scholarships.'
                  )}
                </p>
                <div className="pillar-sub-items" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="pillar-sub-item">✦ 꼬망쎄 (대치 · 평택고덕)</span>
                  <span className="pillar-sub-item">✦ CNCC학원 (잠실 · 대치)</span>
                  <span className="pillar-sub-item">✦ CNCC국제학교 / 유학컨설팅</span>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. Chronological History (Timeline) */}
      <section className="section-padding timeline-section" id="timeline">
        <div className="container">
          <ScrollReveal>
            <div className="section-header text-center">
              <span className="section-subtitle">{t('연혁', 'CNCC HISTORY')}</span>
              <h1 className="about-display-title">Our Journey</h1>
              <div className="accent-line"></div>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="text-center">{t('연혁을 불러오는 중...', 'Loading history...')}</div>
          ) : (
            <div className="history-list">
              {history.map((item, idx) => (
                <ScrollReveal 
                  key={item.id || idx} 
                  className="history-row"
                >
                  <div className={`history-row-inner ${idx === activeHistoryIndex ? 'active' : ''}`} data-history-index={idx}>
                    <div className="history-year">{item.year}</div>
                  <div className="history-copy">
                    <h3>{d(item.title)}</h3>
                    <p>{d(item.desc)}</p>
                  </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        /* Hero Banner */
        .about-hero-section {
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

        .about-hero-section h1 {
          color: var(--text-light);
          font-size: 3.2rem;
          margin-bottom: 24px;
          max-width: 820px;
        }

        .about-display-title {
          font-family: var(--font-serif);
          font-weight: 400;
          line-height: 1.05;
          color: var(--primary-dark);
          font-size: 4.6rem;
          margin-bottom: 20px;
        }

        /* Intro detail section */
        .intro-detail-section {
          background-color: var(--bg-white);
        }

        .intro-stack {
          display: flex;
          flex-direction: column;
          gap: 72px;
          align-items: center;
        }

        .intro-text-block {
          max-width: 980px;
          width: 100%;
        }

        .intro-label {
          font-size: 0.8rem;
          color: var(--accent);
          font-weight: 700;
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 12px;
        }

        .text-divider {
          width: 50px;
          height: 3px;
          background-color: var(--accent);
          margin-bottom: 30px;
        }

        .highlight-text {
          font-size: 1.1rem;
          color: var(--primary);
          font-weight: 600;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .normal-text {
          font-size: 0.95rem;
          color: var(--text-dark);
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .intro-points-list {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 40px;
          max-width: 980px;
          width: 100%;
          margin: 0 auto;
        }

        .intro-point {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 18px;
          padding-top: 28px;
          border-top: 1px solid var(--border-color);
        }

        .intro-point span {
          font-family: var(--font-serif);
          font-size: 2.1rem;
          color: var(--accent);
          line-height: 1;
        }

        .intro-point p {
          color: var(--text-dark);
          font-size: 1.15rem;
          line-height: 1.55;
        }

        @media (max-width: 900px) {
          .intro-stack {
            gap: 48px;
          }
          .intro-points-list {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }

        /* Mission Section */
        .mission-section {
          background-color: var(--bg-white);
        }

        .mission-header .about-display-title,
        .timeline-section .about-display-title {
          margin-bottom: 16px;
        }

        .banner-desc {
          font-size: 1.15rem;
          color: var(--secondary);
          max-width: 720px;
          line-height: 1.6;
        }

        .accent-line {
          width: 60px;
          height: 4px;
          background-color: var(--accent);
          margin: 0 auto;
        }

        .mission-text-list {
          max-width: 980px;
          margin: 56px auto 0 auto;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .mission-text-list p {
          font-size: 1.25rem;
          line-height: 1.8;
          color: var(--text-dark);
        }

        /* Pillars Grid Section */
        .pillars-section {
          background-color: var(--bg-light);
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px;
          margin-top: 60px;
        }

        @media (max-width: 900px) {
          .pillars-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }

        .pillar-card {
          background-color: var(--bg-white);
          padding: 48px;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          transition: var(--transition-smooth);
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .pillar-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary);
        }

        .pillar-card-header {
          display: flex;
          align-items: center;
          gap: 20px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 20px;
        }

        .pillar-num {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          color: var(--accent);
          line-height: 1;
        }

        .pillar-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-dark);
          margin-bottom: 0;
        }

        .pillar-card p {
          font-size: 1rem;
          color: var(--text-muted);
          line-height: 1.7;
        }

        .pillar-sub-items {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pillar-sub-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--primary-dark);
          background-color: var(--secondary-light);
          padding: 6px 14px;
          border-radius: 20px;
          width: fit-content;
        }

        /* Timeline Section */
        .timeline-section {
          background-color: var(--bg-white);
          position: relative;
        }

        .history-list {
          max-width: 980px;
          margin: 70px auto 0 auto;
          width: 100%;
          border-top: 1px solid var(--border-color);
        }

        .history-row-inner {
          color: var(--text-muted);
          transition: color 0.35s ease;
        }

        .history-row-inner.active {
          color: var(--text-dark);
        }

        .history-row-inner {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 48px;
          padding: 36px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .history-year {
          font-family: var(--font-serif);
          font-size: 2.4rem;
          line-height: 1;
          color: currentColor;
        }

        .history-copy h3 {
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 10px;
          color: currentColor;
        }

        .history-copy p {
          font-size: 1rem;
          line-height: 1.6;
          color: currentColor;
        }

        @media (max-width: 768px) {
          .about-display-title {
            font-size: 2.8rem;
          }
          .mission-text-list p {
            font-size: 1.05rem;
          }
          .history-row-inner {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 30px 0;
          }
        }
      `}</style>
    </PageTransition>
  );
}
