import type { Metadata } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'CNCC MISSIONARY | 코람데오 새로운 피조물',
  description: 'CNCC 선교회는 하나님의 임재 앞에서 살아가는 코람데오(Coram Deo)의 태도로 회복과 치유, 그리고 새로운 피조물(New Creation)로의 변화를 사명으로 삼는 선교 공동체입니다.',
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
