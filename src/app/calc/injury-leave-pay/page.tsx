import type { Metadata } from 'next';
import CalcPlaceholder from '@/components/features/calculator/CalcForm';

export const metadata: Metadata = {
  title: '산재 휴업급여 계산기',
  description: '산업재해로 인한 휴업 기간 동안의 휴업급여를 계산합니다.',
};

export default function InjuryLeavePayPage() {
  return (
    <CalcPlaceholder
      title="산재 휴업급여 계산기"
      description="산업재해로 인한 휴업 기간 동안의 휴업급여를 계산합니다."
      emoji="🏥"
    />
  );
}
