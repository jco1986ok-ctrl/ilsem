import type { Metadata } from 'next';
import CalcPlaceholder from '@/components/features/calculator/CalcForm';

export const metadata: Metadata = {
  title: '과로 위험도 진단기',
  description: '주당 근무시간을 기반으로 과로로 인한 산재 위험도를 진단합니다.',
};

export default function OverworkRiskPage() {
  return (
    <CalcPlaceholder
      title="과로 위험도 진단기"
      description="주당 근무시간을 기반으로 과로로 인한 산재 위험도를 진단합니다."
      emoji="⚠️"
    />
  );
}
