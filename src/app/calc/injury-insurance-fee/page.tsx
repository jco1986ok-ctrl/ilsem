import type { Metadata } from 'next';
import CalcPlaceholder from '@/components/features/calculator/CalcForm';

export const metadata: Metadata = {
  title: '산재보험료 계산기',
  description: '사업장의 업종별 산재보험료율에 따른 산재보험료를 계산합니다.',
};

export default function InjuryInsuranceFeePage() {
  return (
    <CalcPlaceholder
      title="산재보험료 계산기"
      description="사업장의 업종별 산재보험료율에 따른 산재보험료를 계산합니다."
      emoji="📋"
    />
  );
}
