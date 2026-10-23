'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, LayoutGroup, MotionConfig, motion, type PanInfo } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Folder, ImageIcon, LayoutGrid, Maximize2, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { PageTransition, ScrollReveal, TextReveal } from '@/components/FramerTransitions';
import { ShaderBackground } from '@/components/ShaderImage';
import SemanticText from '@/components/SemanticText';

/* -------------------------------------------------------------------------- */
/*  Data model                                                                */
/*  /api/content → `fieldGallery` 필드 (없으면 빈 갤러리로 표시됩니다)            */
/*                                                                            */
/*  fieldGallery: {                                                           */
/*    albums: [{ id, title:{ko,en}, year?, country?:{ko,en}, description? }], */
/*    photos: [{ id, src, albumId?, caption?:{ko,en}, width?, height? }]      */
/*  }                                                                         */
/* -------------------------------------------------------------------------- */

type LocalizedText = { ko: string; en: string };

type GalleryAlbum = {
  id: string;
  title: LocalizedText;
  year?: number | string;
  country?: LocalizedText;
  description?: LocalizedText;
  cover?: string;
};

type GalleryPhoto = {
  id: string;
  src: string;
  albumId?: string;
  caption?: LocalizedText;
  width?: number;
  height?: number;
};

type FieldGallery = {
  albums: GalleryAlbum[];
  photos: GalleryPhoto[];
};

type ViewMode = 'albums' | 'photos';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*  Hooks                                                                     */
/* -------------------------------------------------------------------------- */

