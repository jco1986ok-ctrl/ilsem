import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '4대보험료 계산기 2026 | 일셈',
  description: '2026년 기준 4대보험료(국민연금·건강보험·장기요양·고용보험·산재보험)를 자동 계산합니다.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
