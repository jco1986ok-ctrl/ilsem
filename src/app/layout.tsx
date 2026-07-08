import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: '일셈 - 근로자를 위한 계산기',
    template: '%s | 일셈',
  },
  description: '산재보상, 퇴직금, 연차수당, 평균임금을 한 곳에서 계산하세요. 근로자를 위한 무료 온라인 계산기 서비스.',
  keywords: ['퇴직금 계산기', '평균임금', '산재보상', '연차수당', '4대보험', '산재보험', '휴업급여', '장해급여'],
  authors: [{ name: '일셈' }],
  creator: '일셈',
  metadataBase: new URL('https://ilsem.com'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '일셈',
    title: '일셈 - 근로자를 위한 계산기',
    description: '산재보상, 퇴직금, 연차수당, 평균임금을 한 곳에서 계산하세요.',
  },
  twitter: {
    card: 'summary_large_image',
    title: '일셈 - 근로자를 위한 계산기',
    description: '산재보상, 퇴직금, 연차수당, 평균임금을 한 곳에서 계산하세요.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
