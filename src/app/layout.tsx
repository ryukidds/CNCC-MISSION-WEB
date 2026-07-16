import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import '@/app/globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cncc-web.vercel.app';
const siteTitle = 'CNCC MISSION 씨앤씨씨 선교회';
const siteDescription =
  'CNCC MISSION 씨앤씨씨 선교회는 코람데오의 태도로 복음, 회복과 치유, 새로운 피조물로의 변화를 섬기는 선교 공동체입니다.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  applicationName: siteTitle,
  keywords: [
    'CNCC MISSION',
    '씨앤씨씨 선교회',
    'CNCC 선교회',
    '코람데오',
    'Coram Deo',
    'New Creation',
    '선교회',
    '회복과 치유',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: '/',
    siteName: siteTitle,
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/cncc_hero_vision.png',
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/images/cncc_hero_vision.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
