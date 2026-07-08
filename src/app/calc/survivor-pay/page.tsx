import type { Metadata } from 'next';
import CalcPlaceholder from '@/components/features/calculator/CalcForm';

export const metadata: Metadata = {
  title: '유족급여·장의비 계산기',
  description: '산재로 인한 사망 시 유족급여와 장의비를 계산합니다.',
};

export default function SurvivorPayPage() {
  return (
    <CalcPlaceholder
      title="유족급여·장의비 계산기"
      description="산재로 인한 사망 시 유족급여와 장의비를 계산합니다."
      emoji="🌿"
    />
  );
}
