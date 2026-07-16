'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { PageTransition, ScrollReveal, TextReveal } from '@/components/FramerTransitions';
import { ShaderBackground } from '@/components/ShaderImage';

interface ProjectDetailProps {
  params: Promise<{ id: string }>;
}

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
  content: LocalizedText;
};

export default function ProjectDetail({ params }: ProjectDetailProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const { t, d } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.articles) {
          const found = (data.articles as Article[]).find((art) => art.id === id);
          setArticle(found || null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching article details:', err);
        setLoading(false);
      });
  }, [id]);

  // Simple Markdown-like block renderer helper
  const renderContent = (text: string) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="article-h3">{paragraph.replace('### ', '')}</h3>;
      }
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="article-h2">{paragraph.replace('## ', '')}</h2>;
      }
      if (paragraph.startsWith('* ')) {
        const listItems = paragraph.split('\n');
        return (
          <ul key={index} className="article-ul">
            {listItems.map((item, itemIdx) => (
              <li key={itemIdx}>{item.replace('* ', '')}</li>
            ))}
          </ul>
        );
      }
      return <p key={index} className="article-p">{paragraph}</p>;
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

  if (!article) {
    return (
      <div className="container error-container text-center">
        <h2>{t('아티클을 찾을 수 없습니다.', 'Article Not Found')}</h2>
        <p>{t('존재하지 않거나 삭제된 사역 아티클입니다.', 'This article does not exist or has been deleted.')}</p>
        <Link href="/projects" className="btn-primary">
          <span>{t('소식으로 이동', 'Go to News')}</span>
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
      {/* Breadcrumb utility */}
      <div className="breadcrumb-bar">
        <div className="container breadcrumb-content">
          <Link href="/">{t('홈', 'Home')}</Link>
          <span className="breadcrumb-separator">/</span>
          <Link href="/projects">{t('소식', 'News')}</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="current-node">{d(article.title)}</span>
        </div>
      </div>

      {/* Article Hero */}
      <section className="article-hero-section">
        <ShaderBackground image="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop" overlay="rgba(255, 255, 255, 0.62)" />
        <div className="container">
          <ScrollReveal>
            <span className="banner-tag">{article.category}</span>
            <TextReveal as="h1" lines={[d(article.title)]} />
            <p className="banner-desc">{d(article.summary)}</p>
            <span className="article-hero-date">{article.date}</span>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Article Segment */}
      <article className="article-wrapper">
        <div className="container article-container">

          {/* Featured Image */}
          <ScrollReveal>
            <div className="article-banner-img-wrapper">
              <Image
                src={article.thumbnail}
                alt={d(article.title)}
                className="article-banner-img"
                width={1200}
                height={675}
                sizes="(max-width: 900px) 100vw, 800px"
                unoptimized
              />
            </div>
          </ScrollReveal>

          {/* Article Body Content */}
          <ScrollReveal>
            <div className="article-body">
              {renderContent(d(article.content))}
            </div>
          </ScrollReveal>

          {/* Back Navigation */}
          <ScrollReveal>
            <div className="article-footer-nav">
              <Link href="/projects" className="btn-outline back-list-btn">
                <span>{t('소식 목록으로', 'Back to News')}</span>
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
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 400px;
        }

        @media (max-width: 640px) {
          .current-node {
            max-width: 150px;
          }
        }

        .article-hero-section {
          background-color: var(--primary-dark);
          color: var(--text-light);
          padding: 104px 0 112px 0;
          border-bottom: 1px solid rgba(0, 43, 91, 0.12);
          position: relative;
          overflow: hidden;
        }

        .article-hero-section > .container {
          position: relative;
          z-index: 2;
        }

        .banner-tag {
          font-size: 0.8rem;
          color: var(--accent);
          font-weight: 600;
          letter-spacing: 0.14em;
          display: block;
          margin-bottom: 16px;
        }

        .article-hero-section h1 {
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

        .article-hero-date {
          display: block;
          margin-top: 24px;
          color: var(--secondary);
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .article-wrapper {
          background-color: var(--bg-white);
          padding: 80px 0;
        }

        .article-container {
          max-width: 800px;
        }

        @media (max-width: 768px) {
          .article-hero-section h1 {
            font-size: 2rem;
          }
        }

        .article-banner-img-wrapper {
          border-radius: 0;
          overflow: hidden;
          margin-bottom: 56px;
          box-shadow: var(--shadow-md);
        }

        .article-banner-img {
          width: 100%;
          max-height: 480px;
          object-fit: cover;
          display: block;
        }

        /* Reading Typography styles */
        .article-body {
          color: #2c3e50;
          font-size: 1.05rem;
          line-height: 1.8;
        }

        .article-h2 {
          font-size: 1.8rem;
          color: var(--primary);
          margin-top: 48px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
        }

        .article-h3 {
          font-size: 1.4rem;
          color: var(--primary);
          margin-top: 36px;
          margin-bottom: 16px;
        }

        .article-p {
          margin-bottom: 24px;
          text-align: justify;
        }

        .article-ul {
          margin-bottom: 30px;
          padding-left: 24px;
          list-style-type: square;
        }

        .article-ul li {
          margin-bottom: 8px;
        }

        .article-footer-nav {
          margin-top: 60px;
          padding-top: 40px;
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: center;
        }

        .back-list-btn {
          font-weight: 600;
        }
      `}</style>
    </PageTransition>
  );
}
