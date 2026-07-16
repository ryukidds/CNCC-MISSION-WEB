'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { PageTransition, ScrollReveal, TextReveal } from '@/components/FramerTransitions';
import { ShaderBackground } from '@/components/ShaderImage';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact Form Submitted:', formData);
    setIsSent(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <PageTransition>
      {/* 1. Header Banner */}
      <section className="contact-header-section">
        <ShaderBackground image="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop" overlay="rgba(255, 255, 255, 0.62)" />
        <div className="container">
          <ScrollReveal>
            <span className="banner-tag">{t('연락처 및 오시는 길', 'CONTACT')}</span>
            <TextReveal as="h1" lines={[t('CNCC와 소통하기', 'Get in touch with CNCC')]} />
            <p className="banner-desc">
              {t(
                'CNCC 선교회에 대해 궁금하신 점이 있으시거나 동역을 원하신다면 언제든 연락 주십시오. 하나님의 마음으로 정성껏 안내해 드리겠습니다.',
                'Please reach out if you have questions about CNCC or wish to partner with us. We will guide you with God\'s heart.'
              )}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Coordinates & Form Layout */}
      <section className="section-padding contact-main-section">
        <div className="container">
          <div className="contact-main-grid">
            
            {/* Info Column */}
            <ScrollReveal direction="left" className="contact-info-col">
              <div className="contact-info-block">
                <h2>{t('본부 연락 정보', 'Headquarters Info')}</h2>
                <p className="info-desc-txt">
                  {t(
                    'CNCC 선교회 서울 본부 오피스 정보 및 연락 수단입니다. 방문을 원하실 경우 사전 연락을 부탁드립니다.',
                    'Contact details and office coordinates for CNCC Seoul Headquarters. Please contact us prior to visiting.'
                  )}
                </p>

                <div className="info-details-list">
                  <div className="info-detail-item">
                    <div>
                      <h3>{t('단체 주소', 'Office Address')}</h3>
                      <p>{t('서울특별시 강남구 역삼로 78길 18, 5층', '18, Yeoksam-ro 78-gil, Gangnam-gu, Seoul, 5F')}</p>
                    </div>
                  </div>

                  <div className="info-detail-item">
                    <div>
                      <h3>{t('전화번호', 'Phone Number')}</h3>
                      <p>010-6518-5874</p>
                    </div>
                  </div>

                  <div className="info-detail-item">
                    <div>
                      <h3>{t('이메일', 'Email Address')}</h3>
                      <p>info@cncc.org</p>
                    </div>
                  </div>

                  <div className="info-detail-item">
                    <div>
                      <h3>{t('운영 시간', 'Office Hours')}</h3>
                      <p>{t('평일 오전 10:00 - 오후 5:00 (공휴일 제외)', 'Weekdays 10:00 AM - 5:00 PM (Closed on holidays)')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Inquiry Form Column */}
            <ScrollReveal direction="right" className="contact-form-col">
              <div className="contact-card-form">
                {isSent ? (
                  <div className="success-submit-box text-center">
                    <h3>{t('메시지가 전송되었습니다', 'Message Sent')}</h3>
                    <p>{t('소중한 의견을 전송해 주셔서 감사합니다. 신속히 답변 드리겠습니다.', 'Thank you for your message. We will reply to you shortly.')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    <h2>{t('일반 문의 및 동역 신청', 'Send an Inquiry')}</h2>
                    
                    <div className="form-control">
                      <label>{t('성명', 'Your Name')}</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        required 
                        placeholder={t('성함을 입력하십시오', 'Enter your name')} 
                      />
                    </div>

                    <div className="form-control">
                      <label>{t('이메일 주소', 'Email Address')}</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="example@email.com" 
                      />
                    </div>

                    <div className="form-control">
                      <label>{t('문의 제목', 'Subject')}</label>
                      <input 
                        type="text" 
                        name="subject" 
                        value={formData.subject} 
                        onChange={handleInputChange} 
                        required 
                        placeholder={t('제목을 작성하십시오', 'Enter subject')} 
                      />
                    </div>

                    <div className="form-control">
                      <label>{t('내용', 'Message')}</label>
                      <textarea 
                        name="message" 
                        value={formData.message} 
                        onChange={handleInputChange} 
                        required 
                        rows={5} 
                        placeholder={t('구체적인 내용을 입력하십시오.', 'Enter message details.')}
                      />
                    </div>

                    <button type="submit" className="btn-primary submit-btn">
                      <span>{t('메시지 보내기', 'Submit Message')}</span>
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      <style jsx>{`
        /* Header section */
        .contact-header-section {
          background-color: var(--primary-dark);
          color: var(--text-light);
          padding: 104px 0 112px 0;
          border-bottom: 1px solid rgba(0, 43, 91, 0.12);
          position: relative;
          overflow: hidden;
        }

        .contact-header-section > .container {
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

        .contact-header-section h1 {
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

        /* Layout */
        .contact-main-section {
          background-color: var(--bg-light);
        }

        .contact-main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: flex-start;
          max-width: 1100px;
          margin: 0 auto;
        }

        @media (max-width: 900px) {
          .contact-main-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        .contact-info-col h2 {
          font-size: 1.8rem;
          margin-bottom: 16px;
        }

        .info-desc-txt {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .info-details-list {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .info-detail-item {
          display: flex;
          align-items: flex-start;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--border-color);
        }

        .info-detail-item h3 {
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .info-detail-item p {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        /* Form styling */
        .contact-card-form {
          background-color: transparent;
          border-top: 1px solid var(--border-color);
          padding-top: 48px;
        }

        @media (max-width: 600px) {
          .contact-card-form {
            padding: 30px 20px;
          }
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .contact-form h2 {
          font-size: 1.6rem;
          margin-bottom: 10px;
          font-family: var(--font-sans);
        }

        .form-control {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-control label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--primary);
        }

        .form-control input,
        .form-control textarea {
          border: 1px solid var(--border-color);
          border-radius: 0;
          padding: 12px;
          font-family: inherit;
          font-size: 0.9rem;
          background-color: var(--bg-light);
          transition: var(--transition-fast);
        }

        .form-control input:focus,
        .form-control textarea:focus {
          outline: none;
          border-color: var(--primary);
          background-color: var(--bg-white);
          box-shadow: 0 0 0 2px rgba(0, 43, 91, 0.1);
        }

        .submit-btn {
          justify-content: center;
          margin-top: 10px;
        }

        /* Success box */
        .success-submit-box {
          padding: 60px 10px;
        }

        .success-submit-box h3 {
          font-size: 1.5rem;
          margin-bottom: 12px;
        }

        .success-submit-box p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
        }
      `}</style>
    </PageTransition>
  );
}
