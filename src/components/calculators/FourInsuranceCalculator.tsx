'use client';

import { useMemo, useState } from 'react';
import {
  calcFourInsurance,
  EI_STABILITY_TIERS,
  INDUSTRY_RATES,
  NPS_UPPER_BEFORE_JULY,
  NPS_LOWER_BEFORE_JULY,
  NPS_UPPER_FROM_JULY,
  NPS_LOWER_FROM_JULY,
  WC_COMMUTE_RATE,
  WC_WAGE_CLAIM_RATE,
  WC_ASBESTOS_RATE,
  type FourInsuranceResult,
} from '@/lib/calc/four-insurance';
import { useNumberFormat } from '@/hooks/useNumberFormat';
import { formatWon } from '@/lib/helpers';

// ── 보조 ─────────────────────────────────────

function StepHeader({ step, title }: { step: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#2563EB] text-white text-xs font-bold shrink-0">
        {step}
      </span>
      <h2 className="text-sm font-bold text-slate-700">{title}</h2>
    </div>
  );
}

type BadgeColor = 'blue' | 'green' | 'purple' | 'amber' | 'slate';
function RateBadge({ label, rate, color = 'blue' }: { label: string; rate: string; color?: BadgeColor }) {
  const cls: Record<BadgeColor, string> = {
    blue:   'bg-blue-50 text-[#2563EB] border-blue-100',
    green:  'bg-green-50 text-green-700 border-green-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    amber:  'bg-amber-50 text-amber-700 border-amber-100',
    slate:  'bg-slate-100 text-slate-600 border-slate-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs border rounded-full px-2 py-0.5 ${cls[color]}`}>
      <span className="font-medium">{label}</span>
      <span className="opacity-70">·</span>
      <span className="font-bold tabular-nums">{rate}</span>
    </span>
  );
}

function InsRow({ label, ee, er, total, eeOnly, erOnly }: {
  label: string; ee: number; er: number; total: number;
  eeOnly?: boolean; erOnly?: boolean;
}) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="py-2.5 pl-2 text-sm text-slate-700 font-medium">{label}</td>
      <td className="py-2.5 text-right tabular-nums text-sm text-slate-600">
        {eeOnly || (!erOnly && ee > 0) ? ee.toLocaleString() : erOnly ? '—' : ee.toLocaleString()}
      </td>
      <td className="py-2.5 text-right tabular-nums text-sm text-slate-600 px-2">
        {erOnly || (!eeOnly && er > 0) ? er.toLocaleString() : eeOnly ? '—' : er.toLocaleString()}
      </td>
      <td className="py-2.5 pr-2 text-right tabular-nums text-sm font-semibold text-[#1E293B]">
        {total.toLocaleString()}
      </td>
    </tr>
  );
}

// ── 메인 ─────────────────────────────────────

