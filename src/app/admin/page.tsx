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
  HelpCircle,
  KeyRound,
  X,
  Folder,
  FolderPlus,
  Camera,
  Upload,
  Check
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'articles' | 'ministries' | 'history' | 'branches' | 'support' | 'fieldGallery'>('articles');
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

  // Password change modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currPw, setCurrPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwSubmitting, setPwSubmitting] = useState(false);

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

  const [newAlbum, setNewAlbum] = useState({
    id: '',
    titleKo: '',
    titleEn: '',
    year: '2025',
    countryKo: '',
    countryEn: '',
  });

  const [newPhoto, setNewPhoto] = useState({
    src: '',
    albumId: '',
    captionKo: '',
    captionEn: '',
  });

  const [compressingImage, setCompressingImage] = useState(false);
  const [compressStats, setCompressStats] = useState<string | null>(null);

  const [selectedMinistryId, setSelectedMinistryId] = useState('worship');

  // Auth check & Data fetch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('cncc-admin-token') || localStorage.getItem('cncc-admin-token');
      if (token !== 'authenticated') {
        router.push('/admin/login');
        return;
      }
      sessionStorage.setItem('cncc-admin-token', 'authenticated');
      localStorage.setItem('cncc-admin-token', 'authenticated');
      document.cookie = 'cncc-admin-token=authenticated; path=/; max-age=86400; SameSite=Lax';
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
      localStorage.removeItem('cncc-admin-token');
      document.cookie = 'cncc-admin-token=; path=/; max-age=0;';
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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (newPw.length < 4) {
      setPwError('새 비밀번호는 최소 4자리 이상이어야 합니다.');
      return;
    }

    if (newPw !== confirmPw) {
      setPwError('새 비밀번호와 확인 입력이 일치하지 않습니다.');
      return;
    }

    setPwSubmitting(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currPw,
          newPassword: newPw,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPwSuccess('비밀번호가 성공적으로 변경되었습니다!');
        setTimeout(() => {
          setShowPasswordModal(false);
          setCurrPw('');
          setNewPw('');
          setConfirmPw('');
          setPwSuccess('');
        }, 1200);
      } else {
        setPwError(data.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (err) {
      setPwError('비밀번호 변경 중 네트워크 오류가 발생했습니다.');
    } finally {
      setPwSubmitting(false);
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

  // Helper: Compress an image file to WebP data URL
  const compressImageFile = (file: File, maxDim = 1600, quality = 0.82): Promise<{ dataUrl: string; origKb: number; compKb: number }> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('이미지 파일만 업로드할 수 있습니다.'));
        return;
      }

      const origKb = Math.round(file.size / 1024);
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new (window as any).Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('캔버스 생성 실패'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/webp', quality);
          const compKb = Math.round((dataUrl.length * 3) / 4 / 1024);
          resolve({ dataUrl, origKb, compKb });
        };
        img.onerror = () => reject(new Error('이미지 로드 실패'));
        img.src = event.target?.result as string;
      };

      reader.onerror = () => reject(new Error('파일 읽기 실패'));
      reader.readAsDataURL(file);
    });
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

  // ================= Field Gallery Handlers =================
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressingImage(true);
    setCompressStats('이미지 WebP 변환 및 압축 중...');

    try {
      const res = await compressImageFile(file, 1600, 0.82);
      setNewPhoto((prev) => ({ ...prev, src: res.dataUrl }));
      const savedPct = Math.max(0, Math.round((1 - res.compKb / res.origKb) * 100));
      setCompressStats(`✅ WebP 변환 완료! (${res.origKb}KB → ${res.compKb}KB, 약 ${savedPct}% 절감)`);
    } catch (err: any) {
      alert(err.message || '이미지 압축 중 오류가 발생했습니다.');
    } finally {
      setCompressingImage(false);
    }
  };

  // Handler: Upload thumbnail for Article
  const handleArticleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await compressImageFile(file, 1400, 0.82);
      setNewArticle((prev) => ({ ...prev, thumbnail: res.dataUrl }));
    } catch (err: any) {
      alert(err.message || '이미지 처리 실패');
    }
  };

  // Handler: Upload thumbnail for Ministry
  const handleMinistryThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await compressImageFile(file, 1600, 0.82);
      handleUpdateMinistry('thumbnail', res.dataUrl);
    } catch (err: any) {
      alert(err.message || '이미지 처리 실패');
    }
  };

  // Handler: Upload photo for Ministry detail gallery
  const handleMinistryGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const captionKo = prompt('사진 설명을 입력하세요:', '사역 현장 사진');

    try {
      const res = await compressImageFile(file, 1400, 0.82);
      const curGallery = currentMinistry?.gallery || [];
      const newGallery = [
        ...curGallery,
        { src: res.dataUrl, caption: { ko: captionKo || '', en: captionKo || '' } }
      ];
      handleUpdateMinistry('gallery', newGallery);
    } catch (err: any) {
      alert(err.message || '이미지 처리 실패');
    }
  };

  const handleAddAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbum.titleKo.trim()) {
      alert('앨범 제목을 입력해 주세요.');
      return;
    }
    const albumId = newAlbum.id.trim() || `album-${Date.now()}`;
    const curAlbums = dbData?.fieldGallery?.albums || [];
    const newAlbumObj = {
      id: albumId,
      title: { ko: newAlbum.titleKo.trim(), en: newAlbum.titleEn.trim() || newAlbum.titleKo.trim() },
      year: newAlbum.year ? parseInt(newAlbum.year, 10) || newAlbum.year : undefined,
      country: newAlbum.countryKo.trim()
        ? { ko: newAlbum.countryKo.trim(), en: newAlbum.countryEn.trim() || newAlbum.countryKo.trim() }
        : undefined,
    };
    const updated = {
      ...dbData,
      fieldGallery: {
        ...(dbData?.fieldGallery || {}),
        albums: [...curAlbums, newAlbumObj],
        photos: dbData?.fieldGallery?.photos || [],
      },
    };
    setDbData(updated);
    setNewAlbum({ id: '', titleKo: '', titleEn: '', year: '2025', countryKo: '', countryEn: '' });
  };

  const handleDeleteAlbum = (albumId: string) => {
    if (!confirm('이 앨범을 삭제하시겠습니까? (소속된 사진의 앨범 분류도 해제됩니다)')) return;
    const curAlbums = dbData?.fieldGallery?.albums || [];
    const curPhotos = dbData?.fieldGallery?.photos || [];
    const updated = {
      ...dbData,
      fieldGallery: {
        ...(dbData?.fieldGallery || {}),
        albums: curAlbums.filter((a: any) => a.id !== albumId),
        photos: curPhotos.map((p: any) => (p.albumId === albumId ? { ...p, albumId: undefined } : p)),
      },
    };
    setDbData(updated);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.src.trim()) {
      alert('사진 이미지 경로(또는 웹 URL)를 입력해 주세요.');
      return;
    }
    const curPhotos = dbData?.fieldGallery?.photos || [];
    const newPhotoObj = {
      id: `photo-${Date.now()}`,
      src: newPhoto.src.trim(),
      albumId: newPhoto.albumId || undefined,
      caption: newPhoto.captionKo.trim()
        ? { ko: newPhoto.captionKo.trim(), en: newPhoto.captionEn.trim() || newPhoto.captionKo.trim() }
        : undefined,
    };
    const updated = {
      ...dbData,
      fieldGallery: {
        ...(dbData?.fieldGallery || {}),
        albums: dbData?.fieldGallery?.albums || [],
        photos: [newPhotoObj, ...curPhotos],
      },
    };
    setDbData(updated);
    setNewPhoto({ src: '', albumId: newPhoto.albumId, captionKo: '', captionEn: '' });
    setCompressStats(null);
  };

  const handleDeletePhoto = (photoId: string) => {
    if (!confirm('이 사진을 갤러리에서 삭제하시겠습니까?')) return;
    const curPhotos = dbData?.fieldGallery?.photos || [];
    const updated = {
      ...dbData,
      fieldGallery: {
        ...(dbData?.fieldGallery || {}),
        photos: curPhotos.filter((p: any) => p.id !== photoId),
      },
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
            <button
              onClick={() => {
                setShowPasswordModal(true);
                setPwError('');
                setPwSuccess('');
                setCurrPw('');
                setNewPw('');
                setConfirmPw('');
              }}
              className="action-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                backgroundColor: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1',
                cursor: 'pointer'
              }}
            >
              <KeyRound size={15} />
              <span>비밀번호 변경</span>
            </button>
            <Link
              href="/?preview=admin"
              target="_blank"
              className="action-btn view-site"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                textDecoration: 'none'
              }}
            >
              <ExternalLink size={15} />
              <span>사이트 실시간 미리보기 (점검 우회)</span>
            </Link>
            <button onClick={handleLogout} className="action-btn logout">
              <LogOut size={16} />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </header>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '420px',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowPasswordModal(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#002B5B', marginBottom: '8px' }}>
              관리자 비밀번호 변경
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px' }}>
              새로운 관리자 비밀번호를 설정합니다. 변경 후 즉시 Supabase DB에 영구 적용됩니다.
            </p>

            {pwError && (
              <div style={{
                backgroundColor: '#fef2f2',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '14px'
              }}>
                {pwError}
              </div>
            )}

            {pwSuccess && (
              <div style={{
                backgroundColor: '#f0fdf4',
                color: '#166534',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '14px'
              }}>
                {pwSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  value={currPw}
                  onChange={(e) => setCurrPw(e.target.value)}
                  required
                  placeholder="현재 비밀번호 입력"
                  style={{
                    width: '100%',
                    height: '42px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0 12px',
                    fontSize: '0.92rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  새 비밀번호 (최소 4자리)
                </label>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  required
                  minLength={4}
                  placeholder="새로운 비밀번호"
                  style={{
                    width: '100%',
                    height: '42px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0 12px',
                    fontSize: '0.92rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  required
                  placeholder="새로운 비밀번호 재입력"
                  style={{
                    width: '100%',
                    height: '42px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0 12px',
                    fontSize: '0.92rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  style={{
                    flex: 1,
                    height: '42px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={pwSubmitting}
                  style={{
                    flex: 2,
                    height: '42px',
                    backgroundColor: '#002B5B',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {pwSubmitting ? '저장 중...' : '비밀번호 변경하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              onClick={() => setActiveTab('fieldGallery')}
              className={`nav-btn ${activeTab === 'fieldGallery' ? 'active' : ''}`}
            >
              <ImageIcon size={18} />
              <span>현장 갤러리</span>
              <span className="count-tag">{dbData?.fieldGallery?.photos?.length || 0}</span>
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
                {activeTab === 'fieldGallery' && '선교 현장 갤러리 관리 (폴더 및 사진)'}
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
                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>게시글 대표 썸네일 첨부 *</span>
                      <span style={{ fontSize: '0.78rem', color: '#002B5B', fontWeight: 600 }}>WebP 자동 압축 적용됨</span>
                    </label>
                    <div
                      style={{
                        border: '2px dashed #cbd5e1',
                        borderRadius: '10px',
                        padding: '16px',
                        backgroundColor: '#f8fafc',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                      onClick={() => document.getElementById('article-thumb-input')?.click()}
                    >
                      <input
                        id="article-thumb-input"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleArticleThumbUpload}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#002B5B' }}>
                        <Upload size={18} />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>클릭하여 대표 이미지 파일을 선택하세요</span>
                      </div>
                    </div>
                    {newArticle.thumbnail && (
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={newArticle.thumbnail} alt="미리보기" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>대표 이미지가 선택되었습니다.</span>
                      </div>
                    )}
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
                      <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>대표 썸네일 이미지 파일 첨부</span>
                        <span style={{ fontSize: '0.78rem', color: '#002B5B', fontWeight: 600 }}>WebP 자동 압축 적용됨</span>
                      </label>
                      <div
                        style={{
                          border: '2px dashed #cbd5e1',
                          borderRadius: '10px',
                          padding: '16px',
                          backgroundColor: '#f8fafc',
                          cursor: 'pointer',
                          textAlign: 'center',
                        }}
                        onClick={() => document.getElementById('ministry-thumb-input')?.click()}
                      >
                        <input
                          id="ministry-thumb-input"
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleMinistryThumbUpload}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#002B5B' }}>
                          <Upload size={18} />
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>클릭하여 사역 대표 이미지 파일을 선택하세요</span>
                        </div>
                      </div>
                      {currentMinistry.thumbnail && (
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={currentMinistry.thumbnail} alt="미리보기" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>대표 이미지가 적용되어 있습니다.</span>
                        </div>
                      )}
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
                      <button
                        type="button"
                        onClick={() => document.getElementById('ministry-gallery-input')?.click()}
                        className="btn-secondary-admin"
                      >
                        <input
                          id="ministry-gallery-input"
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleMinistryGalleryUpload}
                        />
                        <Upload size={16} />
                        <span>사진 파일 첨부</span>
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

          {/* TAB 6: FIELD GALLERY (선교 현장 갤러리 - 앨범/폴더 및 사진 관리) */}
          {activeTab === 'fieldGallery' && (
            <div className="tab-content">
              {/* 1. Album / Folder Management */}
              <div className="admin-card">
                <div className="card-header">
                  <div className="card-title">
                    <FolderPlus size={20} color="#002B5B" />
                    <span>선교지 앨범(폴더) 생성 및 관리</span>
                  </div>
                </div>

                <form onSubmit={handleAddAlbum} style={{ marginBottom: '28px' }}>
                  <div className="form-grid">
                    <div className="form-field">
                      <label>앨범 제목 (한글) *</label>
                      <input
                        type="text"
                        placeholder="예: 2025 필리핀 선교"
                        value={newAlbum.titleKo}
                        onChange={(e) => setNewAlbum({ ...newAlbum, titleKo: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>앨범 제목 (영문)</label>
                      <input
                        type="text"
                        placeholder="예: 2025 Philippines Mission"
                        value={newAlbum.titleEn}
                        onChange={(e) => setNewAlbum({ ...newAlbum, titleEn: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field">
                      <label>진행 연도</label>
                      <input
                        type="text"
                        placeholder="예: 2025"
                        value={newAlbum.year}
                        onChange={(e) => setNewAlbum({ ...newAlbum, year: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field">
                      <label>선교 국가 (한글)</label>
                      <input
                        type="text"
                        placeholder="예: 필리핀, 멕시코, 브라질"
                        value={newAlbum.countryKo}
                        onChange={(e) => setNewAlbum({ ...newAlbum, countryKo: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="action-btn-primary">
                      <Plus size={16} />
                      <span>새 앨범(폴더) 생성</span>
                    </button>
                  </div>
                </form>

                {/* Album Table */}
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>앨범 제목</th>
                        <th>연도</th>
                        <th>국가</th>
                        <th>등록 사진 수</th>
                        <th style={{ textAlign: 'right' }}>관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(dbData?.fieldGallery?.albums || []).length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                            생성된 앨범이 없습니다. 위에서 필리핀, 멕시코, 브라질 등의 앨범을 생성해 보세요.
                          </td>
                        </tr>
                      ) : (
                        dbData?.fieldGallery?.albums?.map((album: any) => {
                          const count = (dbData?.fieldGallery?.photos || []).filter(
                            (p: any) => p.albumId === album.id
                          ).length;
                          return (
                            <tr key={album.id}>
                              <td style={{ fontWeight: 700, color: '#002B5B' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Folder size={16} color="#56DFCF" />
                                  <span>{album.title?.ko || album.title}</span>
                                </div>
                              </td>
                              <td style={{ color: '#64748b' }}>{album.year || '-'}</td>
                              <td style={{ color: '#64748b' }}>{album.country?.ko || '-'}</td>
                              <td>
                                <span className="count-tag">{count}장</span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAlbum(album.id)}
                                  className="del-btn"
                                  title="앨범 삭제"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. Photo Upload & Management */}
              <div className="admin-card">
                <div className="card-header">
                  <div className="card-title">
                    <Camera size={20} color="#002B5B" />
                    <span>개별 사진 등록 및 캡션 설정</span>
                  </div>
                </div>

                <form onSubmit={handleAddPhoto} style={{ marginBottom: '28px' }}>
                  <div className="form-grid">
                    {/* File Attachment & WebP Compression Upload Area */}
                    <div className="form-field full-width">
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>사진 파일 첨부 (PC/스마트폰 파일 선택) *</span>
                        <span style={{ fontSize: '0.78rem', color: '#002B5B', fontWeight: 600 }}>
                          자동 WebP 고효율 압축 변환 적용됨
                        </span>
                      </label>
                      <div
                        style={{
                          border: '2px dashed #cbd5e1',
                          borderRadius: '12px',
                          padding: '24px 20px',
                          backgroundColor: '#f8fafc',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                        }}
                        onClick={() => document.getElementById('photo-file-input')?.click()}
                      >
                        <input
                          id="photo-file-input"
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleFileUpload}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '50%',
                              backgroundColor: '#e0f2fe',
                              color: '#0284c7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Upload size={22} />
                          </div>
                          <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                            여기를 클릭하여 사진 파일을 선택하세요
                          </span>
                          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                            JPG, PNG, HEIC 등 모든 이미지가 <strong>고화질 WebP</strong>로 즉시 자동 압축됩니다
                          </span>
                        </div>
                      </div>

                      {/* Compression Feedback Status */}
                      {compressStats && (
                        <div
                          style={{
                            marginTop: '10px',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            backgroundColor: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            color: '#15803d',
                            fontSize: '0.86rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Check size={16} />
                          <span>{compressStats}</span>
                        </div>
                      )}

                      {/* Preview Thumbnail if selected */}
                      {newPhoto.src && (
                        <div
                          style={{
                            marginTop: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={newPhoto.src}
                            alt="미리보기"
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                              선택된 이미지 미리보기 (WebP 변환 완료)
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', wordBreak: 'break-all' }}>
                              {newPhoto.src.startsWith('data:') ? 'Base64 WebP 인코딩 완료' : newPhoto.src}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewPhoto((prev) => ({ ...prev, src: '' }));
                              setCompressStats(null);
                            }}
                            className="del-btn"
                            title="사진 취소"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="form-field">
                      <label>소속 앨범(폴더) 선택</label>
                      <select
                        value={newPhoto.albumId}
                        onChange={(e) => setNewPhoto({ ...newPhoto, albumId: e.target.value })}
                        className="form-input"
                      >
                        <option value="">(미지정 - 전체 사진에만 노출)</option>
                        {(dbData?.fieldGallery?.albums || []).map((album: any) => (
                          <option key={album.id} value={album.id}>
                            {album.title?.ko || album.title} {album.year ? `(${album.year})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field">
                      <label>개별 사진 설명 / 캡션</label>
                      <input
                        type="text"
                        placeholder="예: '25년도 멕시코 현장 사역"
                        value={newPhoto.captionKo}
                        onChange={(e) => setNewPhoto({ ...newPhoto, captionKo: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      className="action-btn-primary"
                      disabled={compressingImage || !newPhoto.src}
                      style={{ opacity: compressingImage || !newPhoto.src ? 0.6 : 1 }}
                    >
                      <Plus size={16} />
                      <span>{compressingImage ? '압축 처리 중...' : '사진 등록'}</span>
                    </button>
                  </div>
                </form>

                {/* Photo Grid */}
                <div className="gallery-admin-grid">
                  {(dbData?.fieldGallery?.photos || []).length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                      등록된 현장 사진이 없습니다. 위에서 사진을 등록해 보세요.
                    </div>
                  ) : (
                    dbData?.fieldGallery?.photos?.map((photo: any) => {
                      const album = (dbData?.fieldGallery?.albums || []).find((a: any) => a.id === photo.albumId);
                      return (
                        <div key={photo.id} className="gallery-admin-card">
                          <div className="gallery-preview">
                            <Image
                              src={photo.src}
                              alt={photo.caption?.ko || '현장 사진'}
                              width={320}
                              height={200}
                              unoptimized
                              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            />
                            <button
                              type="button"
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="gallery-del-btn"
                              title="사진 삭제"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div style={{ padding: '10px 12px' }}>
                            {album && (
                              <span
                                style={{
                                  display: 'inline-block',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: '#002B5B',
                                  backgroundColor: '#e2e8f0',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  marginBottom: '4px',
                                }}
                              >
                                {album.title?.ko || album.title}
                              </span>
                            )}
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
                              {photo.caption?.ko || '(설명 없음)'}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
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
