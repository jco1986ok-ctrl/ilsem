import type { Metadata } from 'next';
import CalcPlaceholder from '@/components/features/calculator/CalcForm';

export const metadata: Metadata = {
  title: '4대보험 계산기',
  description: '국민연금, 건강보험, 고용보험, 산재보험 보험료를 계산합니다.',
};

export default function FourInsurancePage() {
  return (
    <CalcPlaceholder
      title="4대보험 계산기"
      description="국민연금·건강보험·고용보험·산재보험 보험료를 계산합니다."
      emoji="🛡️"
    />
  );
}