export default function FourInsuranceCalculator() {
  const salaryInput = useNumberFormat(0);

  const [npsperiod, setNpsperiod]   = useState<'before_july' | 'from_july'>('from_july');
  const [eiTier, setEiTier]         = useState(EI_STABILITY_TIERS[0].value);
  const [industryType, setIndustry] = useState(INDUSTRY_RATES.find(r => r.value === 'other_biz')!.value);
  const [isGovBiz, setIsGovBiz]     = useState(false);
  const [isUnder20, setIsUnder20]   = useState(false);
  const [showWcTable, setShowWcTable] = useState(false);

  const salary = salaryInput.numericValue;

  const result = useMemo<FourInsuranceResult | null>(() => {
    if (salary <= 0) return null;
    return calcFourInsurance({ monthlySalary: salary, npsperiod, eiTier, industryType, isGovBiz, isUnder20 });
  }, [salary, npsperiod, eiTier, industryType, isGovBiz, isUnder20]);

  const currentIndustry = INDUSTRY_RATES.find(r => r.value === industryType);
  const currentTier     = EI_STABILITY_TIERS.find(t => t.value === eiTier);
  const npsUpper        = npsperiod === 'from_july' ? NPS_UPPER_FROM_JULY   : NPS_UPPER_BEFORE_JULY;
  const npsLower        = npsperiod === 'from_july' ? NPS_LOWER_FROM_JULY   : NPS_LOWER_BEFORE_JULY;

  const iCls = 'w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[#1E293B] font-medium outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 bg-white';

  return (
    <div className="space-y-6">

      {/* ── STEP 1: 월 보수액 ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
        <StepHeader step="1" title="월 보수액 입력" />
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            월 보수액 (비과세 제외) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input type="text" inputMode="numeric"
              value={salaryInput.displayValue} onChange={salaryInput.onChange}
              placeholder="예: 3,000,000"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-right pr-10 text-[#1E293B] font-medium outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            실제 지급 급여에서 식대(월 20만 이하), 차량유지비 등 비과세 항목을 제외한 금액
          </p>
        </div>

        {/* 국민연금 기간 */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">국민연금 기준소득월액 상·하한 적용 기간</label>
          <div className="grid grid-cols-2 gap-2">
            {([
              ['before_july', `2026.1~6월 기준 (하한 ${NPS_LOWER_BEFORE_JULY.toLocaleString()}원 / 상한 ${NPS_UPPER_BEFORE_JULY.toLocaleString()}원)` ],
              ['from_july',   `2026.7월~ 기준 (하한 ${NPS_LOWER_FROM_JULY.toLocaleString()}원 / 상한 ${NPS_UPPER_FROM_JULY.toLocaleString()}원)` ],
            ] as const).map(([v, l]) => (
              <button key={v} type="button" onClick={() => setNpsperiod(v)}
                className={`text-left text-xs px-3 py-2.5 rounded-xl border-2 transition-colors ${
                  npsperiod === v
                    ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] font-semibold'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── STEP 2: 고용보험 기업 규모 ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <StepHeader step="2" title="고용보험 — 기업 규모 (고용안정·직업능력개발)" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EI_STABILITY_TIERS.map(tier => (
            <button key={tier.value} type="button" onClick={() => setEiTier(tier.value)}
              className={`text-left text-xs px-3 py-2.5 rounded-xl border-2 transition-colors ${
                eiTier === tier.value
                  ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] font-semibold'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}>
              {tier.label}
              <span className="ml-1 font-bold">{(tier.rate * 100).toFixed(2)}%</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400">사업주만 부담 · 근로자 부담 없음</p>
      </div>

      {/* ── STEP 3: 산재보험 업종 ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <StepHeader step="3" title="산재보험 — 업종 선택" />

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">사업 업종</label>
          <select value={industryType} onChange={e => setIndustry(e.target.value)} className={iCls}>
            {[
              { group: '광업',         items: INDUSTRY_RATES.filter(r => ['coal_mining','other_mining'].includes(r.value)) },
              { group: '제조업',       items: INDUSTRY_RATES.filter(r => r.value.endsWith('_mfg') || r.value === 'smelting' || r.value === 'shipbuilding') },
              { group: '건설·유틸리티', items: INDUSTRY_RATES.filter(r => ['construction','utility'].includes(r.value)) },
              { group: '운수·창고·통신', items: INDUSTRY_RATES.filter(r => ['rail_air_logis','land_water_trans','telecom'].includes(r.value)) },
              { group: '1차산업',       items: INDUSTRY_RATES.filter(r => ['forestry','fishing','agriculture'].includes(r.value)) },
              { group: '서비스·기타',   items: INDUSTRY_RATES.filter(r => ['facility_svc','other_biz','prof_health_edu','retail_food_hotel','real_estate','gov_local','finance'].includes(r.value)) },
            ].map(({ group, items }) => (
              <optgroup key={group} label={group}>
                {items.map(r => (
                  <option key={r.value} value={r.value}>{r.label} ({r.rate}‰)</option>
                ))}
              </optgroup>
            ))}
          </select>
          {currentIndustry && (
            <p className="text-xs text-[#2563EB] mt-1.5 font-medium">
              선택 업종 기본요율: {currentIndustry.rate}‰
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isGovBiz} onChange={e => setIsGovBiz(e.target.checked)}
              className="w-4 h-4 accent-blue-600 shrink-0" />
            <span className="text-sm text-slate-700">
              국가·지자체 사업
              <span className="text-xs text-slate-400 ml-1">(임금채권부담금 {WC_WAGE_CLAIM_RATE}‰ 면제)</span>
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={isUnder20} onChange={e => setIsUnder20(e.target.checked)}
              className="w-4 h-4 accent-blue-600 shrink-0" />
            <span className="text-sm text-slate-700">
              상시근로자 20인 미만
              <span className="text-xs text-slate-400 ml-1">(석면피해구제분담금 {WC_ASBESTOS_RATE}‰ 면제)</span>
            </span>
          </label>
        </div>

        {currentIndustry && (
          <div className="bg-slate-50 rounded-xl px-4 py-3 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-600 mb-1">산재보험료율 구성</p>
            <div className="flex justify-between"><span>업종 기본요율</span><span className="font-medium">{currentIndustry.rate}‰</span></div>
            <div className="flex justify-between"><span>출퇴근재해</span><span className="font-medium">{WC_COMMUTE_RATE}‰</span></div>
            {!isGovBiz  && <div className="flex justify-between"><span>임금채권부담금</span><span className="font-medium">{WC_WAGE_CLAIM_RATE}‰</span></div>}
            {!isUnder20 && <div className="flex justify-between"><span>석면피해구제분담금</span><span className="font-medium">{WC_ASBESTOS_RATE}‰</span></div>}
            <div className="flex justify-between border-t border-slate-200 pt-1 font-semibold text-[#1E293B]">
              <span>합계</span>
              <span>
                {currentIndustry.rate + WC_COMMUTE_RATE + (isGovBiz ? 0 : WC_WAGE_CLAIM_RATE) + (isUnder20 ? 0 : WC_ASBESTOS_RATE)}‰
              </span>
            </div>
          </div>
        )}

        {/* 전업종 요율표 토글 */}
        <div>
          <button type="button" onClick={() => setShowWcTable(s => !s)}
            className="text-xs text-[#2563EB] underline underline-offset-2">
            {showWcTable ? '업종별 요율표 닫기' : '전 업종 기본요율표 보기'}
          </button>
          {showWcTable && (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs min-w-[280px]">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-3 py-2 text-left font-semibold text-slate-500">업종</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-500 w-16">기본요율</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {INDUSTRY_RATES.map(r => (
                    <tr key={r.value} className={r.value === industryType ? 'bg-blue-50' : ''}>
                      <td className={`px-3 py-1.5 ${r.value === industryType ? 'text-[#2563EB] font-semibold' : 'text-slate-600'}`}>
                        {r.label}
                      </td>
                      <td className="px-3 py-1.5 text-right font-medium text-[#1E293B] tabular-nums">{r.rate}‰</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── 결과 ── */}
      {result && (
        <div className="space-y-5">
          {/* 요율 뱃지 요약 */}
          <div className="flex flex-wrap gap-2">
            <RateBadge label="국민연금" rate="9.5%" color="blue" />
            <RateBadge label="건강보험" rate="7.19%" color="green" />
            <RateBadge label="장기요양" rate="13.14%(건강보험료 대비)" color="purple" />
            <RateBadge label="고용보험(실업)" rate="1.8%" color="amber" />
            <RateBadge label={`고용안정(${currentTier?.label})`} rate={`${((currentTier?.rate ?? 0) * 100).toFixed(2)}%`} color="slate" />
          </div>

          {/* 메인 결과 — 근로자/사업주 분리 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#EEF2FF] border border-[#2563EB]/20 rounded-2xl p-5 text-center">
              <p className="text-xs text-slate-500 mb-2 font-medium">근로자 부담 (월)</p>
              <p className="text-2xl font-bold text-[#2563EB] tabular-nums">{result.totalEmployee.toLocaleString()}원</p>
              <p className="text-xs text-slate-400 mt-1">연 {result.annualEmployee.toLocaleString()}원</p>
            </div>
            <div className="bg-[#F0FDF4] border border-green-200 rounded-2xl p-5 text-center">
              <p className="text-xs text-slate-500 mb-2 font-medium">사업주 부담 (월)</p>
              <p className="text-2xl font-bold text-green-700 tabular-nums">{result.totalEmployer.toLocaleString()}원</p>
              <p className="text-xs text-slate-400 mt-1">연 {result.annualEmployer.toLocaleString()}원</p>
            </div>
          </div>

          {/* 합계 */}
          <div className="bg-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">총 보험료 합계 (월)</p>
              <p className="text-2xl font-bold text-white tabular-nums">{result.totalAll.toLocaleString()}원</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-0.5">연간 추정</p>
              <p className="text-lg font-bold text-slate-200 tabular-nums">{result.annualAll.toLocaleString()}원</p>
            </div>
          </div>

          {/* 상세 내역 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-[#1E293B] mb-4 flex items-center gap-2">
              <span>📊</span> 보험료 상세 내역
            </h3>

            {/* 국민연금 기준소득월액 안내 */}
            {(result.npsBasis !== result.monthlySalary) && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4 text-xs text-amber-700">
                국민연금 기준소득월액: {result.npsBasis.toLocaleString()}원
                (상한 {npsUpper.toLocaleString()}원 / 하한 {npsLower.toLocaleString()}원 적용)
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[340px]">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="py-2 pl-2 text-left text-xs font-semibold text-slate-500">보험 종류</th>
                    <th className="py-2 text-right text-xs font-semibold text-slate-500">근로자</th>
                    <th className="py-2 text-right text-xs font-semibold text-slate-500 px-2">사업주</th>
                    <th className="py-2 pr-2 text-right text-xs font-semibold text-slate-500">합계</th>
                  </tr>
                </thead>
                <tbody>
                  <InsRow label="국민연금"               ee={result.nps.employee}         er={result.nps.employer}         total={result.nps.total} />
                  <InsRow label="건강보험"               ee={result.hi.employee}          er={result.hi.employer}          total={result.hi.total} />
                  <InsRow label="장기요양보험"            ee={result.ltc.employee}         er={result.ltc.employer}         total={result.ltc.total} />
                  <InsRow label="고용보험(실업급여)"      ee={result.eiUI.employee}        er={result.eiUI.employer}        total={result.eiUI.total} />
                  <InsRow label="고용보험(고용안정·직능)" ee={0}                           er={result.eiStability.employer} total={result.eiStability.total} erOnly />
                  <InsRow label="산재보험"               ee={0}                           er={result.wc.employer}          total={result.wc.total} erOnly />
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold">
                    <td className="py-3 pl-2 text-sm text-[#1E293B]">합계</td>
                    <td className="py-3 text-right tabular-nums text-sm text-[#2563EB]">{result.totalEmployee.toLocaleString()}</td>
                    <td className="py-3 text-right tabular-nums text-sm text-green-700 px-2">{result.totalEmployer.toLocaleString()}</td>
                    <td className="py-3 pr-2 text-right tabular-nums text-sm text-[#1E293B]">{result.totalAll.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-3">단위: 원 / 10원 미만 절사</p>
          </div>

          {/* 세후 실수령액 참고 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
            <span className="text-slate-500">세전 급여 기준 근로자 공제율</span>
            <span className="font-bold text-[#1E293B] tabular-nums">
              {salary > 0 ? ((result.totalEmployee / salary) * 100).toFixed(2) : '—'}%
            </span>
          </div>

          {/* 안내 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-2 text-xs text-blue-700">
            <span className="shrink-0">📌</span>
            실수령액 = 세전 급여 − 근로자 부담 4대보험 − 근로소득세 − 지방소득세.
            소득세는 간이세액표 기준이며 본 계산기에서는 별도 산정합니다.
          </div>
        </div>
      )}

      {/* 초기화 */}
      {salary > 0 && (
        <div className="flex justify-end">
          <button onClick={() => salaryInput.reset()}
            className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
            입력 초기화
          </button>
        </div>
      )}
    </div>
  );
}
