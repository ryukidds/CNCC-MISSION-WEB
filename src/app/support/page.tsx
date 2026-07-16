'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { PageTransition, ScrollReveal, TextReveal } from '@/components/FramerTransitions';
import { ShaderBackground } from '@/components/ShaderImage';

type LocalizedText = {
  ko: string;
  en: string;
};

type SupportData = {
  bankAccount?: LocalizedText;
  contact?: string;
};

export default function Support() {
  const { t, d } = useLanguage();
  const [supportData, setSupportData] = useState<SupportData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'donation', // donation, goods, volunteer
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.support) {
          setSupportData(data.support);
        }
      })
      .catch((err) => console.error('Error fetching support details:', err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this to a backend mailer
    console.log('Support Form Submitted:', formData);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      type: 'donation',
      message: ''
    });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <PageTransition>
      {/* 1. Header Segment */}
      <section className="support-header-section">
        <ShaderBackground image="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop" overlay="rgba(255, 255, 255, 0.62)" />
        <div className="container">
          <ScrollReveal>
            <span className="banner-tag">{t('후원 및 나눔', 'SUPPORT')}</span>
            <TextReveal as="h1" lines={[t('사랑의 실천, 회복을 위한 동참', 'Participate in Restoration')]} />
            <p className="banner-desc">
              {t(
                '한 영혼을 회복시키고, 이 땅에 하나님의 사랑과 뜻을 세워가는 이 복된 사역은 기도와 물질의 헌신으로 함께해 주시는 동역자 여러분이 계시기에 가능합니다.',
                'This blessed ministry of restoring souls and establishing God\'s love on this earth is made possible by partners who join through prayer and financial dedication.'
              )}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Donation & Sharing Info Blocks */}
      <section className="section-padding support-info-section">
        <div className="container">
          <div className="support-blocks-grid">
            {/* Financial Support */}
            <ScrollReveal direction="left">
              <div className="support-info-card">
                <div className="card-icon-header">
                  <h3>{t('재정 후원 안내', 'Financial Donation')}</h3>
                </div>
                <p>
                  {t(
                    '한 영혼을 세우고, 이 땅에 하나님의 사랑을 세워가는 사역에 기도와 물질의 헌신으로 함께해 주십시오.',
                    'Please join this ministry of building souls and establishing God\'s love on this earth through prayer and financial dedication.'
                  )}
                </p>
                <div className="account-details-box">
                  <span className="account-label">{t('후원 계좌 번호', 'Donation Bank Account')}</span>
                  <span className="account-number">
                    {supportData?.bankAccount ? d(supportData.bankAccount) : t('국민은행 659002-04-078948 (예금주: 윤귀영)', 'Kookmin Bank 659002-04-078948 (Holder: Yun Gui-young)')}
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Goods Sharing */}
            <ScrollReveal direction="right">
              <div className="support-info-card">
                <div className="card-icon-header">
                  <h3>{t('물품 나눔 & 구제', 'Material & Goods Donation')}</h3>
                </div>
                <p>
                  {t(
                    '물품 나눔 및 자원봉사에 관심이 있으시면 아래 연락처로 문의해 주십시오. 꼬망쎄의 무료 반찬 나눔과 지역사회 기부, 교육 소외계층을 위한 장학 지원 등 실질적인 섬김을 진행합니다.',
                    'If you are interested in goods sharing or volunteering, please contact us below. We provide free side dishes through Commencer, community donations, and scholarships for educational underserved groups.'
                  )}
                </p>
                <div className="contact-details-box">
                  <span className="contact-label">{t('물품 및 봉사 문의', 'Goods & Volunteer Hotline')}</span>
                  <span className="contact-phone">
                    {supportData?.contact ? supportData.contact : '010-6518-5874'}
                  </span>
                  <span className="contact-name">({t('임태경 이사', 'Director Lim Tae-kyung')})</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. Interactive Support Contact Form */}
      <section className="section-padding support-form-section">
        <div className="container">
          <div className="support-form-layout">
            <ScrollReveal className="form-info-col">
              <div className="form-info-text">
                <h2>{t('동참 문의 및 상담 신청', 'Inquire & Get in Touch')}</h2>
                <p>
                  {t(
                    '정기 후원 신청, 대량 물품 나눔 기증, 혹은 국내외 지부에서의 자원봉사 신청 등 궁금한 점이 있으시다면 아래 양식을 작성하여 보내주십시오. 사역 담당자가 검토 후 연락해 드립니다.',
                    'Please fill out the form below for donation questions, goods contributions, or volunteer applications. Our team will contact you shortly.'
                  )}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal className="form-input-col">
              <div className="support-contact-card">
                {isSubmitted ? (
                  <div className="success-submit-box text-center">
                    <h3>{t('성공적으로 제출되었습니다', 'Submitted Successfully')}</h3>
                    <p>{t('보내주신 소중한 문의 내용을 검토하여 신속하게 답변 드리겠습니다.', 'We will review your message and get back to you as soon as possible.')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="support-form">
                    <div className="form-group-row">
                      <div className="form-control">
                        <label>{t('성명', 'Your Name')}</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          required 
                          placeholder={t('홍길동', 'John Doe')} 
                        />
                      </div>
                      <div className="form-control">
                        <label>{t('연락처', 'Phone Number')}</label>
                        <input 
                          type="tel" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                          required 
                          placeholder="010-0000-0000" 
                        />
                      </div>
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
                      <label>{t('참여 유형', 'Type of Support')}</label>
                      <select name="type" value={formData.type} onChange={handleInputChange}>
                        <option value="donation">{t('재정 후원 문의', 'Financial Donation Inquiry')}</option>
                        <option value="goods">{t('물품 기부 문의', 'Goods Donation Inquiry')}</option>
                        <option value="volunteer">{t('자원봉사 신청', 'Volunteer Application')}</option>
                        <option value="other">{t('기타 문의', 'Other Questions')}</option>
                      </select>
                    </div>

                    <div className="form-control">
                      <label>{t('상세 문의 내용', 'Message Details')}</label>
                      <textarea 
                        name="message" 
                        value={formData.message} 
                        onChange={handleInputChange} 
                        required 
                        rows={5} 
                        placeholder={t('의견이나 구체적인 사항을 기재해 주십시오.', 'Please specify your suggestions or inquiries.')}
                      />
                    </div>

                    <button type="submit" className="btn-primary form-submit-btn">
                      <span>{t('문의 보내기', 'Send Message')}</span>
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Header Segment */
        .support-header-section {
          background-color: var(--primary-dark);
          color: var(--text-light);
          padding: 104px 0 112px 0;
          border-bottom: 1px solid rgba(0, 43, 91, 0.12);
          position: relative;
          overflow: hidden;
        }

        .support-header-section > .container {
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

        .support-header-section h1 {
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

        /* Info Blocks */
        .support-info-section {
          background-color: var(--bg-light);
        }

        .support-blocks-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px;
          max-width: 1100px;
          margin: 0 auto;
        }

        @media (max-width: 900px) {
          .support-blocks-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        .support-info-card {
          background-color: transparent;
          padding: 0 0 36px;
          border-bottom: 1px solid var(--border-color);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .card-icon-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .support-info-card h3 {
          font-size: 1.5rem;
          font-family: var(--font-sans);
          font-weight: 600;
        }

        .support-info-card p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 36px;
        }

        .account-details-box,
        .contact-details-box {
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }

        .account-label,
        .contact-label {
          display: block;
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .account-number,
        .contact-phone {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--primary);
        }

        @media (max-width: 600px) {
          .account-number,
          .contact-phone {
            font-size: 1rem;
          }
        }

        .contact-name {
          font-size: 0.9rem;
          color: var(--text-muted);
          display: block;
          margin-top: 4px;
          font-weight: 400;
        }

        /* Support Form segment */
        .support-form-section {
          background-color: var(--bg-white);
        }

        .support-form-layout {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 60px;
          align-items: center;
          max-width: 1100px;
          margin: 0 auto;
        }

        @media (max-width: 900px) {
          .support-form-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        .form-info-text h2 {
          font-size: 2.2rem;
          margin-bottom: 20px;
        }

        .form-info-text p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.7;
        }

        .support-contact-card {
          background-color: transparent;
          border-top: 1px solid var(--border-color);
          padding-top: 40px;
        }

        .support-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 600px) {
          .form-group-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }
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
        .form-control select,
        .form-control textarea {
          border: 1px solid var(--border-color);
          border-radius: 0;
          padding: 12px;
          font-family: inherit;
          font-size: 0.9rem;
          background-color: var(--bg-white);
          transition: var(--transition-fast);
        }

        .form-control input:focus,
        .form-control select:focus,
        .form-control textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(0, 43, 91, 0.1);
        }

        .form-submit-btn {
          margin-top: 10px;
          justify-content: center;
        }

        /* Submission success */
        .success-submit-box {
          padding: 40px 10px;
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
