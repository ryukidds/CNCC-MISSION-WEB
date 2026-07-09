'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { PageTransition } from '@/components/FramerTransitions';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  LogOut, 
  Image as ImageIcon, 
  Calendar, 
  MapPin, 
  History, 
  Globe, 
  FileText, 
  Settings 
} from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'articles' | 'history' | 'branches' | 'events' | 'support'>('articles');
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Form states for adding items
  const [newArticle, setNewArticle] = useState({
    category: 'Worship',
    date: new Date().toISOString().split('T')[0],
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
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

  const [newBranch, setNewBranch] = useState({
    country: '',
    countryKo: '',
    city: '',
    cityKo: '',
    address: '',
    addressKo: '',
    contact: ''
  });

  const [newEvent, setNewEvent] = useState({
    titleKo: '',
    titleEn: '',
    date: '',
    time: '11:00',
    locationKo: '',
    locationEn: ''
  });

  // Verify Admin Login Session
  useEffect(() => {
    const token = sessionStorage.getItem('cncc-admin-token');
    if (token !== 'authenticated') {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      fetchContent();
    }
  }, [router]);

  const fetchContent = () => {
    setLoading(true);
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        setDbData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching db data:', err);
        setLoading(false);
      });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('cncc-admin-token');
    router.push('/admin/login');
  };

  const handleSaveAll = (updatedDb: any) => {
    setSaveStatus('saving');
    fetch('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDb),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setDbData(resData.data);
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 3000);
        } else {
          setSaveStatus('error');
        }
      })
      .catch((err) => {
        console.error('Save error:', err);
        setSaveStatus('error');
      });
  };

  // --- CRUD ACTIONS ---

  // Articles
  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbData) return;

    const newId = `post-${Date.now()}`;
    const articleObject = {
      id: newId,
      category: newArticle.category,
      date: newArticle.date,
      thumbnail: newArticle.thumbnail,
      title: { ko: newArticle.titleKo, en: newArticle.titleEn },
      summary: { ko: newArticle.summaryKo, en: newArticle.summaryEn },
      content: { ko: newArticle.contentKo, en: newArticle.contentEn }
    };

    const updatedArticles = [articleObject, ...dbData.articles];
    handleSaveAll({ ...dbData, articles: updatedArticles });
    
    // Reset form
    setNewArticle({
      category: 'Worship',
      date: new Date().toISOString().split('T')[0],
      thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
      titleKo: '',
      titleEn: '',
      summaryKo: '',
      summaryEn: '',
      contentKo: '',
      contentEn: ''
    });
  };

  const handleDeleteArticle = (id: string) => {
    if (!dbData || !window.confirm(t('이 아티클을 삭제하시겠습니까?', 'Are you sure you want to delete this article?'))) return;
    const updatedArticles = dbData.articles.filter((art: any) => art.id !== id);
    handleSaveAll({ ...dbData, articles: updatedArticles });
  };

  // History
  const handleAddHistory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbData) return;

    const historyObject = {
      id: `hist-${Date.now()}`,
      year: newHistory.year,
      title: { ko: newHistory.titleKo, en: newHistory.titleEn },
      desc: { ko: newHistory.descKo, en: newHistory.descEn }
    };

    const updatedHistory = [...dbData.history, historyObject].sort((a, b) => parseInt(a.year) - parseInt(b.year));
    handleSaveAll({ ...dbData, history: updatedHistory });

    setNewHistory({
      year: '2026',
      titleKo: '',
      titleEn: '',
      descKo: '',
      descEn: ''
    });
  };

  const handleDeleteHistory = (id: string) => {
    if (!dbData || !window.confirm(t('이 연혁 항목을 삭제하시겠습니까?', 'Are you sure you want to delete this history item?'))) return;
    const updatedHistory = dbData.history.filter((h: any) => h.id !== id);
    handleSaveAll({ ...dbData, history: updatedHistory });
  };

  // Branches
  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbData) return;

    const branchObject = {
      id: `branch-${Date.now()}`,
      ...newBranch
    };

    const updatedBranches = [...dbData.branches, branchObject];
    handleSaveAll({ ...dbData, branches: updatedBranches });

    setNewBranch({
      country: '',
      countryKo: '',
      city: '',
      cityKo: '',
      address: '',
      addressKo: '',
      contact: ''
    });
  };

  const handleDeleteBranch = (id: string) => {
    if (!dbData || !window.confirm(t('이 지부를 삭제하시겠습니까?', 'Are you sure you want to delete this branch?'))) return;
    const updatedBranches = dbData.branches.filter((b: any) => b.id !== id);
    handleSaveAll({ ...dbData, branches: updatedBranches });
  };

  // Events
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbData) return;

    const eventObject = {
      id: `evt-${Date.now()}`,
      title: { ko: newEvent.titleKo, en: newEvent.titleEn },
      date: newEvent.date,
      time: newEvent.time,
      location: { ko: newEvent.locationKo, en: newEvent.locationEn }
    };

    const updatedEvents = [...dbData.events, eventObject].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    handleSaveAll({ ...dbData, events: updatedEvents });

    setNewEvent({
      titleKo: '',
      titleEn: '',
      date: '',
      time: '11:00',
      locationKo: '',
      locationEn: ''
    });
  };

  const handleDeleteEvent = (id: string) => {
    if (!dbData || !window.confirm(t('이 일정을 삭제하시겠습니까?', 'Are you sure you want to delete this event?'))) return;
    const updatedEvents = dbData.events.filter((e: any) => e.id !== id);
    handleSaveAll({ ...dbData, events: updatedEvents });
  };

  // Banner & Support Edit
  const handleUpdateSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbData) return;
    handleSaveAll(dbData);
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="admin-loader">
        <div className="spinner"></div>
        <style jsx>{`
          .admin-loader {
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
      <div className="admin-dashboard-container">
        {/* Dash Header */}
        <div className="dashboard-header container">
          <div>
            <h1>CNCC CMS Portal</h1>
            <p className="subtitle">{t('선교회 데이터베이스 및 콘텐츠 통합 관리자 모드', 'Integrated Content Management System for CNCC')}</p>
          </div>
          <button onClick={handleLogout} className="btn-outline logout-btn">
            <LogOut size={16} />
            <span>{t('로그아웃', 'Sign Out')}</span>
          </button>
        </div>

        {/* Global Save Status Overlay */}
        {saveStatus !== 'idle' && (
          <div className={`save-status-overlay ${saveStatus}`}>
            <span>
              {saveStatus === 'saving' && t('저장 중...', 'Saving changes...')}
              {saveStatus === 'saved' && t('성공적으로 저장되었습니다!', 'Changes saved successfully!')}
              {saveStatus === 'error' && t('저장 오류가 발생했습니다.', 'Error saving changes.')}
            </span>
          </div>
        )}

        <div className="container dashboard-layout">
          {/* Left Navigation Tabs */}
          <aside className="dashboard-sidebar">
            <button 
              onClick={() => setActiveTab('articles')} 
              className={`sidebar-tab ${activeTab === 'articles' ? 'active' : ''}`}
            >
              <FileText size={18} />
              <span>{t('사역 블로그 포스트', 'Blog Articles')}</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('history')} 
              className={`sidebar-tab ${activeTab === 'history' ? 'active' : ''}`}
            >
              <History size={18} />
              <span>{t('선교회 연혁', 'Chronological History')}</span>
            </button>

            <button 
              onClick={() => setActiveTab('branches')} 
              className={`sidebar-tab ${activeTab === 'branches' ? 'active' : ''}`}
            >
              <Globe size={18} />
              <span>{t('해외 지부 리스트', 'Global Branches')}</span>
            </button>

            <button 
              onClick={() => setActiveTab('events')} 
              className={`sidebar-tab ${activeTab === 'events' ? 'active' : ''}`}
            >
              <Calendar size={18} />
              <span>{t('모임 및 예배 일정', 'Upcoming Events')}</span>
            </button>

            <button 
              onClick={() => setActiveTab('support')} 
              className={`sidebar-tab ${activeTab === 'support' ? 'active' : ''}`}
            >
              <Settings size={18} />
              <span>{t('계좌 & 메인 배너', 'Support & Banner')}</span>
            </button>
          </aside>

          {/* Right Main Editor Area */}
          <main className="dashboard-content-panel">
            
            {/* T-1: Blog Articles tab */}
            {activeTab === 'articles' && (
              <div>
                <h2>{t('사역 블로그 포스트 관리', 'Manage Blog Articles')}</h2>
                
                {/* Form to Add Post */}
                <form onSubmit={handleAddArticle} className="admin-form-box">
                  <h3>
                    <Plus size={18} />
                    <span>{t('새 블로그 아티클 추가', 'Create Blog Post')}</span>
                  </h3>
                  
                  <div className="form-row-grid">
                    <div className="form-group">
                      <label>{t('사역 카테고리', 'Category')}</label>
                      <select 
                        value={newArticle.category} 
                        onChange={(e) => setNewArticle(prev => ({ ...prev, category: e.target.value }))}
                      >
                        <option value="Worship">{t('예배 사역 (Worship)', 'Worship')}</option>
                        <option value="Sharing">{t('나눔 사역 (Sharing)', 'Sharing')}</option>
                        <option value="Training">{t('제자 훈련 (Training)', 'Training')}</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>{t('발행 일자', 'Date')}</label>
                      <input 
                        type="date" 
                        value={newArticle.date} 
                        onChange={(e) => setNewArticle(prev => ({ ...prev, date: e.target.value }))}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{t('썸네일 이미지 주소', 'Thumbnail URL')}</label>
                    <input 
                      type="text" 
                      value={newArticle.thumbnail} 
                      onChange={(e) => setNewArticle(prev => ({ ...prev, thumbnail: e.target.value }))}
                      required 
                    />
                  </div>

                  <div className="form-row-grid">
                    <div className="form-group">
                      <label>{t('제목 (한글)', 'Title (KO)')}</label>
                      <input 
                        type="text" 
                        value={newArticle.titleKo} 
                        onChange={(e) => setNewArticle(prev => ({ ...prev, titleKo: e.target.value }))}
                        required 
                        placeholder="예배의 감격 스케치..."
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('제목 (영어)', 'Title (EN)')}</label>
                      <input 
                        type="text" 
                        value={newArticle.titleEn} 
                        onChange={(e) => setNewArticle(prev => ({ ...prev, titleEn: e.target.value }))}
                        required 
                        placeholder="Sketches of Worship Night..."
                      />
                    </div>
                  </div>

                  <div className="form-row-grid">
                    <div className="form-group">
                      <label>{t('요약 요점 (한글)', 'Summary (KO)')}</label>
                      <textarea 
                        rows={2} 
                        value={newArticle.summaryKo} 
                        onChange={(e) => setNewArticle(prev => ({ ...prev, summaryKo: e.target.value }))}
                        required 
                        placeholder="이 아티클의 주요 소개 한 줄 요약..."
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('요약 요점 (영어)', 'Summary (EN)')}</label>
                      <textarea 
                        rows={2} 
                        value={newArticle.summaryEn} 
                        onChange={(e) => setNewArticle(prev => ({ ...prev, summaryEn: e.target.value }))}
                        required 
                        placeholder="One line description of this post..."
                      />
                    </div>
                  </div>

                  <div className="form-row-grid">
                    <div className="form-group">
                      <label>{t('본문 내용 (한글) - Markdown 형식 지원', 'Content Text (KO)')}</label>
                      <textarea 
                        rows={8} 
                        value={newArticle.contentKo} 
                        onChange={(e) => setNewArticle(prev => ({ ...prev, contentKo: e.target.value }))}
                        required 
                        placeholder="### 소제목 \n\n내용 기술..."
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('본문 내용 (영어) - Markdown 형식 지원', 'Content Text (EN)')}</label>
                      <textarea 
                        rows={8} 
                        value={newArticle.contentEn} 
                        onChange={(e) => setNewArticle(prev => ({ ...prev, contentEn: e.target.value }))}
                        required 
                        placeholder="### Subheading \n\nEnglish description..."
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary">
                    <Save size={14} />
                    <span>{t('블로그 아티클 등록', 'Publish Article')}</span>
                  </button>
                </form>

                {/* List of articles */}
                <div className="admin-list-container">
                  <h3>{t('등록된 아티클 목록', 'Published Articles')}</h3>
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>{t('구분', 'Category')}</th>
                          <th>{t('제목', 'Title')}</th>
                          <th>{t('일자', 'Date')}</th>
                          <th>{t('관리', 'Actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dbData.articles.map((art: any) => (
                          <tr key={art.id}>
                            <td>
                              <span className="table-tag">{art.category}</span>
                            </td>
                            <td className="table-title-cell">{art.title.ko}</td>
                            <td>{art.date}</td>
                            <td>
                              <button 
                                onClick={() => handleDeleteArticle(art.id)} 
                                className="action-delete-btn"
                                aria-label="Delete"
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

            {/* T-2: History Timeline tab */}
            {activeTab === 'history' && (
              <div>
                <h2>{t('선교회 연혁 Timeline 관리', 'Manage History Timeline')}</h2>

                <form onSubmit={handleAddHistory} className="admin-form-box">
                  <h3>
                    <Plus size={18} />
                    <span>{t('연혁 노드 추가', 'Add History Node')}</span>
                  </h3>
                  
                  <div className="form-group">
                    <label>{t('해당 연도 (예: 2026)', 'Year')}</label>
                    <input 
                      type="text" 
                      value={newHistory.year} 
                      onChange={(e) => setNewHistory(prev => ({ ...prev, year: e.target.value }))}
                      required 
                    />
                  </div>

                  <div className="form-row-grid">
                    <div className="form-group">
                      <label>{t('연혁 한글 타이틀', 'Title (KO)')}</label>
                      <input 
                        type="text" 
                        value={newHistory.titleKo} 
                        onChange={(e) => setNewHistory(prev => ({ ...prev, titleKo: e.target.value }))}
                        required 
                        placeholder="선교회 창립 및..."
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('연혁 영어 타이틀', 'Title (EN)')}</label>
                      <input 
                        type="text" 
                        value={newHistory.titleEn} 
                        onChange={(e) => setNewHistory(prev => ({ ...prev, titleEn: e.target.value }))}
                        required 
                        placeholder="CNCC Founded..."
                      />
                    </div>
                  </div>

                  <div className="form-row-grid">
                    <div className="form-group">
                      <label>{t('연혁 한글 상세설명', 'Description (KO)')}</label>
                      <textarea 
                        rows={2} 
                        value={newHistory.descKo} 
                        onChange={(e) => setNewHistory(prev => ({ ...prev, descKo: e.target.value }))}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('연혁 영어 상세설명', 'Description (EN)')}</label>
                      <textarea 
                        rows={2} 
                        value={newHistory.descEn} 
                        onChange={(e) => setNewHistory(prev => ({ ...prev, descEn: e.target.value }))}
                        required 
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary">
                    <Plus size={14} />
                    <span>{t('연혁 추가 등록', 'Add Timeline Node')}</span>
                  </button>
                </form>

                {/* History List */}
                <div className="admin-list-container">
                  <h3>{t('등록된 연혁 목록', 'Registered History')}</h3>
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>{t('연도', 'Year')}</th>
                          <th>{t('타이틀', 'Title')}</th>
                          <th>{t('설명', 'Description')}</th>
                          <th>{t('관리', 'Actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dbData.history.map((hist: any) => (
                          <tr key={hist.id}>
                            <td className="bold-text">{hist.year}</td>
                            <td>{hist.title.ko}</td>
                            <td>{hist.desc.ko}</td>
                            <td>
                              <button 
                                onClick={() => handleDeleteHistory(hist.id)} 
                                className="action-delete-btn"
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

            {/* T-3: Global Branches tab */}
            {activeTab === 'branches' && (
              <div>
                <h2>{t('해외 지부 오피스 관리', 'Manage Global Branches')}</h2>

                <form onSubmit={handleAddBranch} className="admin-form-box">
                  <h3>
                    <Plus size={18} />
                    <span>{t('신규 지부 등록', 'Register New Branch')}</span>
                  </h3>
                  
                  <div className="form-row-grid">
                    <div className="form-group">
                      <label>{t('국가 영어 (예: Kenya)', 'Country (EN)')}</label>
                      <input 
                        type="text" 
                        value={newBranch.country} 
                        onChange={(e) => setNewBranch(prev => ({ ...prev, country: e.target.value }))}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('국가 한글 (예: 케냐)', 'Country (KO)')}</label>
                      <input 
                        type="text" 
                        value={newBranch.countryKo} 
                        onChange={(e) => setNewBranch(prev => ({ ...prev, countryKo: e.target.value }))}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-row-grid">
                    <div className="form-group">
                      <label>{t('도시 영어 (예: Nairobi Office)', 'City (EN)')}</label>
                      <input 
                        type="text" 
                        value={newBranch.city} 
                        onChange={(e) => setNewBranch(prev => ({ ...prev, city: e.target.value }))}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('도시 한글 (예: 나이로비 지부)', 'City (KO)')}</label>
                      <input 
                        type="text" 
                        value={newBranch.cityKo} 
                        onChange={(e) => setNewBranch(prev => ({ ...prev, cityKo: e.target.value }))}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-row-grid">
                    <div className="form-group">
                      <label>{t('상세주소 영어', 'Address (EN)')}</label>
                      <input 
                        type="text" 
                        value={newBranch.address} 
                        onChange={(e) => setNewBranch(prev => ({ ...prev, address: e.target.value }))}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('상세주소 한글', 'Address (KO)')}</label>
                      <input 
                        type="text" 
                        value={newBranch.addressKo} 
                        onChange={(e) => setNewBranch(prev => ({ ...prev, addressKo: e.target.value }))}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{t('지부 대표 연락처', 'Contact Number')}</label>
                    <input 
                      type="text" 
                      value={newBranch.contact} 
                      onChange={(e) => setNewBranch(prev => ({ ...prev, contact: e.target.value }))}
                      required 
                      placeholder="+254-20-000-0000"
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    <Plus size={14} />
                    <span>{t('지부 등록', 'Publish Branch')}</span>
                  </button>
                </form>

                {/* Branches List */}
                <div className="admin-list-container">
                  <h3>{t('등록된 해외 지부', 'Registered Branches')}</h3>
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>{t('국가', 'Country')}</th>
                          <th>{t('지부명', 'Branch City')}</th>
                          <th>{t('주소', 'Address')}</th>
                          <th>{t('연락처', 'Contact')}</th>
                          <th>{t('관리', 'Actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dbData.branches.map((b: any) => (
                          <tr key={b.id}>
                            <td>{b.countryKo} ({b.country})</td>
                            <td className="bold-text">{b.cityKo}</td>
                            <td>{b.addressKo}</td>
                            <td>{b.contact}</td>
                            <td>
                              <button 
                                onClick={() => handleDeleteBranch(b.id)} 
                                className="action-delete-btn"
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

            {/* T-4: Events Calendar tab */}
            {activeTab === 'events' && (
              <div>
                <h2>{t('예배 및 선교회 모임 일정 관리', 'Manage Upcoming Events')}</h2>

                <form onSubmit={handleAddEvent} className="admin-form-box">
                  <h3>
                    <Plus size={18} />
                    <span>{t('새로운 일정 등록', 'Add Schedule')}</span>
                  </h3>
                  
                  <div className="form-row-grid">
                    <div className="form-group">
                      <label>{t('모임 명칭 (한글)', 'Title (KO)')}</label>
                      <input 
                        type="text" 
                        value={newEvent.titleKo} 
                        onChange={(e) => setNewEvent(prev => ({ ...prev, titleKo: e.target.value }))}
                        required 
                        placeholder="예: 코람데오 예배 수련회"
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('모임 명칭 (영어)', 'Title (EN)')}</label>
                      <input 
                        type="text" 
                        value={newEvent.titleEn} 
                        onChange={(e) => setNewEvent(prev => ({ ...prev, titleEn: e.target.value }))}
                        required 
                        placeholder="e.g. Coram Deo Spiritual Retreat"
                      />
                    </div>
                  </div>

                  <div className="form-row-grid">
                    <div className="form-group">
                      <label>{t('날짜', 'Date')}</label>
                      <input 
                        type="date" 
                        value={newEvent.date} 
                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('시간 (예: 14:00)', 'Time')}</label>
                      <input 
                        type="text" 
                        value={newEvent.time} 
                        onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-row-grid">
                    <div className="form-group">
                      <label>{t('장소 (한글)', 'Location (KO)')}</label>
                      <input 
                        type="text" 
                        value={newEvent.locationKo} 
                        onChange={(e) => setNewEvent(prev => ({ ...prev, locationKo: e.target.value }))}
                        required 
                        placeholder="예: 본부 오피스 예배홀"
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('장소 (영어)', 'Location (EN)')}</label>
                      <input 
                        type="text" 
                        value={newEvent.locationEn} 
                        onChange={(e) => setNewEvent(prev => ({ ...prev, locationEn: e.target.value }))}
                        required 
                        placeholder="e.g. Headquarters Chapel"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary">
                    <Plus size={14} />
                    <span>{t('일정 추가', 'Publish Event')}</span>
                  </button>
                </form>

                {/* Events list */}
                <div className="admin-list-container">
                  <h3>{t('등록된 모임 일정', 'Scheduled Events')}</h3>
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>{t('일자', 'Date')}</th>
                          <th>{t('시간', 'Time')}</th>
                          <th>{t('일정명', 'Event Name')}</th>
                          <th>{t('장소', 'Location')}</th>
                          <th>{t('관리', 'Actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dbData.events.map((evt: any) => (
                          <tr key={evt.id}>
                            <td>{evt.date}</td>
                            <td>{evt.time}</td>
                            <td className="bold-text">{evt.title.ko}</td>
                            <td>{evt.location.ko}</td>
                            <td>
                              <button 
                                onClick={() => handleDeleteEvent(evt.id)} 
                                className="action-delete-btn"
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

            {/* T-5: Banner and support settings */}
            {activeTab === 'support' && (
              <div>
                <h2>{t('선교회 메인 배너 & 후원 정보 설정', 'Global Support & Slider Settings')}</h2>
                
                <form onSubmit={handleUpdateSupport} className="admin-form-box">
                  <h3>
                    <Settings size={18} />
                    <span>{t('후원 및 연락처 정보 수정', 'Financial & Hotlines')}</span>
                  </h3>

                  <div className="form-row-grid">
                    <div className="form-group">
                      <label>{t('후원계좌 한글 텍스트', 'Bank Details (KO)')}</label>
                      <input 
                        type="text" 
                        value={dbData.support.bankAccount.ko} 
                        onChange={(e) => {
                          const updated = { ...dbData };
                          updated.support.bankAccount.ko = e.target.value;
                          setDbData(updated);
                        }}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('후원계좌 영어 텍스트', 'Bank Details (EN)')}</label>
                      <input 
                        type="text" 
                        value={dbData.support.bankAccount.en} 
                        onChange={(e) => {
                          const updated = { ...dbData };
                          updated.support.bankAccount.en = e.target.value;
                          setDbData(updated);
                        }}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{t('나눔 문의 핫라인 전화번호', 'Support Hotline')}</label>
                    <input 
                      type="text" 
                      value={dbData.support.contact} 
                      onChange={(e) => {
                        const updated = { ...dbData };
                        updated.support.contact = e.target.value;
                        setDbData(updated);
                      }}
                      required 
                    />
                  </div>

                  <div className="form-row-grid">
                    <div className="form-group">
                      <label>{t('본부 한글 주소', 'HQ Address (KO)')}</label>
                      <input 
                        type="text" 
                        value={dbData.support.address.ko} 
                        onChange={(e) => {
                          const updated = { ...dbData };
                          updated.support.address.ko = e.target.value;
                          setDbData(updated);
                        }}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('본부 영어 주소', 'HQ Address (EN)')}</label>
                      <input 
                        type="text" 
                        value={dbData.support.address.en} 
                        onChange={(e) => {
                          const updated = { ...dbData };
                          updated.support.address.en = e.target.value;
                          setDbData(updated);
                        }}
                        required 
                      />
                    </div>
                  </div>

                  {/* Main slides edit list */}
                  <div className="slides-edit-container">
                    <h3>{t('메인 비주얼 슬라이드 관리', 'Hero Slider Images & Headers')}</h3>
                    
                    {dbData.slides.map((slide: any, slideIdx: number) => (
                      <div key={slide.id} className="slide-edit-card">
                        <h4>{t(`슬라이드 #${slideIdx + 1}`, `Hero Slide #${slideIdx + 1}`)}</h4>
                        
                        <div className="form-group">
                          <label>{t('배경 이미지 주소', 'Background Image URL')}</label>
                          <input 
                            type="text" 
                            value={slide.bgImage} 
                            onChange={(e) => {
                              const updated = { ...dbData };
                              updated.slides[slideIdx].bgImage = e.target.value;
                              setDbData(updated);
                            }}
                            required 
                          />
                        </div>

                        <div className="form-row-grid">
                          <div className="form-group">
                            <label>{t('슬라이드 타이틀 (한글)', 'Title (KO)')}</label>
                            <input 
                              type="text" 
                              value={slide.title.ko} 
                              onChange={(e) => {
                                const updated = { ...dbData };
                                updated.slides[slideIdx].title.ko = e.target.value;
                                setDbData(updated);
                              }}
                              required 
                            />
                          </div>
                          <div className="form-group">
                            <label>{t('슬라이드 타이틀 (영어)', 'Title (EN)')}</label>
                            <input 
                              type="text" 
                              value={slide.title.en} 
                              onChange={(e) => {
                                const updated = { ...dbData };
                                updated.slides[slideIdx].title.en = e.target.value;
                                setDbData(updated);
                              }}
                              required 
                            />
                          </div>
                        </div>

                        <div className="form-row-grid">
                          <div className="form-group">
                            <label>{t('슬라이드 서브 타이틀 (한글)', 'Subtitle (KO)')}</label>
                            <input 
                              type="text" 
                              value={slide.subtitle.ko} 
                              onChange={(e) => {
                                const updated = { ...dbData };
                                updated.slides[slideIdx].subtitle.ko = e.target.value;
                                setDbData(updated);
                              }}
                              required 
                            />
                          </div>
                          <div className="form-group">
                            <label>{t('슬라이드 서브 타이틀 (영어)', 'Subtitle (EN)')}</label>
                            <input 
                              type="text" 
                              value={slide.subtitle.en} 
                              onChange={(e) => {
                                const updated = { ...dbData };
                                updated.slides[slideIdx].subtitle.en = e.target.value;
                                setDbData(updated);
                              }}
                              required 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    type="button" 
                    onClick={() => handleSaveAll(dbData)} 
                    className="btn-primary"
                  >
                    <Save size={14} />
                    <span>{t('전체 글로벌 설정 저장', 'Save Support & Slider')}</span>
                  </button>
                </form>
              </div>
            )}

          </main>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard-container {
          padding-top: 40px;
          padding-bottom: 80px;
          background-color: var(--bg-light);
          min-height: 90vh;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .dashboard-header h1 {
          font-family: var(--font-sans);
          font-size: 2.2rem;
          font-weight: 800;
        }

        .dashboard-header .subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
          margin-top: 4px;
        }

        .logout-btn {
          border-color: #b91c1c;
          color: #b91c1c;
        }

        .logout-btn:hover {
          background-color: #fef2f2;
          color: #b91c1c;
        }

        /* Save overlay popup */
        .save-status-overlay {
          position: fixed;
          bottom: 30px;
          right: 30px;
          padding: 16px 28px;
          border-radius: 0;
          color: var(--text-light);
          font-weight: 700;
          font-size: 0.95rem;
          box-shadow: var(--shadow-lg);
          z-index: 300;
        }

        .save-status-overlay.saving {
          background-color: var(--primary);
        }

        .save-status-overlay.saved {
          background-color: #15803d;
        }

        .save-status-overlay.error {
          background-color: #b91c1c;
        }

        /* Dashboard layout */
        .dashboard-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 40px;
          align-items: flex-start;
        }

        @media (max-width: 900px) {
          .dashboard-layout {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        .dashboard-sidebar {
          background-color: var(--bg-white);
          border: 1px solid var(--border-color);
          border-radius: 0;
          padding: 20px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: var(--shadow-sm);
        }

        .sidebar-tab {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 0;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-dark);
          transition: var(--transition-fast);
          text-align: left;
        }

        .sidebar-tab:hover {
          background-color: var(--bg-light);
          color: var(--primary);
        }

        .sidebar-tab.active {
          background-color: var(--primary);
          color: var(--text-light);
        }

        /* Content Editor panel */
        .dashboard-content-panel {
          background-color: var(--bg-white);
          border: 1px solid var(--border-color);
          border-radius: 0;
          padding: 40px;
          box-shadow: var(--shadow-sm);
        }

        @media (max-width: 600px) {
          .dashboard-content-panel {
            padding: 24px 16px;
          }
        }

        .dashboard-content-panel h2 {
          font-family: var(--font-sans);
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 30px;
          border-bottom: 2px solid var(--primary);
          padding-bottom: 12px;
        }

        /* Form setups */
        .admin-form-box {
          background-color: var(--bg-light);
          border: 1px solid var(--border-color);
          border-radius: 0;
          padding: 30px;
          margin-bottom: 40px;
        }

        .admin-form-box h3 {
          font-family: var(--font-sans);
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--primary);
        }

        .form-row-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        @media (max-width: 600px) {
          .form-row-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          border: 1px solid var(--border-color);
          border-radius: 0;
          padding: 10px 12px;
          font-family: inherit;
          font-size: 0.9rem;
          background-color: var(--bg-white);
          transition: var(--transition-fast);
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(0, 43, 91, 0.1);
        }

        /* List/Table styling */
        .admin-list-container h3 {
          font-family: var(--font-sans);
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: var(--primary);
        }

        .table-responsive {
          overflow-x: auto;
          width: 100%;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
          text-align: left;
        }

        .admin-table th,
        .admin-table td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .admin-table th {
          font-weight: 700;
          color: var(--primary);
          background-color: var(--bg-light);
        }

        .admin-table tbody tr:hover {
          background-color: rgba(0, 43, 91, 0.02);
        }

        .table-tag {
          background-color: var(--secondary-light);
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 0;
          text-transform: uppercase;
        }

        .table-title-cell {
          font-weight: 600;
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .bold-text {
          font-weight: 700;
        }

        .action-delete-btn {
          color: #b91c1c;
          transition: var(--transition-fast);
          padding: 4px;
        }

        .action-delete-btn:hover {
          color: #7f1d1d;
          transform: scale(1.15);
        }

        /* Slider elements */
        .slides-edit-container {
          margin-top: 32px;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .slide-edit-card {
          background-color: var(--bg-white);
          border: 1px solid var(--border-color);
          border-radius: 0;
          padding: 24px;
        }

        .slide-edit-card h4 {
          font-size: 1rem;
          color: var(--accent);
          margin-bottom: 16px;
          border-left: 3px solid var(--accent);
          padding-left: 10px;
        }
      `}</style>
    </PageTransition>
  );
}
