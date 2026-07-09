import type { Metadata } from 'next';
import UnfairDismissalCalculator from '@/components/calculators/UnfairDismissalCalculator';

export const metadata: Metadata = {
  title: '부당해고 보상금 계산기 | 해고예고수당 · 금전보상금 | 일셈',
  description:
    '해고예고수당과 부당해고 금전보상금을 한 번에 계산합니다. 근로기준법 제26조·제30조 기준, 2026년 최신 반영. 해고 시 받을 수 있는 보상금 총액을 3분 안에 확인하세요.',
  keywords:
    '부당해고 보상금 계산기,해고예고수당 계산기,부당해고 금전보상,부당해고 구제신청,근로기준법 제26조,근로기준법 제30조,해고 보상금,임금상당액,부당해고 위로금',
};

/* ─────────────────────────────────────
   SEO 콘텐츠
───────────────────────────────────── */
function SeoContent() {
  return (
    <div className="prose prose-slate max-w-none mt-8 text-sm leading-7 text-slate-600 space-y-6">
      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">부당해고 보상금 계산기란?</h2>
        <p>
          이 계산기는 <strong>해고예고수당</strong>(근로기준법 제26조)과 <strong>부당해고 금전보상금</strong>(근로기준법 제30조 제3항)을
          한 화면에서 동시에 계산합니다. 갑작스러운 해고 통보를 받았을 때 내가 받을 수 있는 금액이 얼마인지
          3분 안에 확인해 보세요.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">해고예고수당 (근로기준법 제26조)</h2>
        <p>
          사용자가 근로자를 해고하려면 <strong>적어도 30일 전에 예고</strong>해야 합니다.
          예고 없이 즉시 해고하면 <strong>30일분 이상의 통상임금</strong>을 해고예고수당으로 지급해야 합니다.
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-3">
          <li>풀타임 근로자: 시간급 × 8시간 × 30일</li>
          <li>단시간 근로자: 시간급 × (주 소정근로시간 ÷ 주 근무일수) × 30일</li>
        </ul>
        <p className="mt-3 text-slate-500 text-xs">
          예외 (근로기준법 제35조): 일용직 3개월 미만 · 2개월 이내 기간제 · 수습 3개월 이내 · 천재사변 · 근로자 고의 손해 등은 적용 제외
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">부당해고 금전보상금 (근로기준법 제30조 제3항)</h2>
        <p>
          노동위원회에 부당해고 구제신청을 해 원직복직 대신 <strong>금전보상</strong>을 신청하면,
          해고 기간 동안 받지 못한 <strong>임금상당액 이상</strong>을 받을 수 있습니다.
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-3">
          <li><strong>임금상당액</strong> = 월급 × (해고일 ~ 초심판정일 개월 수)</li>
          <li><strong>위로금</strong>: 실무상 99% 이상 사건에서는 별도 인정되지 않으나, 최대 3개월분까지 청구 가능</li>
          <li>초심 판정까지 평균 60~90일 소요 (이 계산기는 기본 75일 적용)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">구제신청 절차 및 기간</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>신청 기한: <strong>해고일로부터 3개월 이내</strong> (근로기준법 제28조 제2항) — 기간 도과 시 각하</li>
          <li>신청 기관: 관할 지방노동위원회</li>
          <li>신청 자격: 상시 <strong>5인 이상</strong> 사업장 근로자 (해고예고수당은 5인 미만도 적용)</li>
          <li>임금채권 소멸시효: <strong>3년</strong> (근로기준법 제49조)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">자주 묻는 질문</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold text-slate-700">Q. 5인 미만 사업장인데 해고예고수당은 받을 수 있나요?</dt>
            <dd className="mt-1 text-slate-500">
              네. 해고예고 의무(근로기준법 제26조)는 사업장 규모와 무관하게 적용됩니다.
              다만 부당해고 구제신청(제28조)은 5인 이상 사업장에 한합니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 해고예고를 30일 전에 했지만 부당해고인 경우 어떻게 되나요?</dt>
            <dd className="mt-1 text-slate-500">
              해고예고수당은 지급하지 않아도 되지만, 부당해고에 해당하면 금전보상금 청구는 가능합니다.
              두 가지는 별개의 권리입니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 통상임금과 평균임금의 차이는?</dt>
            <dd className="mt-1 text-slate-500">
              해고예고수당은 <strong>통상임금</strong>(기본급 + 고정 수당) 기준,
              금전보상금은 <strong>통상임금</strong> 기준입니다.
              평균임금(최근 3개월 임금 ÷ 일수)은 퇴직금·산재급여 산정에 사용됩니다.
            </dd>
          </div>
        </dl>
      </section>

      <p className="text-xs text-slate-400 border-t border-slate-100 pt-4">
        이 계산기는 법령 이해를 돕기 위한 참고용입니다. 실제 보상금은 사실관계·증거에 따라 달라질 수 있으며,
        정확한 판단은 노동부 고객상담센터(☎ 1350) 또는 공인노무사에게 문의하시기 바랍니다.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────
   페이지
───────────────────────────────────── */
export default function UnfairDismissalPayPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-1">부당해고 보상금 계산기</h1>
        <p className="text-slate-500 text-sm">해고예고수당 + 부당해고 금전보상금 — 근로기준법 제26조·제30조</p>
      </div>

      <UnfairDismissalCalculator />
      <SeoContent />
    </div>
  );
}
