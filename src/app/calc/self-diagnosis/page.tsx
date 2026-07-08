import type { Metadata } from 'next';
import CalcPlaceholder from '@/components/features/calculator/CalcForm';

export const metadata: Metadata = {
  title: '산재 승인 자가진단',
  description: '나의 상황이 산재로 승인받을 수 있는지 자가 진단합니다.',
};

export default function SelfDiagnosisPage() {
  return (
    <CalcPlaceholder
      title="산재 승인 자가진단"
      description="나의 상황이 산재로 승인받을 수 있는지 자가 진단합니다."
      emoji="🔍"
    />
  );
}
