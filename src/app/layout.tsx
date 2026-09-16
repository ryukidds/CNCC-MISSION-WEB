import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Maintenance from '@/components/Maintenance';
import '@/app/globals.css';

// Set to true to temporarily take down the website and show maintenance screen
const IS_MAINTENANCE_MODE = true;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cncc-web.vercel.app';
const siteTitle = 'CNCC MISSION 씨앤씨씨 선교회 - 시스템 점검 안내';
const siteDescription =
  '현재 CNCC 선교회 공식 홈페이지 개편 및 시스템 점검 중입니다. 보다 나은 서비스로 곧 찾아뵙겠습니다.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  applicationName: siteTitle,
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (IS_MAINTENANCE_MODE) {
    return (
      <html lang="ko">
        <body>
          <Maintenance />
        </body>
      </html>
    );
  }

  return (
    <html lang="ko">
      <body>
        <LanguageProvider>
          <Header />
          <main style={{ minHeight: '80vh' }}>
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
