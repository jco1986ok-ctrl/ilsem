import type { Metadata } from 'next';
import CalcPlaceholder from '@/components/features/calculator/CalcForm';

export const metadata: Metadata = {
  title: '평균임금 계산기',
  description: '통상임금과 평균임금을 근로기준법 기준에 따라 정확하게 계산합니다.',
};

export default function AverageWagePage() {
  return (
    <CalcPlaceholder
      title="평균임금 계산기"
      description="통상임금·평균임금을 근로기준법 기준에 맞게 계산합니다."
      emoji="💰"
    />
  );
}
