import type { Metadata } from 'next';
import CalcPlaceholder from '@/components/features/calculator/CalcForm';

export const metadata: Metadata = {
  title: '퇴직금 계산기',
  description: '근무 기간과 평균임금으로 퇴직금을 정확하게 산출합니다.',
};

export default function RetirementPayPage() {
  return (
    <CalcPlaceholder
      title="퇴직금 계산기"
      description="근무 기간과 평균임금으로 퇴직금을 산출합니다."
      emoji="🏦"
    />
  );
}
