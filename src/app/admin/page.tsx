'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Save,
  Plus,
  Trash2,
  Edit,
  LogOut,
  Image as ImageIcon,
  Calendar,
  History,
  Globe,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'articles' | 'ministries' | 'history' | 'branches' | 'support'>('articles');
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    message: string;
    hasUrl: boolean;
    hasKey: boolean;
    tableExists: boolean;
  } | null>(null);

  // Editing states
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [newArticle, setNewArticle] = useState({
    category: '소식',
    date: new Date().toISOString().split('T')[0],
    thumbnail: '/images/ministries/mission-worship.jpg',
    titleKo: '',
    titleEn: '',
    summaryKo: '',
    summaryEn: '',
    contentKo: '',
    contentEn: ''
  });

  const [newHistory, setNewHistory] = useState({
    year: '2026',
    titleKo: '',
    titleEn: '',
    descKo: '',
    descEn: ''
  });

  const [selectedMinistryId, setSelectedMinistryId] = useState('worship');

  // Auth check & Data fetch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('cncc-admin-token');
      if (token !== 'authenticated') {
        router.push('/admin/login');
        return;
      }
      setIsAuthenticated(true);
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contentRes, statusRes] = await Promise.all([
        fetch('/api/content'),
        fetch('/api/db-status')
      ]);

      if (contentRes.ok) {
        const data = await contentRes.json();
        setDbData(data);
      }

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setDbStatus(statusData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('cncc-admin-token');
    }
    router.push('/admin/login');
  };

  const handleSaveAll = async (overrideData?: any) => {
    const dataToSave = overrideData || dbData;
    if (!dataToSave) return;

    setSaveStatus('saving');
    setSaveMessage('저장 중입니다...');

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (res.ok) {
        const result = await res.json();
        setDbData(result.data);
        setSaveStatus('saved');
        setSaveMessage('성공적으로 저장되었습니다! 홈페이지에 실시간 반영되었습니다.');
        setTimeout(() => setSaveStatus('idle'), 4000);
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      console.error('Error saving data:', err);
      setSaveStatus('error');
      setSaveMessage('저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  };

  // ================= Article Handlers =================
  const handleAddArticle = () => {
    if (!newArticle.titleKo) {
      alert('게시글 제목을 입력해 주세요.');
      return;
    }

    const newItem = {
      id: `art-${Date.now()}`,
      category: newArticle.category,
      date: newArticle.date,
      thumbnail: newArticle.thumbnail,
      title: { ko: newArticle.titleKo, en: newArticle.titleEn || newArticle.titleKo },
      summary: { ko: newArticle.summaryKo, en: newArticle.summaryEn || newArticle.summaryKo },
      content: { ko: newArticle.contentKo, en: newArticle.contentEn || newArticle.contentKo },
    };

    const updated = {
      ...dbData,
      articles: [newItem, ...(dbData.articles || [])],
    };

    setDbData(updated);
    handleSaveAll(updated);

    // Reset Form
    setNewArticle({
      category: '소식',
      date: new Date().toISOString().split('T')[0],
      thumbnail: '/images/ministries/mission-worship.jpg',
      titleKo: '',
      titleEn: '',
      summaryKo: '',
      summaryEn: '',
      contentKo: '',
      contentEn: ''
    });
  };

  const handleDeleteArticle = (id: string) => {
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) return;
    const updated = {
      ...dbData,
      articles: dbData.articles.filter((a: any) => a.id !== id),
    };
    setDbData(updated);
    handleSaveAll(updated);
  };

  // ================= History Handlers =================
  const handleAddHistory = () => {
    if (!newHistory.titleKo || !newHistory.year) {
      alert('연도와 연혁 제목을 입력해 주세요.');
      return;
    }

    const newItem = {
      id: `hist-${Date.now()}`,
      year: newHistory.year,
      title: { ko: newHistory.titleKo, en: newHistory.titleEn || newHistory.titleKo },
      desc: { ko: newHistory.descKo, en: newHistory.descEn || newHistory.descKo },
    };

    const updated = {
      ...dbData,
      history: [...(dbData.history || []), newItem],
    };

    setDbData(updated);
    handleSaveAll(updated);

    setNewHistory({
      year: '2026',
      titleKo: '',
      titleEn: '',
      descKo: '',
      descEn: ''
    });
  };

  const handleDeleteHistory = (id: string) => {
    if (!confirm('정말 이 연혁 항목을 삭제하시겠습니까?')) return;
    const updated = {
      ...dbData,
      history: dbData.history.filter((h: any) => h.id !== id),
    };
    setDbData(updated);
    handleSaveAll(updated);
  };

  // ================= Ministry Handlers =================
  const currentMinistry = dbData?.ministryDetails?.find((m: any) => m.id === selectedMinistryId);

  const handleUpdateMinistry = (field: string, value: any) => {
    const updatedMinistries = dbData.ministryDetails.map((m: any) => {
      if (m.id === selectedMinistryId) {
        return { ...m, [field]: value };
      }
      return m;
    });

    const updated = {
      ...dbData,
      ministryDetails: updatedMinistries,
    };
    setDbData(updated);
  };

  const handleAddGalleryPhoto = () => {
    const newSrc = prompt('추가할 사진의 경로(또는 웹 URL)를 입력하세요:', '/images/ministries/');
    if (!newSrc) return;
    const captionKo = prompt('사진 설명을 입력하세요:', '사역 현장 사진');

    const curGallery = currentMinistry?.gallery || [];
    const newGallery = [
      ...curGallery,
      { src: newSrc, caption: { ko: captionKo || '', en: captionKo || '' } }
    ];

    handleUpdateMinistry('gallery', newGallery);
  };

  const handleDeleteGalleryPhoto = (idx: number) => {
    if (!confirm('이 사진을 갤러리에서 삭제하시겠습니까?')) return;
    const curGallery = currentMinistry?.gallery || [];
    const newGallery = curGallery.filter((_: any, i: number) => i !== idx);
    handleUpdateMinistry('gallery', newGallery);
  };

  // ================= Support & Branches Handlers =================
  const handleUpdateSupport = (field: string, val: any) => {
    const updated = {
      ...dbData,
      support: {
        ...(dbData.support || {}),
        [field]: val
      }
    };
    setDbData(updated);
  };

  if (!isAuthenticated || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Pretendard, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #002B5B', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontWeight: 600 }}>데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Top Header */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-brand">
            <Image src="/logo.svg" alt="CNCC Logo" width={130} height={38} priority />
            <span className="portal-badge">CMS 관리자 포털</span>
            {dbStatus && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: dbStatus.connected ? '#ecfdf5' : '#fffbeb',
                  color: dbStatus.connected ? '#065f46' : '#b45309',
                  border: `1px solid ${dbStatus.connected ? '#a7f3d0' : '#fde68a'}`,
                  marginLeft: '12px'
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: dbStatus.connected ? '#10b981' : '#f59e0b',
                    display: 'inline-block'
                  }}
                />
                {dbStatus.connected ? '클라우드 DB 연결됨' : 'DB 연결 대기 중'}
              </span>
            )}
          </div>

          <div className="admin-actions">
            <Link href="/" target="_blank" className="action-btn view-site">
              <ExternalLink size={16} />
              <span>홈페이지 바로가기</span>
            </Link>
            <button onClick={handleLogout} className="action-btn logout">
              <LogOut size={16} />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </header>

      {/* DB Connection Alert Notice if not connected */}
      {dbStatus && !dbStatus.connected && (
        <div style={{
          backgroundColor: '#fffbeb',
          borderBottom: '1px solid #fef3c7',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          color: '#92400e'
        }}>
          <AlertCircle size={18} style={{ color: '#d97706', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <strong>[데이터베이스 상태]</strong> {dbStatus.message}
          </div>
          <button
            onClick={() => fetchData()}
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: '#d97706',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            연결 다시 확인
          </button>
        </div>
      )}

      {/* Save Notification Floating Bar */}
      {saveStatus !== 'idle' && (
        <div className={`save-toast ${saveStatus}`}>
          {saveStatus === 'saving' && <div className="spinner-mini"></div>}
          {saveStatus === 'saved' && <CheckCircle2 size={18} />}
          {saveStatus === 'error' && <AlertCircle size={18} />}
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Main Admin Workspace */}
      <div className="admin-body">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <div className="sidebar-title">콘텐츠 관리 메뉴</div>
          <nav className="sidebar-nav">
            <button
              onClick={() => setActiveTab('articles')}
              className={`nav-btn ${activeTab === 'articles' ? 'active' : ''}`}
            >
              <FileText size={18} />
              <span>사역 소식 / 게시글</span>
              <span className="count-tag">{dbData?.articles?.length || 0}</span>
            </button>

            <button
              onClick={() => setActiveTab('ministries')}
              className={`nav-btn ${activeTab === 'ministries' ? 'active' : ''}`}
            >
              <History size={18} />
              <span>4대 사역 & 갤러리</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
            >
              <Calendar size={18} />
              <span>선교회 연혁</span>
              <span className="count-tag">{dbData?.history?.length || 0}</span>
            </button>

            <button
              onClick={() => setActiveTab('branches')}
              className={`nav-btn ${activeTab === 'branches' ? 'active' : ''}`}
            >
              <Globe size={18} />
              <span>해외 지부 안내</span>
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`nav-btn ${activeTab === 'support' ? 'active' : ''}`}
            >
              <HelpCircle size={18} />
              <span>후원 계좌 & 문의</span>
            </button>
          </nav>

          <div style={{ marginTop: 'auto', padding: '20px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, color: '#002B5B', fontSize: '0.88rem', marginBottom: '6px' }}>💡 안내 사항</div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              수정 후 상단 <strong>[변경사항 전체 저장]</strong>을 누르시면 메인 홈페이지에 1초 만에 실시간 반영됩니다.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="admin-main">
          {/* Top Control Bar with Save Button */}
          <div className="content-topbar">
            <div>
              <h1 className="tab-heading">
                {activeTab === 'articles' && '사역 소식 / 게시글 관리'}
                {activeTab === 'ministries' && '4대 사역 소개 및 현장 갤러리 관리'}
                {activeTab === 'history' && '선교회 연혁 타임라인 관리'}
                {activeTab === 'branches' && '해외 선교 지부 관리'}
                {activeTab === 'support' && '사역 후원 계좌 및 문의처 관리'}
              </h1>
              <p className="tab-sub">관리자 화면에서 수정하고 저장하시면 웹사이트에 즉시 적용됩니다.</p>
            </div>

            <button
              onClick={() => handleSaveAll()}
              className="save-all-btn"
              disabled={saveStatus === 'saving'}
            >
              <Save size={18} />
              <span>{saveStatus === 'saving' ? '저장 중...' : '변경사항 전체 저장'}</span>
            </button>
          </div>

          {/* TAB 1: ARTICLES (사역 소식 / 게시글) */}
          {activeTab === 'articles' && (
            <div className="tab-content">
              {/* New Article Form */}
              <div className="admin-card">
                <div className="card-header">
                  <div className="card-title">
                    <Plus size={20} color="#0d9488" />
                    <span>새 소식 글 등록</span>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-field">
                    <label>분류 (카테고리)</label>
                    <select
                      value={newArticle.category}
                      onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                      className="form-input"
                    >
                      <option value="소식">소식 (News)</option>
                      <option value="선교">선교 (Missions)</option>
                      <option value="예배">예배 (Worship)</option>
                      <option value="사역">사역 (Ministry)</option>
                      <option value="행사">행사 (Events)</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>작성 일자</label>
                    <input
                      type="date"
                      value={newArticle.date}
                      onChange={(e) => setNewArticle({ ...newArticle, date: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-field full-width">
                    <label>대표 이미지 경로 / URL</label>
                    <input
                      type="text"
                      value={newArticle.thumbnail}
                      onChange={(e) => setNewArticle({ ...newArticle, thumbnail: e.target.value })}
                      className="form-input"
                      placeholder="예: /images/ministries/missions-global.jpg 또는 이미지 웹 주소"
                    />
                  </div>

                  <div className="form-field full-width">
                    <label>게시글 제목 (Title)</label>
                    <input
                      type="text"
                      value={newArticle.titleKo}
                      onChange={(e) => setNewArticle({ ...newArticle, titleKo: e.target.value })}
                      className="form-input"
                      placeholder="게시글 제목을 입력하세요"
                    />
                  </div>

                  <div className="form-field full-width">
                    <label>한 줄 요약 (Summary)</label>
                    <input
                      type="text"
                      value={newArticle.summaryKo}
                      onChange={(e) => setNewArticle({ ...newArticle, summaryKo: e.target.value })}
                      className="form-input"
                      placeholder="목록에 표시될 간략한 한 줄 요약을 입력하세요"
                    />
                  </div>

                  <div className="form-field full-width">
                    <label>상세 본문 내용 (Content)</label>
                    <textarea
                      rows={8}
                      value={newArticle.contentKo}
                      onChange={(e) => setNewArticle({ ...newArticle, contentKo: e.target.value })}
                      className="form-textarea"
                      placeholder="게시글 본문 내용을 자유롭게 작성하세요."
                    />
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handleAddArticle} className="btn-primary-admin">
                    <Plus size={18} />
                    <span>게시글 즉시 등록 및 발행</span>
                  </button>
                </div>
              </div>

              {/* Articles List */}
              <div className="admin-card">
                <div className="card-header">
                  <div className="card-title">
                    <FileText size={20} color="#002B5B" />
                    <span>등록된 게시글 목록 ({dbData?.articles?.length || 0}건)</span>
                  </div>
                </div>

                {(!dbData?.articles || dbData.articles.length === 0) ? (
                  <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
                    등록된 게시글이 없습니다. 위 폼에서 새 글을 작성해 보세요.
                  </p>
                ) : (
                  <div className="items-table-wrapper">
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>일자</th>
                          <th>분류</th>
                          <th>제목</th>
                          <th>요약</th>
                          <th style={{ textAlign: 'right' }}>관리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dbData.articles.map((art: any) => (
                          <tr key={art.id}>
                            <td style={{ whiteSpace: 'nowrap', color: '#64748b' }}>{art.date}</td>
                            <td>
                              <span className="badge-cat">{art.category}</span>
                            </td>
                            <td style={{ fontWeight: 700, color: '#002B5B' }}>
                              {art.title?.ko || art.title}
                            </td>
                            <td style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '300px' }} className="truncate">
                              {art.summary?.ko || art.summary || art.content?.ko || art.content}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                onClick={() => handleDeleteArticle(art.id)}
                                className="del-btn"
                                title="게시글 삭제"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MINISTRIES (4대 사역 및 갤러리) */}
          {activeTab === 'ministries' && (
            <div className="tab-content">
              {/* Ministry Selector */}
              <div className="ministry-tabs-bar">
                {dbData?.ministryDetails?.map((m: any) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMinistryId(m.id)}
                    className={`ministry-tab-btn ${selectedMinistryId === m.id ? 'active' : ''}`}
                  >
                    {m.title?.ko || m.title}
                  </button>
                ))}
              </div>

              {currentMinistry && (
                <div className="admin-card">
                  <div className="card-header">
                    <div className="card-title">
                      <span>[{currentMinistry.title?.ko || currentMinistry.title}] 사역 정보 편집</span>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-field full-width">
                      <label>사역 명칭 (Title)</label>
                      <input
                        type="text"
                        value={currentMinistry.title?.ko || ''}
                        onChange={(e) => handleUpdateMinistry('title', { ...currentMinistry.title, ko: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-field full-width">
                      <label>대표 썸네일 이미지</label>
                      <input
                        type="text"
                        value={currentMinistry.thumbnail || ''}
                        onChange={(e) => handleUpdateMinistry('thumbnail', e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-field full-width">
                      <label>사역 한 줄 요약 (Summary)</label>
                      <textarea
                        rows={3}
                        value={currentMinistry.summary?.ko || ''}
                        onChange={(e) => handleUpdateMinistry('summary', { ...currentMinistry.summary, ko: e.target.value })}
                        className="form-textarea"
                      />
                    </div>

                    <div className="form-field full-width">
                      <label>상세 본문 소개 (Content)</label>
                      <textarea
                        rows={10}
                        value={currentMinistry.content?.ko || ''}
                        onChange={(e) => handleUpdateMinistry('content', { ...currentMinistry.content, ko: e.target.value })}
                        className="form-textarea"
                      />
                    </div>
                  </div>

                  {/* Photo Gallery Editor */}
                  <div style={{ marginTop: '40px', paddingTop: '28px', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', color: '#002B5B', fontWeight: 700, margin: 0 }}>📸 사역 현장 갤러리 관리</h3>
                        <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '4px 0 0 0' }}>
                          사역 상세페이지 하단에 노출되는 현장 사진들을 관리합니다.
                        </p>
                      </div>
                      <button onClick={handleAddGalleryPhoto} className="btn-secondary-admin">
                        <Plus size={16} />
                        <span>사진 추가</span>
                      </button>
                    </div>

                    <div className="gallery-admin-grid">
                      {currentMinistry.gallery?.map((g: any, idx: number) => (
                        <div key={idx} className="gallery-admin-card">
                          <div className="gallery-preview">
                            <img src={g.src} alt="Gallery Preview" />
                          </div>
                          <div style={{ padding: '12px' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#002B5B', marginBottom: '6px' }}>
                              {g.caption?.ko || g.caption}
                            </div>
                            <button
                              onClick={() => handleDeleteGalleryPhoto(idx)}
                              className="del-btn-sm"
                            >
                              <Trash2 size={14} />
                              <span>삭제</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HISTORY (선교회 연혁) */}
          {activeTab === 'history' && (
            <div className="tab-content">
              {/* New History Form */}
              <div className="admin-card">
                <div className="card-header">
                  <div className="card-title">
                    <Plus size={20} color="#0d9488" />
                    <span>새 연혁 항목 추가</span>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-field">
                    <label>연도 및 월 (예: 2026.05)</label>
                    <input
                      type="text"
                      value={newHistory.year}
                      onChange={(e) => setNewHistory({ ...newHistory, year: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-field" style={{ flexGrow: 2 }}>
                    <label>연혁 제목 (사역 내용)</label>
                    <input
                      type="text"
                      value={newHistory.titleKo}
                      onChange={(e) => setNewHistory({ ...newHistory, titleKo: e.target.value })}
                      className="form-input"
                      placeholder="예: 5호점 오픈 또는 해외 단기선교"
                    />
                  </div>

                  <div className="form-field full-width">
                    <label>상세 설명 (선택)</label>
                    <input
                      type="text"
                      value={newHistory.descKo}
                      onChange={(e) => setNewHistory({ ...newHistory, descKo: e.target.value })}
                      className="form-input"
                      placeholder="사역에 대한 간략한 보충 설명"
                    />
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handleAddHistory} className="btn-primary-admin">
                    <Plus size={18} />
                    <span>연혁 목록에 추가</span>
                  </button>
                </div>
              </div>

              {/* History List */}
              <div className="admin-card">
                <div className="card-header">
                  <div className="card-title">
                    <History size={20} color="#002B5B" />
                    <span>현재 연혁 타임라인 목록 ({dbData?.history?.length || 0}건)</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: 600 }}>
                    ✓ MOU·이사취임·KWMA/KWMC 제외 정비 완료
                  </span>
                </div>

                <div className="items-table-wrapper">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>연도</th>
                        <th>연혁 제목</th>
                        <th>상세 설명</th>
                        <th style={{ textAlign: 'right' }}>관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dbData?.history?.map((h: any) => (
                        <tr key={h.id}>
                          <td style={{ fontWeight: 700, color: '#002B5B', whiteSpace: 'nowrap' }}>
                            {h.year}
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {h.title?.ko || h.title}
                          </td>
                          <td style={{ color: '#64748b', fontSize: '0.9rem' }}>
                            {h.desc?.ko || h.desc}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              onClick={() => handleDeleteHistory(h.id)}
                              className="del-btn"
                              title="연혁 삭제"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BRANCHES (해외 선교 지부) */}
          {activeTab === 'branches' && (
            <div className="tab-content">
              <div className="admin-card">
                <div className="card-header">
                  <div className="card-title">
                    <Globe size={20} color="#002B5B" />
                    <span>선교 지부 목록 편집</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                  {dbData?.branches?.map((b: any, index: number) => (
                    <div key={b.id || index} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: 700, color: '#002B5B', fontSize: '1.1rem', marginBottom: '12px' }}>
                        {b.cityKo || b.city} ({b.countryKo || b.country})
                      </div>
                      <div className="form-field" style={{ marginBottom: '10px' }}>
                        <label>주소</label>
                        <input
                          type="text"
                          value={b.addressKo || b.address || ''}
                          onChange={(e) => {
                            const newBranches = [...dbData.branches];
                            newBranches[index] = { ...b, addressKo: e.target.value };
                            setDbData({ ...dbData, branches: newBranches });
                          }}
                          className="form-input"
                        />
                      </div>
                      <div className="form-field">
                        <label>연락처</label>
                        <input
                          type="text"
                          value={b.contact || ''}
                          onChange={(e) => {
                            const newBranches = [...dbData.branches];
                            newBranches[index] = { ...b, contact: e.target.value };
                            setDbData({ ...dbData, branches: newBranches });
                          }}
                          className="form-input"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SUPPORT & ACCOUNT (후원 및 문의) */}
          {activeTab === 'support' && (
            <div className="tab-content">
              <div className="admin-card">
                <div className="card-header">
                  <div className="card-title">
                    <HelpCircle size={20} color="#002B5B" />
                    <span>후원 계좌 및 대표 연락처 편집</span>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-field full-width">
                    <label>공식 후원 계좌 안내</label>
                    <input
                      type="text"
                      value={dbData?.support?.bankAccount?.ko || '신한은행 100-032-123456 (예금주: CNCC선교회)'}
                      onChange={(e) => handleUpdateSupport('bankAccount', { ko: e.target.value, en: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-field full-width">
                    <label>대표 문의 전화</label>
                    <input
                      type="text"
                      value={dbData?.support?.contact || '010-6518-5874'}
                      onChange={(e) => handleUpdateSupport('contact', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .admin-layout {
          min-height: 100vh;
          background-color: #f1f5f9;
          font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;
          color: #1e293b;
        }

        /* Header */
        .admin-header {
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .admin-header-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 12px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .admin-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .portal-badge {
          background-color: #002B5B;
          color: #56DFCF;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .admin-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .action-btn.view-site {
          background-color: #f8fafc;
          border-color: #cbd5e1;
          color: #002B5B;
        }

        .action-btn.view-site:hover {
          background-color: #e2e8f0;
        }

        .action-btn.logout {
          background-color: #fee2e2;
          color: #b91c1c;
        }

        .action-btn.logout:hover {
          background-color: #fecaca;
        }

        /* Toast */
        .save-toast {
          position: fixed;
          top: 76px;
          right: 24px;
          z-index: 200;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          font-weight: 600;
          font-size: 0.92rem;
          animation: slideIn 0.3s ease;
        }

        .save-toast.saving {
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #002B5B;
        }

        .save-toast.saved {
          background-color: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #047857;
        }

        .save-toast.error {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
        }

        .spinner-mini {
          width: 16px;
          height: 16px;
          border: 2px solid #cbd5e1;
          border-top: 2px solid #002B5B;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* Layout Body */
        .admin-body {
          max-width: 1440px;
          margin: 0 auto;
          padding: 24px;
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 24px;
        }

        @media (max-width: 960px) {
          .admin-body {
            grid-template-columns: 1fr;
          }
        }

        /* Sidebar */
        .admin-sidebar {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          height: fit-content;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sidebar-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding-left: 8px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #475a70;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }

        .nav-btn:hover {
          background-color: #f8fafc;
          color: #002B5B;
        }

        .nav-btn.active {
          background-color: #002B5B;
          color: #ffffff;
        }

        .count-tag {
          margin-left: auto;
          background-color: rgba(0, 0, 0, 0.08);
          font-size: 0.78rem;
          padding: 2px 8px;
          border-radius: 12px;
        }

        .nav-btn.active .count-tag {
          background-color: rgba(255, 255, 255, 0.2);
        }

        /* Main Workspace */
        .content-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .tab-heading {
          font-size: 1.6rem;
          font-weight: 700;
          color: #002B5B;
          margin: 0;
        }

        .tab-sub {
          font-size: 0.92rem;
          color: #64748b;
          margin: 4px 0 0 0;
        }

        .save-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #002B5B;
          color: #ffffff;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(0, 43, 91, 0.15);
          transition: all 0.2s ease;
        }

        .save-all-btn:hover {
          background-color: #001f42;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 43, 91, 0.25);
        }

        /* Cards */
        .admin-card {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 28px;
          border: 1px solid #e2e8f0;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.25rem;
          font-weight: 700;
          color: #002B5B;
        }

        /* Form */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-field.full-width {
          grid-column: 1 / -1;
        }

        .form-field label {
          font-size: 0.88rem;
          font-weight: 700;
          color: #334155;
        }

        .form-input, .form-textarea {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 0.95rem;
          background-color: #ffffff;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #56DFCF;
          box-shadow: 0 0 0 3px rgba(86, 223, 207, 0.2);
        }

        .btn-primary-admin {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #0d9488;
          color: #ffffff;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.92rem;
          transition: background-color 0.2s;
        }

        .btn-primary-admin:hover {
          background-color: #0f766e;
        }

        .btn-secondary-admin {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #f1f5f9;
          color: #002B5B;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.88rem;
          border: 1px solid #cbd5e1;
        }

        .btn-secondary-admin:hover {
          background-color: #e2e8f0;
        }

        /* Table */
        .items-table-wrapper {
          overflow-x: auto;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .items-table th {
          padding: 12px 16px;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748b;
        }

        .items-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.92rem;
        }

        .badge-cat {
          background-color: #e0f2fe;
          color: #0369a1;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.78rem;
          font-weight: 700;
        }

        .del-btn {
          color: #94a3b8;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .del-btn:hover {
          color: #ef4444;
          background-color: #fee2e2;
        }

        .del-btn-sm {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #ef4444;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
          background-color: #fef2f2;
        }

        /* Ministry Tabs */
        .ministry-tabs-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          overflow-x: auto;
        }

        .ministry-tab-btn {
          padding: 10px 18px;
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-weight: 600;
          color: #475a70;
          font-size: 0.95rem;
          white-space: nowrap;
          cursor: pointer;
        }

        .ministry-tab-btn.active {
          background-color: #002B5B;
          color: #ffffff;
          border-color: #002B5B;
        }

        /* Gallery Admin Grid */
        .gallery-admin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }

        .gallery-admin-card {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          background: #f8fafc;
        }

        .gallery-preview {
          width: 100%;
          aspect-ratio: 16 / 10;
          background-color: #e2e8f0;
          overflow: hidden;
        }

        .gallery-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