function useColumnCount() {
  const [count, setCount] = useState(4);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setCount(w < 520 ? 1 : w < 900 ? 2 : w < 1200 ? 3 : 4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return count;
}

/** Distribute photos into balanced masonry columns (shortest column first). */
function distribute<T extends { width?: number; height?: number }>(items: T[], columns: number) {
  const cols: { item: T; index: number }[][] = Array.from({ length: columns }, () => []);
  const heights = new Array(columns).fill(0);
  items.forEach((item, index) => {
    const ratio = item.width && item.height ? item.height / item.width : 1;
    const target = heights.indexOf(Math.min(...heights));
    cols[target].push({ item, index });
    heights[target] += ratio + 0.28; // caption block
  });
  return cols;
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function FieldGalleryPage() {
  const { t, d } = useLanguage();
  const [gallery, setGallery] = useState<FieldGallery>({ albums: [], photos: [] });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>('albums');
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [lightbox, setLightbox] = useState<{ index: number; direction: number } | null>(null);
  const columns = useColumnCount();

  useEffect(() => {
    fetch('/api/content')
      .then((res) => res.json())
      .then((data) => {
        const fg = data?.fieldGallery;
        setGallery({
          albums: Array.isArray(fg?.albums) ? fg.albums : [],
          photos: Array.isArray(fg?.photos) ? fg.photos : [],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching field gallery:', err);
        setLoading(false);
      });
  }, []);

  // Deep-link support: /gallery#album-id
  useEffect(() => {
    if (loading) return;
    const hash = decodeURIComponent(window.location.hash.replace('#', ''));
    if (hash && gallery.albums.some((a) => a.id === hash)) {
      const timeoutId = window.setTimeout(() => setActiveAlbumId(hash), 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, [loading, gallery.albums]);

  const albumMap = useMemo(() => new Map(gallery.albums.map((a) => [a.id, a])), [gallery.albums]);

  const photosByAlbum = useMemo(() => {
    const map = new Map<string, GalleryPhoto[]>();
    gallery.photos.forEach((p) => {
      const key = p.albumId ?? '__none__';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return map;
  }, [gallery.photos]);

  const activeAlbum = activeAlbumId ? albumMap.get(activeAlbumId) ?? null : null;

  const visiblePhotos = useMemo(() => {
    if (activeAlbum) return photosByAlbum.get(activeAlbum.id) ?? [];
    if (view === 'photos' && filter !== 'all') return photosByAlbum.get(filter) ?? [];
    return gallery.photos;
  }, [activeAlbum, view, filter, photosByAlbum, gallery.photos]);

  const albumLabel = useCallback(
    (album?: GalleryAlbum | null) => {
      if (!album) return '';
      return d(album.title);
    },
    [d]
  );

  const photoMeta = useCallback(
    (photo: GalleryPhoto) => {
      const album = photo.albumId ? albumMap.get(photo.albumId) : undefined;
      if (!album) return '';
      const parts = [album.year ? String(album.year) : '', album.country ? d(album.country) : ''].filter(Boolean);
      return parts.length ? parts.join(' · ') : d(album.title);
    },
    [albumMap, d]
  );

  const openAlbum = (id: string) => {
    setActiveAlbumId(id);
    window.history.replaceState(null, '', `#${encodeURIComponent(id)}`);
    window.scrollTo({ top: document.getElementById('gallery-stage')?.offsetTop ?? 0, behavior: 'smooth' });
  };

  const closeAlbum = () => {
    setActiveAlbumId(null);
    window.history.replaceState(null, '', window.location.pathname);
  };

  const switchView = (mode: ViewMode) => {
    setView(mode);
    if (activeAlbumId) closeAlbum();
  };

  const isEmpty = !loading && gallery.photos.length === 0;

  return (
    <MotionConfig reducedMotion="user">
      <PageTransition>
        {/* Hero */}
        <section className="fg-hero">
          <ShaderBackground image="/images/global-mission-16x9-depth-v2.png" overlay="rgba(246, 245, 239, 0.7)" />
          <div className="container fg-hero-inner">
            <ScrollReveal>
              <nav className="fg-crumbs" aria-label="Breadcrumb">
                <Link href="/">{t('홈', 'Home')}</Link>
                <span>/</span>
                <Link href="/about#pillars">{t('사역', 'Ministries')}</Link>
                <span>/</span>
                <span className="fg-current">{t('현장 갤러리', 'Field Gallery')}</span>
              </nav>
              <span className="banner-tag">{t('선교 현장 갤러리', 'MISSION FIELD GALLERY')}</span>
              <TextReveal as="h1" lines={[t('현장에서 만난', 'Moments from'), t('은혜의 순간들', 'the Mission Field')]} />
              <SemanticText as="p" className="banner-desc">
                {t(
                  '열방의 선교 현장에서 함께 예배하고 섬겼던 시간들을 사진으로 기록합니다. 국가와 연도별 앨범으로 모아 보거나, 모든 사진을 한눈에 둘러보세요.',
                  'A visual record of worship and service across the nations. Browse by country and year, or explore every photo at once.'
                )}
              </SemanticText>
            </ScrollReveal>

            {!loading && !isEmpty && (
              <motion.dl
                className="fg-hero-stats"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
              >
                <div>
                  <dt>{t('앨범', 'Albums')}</dt>
                  <dd>{String(gallery.albums.length).padStart(2, '0')}</dd>
                </div>
                <div>
                  <dt>{t('사진', 'Photos')}</dt>
                  <dd>{String(gallery.photos.length).padStart(2, '0')}</dd>
                </div>
              </motion.dl>
            )}
          </div>
        </section>

        {/* Toolbar */}
        <div className="fg-toolbar">
          <div className="container fg-toolbar-inner">
            <LayoutGroup id="fg-view">
              <div className="fg-segment" role="tablist" aria-label={t('보기 방식', 'View mode')}>
                {([
                  { key: 'albums', label: t('앨범', 'Albums'), icon: <Folder size={15} strokeWidth={1.9} /> },
                  { key: 'photos', label: t('전체 사진', 'All Photos'), icon: <LayoutGrid size={15} strokeWidth={1.9} /> },
                ] as const).map((tab) => {
                  const active = view === tab.key && !(tab.key === 'photos' && activeAlbum);
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      className={`fg-segment-btn ${active ? 'active' : ''}`}
                      onClick={() => switchView(tab.key)}
                    >
                      {active && (
                        <motion.span
                          layoutId="fg-segment-pill"
                          className="fg-segment-pill"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="fg-segment-label">
                        {tab.icon}
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>

            <AnimatePresence mode="wait" initial={false}>
              {view === 'photos' && !activeAlbum && gallery.albums.length > 0 && (
                <motion.div
                  key="filters"
                  className="fg-filters"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <LayoutGroup id="fg-filter">
                    {[{ id: 'all', label: t('전체', 'All') }, ...gallery.albums.map((a) => ({ id: a.id, label: albumLabel(a) }))].map(
                      (chip) => (
                        <button
                          key={chip.id}
                          type="button"
                          className={`fg-chip ${filter === chip.id ? 'active' : ''}`}
                          onClick={() => setFilter(chip.id)}
                        >
                          {chip.label}
                          {filter === chip.id && (
                            <motion.span
                              layoutId="fg-chip-underline"
                              className="fg-chip-underline"
                              transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                            />
                          )}
                        </button>
                      )
                    )}
                  </LayoutGroup>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stage */}
        <section className="fg-stage" id="gallery-stage">
          <div className="container">
            {loading ? (
              <GhostMasonry columns={columns} shimmer />
            ) : isEmpty ? (
              <EmptyState columns={columns} />
            ) : (
              <AnimatePresence mode="wait">
                {activeAlbum ? (
                  <motion.div
                    key={`album-${activeAlbum.id}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <div className="fg-album-head">
                      <button type="button" className="fg-back" onClick={closeAlbum}>
                        <ArrowLeft size={16} />
                        <span>{t('전체 앨범', 'All Albums')}</span>
                      </button>
                      <div className="fg-album-head-text">
                        <span className="fg-album-eyebrow">
                          {[activeAlbum.year, activeAlbum.country ? d(activeAlbum.country) : ''].filter(Boolean).join(' · ')}
                        </span>
                        <h2>{d(activeAlbum.title)}</h2>
                        {activeAlbum.description && <SemanticText as="p">{d(activeAlbum.description)}</SemanticText>}
                      </div>
                      <span className="fg-album-count">
                        {visiblePhotos.length}
                        <small>{t('장', ' photos')}</small>
                      </span>
                    </div>
                    <Masonry
                      photos={visiblePhotos}
                      columns={columns}
                      meta={photoMeta}
                      onOpen={(index) => setLightbox({ index, direction: 0 })}
                    />
                  </motion.div>
                ) : view === 'albums' ? (
                  <motion.div
                    key="albums"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <AlbumGrid
                      albums={gallery.albums}
                      photosByAlbum={photosByAlbum}
                      onOpen={openAlbum}
                      fallbackPhotos={photosByAlbum.get('__none__') ?? []}
                      onOpenLoose={() => switchView('photos')}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`photos-${filter}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    {visiblePhotos.length === 0 ? (
                      <p className="fg-inline-empty">{t('이 앨범에는 아직 사진이 없습니다.', 'No photos in this album yet.')}</p>
                    ) : (
                      <Masonry
                        photos={visiblePhotos}
                        columns={columns}
                        meta={photoMeta}
                        onOpen={(index) => setLightbox({ index, direction: 0 })}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </section>

        <Lightbox
          photos={visiblePhotos}
          state={lightbox}
          onChange={setLightbox}
          meta={photoMeta}
        />

        <GalleryStyles />
      </PageTransition>
    </MotionConfig>
  );
}

/* -------------------------------------------------------------------------- */
/*  Masonry                                                                   */
/* -------------------------------------------------------------------------- */

function Masonry({
  photos,
  columns,
  meta,
  onOpen,
}: {
  photos: GalleryPhoto[];
  columns: number;
  meta: (p: GalleryPhoto) => string;
  onOpen: (index: number) => void;
}) {
  const cols = useMemo(() => distribute(photos, columns), [photos, columns]);
  return (
    <div className="fg-masonry" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {cols.map((col, ci) => (
        <div key={ci} className="fg-masonry-col">
          {col.map(({ item, index }, ri) => (
            <PhotoTile
              key={item.id}
              photo={item}
              meta={meta(item)}
              delay={Math.min(ci * 0.06 + ri * 0.04, 0.4)}
              onOpen={() => onOpen(index)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function PhotoTile({
  photo,
  meta,
  delay,
  onOpen,
}: {
  photo: GalleryPhoto;
  meta: string;
  delay: number;
  onOpen: () => void;
}) {
  const { d, t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const caption = photo.caption ? d(photo.caption) : '';

  return (
    <motion.figure
      className="fg-tile"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      <button type="button" className="fg-tile-media" onClick={onOpen} aria-label={caption || t('사진 크게 보기', 'View photo')}>
        <motion.span
          className="fg-tile-curtain"
          initial={{ scaleY: 1 }}
          whileInView={{ scaleY: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.9, delay: delay + 0.1, ease: [0.76, 0, 0.24, 1] }}
        />
        <Image
          src={photo.src}
          alt={caption || meta || 'CNCC mission field photo'}
          width={photo.width ?? 1200}
          height={photo.height ?? 900}
          unoptimized
          sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, 25vw"
          className={`fg-tile-img ${loaded ? 'is-loaded' : ''}`}
          onLoad={() => setLoaded(true)}
        />
        <span className="fg-tile-hover" aria-hidden="true">
          <Maximize2 size={18} strokeWidth={1.8} />
        </span>
      </button>
      {(caption || meta) && (
        <figcaption className="fg-tile-caption">
          {caption && <strong>{caption}</strong>}
          {meta && <span>{meta}</span>}
        </figcaption>
      )}
    </motion.figure>
  );
}

/* -------------------------------------------------------------------------- */
/*  Albums (folders)                                                          */
/* -------------------------------------------------------------------------- */

function AlbumGrid({
  albums,
  photosByAlbum,
  onOpen,
  fallbackPhotos,
  onOpenLoose,
}: {
  albums: GalleryAlbum[];
  photosByAlbum: Map<string, GalleryPhoto[]>;
  onOpen: (id: string) => void;
  fallbackPhotos: GalleryPhoto[];
  onOpenLoose: () => void;
}) {
  const { t, d } = useLanguage();
  return (
    <div className="fg-albums">
      {albums.map((album, i) => {
        const photos = photosByAlbum.get(album.id) ?? [];
        const covers = album.cover ? [{ id: 'cover', src: album.cover }, ...photos].slice(0, 3) : photos.slice(0, 3);
        return (
          <motion.button
            key={album.id}
            type="button"
            className="fg-album"
            onClick={() => onOpen(album.id)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, delay: Math.min(i * 0.08, 0.4), ease: EASE }}
            whileHover="hover"
          >
            <div className="fg-album-stack">
              {[2, 1, 0].map((layer) => {
                const cover = covers[layer];
                return (
                  <motion.div
                    key={layer}
                    className={`fg-album-layer layer-${layer}`}
                    variants={{
                      hover: {
                        rotate: layer === 0 ? 0 : layer === 1 ? -5 : 6,
                        x: layer === 0 ? 0 : layer === 1 ? -18 : 18,
                        y: layer === 0 ? -6 : -14,
                        scale: layer === 0 ? 1.02 : 0.96,
                      },
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  >
                    {cover ? (
                      <Image src={cover.src} alt="" fill unoptimized sizes="(max-width: 900px) 50vw, 33vw" className="fg-album-img" />
                    ) : (
                      <span className="fg-album-placeholder">
                        <ImageIcon size={layer === 0 ? 28 : 0} strokeWidth={1.4} />
                      </span>
                    )}
                  </motion.div>
                );
              })}
              <span className="fg-album-badge">
                {photos.length}
                <small>{t('장', '')}</small>
              </span>
            </div>
            <div className="fg-album-info">
              <span className="fg-album-meta">
                {[album.year, album.country ? d(album.country) : ''].filter(Boolean).join(' · ')}
              </span>
              <h3>{d(album.title)}</h3>
              <span className="fg-album-cta">
                {t('앨범 열기', 'Open album')}
                <ChevronRight size={14} />
              </span>
            </div>
          </motion.button>
        );
      })}

      {fallbackPhotos.length > 0 && (
        <button type="button" className="fg-album fg-album-loose" onClick={onOpenLoose}>
          <div className="fg-album-stack">
            <div className="fg-album-layer layer-0">
              <Image src={fallbackPhotos[0].src} alt="" fill unoptimized sizes="33vw" className="fg-album-img" />
            </div>
          </div>
          <div className="fg-album-info">
            <span className="fg-album-meta">{t('분류되지 않음', 'Unsorted')}</span>
            <h3>{t('기타 현장 사진', 'Other Field Photos')}</h3>
          </div>
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Lightbox                                                                  */
/* -------------------------------------------------------------------------- */

function Lightbox({
  photos,
  state,
  onChange,
  meta,
}: {
  photos: GalleryPhoto[];
  state: { index: number; direction: number } | null;
  onChange: (s: { index: number; direction: number } | null) => void;
  meta: (p: GalleryPhoto) => string;
}) {
  const { t, d } = useLanguage();
  const total = photos.length;

  const go = useCallback(
    (dir: number) => {
      if (!state || total < 2) return;
      onChange({ index: (state.index + dir + total) % total, direction: dir });
    },
    [state, total, onChange]
  );

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [state, go, onChange]);

  const photo = state ? photos[state.index] : null;

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80 || info.velocity.x < -500) go(1);
    else if (info.offset.x > 80 || info.velocity.x > 500) go(-1);
  };

  return (
    <AnimatePresence>
      {state && photo && (
        <motion.div
          className="fg-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t('사진 보기', 'Photo viewer')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          onClick={() => onChange(null)}
        >
          <div className="fg-lb-top" onClick={(e) => e.stopPropagation()}>
            <span className="fg-lb-counter">
              <motion.span key={state.index} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                {String(state.index + 1).padStart(2, '0')}
              </motion.span>
              <i />
              {String(total).padStart(2, '0')}
            </span>
            <button type="button" className="fg-lb-btn" onClick={() => onChange(null)} aria-label={t('닫기', 'Close')}>
              <X size={22} />
            </button>
          </div>

          <div className="fg-lb-stage">
            <AnimatePresence initial={false} custom={state.direction} mode="popLayout">
              <motion.div
                key={photo.id}
                className="fg-lb-frame"
                custom={state.direction}
                variants={{
                  enter: (dir: number) => ({ opacity: 0, x: dir * 80, scale: dir === 0 ? 0.94 : 1, filter: 'blur(8px)' }),
                  center: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' },
                  exit: (dir: number) => ({ opacity: 0, x: dir * -80, filter: 'blur(8px)' }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: EASE }}
                drag={total > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={onDragEnd}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={photo.src}
                  alt={photo.caption ? d(photo.caption) : meta(photo)}
                  width={photo.width ?? 1600}
                  height={photo.height ?? 1200}
                  unoptimized
                  className="fg-lb-img"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {total > 1 && (
              <>
                <button
                  type="button"
                  className="fg-lb-btn fg-lb-nav prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  aria-label={t('이전 사진', 'Previous photo')}
                >
                  <ChevronLeft size={26} />
                </button>
                <button
                  type="button"
                  className="fg-lb-btn fg-lb-nav next"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  aria-label={t('다음 사진', 'Next photo')}
                >
                  <ChevronRight size={26} />
                </button>
              </>
            )}
          </div>

          <div className="fg-lb-bottom" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait">
              <motion.div
                key={photo.id}
                className="fg-lb-caption"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                {photo.caption && <strong>{d(photo.caption)}</strong>}
                {meta(photo) && <span>{meta(photo)}</span>}
              </motion.div>
            </AnimatePresence>

            {total > 1 && (
              <div className="fg-lb-thumbs">
                {photos.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`fg-lb-thumb ${i === state.index ? 'active' : ''}`}
                    onClick={() => onChange({ index: i, direction: i > state.index ? 1 : -1 })}
                    aria-label={`${i + 1}`}
                  >
                    <Image src={p.src} alt="" fill unoptimized sizes="64px" />
                    {i === state.index && (
                      <motion.span layoutId="fg-thumb-ring" className="fg-lb-thumb-ring" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/*  Empty / loading states                                                    */
/* -------------------------------------------------------------------------- */

const GHOST_HEIGHTS = [
  [1.35, 0.8, 1.1],
  [0.7, 1.25, 0.9],
  [1, 0.75, 1.3],
  [0.85, 1.15, 0.8],
];

function GhostMasonry({ columns, shimmer = false }: { columns: number; shimmer?: boolean }) {
  return (
    <div
      className={`fg-masonry fg-ghost ${shimmer ? 'is-shimmer' : ''}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      aria-hidden="true"
    >
      {GHOST_HEIGHTS.slice(0, columns).map((col, ci) => (
        <div key={ci} className="fg-masonry-col">
          {col.map((h, ri) => (
            <motion.div
              key={ri}
              className="fg-ghost-tile"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: ci * 0.08 + ri * 0.1, ease: EASE }}
            >
              <div className="fg-ghost-img" style={{ paddingBottom: `${h * 100}%` }} />
              <div className="fg-ghost-line w-70" />
              <div className="fg-ghost-line w-40" />
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

function EmptyState({ columns }: { columns: number }) {
  const { t } = useLanguage();
  return (
    <div className="fg-empty">
      <GhostMasonry columns={columns} />
      <motion.div
        className="fg-empty-card"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
      >
        <motion.span
          className="fg-empty-icon"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ImageIcon size={26} strokeWidth={1.5} />
        </motion.span>
        <h2>{t('현장 사진을 준비하고 있습니다', 'Photos are on their way')}</h2>
        <SemanticText as="p">
          {t(
            '선교 현장에서 담아온 소중한 순간들이 곧 이곳에 채워집니다. 조금만 기다려 주세요.',
            'Precious moments captured on the mission field will be shared here soon.'
          )}
        </SemanticText>
        <Link href="/ministries/missions" className="fg-empty-link">
          {t('국내외 선교 활동 보기', 'Explore our missions')}
          <ChevronRight size={15} />
        </Link>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

function GalleryStyles() {
  return (
    <style jsx global>{`
      body:has(.fg-hero) main {
        padding-top: 0;
      }
      .fg-crumbs {
        display: flex;
        gap: 8px;
        align-items: center;
        font-size: 0.82rem;
        color: var(--text-muted);
        margin-bottom: 40px;
      }
      .fg-crumbs a:hover {
        color: var(--primary-hover);
      }
      .fg-current {
        color: var(--primary-dark);
        font-weight: 600;
      }

      /* Hero */
      .fg-hero {
        position: relative;
        overflow: hidden;
        background: #f6f5ef;
        color: var(--primary-dark);
        padding: calc(var(--header-height) + 72px) 0 96px;
        border-bottom: 1px solid rgba(0, 43, 91, 0.08);
      }
      .fg-hero-inner {
        position: relative;
        z-index: 2;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 48px;
      }
      .fg-hero .banner-tag {
        color: var(--primary-dark);
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.14em;
        display: block;
        margin-bottom: 18px;
      }
      .fg-hero h1 {
        color: var(--primary-dark);
        font-size: clamp(2.4rem, 5vw, 3.8rem);
        line-height: 1.12;
        margin-bottom: 26px;
      }
      .fg-hero .banner-desc {
        color: var(--text-muted);
        font-size: 1.1rem;
        max-width: 620px;
        line-height: 1.7;
      }
      .fg-hero-stats {
        display: flex;
        gap: 40px;
        flex-shrink: 0;
      }
      .fg-hero-stats div {
        border-left: 1px solid rgba(0, 43, 91, 0.18);
        padding-left: 18px;
      }
      .fg-hero-stats dt {
        font-size: 0.75rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--text-muted);
      }
      .fg-hero-stats dd {
        font-family: var(--font-display);
        font-size: 3.4rem;
        line-height: 1;
        color: var(--primary-dark);
      }

      /* Toolbar */
      .fg-toolbar {
        position: sticky;
        top: var(--header-height);
        z-index: 40;
        background: rgba(255, 255, 255, 0.86);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(0, 43, 91, 0.08);
      }
      .fg-toolbar-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        min-height: 68px;
      }
      .fg-segment {
        display: inline-flex;
        padding: 4px;
        background: var(--secondary-light);
        border-radius: 999px;
        flex-shrink: 0;
      }
      .fg-segment-btn {
        position: relative;
        padding: 9px 18px;
        border-radius: 999px;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-muted);
        transition: color 0.25s ease;
      }
      .fg-segment-btn.active {
        color: var(--text-light);
      }
      .fg-segment-pill {
        position: absolute;
        inset: 0;
        border-radius: 999px;
        background: var(--primary-dark);
        box-shadow: 0 6px 16px -6px rgba(0, 43, 91, 0.5);
      }
      .fg-segment-label {
        position: relative;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        gap: 7px;
      }
      .fg-filters {
        display: flex;
        gap: 6px;
        overflow-x: auto;
        scrollbar-width: none;
        -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 12px, #000 calc(100% - 12px), transparent);
        mask-image: linear-gradient(90deg, transparent 0, #000 12px, #000 calc(100% - 12px), transparent);
        padding: 0 12px;
      }
      .fg-filters::-webkit-scrollbar {
        display: none;
      }
      .fg-chip {
        position: relative;
        white-space: nowrap;
        padding: 10px 12px;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-muted);
        transition: color 0.2s ease;
      }
      .fg-chip:hover,
      .fg-chip.active {
        color: var(--primary-dark);
      }
      .fg-chip-underline {
        position: absolute;
        left: 12px;
        right: 12px;
        bottom: 2px;
        height: 2px;
        border-radius: 2px;
        background: var(--primary);
      }

      /* Stage */
      .fg-stage {
        background: var(--bg-white);
        padding: 64px 0 120px;
        min-height: 60vh;
      }

      /* Masonry */
      .fg-masonry {
        display: grid;
        gap: 28px;
        align-items: start;
      }
      .fg-masonry-col {
        display: flex;
        flex-direction: column;
        gap: 36px;
        min-width: 0;
      }
      .fg-tile {
        margin: 0;
      }
      .fg-tile-media {
        position: relative;
        display: block;
        width: 100%;
        padding: 0;
        overflow: hidden;
        border-radius: 6px;
        background: var(--secondary-light);
        cursor: zoom-in;
        isolation: isolate;
      }
      .fg-tile-img {
        display: block;
        width: 100%;
        height: auto;
        opacity: 0;
        transform: scale(1.08);
        transition: opacity 0.8s ease, transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .fg-tile-img.is-loaded {
        opacity: 1;
        transform: scale(1);
      }
      .fg-tile-media:hover .fg-tile-img.is-loaded {
        transform: scale(1.045);
      }
      .fg-tile-curtain {
        position: absolute;
        inset: 0;
        z-index: 2;
        background: var(--primary-dark);
        transform-origin: top;
        pointer-events: none;
      }
      .fg-tile-hover {
        position: absolute;
        inset: 0;
        z-index: 1;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        padding: 14px;
        color: #fff;
        background: linear-gradient(180deg, transparent 55%, rgba(0, 20, 45, 0.45));
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      .fg-tile-hover svg {
        width: 36px;
        height: 36px;
        padding: 9px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.18);
        backdrop-filter: blur(6px);
        transform: translateY(8px) scale(0.85);
        transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .fg-tile-media:hover .fg-tile-hover,
      .fg-tile-media:focus-visible .fg-tile-hover {
        opacity: 1;
      }
      .fg-tile-media:hover .fg-tile-hover svg {
        transform: translateY(0) scale(1);
      }
      .fg-tile-caption {
        padding-top: 14px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .fg-tile-caption strong {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--primary-dark);
        line-height: 1.4;
      }
      .fg-tile-caption span {
        font-size: 0.8rem;
        color: var(--text-muted);
        opacity: 0.8;
      }

      /* Albums */
      .fg-albums {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 56px 40px;
      }
      .fg-album {
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 26px;
        padding: 0;
      }
      .fg-album-stack {
        position: relative;
        aspect-ratio: 4 / 3;
        margin: 18px 22px 0;
      }
      .fg-album-layer {
        position: absolute;
        inset: 0;
        border-radius: 10px;
        overflow: hidden;
        background: var(--secondary-light);
        box-shadow: 0 18px 40px -18px rgba(0, 43, 91, 0.35);
      }
      .fg-album-layer.layer-2 {
        transform: translate(10px, -14px) scale(0.92);
        background: #e8ecf1;
      }
      .fg-album-layer.layer-1 {
        transform: translate(-8px, -8px) scale(0.96);
        background: #eef1f5;
      }
      .fg-album-layer.layer-0 {
        z-index: 2;
      }
      .fg-album-img {
        object-fit: cover;
      }
      .fg-album-placeholder {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(0, 43, 91, 0.25);
      }
      .fg-album-badge {
        position: absolute;
        z-index: 3;
        right: 12px;
        bottom: 12px;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(0, 25, 52, 0.7);
        backdrop-filter: blur(8px);
        color: #fff;
        font-size: 0.8rem;
        font-weight: 600;
      }
      .fg-album-badge small {
        font-size: 0.72rem;
        margin-left: 1px;
        opacity: 0.8;
      }
      .fg-album-meta {
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        color: var(--primary-hover);
        display: block;
        margin-bottom: 6px;
        min-height: 1em;
      }
      .fg-album-info h3 {
        font-size: 1.35rem;
        font-weight: 600;
        color: var(--primary-dark);
        line-height: 1.3;
      }
      .fg-album-cta {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-top: 10px;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-muted);
        transition: color 0.25s ease, gap 0.35s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .fg-album:hover .fg-album-cta {
        color: var(--primary-dark);
        gap: 10px;
      }

      /* Album detail head */
      .fg-album-head {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: end;
        gap: 32px;
        padding-bottom: 36px;
        margin-bottom: 44px;
        border-bottom: 1px solid var(--border-color);
      }
      .fg-back {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        border: 1px solid var(--border-color);
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-dark);
        align-self: start;
        transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .fg-back:hover {
        border-color: var(--primary-dark);
        background: var(--primary-dark);
        color: #fff;
      }
      .fg-back:hover svg {
        transform: translateX(-3px);
      }
      .fg-back svg {
        transition: transform 0.3s ease;
      }
      .fg-album-eyebrow {
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        color: var(--primary-hover);
      }
      .fg-album-head h2 {
        font-size: clamp(1.8rem, 3vw, 2.6rem);
        color: var(--primary-dark);
        line-height: 1.2;
        margin-top: 6px;
      }
      .fg-album-head p {
        margin-top: 10px;
        color: var(--text-muted);
        max-width: 640px;
      }
      .fg-album-count {
        font-family: var(--font-display);
        font-size: 3rem;
        line-height: 1;
        color: var(--primary-dark);
      }
      .fg-album-count small {
        font-family: var(--font-sans);
        font-size: 0.9rem;
        margin-left: 4px;
        color: var(--text-muted);
      }
      .fg-inline-empty {
        text-align: center;
        padding: 80px 0;
        color: var(--text-muted);
      }

      /* Ghost / empty */
      .fg-ghost-tile {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .fg-ghost-img {
        border-radius: 6px;
        background: linear-gradient(135deg, #f1f4f8, #e9eef4);
        position: relative;
        overflow: hidden;
      }
      .fg-ghost-line {
        height: 10px;
        border-radius: 4px;
        background: #eef1f5;
      }
      .fg-ghost-line.w-70 {
        width: 70%;
        margin-top: 4px;
      }
      .fg-ghost-line.w-40 {
        width: 40%;
        height: 8px;
      }
      .fg-ghost.is-shimmer .fg-ghost-img::after {
        content: '';
        position: absolute;
        inset: 0;
        transform: translateX(-100%);
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
        animation: fg-shimmer 1.6s infinite;
      }
      @keyframes fg-shimmer {
        to {
          transform: translateX(100%);
        }
      }
      .fg-empty {
        position: relative;
      }
      .fg-empty .fg-ghost {
        -webkit-mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.9), transparent 85%);
        mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.9), transparent 85%);
      }
      .fg-empty-card {
        position: absolute;
        top: 120px;
        left: 50%;
        width: min(460px, calc(100% - 32px));
        margin-left: calc(min(460px, calc(100% - 32px)) / -2);
        text-align: center;
        padding: 44px 36px 38px;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid rgba(0, 43, 91, 0.08);
        border-radius: 24px;
        box-shadow: 0 30px 60px -24px rgba(0, 43, 91, 0.25);
      }
      .fg-empty-icon {
        width: 60px;
        height: 60px;
        margin: 0 auto 22px;
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-dark);
        color: var(--primary);
      }
      .fg-empty-card h2 {
        font-size: 1.35rem;
        color: var(--primary-dark);
        margin-bottom: 10px;
      }
      .fg-empty-card p {
        color: var(--text-muted);
        font-size: 0.95rem;
        line-height: 1.65;
      }
      .fg-empty-link {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-top: 22px;
        font-size: 0.88rem;
        font-weight: 600;
        color: var(--primary-dark);
        transition: gap 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .fg-empty-link:hover {
        gap: 10px;
      }

      /* Lightbox */
      .fg-lightbox {
        position: fixed;
        inset: 0;
        z-index: 300;
        background: rgba(4, 14, 28, 0.94);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        color: #fff;
      }
      .fg-lb-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 24px;
      }
      .fg-lb-counter {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        font-size: 0.85rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        color: rgba(255, 255, 255, 0.55);
        overflow: hidden;
      }
      .fg-lb-counter > span {
        color: #fff;
        display: inline-block;
      }
      .fg-lb-counter i {
        width: 28px;
        height: 1px;
        background: rgba(255, 255, 255, 0.35);
      }
      .fg-lb-btn {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        background: rgba(255, 255, 255, 0.08);
        transition: background 0.25s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .fg-lb-btn:hover {
        background: rgba(255, 255, 255, 0.18);
        transform: scale(1.06);
      }
      .fg-lb-stage {
        position: relative;
        flex: 1;
        min-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 96px;
      }
      .fg-lb-frame {
        max-width: 100%;
        max-height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: grab;
        touch-action: pan-y;
      }
      .fg-lb-frame:active {
        cursor: grabbing;
      }
      .fg-lb-img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: calc(100vh - 230px);
        object-fit: contain;
        border-radius: 4px;
        user-select: none;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
      }
      .fg-lb-nav {
        position: absolute;
        top: 50%;
        margin-top: -24px;
      }
      .fg-lb-nav.prev {
        left: 24px;
      }
      .fg-lb-nav.next {
        right: 24px;
      }
      .fg-lb-bottom {
        padding: 18px 24px 22px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }
      .fg-lb-caption {
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-height: 2.6em;
      }
      .fg-lb-caption strong {
        font-size: 1rem;
        font-weight: 600;
      }
      .fg-lb-caption span {
        font-size: 0.82rem;
        color: rgba(255, 255, 255, 0.6);
      }
      .fg-lb-thumbs {
        display: flex;
        gap: 8px;
        max-width: 100%;
        overflow-x: auto;
        padding: 4px;
        scrollbar-width: none;
      }
      .fg-lb-thumb {
        position: relative;
        width: 52px;
        height: 52px;
        flex-shrink: 0;
        border-radius: 6px;
        overflow: hidden;
        opacity: 0.4;
        transition: opacity 0.3s ease;
      }
      .fg-lb-thumb img {
        object-fit: cover;
      }
      .fg-lb-thumb:hover,
      .fg-lb-thumb.active {
        opacity: 1;
      }
      .fg-lb-thumb-ring {
        position: absolute;
        inset: 0;
        border-radius: 6px;
        box-shadow: inset 0 0 0 2px var(--primary);
      }

      /* Responsive */
      @media (max-width: 1024px) {
        .fg-albums {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 768px) {
        .fg-hero {
          padding: 80px 0 72px;
        }
        .fg-hero-inner {
          flex-direction: column;
          align-items: flex-start;
          gap: 36px;
        }
        .fg-hero-stats dd {
          font-size: 2.6rem;
        }
        .fg-toolbar-inner {
          flex-direction: column;
          align-items: stretch;
          gap: 4px;
          padding-top: 12px;
          padding-bottom: 8px;
        }
        .fg-segment {
          align-self: flex-start;
        }
        .fg-filters {
          margin: 0 -12px;
        }
        .fg-stage {
          padding: 40px 0 80px;
        }
        .fg-masonry {
          gap: 16px;
        }
        .fg-masonry-col {
          gap: 26px;
        }
        .fg-album-head {
          grid-template-columns: 1fr auto;
          gap: 20px;
        }
        .fg-back {
          grid-column: 1 / -1;
        }
        .fg-lb-stage {
          padding: 0 12px;
        }
        .fg-lb-nav {
          display: none;
        }
        .fg-empty-card {
          top: 40px;
          padding: 36px 24px 30px;
        }
      }
      @media (max-width: 560px) {
        .fg-albums {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}
