import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: '일셈 — 산재보상·퇴직금·연차수당 계산기 | 2026년 법령 반영',
    template: '%s | 일셈',
  },
  description:
    '산재 휴업급여, 장해급여, 퇴직금, 연차수당, 4대보험료까지. 2026년 최신 법령이 반영된 무료 계산기로 3분 안에 계산하세요. 회원가입 없음, 서버 전송 없음.',
  keywords:
    '평균임금 계산기,퇴직금 계산기,산재보상,휴업급여,장해급여,연차수당,4대보험,산재보험,유족급여,과로 위험도,2026',
  authors: [{ name: '일셈' }],
  creator: '일셈',
  metadataBase: new URL('https://ilsem.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '일셈',
    title: '일셈 — 산재보상·퇴직금·연차수당 계산기 | 2026년 법령 반영',
    description:
      '산재 휴업급여, 장해급여, 퇴직금, 연차수당, 4대보험료까지. 2026년 최신 법령이 반영된 무료 계산기로 3분 안에 계산하세요. 회원가입 없음, 서버 전송 없음.',
    url: 'https://ilsem.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: '일셈 — 산재보상·퇴직금·연차수당 계산기 | 2026년 법령 반영',
    description:
      '산재 휴업급여, 장해급여, 퇴직금, 연차수당, 4대보험료까지. 2026년 최신 법령이 반영된 무료 계산기. 회원가입 없음, 서버 전송 없음.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex flex-col min-h-screen antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
