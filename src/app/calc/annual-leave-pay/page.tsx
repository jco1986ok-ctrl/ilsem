import type { Metadata } from 'next';
import AnnualLeavePayCalculator from '@/components/calculators/AnnualLeavePayCalculator';

export const metadata: Metadata = {
  title: '연차수당 계산기 2026 | 미사용 연차 자동 계산 | 일셈',
  description:
    '입사일 기반으로 연차 발생일수를 자동 산정하고, 통상임금을 입력하면 미사용 연차수당을 즉시 계산합니다. 근로기준법 제60조 기준, 근속연수별 가산일까지 반영한 2026년 최신 연차수당 계산기입니다.',
  keywords: [
    '연차수당 계산기', '연차수당 계산', '미사용 연차수당', '연차 발생일수',
    '연차 개수 계산', '통상임금 연차수당', '연차유급휴가', '연차사용촉진',
    '근로기준법 제60조', '연차수당 자동계산',
  ],
};

/* ─────────────────────────────────────
   SEO 콘텐츠
───────────────────────────────────── */
function SeoContent() {
  return (
    <article className="mt-8 text-sm leading-7 text-slate-600 space-y-6">
      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">연차수당이란? — 근로기준법 제60조 완전 해설</h2>
        <p>
          연차유급휴가는 <strong>근로기준법 제60조</strong>에 따라 일정 요건을 갖춘 근로자에게 유급으로 부여되는 휴가입니다.
          근로자가 이 휴가를 사용하지 못하고 소멸된 경우, 사용자는 미사용일수에 해당하는
          <strong> 연차수당</strong>을 지급해야 합니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">연차 발생 요건과 일수</h2>
        <ul className="space-y-2">
          <li>
            <strong>1년 미만 근로자:</strong> 1개월 개근 시 1일 유급휴가 (최대 11일)
          </li>
          <li>
            <strong>1년 이상 근로자:</strong> 1년간 80% 이상 출근 시 15일 기본 부여
          </li>
          <li>
            <strong>가산 휴가:</strong> 계속 근로연수 3년 이상이면 최초 1년 초과 매 2년마다 1일 가산 (상한 25일)
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">근속연수별 연차 발생일수 표</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-600">근속연수</th>
                <th className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-600">연차일수</th>
                <th className="border border-slate-200 px-3 py-2 text-left font-semibold text-slate-600">근속연수</th>
                <th className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-600">연차일수</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['1년 미만', '최대 11일', '만 11~12년', '20일'],
                ['만 1~2년',  '15일',     '만 13~14년', '21일'],
                ['만 3~4년',  '16일',     '만 15~16년', '22일'],
                ['만 5~6년',  '17일',     '만 17~18년', '23일'],
                ['만 7~8년',  '18일',     '만 19~20년', '24일'],
                ['만 9~10년', '19일',     '만 21년 이상', '25일 (상한)'],
              ].map(([y1, d1, y2, d2], i) => (
                <tr key={i} className={i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                  <td className="border border-slate-200 px-3 py-1.5 text-slate-600">{y1}</td>
                  <td className="border border-slate-200 px-3 py-1.5 text-center font-semibold text-[#1E293B]">{d1}</td>
                  <td className="border border-slate-200 px-3 py-1.5 text-slate-600">{y2}</td>
                  <td className="border border-slate-200 px-3 py-1.5 text-center font-semibold text-[#1E293B]">{d2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">연차수당 계산 방법</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 font-medium text-[#1E293B] text-sm space-y-1">
          <p>연차수당 = 1일 통상임금 × 미사용 연차일수</p>
          <p>1일 통상임금 = 시간급 통상임금 × 1일 소정근로시간</p>
          <p>시간급 통상임금 = 월 통상임금 ÷ 월 소정근로시간</p>
          <p className="text-slate-500 text-xs mt-1">월 소정근로시간 (풀타임 기준) = (40h + 주휴 8h) × 365/12/7 ≒ 209시간</p>
        </div>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">연차사용촉진 제도 (제61조)</h2>
        <p>
          사용자가 근로기준법 제61조에 따른 사용촉진 절차를 적법하게 이행한 경우, 미사용 연차에 대한
          수당 지급 의무가 면제됩니다.
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-500">
          <li>연차 사용기간 만료 6개월 전: 미사용 연차일수 통보 및 사용 시기 지정 요구</li>
          <li>만료 2개월 전까지 근로자가 시기 미정 시: 사용자가 시기 지정 후 서면 통보</li>
        </ul>
        <p className="mt-2 text-slate-500">
          단, <strong>퇴직으로 인한 미사용 연차</strong>에는 사용촉진 면책이 적용되지 않으므로
          퇴직 시 미사용분은 반드시 지급해야 합니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">자주 묻는 질문</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold text-slate-700">Q. 아르바이트도 연차수당을 받을 수 있나요?</dt>
            <dd className="mt-1 text-slate-500">
              주 15시간 이상 근로하는 아르바이트도 연차가 발생하며, 미사용 시 수당을 받을 수 있습니다.
              주 15시간 미만의 초단시간 근로자는 적용 제외입니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 입사 1년 미만인데 연차가 있나요?</dt>
            <dd className="mt-1 text-slate-500">
              있습니다. 1개월 개근 시 1일의 유급휴가가 발생합니다. 11개월 모두 개근하면 최대 11일입니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 연차수당 청구 시효는 몇 년인가요?</dt>
            <dd className="mt-1 text-slate-500">
              연차수당은 임금채권이므로 <strong>3년의 소멸시효</strong>가 적용됩니다 (근로기준법 제49조).
              수당 청구권이 발생한 날로부터 3년 이내에 청구해야 합니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 연차수당은 퇴직금 계산에 포함되나요?</dt>
            <dd className="mt-1 text-slate-500">
              퇴직전전년도 출근율로 퇴직전년도에 발생한 미사용 연차수당의 3/12이
              퇴직금 산정을 위한 평균임금에 가산됩니다.&nbsp;
              <a href="/calc/retirement-pay" className="text-[#2563EB] underline">퇴직금 계산기 →</a>
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 80% 미만 출근했으면 연차가 아예 없나요?</dt>
            <dd className="mt-1 text-slate-500">
              아닙니다. 80% 미만 출근한 경우에도 개근한 달마다 1일의 연차가 발생합니다.
            </dd>
          </div>
        </dl>
      </section>

      {/* 관련 계산기 */}
      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">함께 보면 좋은 계산기</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/calc/average-wage',    emoji: '💰', label: '평균임금 계산기' },
            { href: '/calc/retirement-pay',  emoji: '🏦', label: '퇴직금 계산기' },
            { href: '/calc/sick-leave-pay',  emoji: '🏥', label: '휴업급여 계산기' },
          ].map(({ href, emoji, label }) => (
            <a key={href} href={href}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50 transition-colors text-sm font-medium text-slate-700">
              <span className="text-lg">{emoji}</span>{label}
            </a>
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-400 border-t border-slate-100 pt-4">
        본 계산기는 근로기준법 제60조를 기반으로 제공되며 참고용입니다.
        출근율, 휴직기간, 회사 규정에 따라 실제 발생일수가 달라질 수 있습니다.
        정확한 산정은 고용노동부(☎ 1350) 또는 공인노무사에게 문의하세요.&nbsp;
        <a href="https://labor.moel.go.kr/cmmt/calAnnlVctn.do" target="_blank" rel="noopener noreferrer"
          className="text-[#2563EB] underline">고용노동부 연차 계산기 →</a>
      </p>
    </article>
  );
}

/* ─────────────────────────────────────
   페이지
───────────────────────────────────── */
export default function AnnualLeavePayPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-1">연차수당 계산기</h1>
        <p className="text-slate-500 text-sm">근속연수별 연차 자동 산정 · 통상임금 기반 수당 계산 — 근로기준법 제60조</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['통상임금 × 미사용일수', '근속연수별 가산', '사용촉진 안내', '2026년 기준'].map(tag => (
            <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      <AnnualLeavePayCalculator />
      <SeoContent />
    </div>
  );
}
