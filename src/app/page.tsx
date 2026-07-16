'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition, ScrollReveal, StaggerContainer, StaggerItem, TextReveal } from '@/components/FramerTransitions';
import { ShaderBackground } from '@/components/ShaderImage';

type LocalizedText = {
  ko: string;
  en: string;
};

type Article = {
  id: string;
  title: LocalizedText;
  category: string;
  date: string;
  thumbnail: string;
  summary: LocalizedText;
};

type CnccData = {
  articles?: Article[];
};

export default function Home() {
  const { language, t, d } = useLanguage();
  const [dbData, setDbData] = useState<CnccData | null>(null);
  const [loading, setLoading] = useState(true);

  const articles = dbData?.articles ?? [];
  const ministryCards = [
    {
      href: '/ministries/worship',
      image: '/images/homeless-care-16x9-depth-v2.png',
      title: t('회복 및 예배 사역', 'Restoration & Worship'),
      desc: t(
        '사회적 약자들에게 사랑을 실천하며, 특히 목회 사역으로 인해 지친 목회자들의 회복을 돕는 예배 사역과 치유 사역, 그리고 멤버 케어를 중점으로 합니다.',
        'We serve the marginalized with love, focusing on worship, inner healing, and dedicated member care programs to restore weary pastors.'
      )
    },
    {
      href: '/ministries/missions',
      image: '/images/global-mission-16x9-depth-v2.png',
      title: t('국내외 선교 활동', 'Domestic & Global Missions'),
      desc: t(
        '미국, 멕시코, 캐나다, 브라질, 태국, 두바이, 영국, 프랑스 등 다양한 국가에서 단기 선교 및 순회 선교 가운데 예배 사역과 치유 사역을 진행해 왔으며, 해외 선교사님들과 협력하며 그들의 사역을 적극 지원하고 있습니다.',
        'We conduct short-term and itinerant worship and healing missions in the US, Mexico, Canada, Brazil, Thailand, Dubai, the UK, France, and support overseas missionaries.'
      )
    },
    {
      href: '/ministries/service',
      image: '/images/worship-community-16x9-depth-v2.png',
      title: t('선교예배', 'Mission Worship'),
      desc: t(
        '교단을 초월하여 초대교회와 같은 모습으로 함께 드리는 예배입니다. 선교센터에서 열방과 선교지를 위해 중보하며 기도하고, 삶 가운데 역사하시는 하나님을 함께 예배하고 사모합니다.',
        'Worship that transcends denominations like the early church. We intercede for the nations and worship God who works in our daily lives.'
      )
    },
    {
      href: '/ministries/enterprises',
      image: '/images/business-as-mission-16x9-depth-v2.png',
      title: t('선교사업', 'Mission Enterprises'),
      desc: t(
        '꼬망쎄, CNCC학원, CNCC국제학교, CNCC유학컨설팅을 운영하며 모든 사업장을 선교센터로 여기고 있습니다. 무료 반찬 나눔과 지역사회 기부, 장학 지원 등 실질적이고 따뜻한 섬김을 전합니다.',
        'We operate Commencer, CNCC Academy, CNCC International School, and CNCC Study Abroad Consulting as mission centers that serve neighbors through practical care.'
      )
    }
  ];

  // Fetch dynamic content from local API
  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        setDbData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching CNCC content:', err);
        setLoading(false);
      });
  }, []);



  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <style jsx>{`
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 60vh;
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
        `}</style>
      </div>
    );
  }



  return (
    <PageTransition>
      {/* 1. HERO BANNER */}
      <section className="hero-section">
        <ShaderBackground image="/images/cncc_hero_vision.png" overlay="rgba(255, 255, 255, 0.58)" />
        <div className="container hero-content">
          <TextReveal
            as="h1"
            className="hero-display-title"
            lines={[
              ['Coram', 'Deo'],
              ['New', { text: 'Creation', className: 'hero-italic' }]
            ]}
          />
          <p className="hero-copy">{t(
            '한 영혼을 회복시키고, 이 땅에 하나님의 사랑과 뜻을 세워가는 복된 사역에 함께해 주세요.',
            'Join this blessed ministry of restoring souls and establishing God\'s love and will on this earth.'
          )}</p>
          <Link href="/support" className="btn-primary">
            {t('봉사 및 동참하기', 'Volunteer & Join Us')}
          </Link>
        </div>
      </section>

      {/* 1.5. IDENTITY INTRODUCTION SECTION */}
      <section className="intro-section-outer">
        <div className="container">
          <div className="intro-section">
            <ScrollReveal>
              <motion.div
                className="intro-logo-mark"
                initial={{ opacity: 0, y: 28, scale: 0.92, filter: 'blur(12px)' }}
                whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="/logo.svg"
                  alt="CNCC Missionary"
                  width={280}
                  height={96}
                  className="intro-logo-img"
                />
              </motion.div>
              <TextReveal as="span" className="intro-subtitle" lines={[t('비전', 'VISION')]} delay={0.24} />
              {language === 'ko' ? (
                <>
                  <TextReveal
                    as="h2"
                    className="intro-text intro-text-desktop"
                    mode="line"
                    delay={0.38}
                    lines={[
                      <><span className="intro-serif">&apos;코람데오&apos;</span>(Coram Deo)는 &apos;하나님 앞에서&apos;라는 뜻입니다.</>,
                      '한 사람의 삶이 하나님 앞에서 반응할 때',
                      '하나님의 마음으로 다시 세워지고,',
                      '회복과 치유가 일어나며 그 한 영혼이',
                      <><span className="intro-serif-italic">&apos;새로워지는 일&apos;</span>(New Creation)에 집중하는 선교단체입니다.</>
                    ]}
                  />
                  <TextReveal
                    as="h2"
                    className="intro-text intro-text-mobile"
                    mode="line"
                    delay={0.38}
                    lines={[
                      <><span className="intro-serif">&apos;코람데오&apos;</span>(Coram Deo)는</>,
                      <>&apos;하나님 앞에서&apos;라는 뜻입니다.</>,
                      '한 사람의 삶이 하나님 앞에서 반응할 때',
                      '하나님의 마음으로 다시 세워지고,',
                      '회복과 치유가 일어나며 그 한 영혼이',
                      <><span className="intro-serif-italic">&apos;새로워지는 일&apos;</span>(New Creation)에 집중하는 선교단체입니다.</>
                    ]}
                  />
                </>
              ) : (
                <TextReveal
                  as="h2"
                  className="intro-text"
                  mode="line"
                  delay={0.38}
                  lines={[
                    <><span className="intro-serif">&apos;Coram Deo&apos;</span> means &apos;in the presence of God.&apos;</>,
                    'When a person\'s life responds before God, they are rebuilt with God\'s heart,',
                    <>experiencing restoration and healing. We are a mission organization focused on the renewal of each soul as a <span className="intro-serif-italic">&apos;New Creation.&apos;</span></>
                  ]}
                />
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 2. MINISTRIES 2x2 GRID */}
      <section className="section-padding ministries-section">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-subtitle">{t('사역 영역', 'CORE PILLARS')}</span>
              <h2>Our Ministries</h2>
              <div className="accent-line left-aligned"></div>
            </div>
          </ScrollReveal>

          <StaggerContainer>
            <div className="grid-2">
              {ministryCards.map((card) => (
                <StaggerItem key={card.href}>
                  <Link href={card.href} className="ministry-card">
                    <Image
                      src={card.image}
                      alt={card.title}
                      width={1600}
                      height={900}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="ministry-card-image"
                    />
                    <div className="ministry-card-text">
                      <h3>{card.title}</h3>
                      <p>{card.desc}</p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* 3. CORPORATE BLOG / PROJECT SHOWCASE */}
      {articles.length > 0 && (
        <section className="section-padding blog-showcase-section">
          <div className="container">
            <ScrollReveal>
              <div className="section-header flex-header">
                <div>
                  <h2>News</h2>
                </div>
                <Link href="/projects" className="btn-outline view-all-btn">
                  <span>{t('소식 전체 보기', 'View All News')}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </ScrollReveal>

            <StaggerContainer>
              <div className="blog-list-container">
                {articles.slice(0, 3).map((post) => (
                  <StaggerItem key={post.id}>
                    <div className="blog-list-item">
                      <Link href={`/projects/${post.id}`} className="blog-list-image-link" aria-label={d(post.title)}>
                        <div className="blog-list-img-wrapper" aria-hidden="true">
                          <Image
                            src={post.thumbnail}
                            alt={d(post.title)}
                            className="blog-list-img"
                            fill
                            sizes="(max-width: 768px) 82vw, 33vw"
                            unoptimized
                          />
                        </div>
                      </Link>
                      <div className="blog-list-body">
                        <span className="blog-list-date">{post.date}</span>
                        <Link href={`/projects/${post.id}`} className="blog-list-title-link">
                          <h3>{d(post.title)}</h3>
                        </Link>
                        <p>{d(post.summary)}</p>
                      </div>
                      <div className="blog-list-action">
                        <Link href={`/projects/${post.id}`} className="blog-list-readmore">
                          <span>{t('자세히 읽기', 'Read Article')}</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* 4. CAREERS / VOLUNTEER CTA */}
      <section className="promo-section-outer">
        <div className="promo-hero">
          <ShaderBackground image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop" overlay="rgba(255, 255, 255, 0.62)" />
          <div className="container promo-hero-content">
            <ScrollReveal>
              <div className="promo-text-content">
                <h2>Coram Deo<br /> New <span className="promo-italic">Creation</span></h2>
                <p>{t(
                  '한 영혼을 회복시키고, 이 땅에 하나님의 사랑과 뜻을 세워가는 복된 사역에 함께해 주세요.',
                  'Join this blessed ministry of restoring souls and establishing God\'s love and will on this earth.'
                )}</p>
                <Link href="/support" className="btn-primary">
                  {t('봉사 및 동참하기', 'Volunteer & Join Us')}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Main Page Specific CSS */}
      <style jsx global>{`
        /* Hero Section Flat Typographic Banner Styles */
        .hero-section {
          height: 100vh;
          min-height: 500px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-content {
          color: var(--text-light);
          z-index: 10;
          text-align: center;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .hero-display-title {
          font-family: var(--font-serif);
          font-size: 8.5vw;
          color: var(--text-light);
          line-height: 1.0;
          font-weight: 400;
          letter-spacing: 0;
          text-shadow: none !important;
          text-align: center;
        }

        .hero-copy {
          max-width: 620px;
          color: var(--text-muted);
          font-size: 1.05rem;
          line-height: 1.7;
          text-align: center;
        }

        .hero-italic {
          font-style: italic;
        }

        /* 1.5. Introduction Section Styling */
        .intro-section-outer {
          background-color: var(--bg-white);
          width: 100%;
        }

        .intro-section {
          padding: 120px 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .intro-logo-mark {
          display: flex;
          justify-content: center;
          margin-bottom: 42px;
        }

        .intro-logo-img {
          width: min(280px, 72vw);
          height: auto;
          display: block;
        }

        .intro-subtitle {
          font-family: var(--font-sans);
          font-size: 1.25rem;
          color: var(--text-muted);
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 32px;
          display: block;
        }

        .intro-text {
          font-family: var(--font-serif);
          font-size: 3.2rem;
          line-height: 1.5;
          font-weight: 400;
          color: var(--primary-dark);
          word-break: keep-all;
          letter-spacing: -0.25px;
        }

        .intro-text-mobile {
          display: none;
        }

        .intro-serif {
          font-family: var(--font-serif);
          font-weight: 400;
          color: var(--primary-dark);
        }

        .intro-serif-italic {
          font-family: var(--font-serif);
          font-weight: 400;
          font-style: italic;
          color: var(--primary-dark);
        }

        .desktop-only {
          display: block;
        }

        @media (max-width: 768px) {
          .intro-section {
            padding: 80px 0;
          }
          .intro-logo-mark {
            margin-bottom: 30px;
          }
          .intro-logo-img {
            width: min(180px, 62vw);
          }
          .intro-text {
            font-size: clamp(1.65rem, 7vw, 2rem);
            line-height: 1.42;
            padding: 0;
          }
          .intro-text-desktop {
            display: none;
          }
          .intro-text-mobile {
            display: block;
          }
          .desktop-only {
            display: none;
          }
          .intro-subtitle {
            font-size: 1.0rem;
            margin-bottom: 20px;
          }
        }

        @media (max-width: 768px) {
          .hero-display-title {
            font-size: 12vw;
          }
          .hero-content {
            gap: 20px;
          }
          .hero-copy {
            font-size: 0.98rem;
          }
        }

        /* Section Header Layout */
        .section-header {
          margin-bottom: 60px;
          text-align: left;
        }

        .section-subtitle {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          color: var(--accent);
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 12px;
        }

        .section-header h2 {
          font-family: var(--font-serif);
          font-size: 3.8rem;
          color: var(--primary-dark);
          line-height: 1.1;
          font-weight: 400;
          margin-bottom: 16px;
          text-align: left;
        }

        @media (max-width: 768px) {
          .section-header h2 {
            font-size: 2.2rem;
          }
        }

        .accent-line {
          width: 60px;
          height: 4px;
          background-color: var(--accent);
          margin: 0 auto;
        }

        .accent-line.left-aligned {
          margin: 0;
        }

        .flex-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 20px;
        }

        /* Ministry Card grid section */
        .ministries-section {
          background-color: var(--bg-light);
        }

        .ministry-card {
          display: block;
          transition: var(--transition-smooth);
          min-width: 0;
        }

        .ministry-card:hover {
          transform: translateY(-4px);
        }

        .ministry-card-image {
          display: block;
          width: 100%;
          height: auto;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          border-radius: var(--image-radius);
          margin-bottom: 28px;
        }

        .ministry-card h3 {
          font-size: 2rem;
          font-weight: 600;
          color: #111111;
          line-height: 1.2;
          margin-bottom: 18px;
        }

        .ministry-card p {
          font-size: 1rem;
          color: #222222;
          line-height: 1.6;
        }

        /* Blog Showcase Section */
        .blog-showcase-section {
          background-color: var(--bg-white);
        }

        .blog-list-container {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
          margin-top: 40px;
        }

        .blog-list-image-link {
          display: block;
          overflow: hidden;
        }

        .blog-list-item {
          display: flex;
          flex-direction: column;
          gap: 18px;
          min-width: 0;
          transition: var(--transition-smooth);
        }

        .blog-list-item:hover {
          transform: translateY(-3px);
        }

        .blog-list-img-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: var(--image-radius);
          background-color: var(--secondary-light);
        }

        .blog-list-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .blog-list-item:hover .blog-list-img {
          transform: scale(1.05);
        }

        .blog-list-body {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .blog-list-date {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 8px;
          display: block;
        }

        .blog-list-title-link {
          display: block;
        }

        .blog-list-body h3 {
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--primary-dark);
          margin-bottom: 10px;
          line-height: 1.3;
          transition: var(--transition-fast);
        }

        .blog-list-item:hover .blog-list-body h3 {
          color: var(--accent);
        }

        .blog-list-body p {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-list-action {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          min-width: 0;
        }

        .blog-list-readmore {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--primary);
        }

        @media (max-width: 768px) {
          .blog-list-container {
            display: flex;
            gap: 22px;
            overflow-x: auto;
            padding-bottom: 8px;
            scroll-snap-type: x mandatory;
          }
          .blog-list-container > * {
            flex: 0 0 min(82vw, 340px);
            scroll-snap-align: start;
          }
          .blog-list-item {
            width: 100%;
            gap: 16px;
          }
        }

        /* Volunteer CTA section */
        .promo-section-outer {
          background-color: var(--primary-dark);
          width: 100%;
        }

        .promo-hero {
          min-height: 72vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 120px 0;
        }

        .promo-hero-content {
          position: relative;
          z-index: 2;
          color: var(--text-light);
          text-align: center;
        }

        .promo-text-content {
          max-width: 780px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .promo-text-content h2 {
          font-family: var(--font-serif);
          font-size: 5.2rem;
          color: var(--text-light);
          line-height: 1.1;
          font-weight: 400;
          margin-bottom: 24px;
          text-align: center;
        }

        .promo-italic {
          font-style: italic;
        }

        .promo-text-content p {
          color: rgba(255, 255, 255, 0.78);
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 620px;
          text-align: center;
        }

        @media (max-width: 768px) {
          .promo-hero {
            min-height: 62vh;
            padding: 88px 0;
          }
          .promo-text-content h2 {
            font-size: 3rem;
          }
        }

        /* 2-column grid for ministries */
        .grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          column-gap: 40px;
          row-gap: 72px;
        }
        @media (max-width: 768px) {
          .grid-2 {
            grid-template-columns: 1fr;
            row-gap: 44px;
          }
          .ministry-card-image {
            margin-bottom: 22px;
          }
          .ministry-card h3 {
            font-size: 1.65rem;
          }
        }
      `}</style>
    </PageTransition>
  );
}
