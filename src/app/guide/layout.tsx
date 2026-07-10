import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '근로자 가이드 — 산재·퇴직·급여 상황별 안내 | 일셈',
  description:
    '산재를 당했을 때, 퇴직할 때, 급여명세서가 궁금할 때 — 상황별로 어떤 권리가 있고 어떤 계산기를 써야 하는지 한눈에 안내합니다.',
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
