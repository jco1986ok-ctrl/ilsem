import type { Metadata } from 'next';
import FourInsuranceCalculator from '@/components/calculators/FourInsuranceCalculator';

export const metadata: Metadata = {
  title: '4대보험료 계산기 2026 | 국민연금·건강보험·고용보험·산재보험 | 일셈',
  description:
    '월 보수액을 입력하면 국민연금, 건강보험, 장기요양보험, 고용보험, 산재보험 보험료를 근로자·사업주 부담 기준으로 즉시 계산합니다. 2026년 최신 요율 반영, 업종별 산재보험요율 선택 가능.',
  keywords: [
    '4대보험 계산기', '4대보험료 계산', '국민연금 계산', '건강보험료 계산',
    '고용보험료 계산', '산재보험료 계산', '장기요양보험료', '2026년 4대보험',
    '근로자 사업주 부담', '4대보험 자동계산',
  ],
};

/* ─────────────────────────────────────
   SEO 콘텐츠
───────────────────────────────────── */
function SeoContent() {
  return (
    <article className="mt-8 text-sm leading-7 text-slate-600 space-y-6">
      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">4대보험료란? — 2026년 기준 완전 해설</h2>
        <p>
          4대보험은 <strong>국민연금, 건강보험, 고용보험, 산재보험</strong>을 통칭합니다.
          1인 이상 사업장의 모든 근로자와 사업주는 의무적으로 가입해야 하며,
          보험료는 월 보수액(비과세 제외)을 기준으로 산정합니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">2026년 4대보험 요율 한눈에 보기</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse min-w-[400px]">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-600">보험 종류</th>
                <th className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-600">근로자</th>
                <th className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-600">사업주</th>
                <th className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-600">합계</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['국민연금',            '4.75%', '4.75%', '9.5%'],
                ['건강보험',            '3.595%', '3.595%', '7.19%'],
                ['장기요양보험',        '건강보험료의 6.57%', '건강보험료의 6.57%', '13.14%'],
                ['고용보험(실업급여)',   '0.9%',  '0.9%',  '1.8%'],
                ['고용보험(고용안정)',   '—',     '0.25~0.85%', '사업주 전액'],
                ['산재보험',            '—',     '업종별',      '사업주 전액'],
              ].map(([ins, ee, er, total], i) => (
                <tr key={i} className={i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                  <td className="border border-slate-200 px-3 py-1.5 font-medium text-slate-700">{ins}</td>
                  <td className="border border-slate-200 px-3 py-1.5 text-center text-[#2563EB] font-medium">{ee}</td>
                  <td className="border border-slate-200 px-3 py-1.5 text-center text-green-700 font-medium">{er}</td>
                  <td className="border border-slate-200 px-3 py-1.5 text-center font-semibold text-[#1E293B]">{total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">국민연금 기준소득월액 상·하한</h2>
        <p>
          국민연금 보험료는 실제 소득이 아닌 <strong>기준소득월액</strong>에 9.5%를 적용합니다.
          2026년 1~6월은 하한 40만원·상한 637만원, 2026년 7월부터는 하한 41만원·상한 659만원이 적용됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">건강보험 및 장기요양보험</h2>
        <p>
          건강보험료는 월 보수액 × 7.19%이며, 근로자·사업주가 각 3.595%씩 부담합니다.
          장기요양보험료는 건강보험료에 13.14%를 곱하여 산정하며 동일하게 절반씩 부담합니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">고용보험 — 실업급여와 고용안정·직업능력개발</h2>
        <p>
          실업급여(1.8%)는 근로자와 사업주가 각 0.9%씩 부담합니다.
          고용안정·직업능력개발 보험료는 사업주가 전액 부담하며 기업 규모에 따라 0.25%~0.85%입니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">산재보험 — 업종별 요율</h2>
        <p>
          산재보험료는 사업주가 전액 부담하며, 업종별 기본요율에
          출퇴근재해(0.6‰), 임금채권부담금(0.9‰), 석면피해구제분담금(0.06‰)을 더한 합산요율을 적용합니다.
          금융·보험업(5‰)부터 석탄광업(185‰)까지 업종에 따라 요율이 크게 차이납니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">자주 묻는 질문</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold text-slate-700">Q. 비과세 항목은 보험료 계산에서 제외되나요?</dt>
            <dd className="mt-1 text-slate-500">
              네. 식대(월 20만원 이하), 차량유지비(월 20만원 이하) 등 비과세 급여는 보수월액에서 제외됩니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 4대보험 납부일은 언제인가요?</dt>
            <dd className="mt-1 text-slate-500">
              국민연금·건강보험·고용보험은 매월 10일(공휴일이면 다음 영업일)까지 납부합니다.
              산재보험은 분기별 또는 월별 선납 방식으로 납부합니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 일용직 근로자도 4대보험 가입 의무가 있나요?</dt>
            <dd className="mt-1 text-slate-500">
              1개월 이상 계속 근무하고 월 8일 이상 또는 월 60시간 이상 근무하면 의무 가입 대상입니다.
              단기 일용직은 고용보험·산재보험만 적용되는 경우가 있습니다.
            </dd>
          </div>
        </dl>
      </section>

      {/* 관련 계산기 */}
      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">함께 보면 좋은 계산기</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/calc/retirement-pay',      emoji: '🏦', label: '퇴직금 계산기' },
            { href: '/calc/annual-leave-pay',    emoji: '📅', label: '연차수당 계산기' },
            { href: '/calc/injury-insurance-fee',emoji: '🔧', label: '산재보험료 계산기' },
          ].map(({ href, emoji, label }) => (
            <a key={href} href={href}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50 transition-colors text-sm font-medium text-slate-700">
              <span className="text-lg">{emoji}</span>{label}
            </a>
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-400 border-t border-slate-100 pt-4">
        본 계산기는 2026년 고시 요율을 기준으로 제공되며 참고용입니다.
        보수 항목 구성, 소득월액 특례 등에 따라 실제 보험료가 다를 수 있습니다.
        정확한 산정은 국민건강보험공단(☎ 1577-1000), 국민연금공단(☎ 1355),
        근로복지공단(☎ 1588-0075) 또는 공인노무사에게 문의하세요.
      </p>
    </article>
  );
}

/* ─────────────────────────────────────
   페이지
───────────────────────────────────── */
export default function FourInsurancePage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-1">4대보험료 계산기</h1>
        <p className="text-slate-500 text-sm">근로자·사업주 부담 보험료 즉시 산정 — 2026년 최신 요율 기준</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['국민연금 9.5%', '건강보험 7.19%', '고용보험 1.8%', '업종별 산재보험', '2026년 기준'].map(tag => (
            <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      <FourInsuranceCalculator />
      <SeoContent />
    </div>
  );
}
