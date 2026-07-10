import type { Metadata } from 'next';
import ReportCalculator from '@/components/calculators/ReportCalculator';

export const metadata: Metadata = {
  title: '종합 리포트 — 산재·퇴직 정산 한눈에 | 일셈',
  description:
    '산재 보상(휴업급여·장해급여·유족급여)과 퇴직 정산(퇴직금·연차수당·해고예고수당)을 한 화면에서 종합 계산합니다. 2025~2026년 기준 최신 로직 적용.',
  keywords: [
    '산재 종합 계산', '퇴직 정산', '휴업급여 장해급여 유족급여 합산',
    '퇴직금 연차수당 한번에', '산재 보상금 총액', '2026 산재보상',
  ],
};

export default function ReportPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-1">종합 리포트</h1>
        <p className="text-slate-500 text-sm">
          산재 보상 또는 퇴직 정산 항목을 한 번에 계산합니다
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['산재 보상 종합', '퇴직 정산 종합', '항목별 상세 내역', '2025~2026 기준'].map(tag => (
            <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <ReportCalculator />
    </div>
  );
}
