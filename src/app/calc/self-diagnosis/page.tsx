import type { Metadata } from 'next';
import SelfDiagnosisClient from './SelfDiagnosisClient';

export const metadata: Metadata = {
  title: '산재 승인 자가진단 | 일셈',
  description:
    '내 상황이 산재로 인정될 수 있는지 무료로 진단해보세요. 사고 산재, 질병 산재(근골격계, 뇌심혈관, 정신질환) 승인 가능성을 점수로 확인하고 맞춤형 준비 가이드를 받아보세요.',
  keywords: ['산재 승인 기준', '산재 자가진단', '업무상 재해 인정', '산재보험 신청', '근골격계 산재', '뇌심혈관 산재', '정신질환 산재'],
};

export default function SelfDiagnosisPage() {
  return (
    <div className="space-y-12">
      <SelfDiagnosisClient />
      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 text-sm text-slate-600 leading-relaxed">
      <h2 className="text-xl font-bold text-[#1E293B]">산재 승인, 어떻게 결정되나요?</h2>

      <section className="space-y-3">
        <h3 className="font-bold text-[#1E293B]">1. 업무상 재해의 정의 (산재보험법 제37조)</h3>
        <p>
          업무상 재해란 업무상의 사유에 따른 근로자의 부상·질병·장해 또는 사망을 말합니다.
          핵심은 <strong>업무수행성</strong>(근로계약에 따른 업무 중 발생)과 <strong>업무기인성</strong>
          (업무가 원인이 됐는지)입니다.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="font-bold text-[#1E293B]">2. 업무상 사고 인정 기준</h3>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>근로자가 근로계약에 따른 업무나 그에 따르는 행위를 하던 중 발생한 사고</li>
          <li>사업주가 제공한 시설물의 결함이나 관리 소홀로 발생한 사고</li>
          <li>사업주가 주관하거나 지시한 행사 참여 중 발생한 사고</li>
          <li>출퇴근 재해 (통상적인 경로와 방법으로 출퇴근하는 중)</li>
          <li>고의·자해·범죄행위가 아닌 경우</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="font-bold text-[#1E293B]">3. 업무상 질병 인정 기준</h3>
        <p>
          업무상 질병은 크게 <strong>직업성 질환</strong>과 <strong>과로성 질환</strong>으로 나뉩니다.
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>유해·위험 요인(분진, 화학물질, 소음, 방사선 등) 노출로 인한 질환</li>
          <li>반복 동작, 중량물 취급 등 신체적 부담에 의한 근골격계 질환</li>
          <li>과로(주 52시간 이상)로 인한 뇌심혈관 질환</li>
          <li>업무상 스트레스로 인한 정신질환 (직장 내 괴롭힘 포함)</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="font-bold text-[#1E293B]">4. 과로 인정 기준 (뇌심혈관 질환)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold border-b border-slate-200">구분</th>
                <th className="px-4 py-3 text-left font-semibold border-b border-slate-200">기준</th>
                <th className="px-4 py-3 text-left font-semibold border-b border-slate-200">인정 수준</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 font-medium">단기 과로</td>
                <td className="px-4 py-3">발병 전 1주일 이내 업무량 30% 이상 증가</td>
                <td className="px-4 py-3 text-green-700 font-medium">인정 가능성 높음</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">만성 과로</td>
                <td className="px-4 py-3">12주간 주 평균 52시간 이상 (또는 4주 평균 64시간 이상)</td>
                <td className="px-4 py-3 text-green-700 font-medium">인정 가능성 높음</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">업무 부담 가중</td>
                <td className="px-4 py-3">교대근무, 야간근무, 감정노동 등 질적 과부하</td>
                <td className="px-4 py-3 text-blue-700 font-medium">종합 검토</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="font-bold text-[#1E293B]">5. 산재 신청 절차</h3>
        <ol className="list-decimal list-inside space-y-2 pl-2">
          <li><strong>요양급여 신청:</strong> 근로복지공단에 요양급여 신청서 제출 (사업주 경유 또는 직접 신청)</li>
          <li><strong>심사:</strong> 근로복지공단의 업무상 재해 여부 조사·심사 (60일 이내)</li>
          <li><strong>결정:</strong> 승인 또는 불승인 통보</li>
          <li><strong>이의신청:</strong> 불승인 시 심사청구(90일) → 재심사청구 → 행정소송 순으로 이의 가능</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h3 className="font-bold text-[#1E293B]">6. 산재 보상 종류</h3>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li><strong>요양급여:</strong> 치료비 전액 (본인부담금 없음)</li>
          <li><strong>휴업급여:</strong> 치료 중 일하지 못한 기간 — 평균임금의 70%</li>
          <li><strong>장해급여:</strong> 치료 후 장해가 남은 경우 — 등급별 일시금 또는 연금</li>
          <li><strong>간병급여:</strong> 치료 후 간병이 필요한 경우</li>
          <li><strong>유족급여 + 장의비:</strong> 사망 시 유족에게 지급</li>
        </ul>
      </section>

      <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
        ※ 본 자가진단은 참고용이며 법적 효력이 없습니다. 근로복지공단(1588-0075) 또는 전문 노무사와 상담하세요.
        관련 법령: 산업재해보상보험법 제37조, 같은 법 시행령 별표 3
      </p>
    </article>
  );
}
