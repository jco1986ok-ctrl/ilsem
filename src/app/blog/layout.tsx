import type { Metadata } from 'next';
import './blog.css';

export const metadata: Metadata = {
  title: '블로그',
  description: '노동자가 꼭 알아야 할 정보 — 산재, 퇴직, 급여 가이드와 실무 팁을 정리합니다.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className="blog-shell">{children}</div>;
}
