'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { PageTransition, ScrollReveal, StaggerContainer, StaggerItem } from '@/components/FramerTransitions';

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

export default function Projects() {
  const { t, d } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.articles) {
          setArticles(data.articles);
          setFilteredArticles(data.articles);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching articles:', err);
        setLoading(false);
      });
  }, []);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(art => art.category.toLowerCase() === category.toLowerCase());
      setFilteredArticles(filtered);
    }
  };

  const categories = [
    { key: 'All', label: t('전체보기', 'All Posts') },
    { key: 'Worship', label: t('예배 사역', 'Worship') },
    { key: 'Sharing', label: t('나눔 사역', 'Sharing') },
    { key: 'Training', label: t('제자 훈련', 'Training') }
  ];

  return (
    <PageTransition>
      {/* Header Section */}
      <section className="blog-header-section">
        <div className="container">
          <ScrollReveal>
            <span className="banner-tag">{t('소식 & 블로그', 'BLOG & NEWS')}</span>
            <h1>{t('CNCC 소식 & 블로그', 'CNCC Blog & News')}</h1>
            <p className="banner-desc">
              {t(
                '복음 안에서 새로운 피조물로 변화되는 현장, 그리고 이웃들과 나누는 정직한 기쁨의 기록들을 전해드립니다.',
                'Records of transformation into new creations in the Gospel and the honest joy shared with our neighbors.'
              )}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Blog Body */}
      <section className="section-padding blog-main-section">
        <div className="container">
          {/* Category Filters */}
          <ScrollReveal>
            <div className="filter-container">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  className={`filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Loader or Article Grid */}
          {loading ? (
            <div className="loader-box">
              <div className="spinner"></div>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="no-articles-box text-center">
              <p>{t('등록된 사역 아티클이 없습니다.', 'No articles found in this category.')}</p>
            </div>
          ) : (
            <StaggerContainer>
              <div className="blog-list-container">
                {filteredArticles.map((post) => (
                  <StaggerItem key={post.id}>
                    <div className="blog-list-item">
                      <Link href={`/projects/${post.id}`} className="blog-list-image-link" aria-label={d(post.title)}>
                        <div className="blog-list-img-wrapper" aria-hidden="true">
                          <img src={post.thumbnail} alt={d(post.title)} className="blog-card-img" />
                        </div>
                      </Link>
                      <div className="blog-card-body">
                        <span className="blog-card-date">{post.date}</span>
                        <Link href={`/projects/${post.id}`} className="blog-list-title-link">
                          <h3>{d(post.title)}</h3>
                        </Link>
                        <p>{d(post.summary)}</p>
                      </div>
                      <div className="blog-list-action">
                        <Link href={`/projects/${post.id}`} className="blog-card-readmore">
                          <span>{t('자세히 보기', 'Read Full Post')}</span>
                        </Link>
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
        /* Header section */
        .blog-header-section {
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

        .blog-header-section h1 {
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

        /* Category Filter Styles */
        .filter-container {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 56px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 24px;
          background-color: var(--bg-white);
          border: 1px solid var(--border-color);
          font-weight: 600;
          color: var(--text-dark);
          font-size: 0.9rem;
          transition: var(--transition-fast);
          border-radius: 30px;
        }

        .filter-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .filter-btn.active {
          background-color: var(--primary);
          border-color: var(--primary);
          color: var(--text-light);
          box-shadow: var(--shadow-sm);
        }

        /* Main Blog Section styles */
        .blog-main-section {
          background-color: var(--bg-light);
        }

        .loader-box {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
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

        .no-articles-box {
          min-height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-white);
          border: 1px dashed var(--border-color);
          padding: 60px;
          border-radius: 0;
        }

        .no-articles-box p {
          color: var(--text-muted);
          font-weight: 600;
        }

        .blog-list-container {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
        }

        .blog-list-image-link {
          display: block;
          overflow: hidden;
          border-radius: 8px;
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
          border-radius: 8px;
          background-color: var(--secondary-light);
        }

        .blog-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .blog-list-item:hover .blog-card-img {
          transform: scale(1.06);
        }

        .blog-card-body {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .blog-card-date {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 10px;
        }

        .blog-card-body h3 {
          font-size: 1.35rem;
          margin-bottom: 10px;
          line-height: 1.3;
          transition: var(--transition-fast);
        }

        .blog-list-item:hover .blog-card-body h3 {
          color: var(--accent);
        }

        .blog-card-body p {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-list-action {
          display: flex;
          justify-content: flex-start;
        }

        .blog-card-readmore {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 700;
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
      `}</style>
    </PageTransition>
  );
}
