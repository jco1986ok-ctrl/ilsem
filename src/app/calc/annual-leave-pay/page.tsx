import type { Metadata } from 'next';
import CalcPlaceholder from '@/components/features/calculator/CalcForm';

export const metadata: Metadata = {
  title: '연차수당 계산기',
  description: '발생한 연차일수와 미사용 연차수당을 계산합니다.',
};

export default function AnnualLeavePayPage() {
  return (
    <CalcPlaceholder
      title="연차수당 계산기"
      description="발생한 연차일수와 미사용 연차수당을 계산합니다."
      emoji="📅"
    />
  );
}
