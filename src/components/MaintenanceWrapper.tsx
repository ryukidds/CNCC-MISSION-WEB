'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Maintenance from '@/components/Maintenance';

export default function MaintenanceWrapper({
  isMaintenance,
  children,
}: {
  isMaintenance: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const sessionToken = sessionStorage.getItem('cncc-admin-token');
      const localToken = localStorage.getItem('cncc-admin-token');
      const hasCookie = document.cookie.includes('cncc-admin-token=authenticated');
      const queryParam = new URLSearchParams(window.location.search).get('preview') === 'admin';

      if (sessionToken === 'authenticated' || localToken === 'authenticated' || hasCookie || queryParam) {
        setIsAdmin(true);
      }
    }
  }, [pathname]);

  // Always allow admin portal routes
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  // When maintenance mode is enabled
  if (isMaintenance) {
    // If not mounted yet or not authenticated as admin, show maintenance notice
    if (!mounted || !isAdmin) {
      return <Maintenance />;
    }

    // Authenticated admin: show full website with sticky preview banner
    return (
      <>
        <div
          style={{
            backgroundColor: '#002B5B',
            color: '#ffffff',
            padding: '10px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            position: 'sticky',
            top: 0,
            zIndex: 999999,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Pretendard", sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span
              style={{
                backgroundColor: '#56DFCF',
                color: '#002B5B',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.5px',
              }}
            >
              관리자 미리보기 모드
            </span>
            <span style={{ color: '#e2e8f0' }}>
              현재 일반 방문자에게는 <strong>임시 점검 화면</strong>이 노출되고 있습니다. (관리자 권한으로 실제 사이트 확인 중)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/admin"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                padding: '5px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.25)',
                transition: 'background-color 0.2s',
              }}
            >
              ⚙️ CMS 관리자 홈으로 이동
            </Link>
          </div>
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
}
