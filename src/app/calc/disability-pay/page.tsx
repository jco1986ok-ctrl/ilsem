import type { Metadata } from 'next';
import CalcPlaceholder from '@/components/features/calculator/CalcForm';

export const metadata: Metadata = {
  title: '산재 장해급여 계산기',
  description: '산재 장해등급에 따른 장해급여 보상금을 계산합니다.',
};

export default function DisabilityPayPage() {
  return (
    <CalcPlaceholder
      title="산재 장해급여 계산기"
      description="산재 장해등급에 따른 장해급여 보상금을 계산합니다."
      emoji="♿"
    />
  );
}
