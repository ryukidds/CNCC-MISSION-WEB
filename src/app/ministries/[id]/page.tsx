'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { PageTransition, ScrollReveal, TextReveal } from '@/components/FramerTransitions';
import { ShaderBackground } from '@/components/ShaderImage';
import SemanticText from '@/components/SemanticText';
import { Heart, Globe, Activity, Award, ArrowLeft } from 'lucide-react';

interface MinistryDetailProps {
  params: Promise<{ id: string }>;
}

type LocalizedText = {
  ko: string;
  en: string;
};

type GalleryItem = {
  src: string;
  caption: LocalizedText;
};

type MinistryDetail = {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  thumbnail: string;
  gallery?: GalleryItem[];
  content: LocalizedText;
};

const getIcon = (id: string) => {
  switch (id) {
    case 'worship': return <Heart size={32} />;
    case 'missions': return <Globe size={32} />;
    case 'service': return <Activity size={32} />;
    case 'enterprises': return <Award size={32} />;
    default: return <Heart size={32} />;
  }
};

export default function MinistryDetail({ params }: MinistryDetailProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { t, d } = useLanguage();
  const [ministry, setMinistry] = useState<MinistryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.ministryDetails) {
          const found = (data.ministryDetails as MinistryDetail[]).find((m) => m.id === id);
          setMinistry(found || null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching ministry details:', err);
        setLoading(false);
      });
  }, [id]);

  // Simple Markdown paragraph renderer
  const renderContent = (text: string) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="ministry-h3">{paragraph.replace('### ', '')}</h3>;
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="ministry-h2">{paragraph.replace('## ', '')}</h2>;
      }
      if (paragraph.startsWith('* ')) {
        const listItems = paragraph.split('\n');
        return (
          <ul key={index} className="ministry-ul">
            {listItems.map((item, itemIdx) => (
              <li key={itemIdx}>{item.replace('* ', '')}</li>
            ))}
          </ul>
        );
      }
      return <SemanticText as="p" key={index} className="ministry-p">{paragraph}</SemanticText>;
    });
  };

  if (loading) {
    return (
      <div className="loader-box">
        <div className="spinner"></div>
        <style jsx>{`
          .loader-box {
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

  if (!ministry) {
    return (
      <div className="container error-container text-center">
        <h2>{t('사역을 찾을 수 없습니다.', 'Ministry Not Found')}</h2>
        <p>{t('존재하지 않거나 준비 중인 사역 정보입니다.', 'This ministry details does not exist or is under preparation.')}</p>
        <Link href="/" className="btn-primary">
          <span>{t('홈으로 이동', 'Go to Home')}</span>
        </Link>
        <style jsx>{`
          .error-container {
            padding: 100px 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            min-height: 50vh;
          }
          .error-container h2 {
            font-size: 2.2rem;
            color: var(--primary);
          }
          .error-container p {
            color: var(--text-muted);
          }
        `}</style>
      </div>
    );
  }

  return (
    <PageTransition>
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="container breadcrumb-content">
          <Link href="/">{t('홈', 'Home')}</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="current-node">{d(ministry.title)}</span>
        </div>
      </div>

      {/* Ministry Hero */}
      <section className="ministry-hero-section">
        <ShaderBackground image={ministry.thumbnail} overlay="rgba(10, 25, 47, 0.75)" />
        <div className="container">
          <ScrollReveal>
            <div className="ministry-hero-header">
              <span className="ministry-hero-icon">{getIcon(ministry.id)}</span>
              <span className="banner-tag">{t('사역 소개', 'MINISTRY INTRODUCTION')}</span>
            </div>
            <TextReveal as="h1" lines={[d(ministry.title)]} />
            <SemanticText as="p" className="banner-desc">{d(ministry.summary)}</SemanticText>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <article className="ministry-wrapper">
        <div className="container ministry-container">
          {/* Featured Image */}
          <ScrollReveal>
            <div className="ministry-banner-img-wrapper">
              <Image
                src={ministry.thumbnail}
                alt={d(ministry.title)}
                width={1600}
                height={900}
                sizes="(max-width: 900px) 100vw, 800px"
                className="ministry-banner-img"
                priority
              />
            </div>
          </ScrollReveal>

          {/* Detailed Content */}
          <ScrollReveal>
            <div className="ministry-body">
              {renderContent(d(ministry.content))}
            </div>
          </ScrollReveal>

          {/* Photo Gallery Section */}
          {ministry.gallery && ministry.gallery.length > 1 && (
            <ScrollReveal>
              <div className="ministry-gallery-section">
                <div className="gallery-header">
                  <h3 className="gallery-title">
                    {t('사역 현장 갤러리', 'Ministry Field Gallery')}
                  </h3>
                  <div className="accent-line left-aligned"></div>
                </div>
                <div className="gallery-grid">
                  {ministry.gallery.map((item, idx) => (
                    <div key={idx} className="gallery-card">
                      <div className="gallery-img-wrapper">
                        <Image
                          src={item.src}
                          alt={d(item.caption)}
                          width={800}
                          height={500}
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="gallery-img"
                        />
                      </div>
                      <div className="gallery-info">
                        <p className="gallery-caption">{d(item.caption)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Bottom Call to Actions */}
          <ScrollReveal>
            <div className="ministry-footer-nav">
              <Link href="/" className="btn-outline back-list-btn">
                <ArrowLeft size={16} />
                <span>{t('메인 화면으로', 'Back to Home')}</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </article>

      <style jsx global>{`
        .breadcrumb-bar {
          background-color: var(--bg-white);
          border-bottom: 1px solid var(--border-color);
          padding: 16px 0;
          font-size: 0.85rem;
        }

        .breadcrumb-content {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
        }

        .breadcrumb-content a:hover {
          color: var(--primary);
        }

        .breadcrumb-separator {
          color: var(--text-muted);
        }

        .current-node {
          color: var(--primary);
          font-weight: 600;
        }

        .ministry-hero-section {
          background-color: var(--primary-dark);
          color: var(--text-light);
          padding: 100px 0;
          position: relative;
          overflow: hidden;
        }

        .ministry-hero-section > .container {
          position: relative;
          z-index: 2;
        }

        .ministry-hero-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .ministry-hero-icon {
          color: var(--primary);
          display: inline-flex;
          align-items: center;
        }

        .banner-tag {
          font-size: 0.8rem;
          color: var(--accent);
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .ministry-hero-section h1 {
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

        .ministry-wrapper {
          background-color: var(--bg-white);
          padding: 80px 0;
        }

        .ministry-container {
          max-width: 800px;
        }

        .ministry-banner-img-wrapper {
          border-radius: var(--image-radius);
          overflow: hidden;
          margin-bottom: 56px;
          box-shadow: var(--shadow-md);
          position: relative;
          background-color: var(--bg-light);
        }

        .ministry-banner-img {
          width: 100%;
          height: auto;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          display: block;
        }

        .ministry-body {
          color: #2c3e50;
          font-size: 1.05rem;
          line-height: 1.8;
        }

        .ministry-h2 {
          font-size: 1.8rem;
          color: var(--primary-dark);
          margin-top: 48px;
          margin-bottom: 20px;
          border-bottom: 2px solid var(--primary);
          padding-bottom: 8px;
        }

        .ministry-h3 {
          font-size: 1.4rem;
          color: var(--primary-dark);
          margin-top: 36px;
          margin-bottom: 16px;
          font-weight: 600;
        }

        .ministry-p {
          margin-bottom: 24px;
          text-align: justify;
        }

        .ministry-ul {
          margin-bottom: 30px;
          padding-left: 24px;
          list-style-type: square;
        }

        .ministry-ul li {
          margin-bottom: 10px;
        }

        .ministry-gallery-section {
          margin-top: 56px;
          padding-top: 40px;
          border-top: 1px solid var(--border-color);
        }

        .gallery-header {
          margin-bottom: 24px;
        }

        .gallery-title {
          font-size: 1.6rem;
          color: var(--primary-dark);
          margin-bottom: 8px;
          font-weight: 700;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }

        .gallery-card {
          background-color: #f8fafc;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border-color);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .gallery-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
        }

        .gallery-img-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background-color: #e2e8f0;
        }

        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }

        .gallery-card:hover .gallery-img {
          transform: scale(1.04);
        }

        .gallery-info {
          padding: 14px 16px;
        }

        .gallery-caption {
          font-size: 0.95rem;
          color: var(--text-main);
          font-weight: 600;
          line-height: 1.45;
          margin: 0;
        }

        .ministry-footer-nav {
          margin-top: 60px;
          padding-top: 40px;
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: center;
        }

        @media (max-width: 768px) {
          .ministry-hero-section h1 {
            font-size: 2.2rem;
          }
          .ministry-footer-nav {
            flex-direction: column;
            gap: 16px;
          }
          .ministry-footer-nav > * {
            width: 100%;
          }
        }
      `}</style>
    </PageTransition>
  );
}
