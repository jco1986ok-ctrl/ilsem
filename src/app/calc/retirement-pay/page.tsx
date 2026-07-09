import type { Metadata } from 'next';
import RetirementPayCalculator from '@/components/calculators/RetirementPayCalculator';

export const metadata: Metadata = {
  title: '퇴직금 계산기 2026 | 평균임금·상여금·연차수당 반영 | 일셈',
  description:
    '퇴직 전 3개월 임금, 상여금, 연차수당을 입력하면 퇴직금을 정확히 계산합니다. 평균임금과 통상임금을 비교하여 더 유리한 금액으로 자동 산정합니다. 고용노동부 공식 계산 방식을 그대로 적용한 2026년 최신 퇴직금 계산기입니다.',
  keywords: [
    '퇴직금 계산기', '퇴직금 계산', '평균임금 퇴직금', '퇴직금 계산법',
    '상여금 퇴직금', '연차수당 퇴직금', '통상임금 퇴직금', '퇴직금 자동계산',
    '근로자퇴직급여보장법', '퇴직금 지급기한',
  ],
};

/* ─────────────────────────────────────
   SEO 콘텐츠
───────────────────────────────────── */
function SeoContent() {
  return (
    <article className="mt-8 text-sm leading-7 text-slate-600 space-y-6">
      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">퇴직금이란? — 근로자퇴직급여 보장법 완전 해설</h2>
        <p>
          퇴직금은 <strong>근로자퇴직급여 보장법 제8조</strong>에 따라, 계속근로기간 1년에 대하여
          30일분 이상의 평균임금을 퇴직하는 근로자에게 지급하는 금원입니다.
          사업장 규모나 고용형태(정규직, 계약직, 아르바이트 등)에 관계없이
          <strong> 1년 이상 근무한 모든 근로자</strong>에게 적용됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">퇴직금 계산 공식</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 font-medium text-[#1E293B] text-sm">
          퇴직금 = 1일 평균임금 × 30일 × (총 재직일수 ÷ 365)
        </div>
        <ul className="list-disc pl-5 mt-3 space-y-1">
          <li>1일 평균임금 = (A + B + C) ÷ 퇴직일 이전 3개월 총 일수</li>
          <li><strong>A</strong>: 퇴직 전 3개월간 임금총액 (기본급 + 기타수당)</li>
          <li><strong>B</strong>: 연간 상여금 총액 × 3/12</li>
          <li><strong>C</strong>: 연차수당 × 3/12</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">퇴직금 수급 요건</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>계속근로기간 1년 이상</strong></li>
          <li>1주간의 소정근로시간 <strong>15시간 이상</strong> (4주 평균 기준)</li>
        </ul>
        <p className="text-slate-500 text-xs mt-2">
          초단시간 근로자(주 15시간 미만)는 적용 제외됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">통상임금과의 비교</h2>
        <p>
          <strong>근로기준법 제2조 제2항</strong>에 따라, 1일 평균임금이 1일 통상임금보다 적으면
          통상임금을 평균임금으로 사용하여 퇴직금을 계산합니다.
          통상임금이란 정기적·일률적·고정적으로 소정근로에 대해 지급하기로 약정한 임금입니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">퇴직일과 재직일수</h2>
        <p>
          퇴직일은 마지막으로 근무한 날의 <strong>다음 날</strong>입니다.
          (예: 3월 31일까지 근무 → 퇴직일 4월 1일)
          수습기간, 출산전후휴가, 육아휴직, 업무상 재해 휴업기간 등은 모두 재직일수에 포함됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">평균임금 산정에서 제외되는 기간</h2>
        <p>퇴직 전 3개월 안에 아래 기간이 포함되면, 해당 기간과 임금을 제외하고 직전 3개월 기준으로 산정합니다:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-500">
          <li>업무상 부상·질병 요양 휴업기간</li>
          <li>사용자 귀책사유 휴업기간</li>
          <li>출산전후휴가, 육아휴직 기간</li>
          <li>쟁의행위 기간, 병역의무 복무기간</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">퇴직금 지급기한 및 IRP 안내</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>사용자는 퇴직일로부터 <strong>14일 이내</strong> 지급 의무 (근로자퇴직급여 보장법 제9조)</li>
          <li>2022년 4월 14일부터 퇴직금은 근로자의 <strong>IRP(개인형 퇴직연금) 계좌</strong>로 지급</li>
          <li>퇴직금은 <strong>세전 금액</strong>이며, 퇴직소득세 원천징수 후 지급됩니다</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">자주 묻는 질문</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold text-slate-700">Q. 수습기간도 퇴직금에 포함되나요?</dt>
            <dd className="mt-1 text-slate-500">
              네. 수습기간은 계속근로기간에 포함되며, 수습 중 감액된 급여(최대 10%)를 기준으로 평균임금을 산정합니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 매년 계약갱신한 계약직도 퇴직금을 받을 수 있나요?</dt>
            <dd className="mt-1 text-slate-500">
              반복 갱신한 경우 전체 기간을 합산해 계속근로기간으로 봅니다. 합산 기간이 1년 이상이면 수급 대상입니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 육아휴직 후 퇴직하면 평균임금 계산은?</dt>
            <dd className="mt-1 text-slate-500">
              육아휴직 기간은 재직기간에는 포함되나, 평균임금 산정에서는 제외됩니다.
              육아휴직 시작일 직전 3개월 기준으로 산정합니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 퇴직금을 안 주면 어떻게 하나요?</dt>
            <dd className="mt-1 text-slate-500">
              미지급은 3년 이하 징역 또는 3천만원 이하 벌금에 해당합니다.
              관할 고용노동청에 진정하거나 노동위원회에 구제 신청할 수 있습니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 퇴직소득세는 어떻게 계산하나요?</dt>
            <dd className="mt-1 text-slate-500">
              근속연수·퇴직급여 총액에 따라 달라집니다.&nbsp;
              <a href="https://www.hometax.go.kr" target="_blank" rel="noopener noreferrer"
                className="text-[#2563EB] underline">국세청 홈택스</a>의 퇴직소득 세액 계산기를 이용하세요.
              본 계산기는 세전 퇴직금을 산정합니다.
            </dd>
          </div>
        </dl>
      </section>

      {/* 관련 계산기 */}
      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">함께 보면 좋은 계산기</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/calc/average-wage',         emoji: '💰', label: '평균임금 계산기' },
            { href: '/calc/annual-leave-pay',      emoji: '📅', label: '연차수당 계산기' },
            { href: '/calc/unfair-dismissal-pay',  emoji: '⚖️', label: '부당해고 보상금 계산기' },
          ].map(({ href, emoji, label }) => (
            <a key={href} href={href}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50 transition-colors text-sm font-medium text-slate-700">
              <span className="text-lg">{emoji}</span>{label}
            </a>
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-400 border-t border-slate-100 pt-4">
        본 계산기는 근로자퇴직급여 보장법 및 근로기준법을 기반으로 제공되며 참고용입니다.
        퇴직 전 3개월 내 휴직 등 특수 사유가 있는 경우 별도 산정이 필요합니다.
        정확한 퇴직금 산정은 고용노동부(☎ 1350) 또는 공인노무사에게 상담하세요.&nbsp;
        <a href="https://www.moel.go.kr/retirementpayCal.do" target="_blank" rel="noopener noreferrer"
          className="text-[#2563EB] underline">고용노동부 공식 퇴직금 계산기 →</a>
      </p>
    </article>
  );
}

/* ─────────────────────────────────────
   페이지
───────────────────────────────────── */
export default function RetirementPayPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-1">퇴직금 계산기</h1>
        <p className="text-slate-500 text-sm">평균임금·통상임금 자동 비교 — 근로자퇴직급여 보장법 제8조</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['평균임금 × 30일', '상여금·연차수당 반영', '통상임금 비교', '2026년 기준'].map(tag => (
            <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      <RetirementPayCalculator />
      <SeoContent />
    </div>
  );
}
