'use client';

import { useState, useMemo } from 'react';
import {
  INDUSTRY_TABLE,
  calcPayroll,
  calcConstruction,
  type CalcMode,
  type FeeResult,
} from '@/lib/calc/injury-insurance-fee';
import { useNumberFormat } from '@/hooks/useNumberFormat';
import { formatWon } from '@/lib/helpers';

// ── 업종 그룹핑 ───────────────────────────────────────────────

const CATEGORY_ORDER = [
  '광업', '제조업', '전기·가스·증기·수도사업', '건설업',
  '운수·창고·통신업', '임업', '어업', '농업', '기타의 사업',
  '금융 및 보험업', '해외파견',
];

const grouped = CATEGORY_ORDER.map(cat => ({
  category: cat,
  items: INDUSTRY_TABLE.filter(i => i.category === cat),
})).filter(g => g.items.length > 0);

// ── 보조 컴포넌트 ─────────────────────────────────────────────

function ModeTab({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick}
      className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
        active ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
      }`}>
      {children}
    </button>
  );
}

function Toggle({ label, checked, onChange, hint }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      </div>
      <button type="button" onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-12 h-6 rounded-full transition-colors mt-0.5 ${
          checked ? 'bg-[#2563EB]' : 'bg-slate-300'
        }`}>
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
          checked ? 'left-6' : 'left-0.5'
        }`} />
      </button>
    </div>
  );
}

function RateRow({ label, value, muted, bold, accent }: {
  label: string; value: string; muted?: boolean; bold?: boolean; accent?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${bold ? 'pt-2' : ''}`}>
      <span className={`text-sm ${muted ? 'text-slate-400' : bold ? 'text-[#1E293B] font-bold' : 'text-slate-600'}`}>
        {label}
      </span>
      <span className={`tabular-nums font-semibold text-sm ${
        accent ? 'text-[#2563EB]' : muted ? 'text-slate-400' : bold ? 'text-[#1E293B]' : 'text-slate-700'
      }`}>
        {value}
      </span>
    </div>
  );
}

// ── 요율표 ────────────────────────────────────────────────────

function RateTable() {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left">
        <span className="text-sm font-semibold text-slate-700">📋 2026년 업종별 산재보험료 요율표</span>
        <span className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && (
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-xs border-collapse min-w-[400px]">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-3 py-2 text-left font-semibold border border-slate-200 w-36">대분류</th>
                <th className="px-3 py-2 text-left font-semibold border border-slate-200">업종명</th>
                <th className="px-3 py-2 text-right font-semibold border border-slate-200 w-20">요율 (‰)</th>
              </tr>
            </thead>
            <tbody>
              {grouped.flatMap(({ category, items }) =>
                items.map((item, j) => (
                  <tr key={item.code} className={j % 2 === 0 ? '' : 'bg-slate-50'}>
                    <td className="px-3 py-1.5 border border-slate-200 text-slate-500 align-top">
                      {j === 0 ? category : ''}
                    </td>
                    <td className="px-3 py-1.5 border border-slate-200">{item.name}</td>
                    <td className="px-3 py-1.5 border border-slate-200 text-right font-mono font-semibold text-[#2563EB]">
                      {item.rate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <p className="text-xs text-slate-400 mt-3">
            * 출퇴근재해 0.6‰, 임금채권부담금 0.9‰, 석면분담금 0.06‰는 위 요율에 추가 합산됩니다.
          </p>
        </div>
      )}
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────────────

export default function InjuryInsuranceFeeCalculator() {
  const [mode, setMode]               = useState<CalcMode>('payroll');

  // payroll 모드
  const [industryCode, setIndustryCode] = useState('');
  const monthlyWageInput              = useNumberFormat(0);
  const [isGovProject, setIsGovProject] = useState(false);
  const [employees20Plus, setEmp20]   = useState(true);

  // construction 모드
  const totalAmountInput              = useNumberFormat(0);
  const [isSubcontract, setIsSub]     = useState(false);
  const [emp20Const, setEmp20Const]   = useState(true);

  // 선택된 업종 요율 미리보기
  const selectedIndustry = useMemo(
    () => INDUSTRY_TABLE.find(i => i.code === industryCode),
    [industryCode]
  );

  // 실시간 계산
  const result = useMemo<FeeResult | null>(() => {
    try {
      if (mode === 'payroll') {
        if (!industryCode || !monthlyWageInput.numericValue) return null;
        return calcPayroll({
          mode: 'payroll',
          monthlyWage: monthlyWageInput.numericValue,
          industryCode,
          isGovProject,
          employees20Plus,
          hasRetirementPension: false,
        });
      } else {
        if (!totalAmountInput.numericValue) return null;
        return calcConstruction({
          mode: 'construction',
          totalAmount: totalAmountInput.numericValue,
          isSubcontract,
          employees20Plus: emp20Const,
        });
      }
    } catch { return null; }
  }, [mode, industryCode, monthlyWageInput.numericValue, isGovProject, employees20Plus,
      totalAmountInput.numericValue, isSubcontract, emp20Const]);

  const iCls = `w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-right pr-10 text-[#1E293B] font-medium outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100`;

  return (
    <div className="space-y-6">
      {/* ── 모드 탭 ── */}
      <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
        <ModeTab active={mode === 'payroll'}       onClick={() => setMode('payroll')}>
          🏢 일반 사업장 (월 보수 기반)
        </ModeTab>
        <ModeTab active={mode === 'construction'}  onClick={() => setMode('construction')}>
          🏗️ 건설업 (총공사금액 기반)
        </ModeTab>
      </div>

      {/* ── 입력 카드 ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">

        {/* ──── 일반 사업장 ──── */}
        {mode === 'payroll' && (
          <>
            {/* 업종 선택 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                업종 선택 <span className="text-red-500">*</span>
              </label>
              <select value={industryCode} onChange={e => setIndustryCode(e.target.value)}
                className={`w-full border-2 rounded-xl px-4 py-3 text-[#1E293B] font-medium outline-none transition-colors focus:border-[#2563EB] bg-white ${
                  industryCode ? 'border-slate-200' : 'border-slate-200'
                }`}>
                <option value="">— 업종을 선택해 주세요 —</option>
                {grouped.map(({ category, items }) => (
                  <optgroup key={category} label={category}>
                    {items.map(item => (
                      <option key={item.code} value={item.code}>
                        {item.name} ({item.rate}‰)
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {selectedIndustry && (
                <div className="mt-2 flex items-center gap-2 text-xs text-[#2563EB] font-medium">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#2563EB]" />
                  적용 업종요율: <strong>{selectedIndustry.rate}‰</strong>
                </div>
              )}
            </div>

            {/* 월 평균보수 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                월 평균보수 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input type="text" inputMode="numeric"
                  value={monthlyWageInput.displayValue} onChange={monthlyWageInput.onChange}
                  placeholder="예: 3,000,000" className={`${iCls}`} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">비과세소득 제외 월 보수 기준</p>
            </div>

            <hr className="border-slate-100" />

            {/* 옵션 */}
            <div className="space-y-4">
              <Toggle
                label="국가·지자체 사업"
                checked={isGovProject}
                onChange={setIsGovProject}
                hint="해당 시 임금채권부담금(0.9‰) 면제"
              />
              <Toggle
                label="상시 근로자 20인 이상"
                checked={employees20Plus}
                onChange={setEmp20}
                hint="20인 미만 사업장은 석면피해구제분담금(0.06‰) 면제"
              />
            </div>
          </>
        )}

        {/* ──── 건설업 ──── */}
        {mode === 'construction' && (
          <>
            {/* 공사 유형 */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">공사 유형 <span className="text-red-500">*</span></p>
              {([
                { val: false, label: '일반 건설공사', desc: '총공사금액 × 27% = 보수총액 추정', ratio: '27%' },
                { val: true,  label: '하도급 공사',   desc: '하도급금액 × 29% = 보수총액 추정', ratio: '29%' },
              ] as const).map(({ val, label, desc }) => (
                <label key={String(val)}
                  className={`flex items-start gap-3 cursor-pointer rounded-xl border-2 p-4 transition-colors ${
                    isSubcontract === val ? 'border-[#2563EB] bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setIsSub(val)}>
                  <input type="radio" name="subcontract" checked={isSubcontract === val} onChange={() => {}}
                    className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#1E293B]">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* 총공사금액 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {isSubcontract ? '하도급 공사금액' : '총공사금액'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input type="text" inputMode="numeric"
                  value={totalAmountInput.displayValue} onChange={totalAmountInput.onChange}
                  placeholder="예: 500,000,000" className={`${iCls}`} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            <Toggle
              label="상시 근로자 20인 이상"
              checked={emp20Const}
              onChange={setEmp20Const}
              hint="20인 미만 사업장은 석면피해구제분담금(0.06‰) 면제"
            />
          </>
        )}
      </div>

      {/* ── 결과 카드 ── */}
      {result && (
        <div className="space-y-5">
          {/* 메인 금액 */}
          <div className="bg-gradient-to-br from-[#EEF2FF] to-[#F0FDF4] rounded-2xl border border-[#2563EB]/20 p-6 sm:p-8">
            <p className="text-xs text-slate-500 text-center mb-4 font-medium">
              {mode === 'payroll' ? '사업주 부담 산재보험료' : '건설업 산재보험료 (개산)'}
            </p>
            {mode === 'payroll' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-xs text-slate-400 mb-1">월 산재보험료</p>
                  <p className="text-2xl font-bold text-[#2563EB] tabular-nums">{formatWon(result.monthlyFee)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">연간 산재보험료</p>
                  <p className="text-2xl font-bold text-[#16A34A] tabular-nums">{formatWon(result.annualFee)}</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">개산보험료</p>
                <p className="text-3xl font-bold text-[#2563EB] tabular-nums">{formatWon(result.constructionFee!)}</p>
              </div>
            )}
            <p className="text-center text-xs text-slate-400 mt-4">
              ※ 산재보험료는 사업주가 전액 부담합니다 (근로자 부담 없음)
            </p>
          </div>

          {/* 적용 요율 상세 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-[#1E293B] mb-4">적용 요율 상세</h3>
            <div className="space-y-0.5">
              <RateRow label={`업종요율 — ${
                mode === 'payroll'
                  ? (INDUSTRY_TABLE.find(i => i.code === industryCode)?.name ?? '')
                  : '건설업'
              }`} value={`${result.industryRate} ‰`} />
              <RateRow label="출퇴근재해 요율" value={`${result.commuteRate} ‰`} />
              <RateRow
                label={`임금채권부담금 ${result.wageClaimRate === 0 ? '(국가·지자체 면제)' : ''}`}
                value={result.wageClaimRate === 0 ? '면제' : `${result.wageClaimRate} ‰`}
                muted={result.wageClaimRate === 0}
              />
              <RateRow
                label={`석면피해구제분담금 ${result.asbestosRate === 0 ? '(20인 미만 면제)' : ''}`}
                value={result.asbestosRate === 0 ? '면제' : `${result.asbestosRate} ‰`}
                muted={result.asbestosRate === 0}
              />
              <div className="border-t border-slate-100 mt-2 pt-2">
                <RateRow label="합계 요율" value={`${result.totalRate.toFixed(2)} ‰`} bold accent />
              </div>
            </div>

            {/* 산정 과정 */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-400">
              {mode === 'payroll' ? (
                <>
                  <p>월평균 보수: <span className="text-slate-600 font-medium">{formatWon(result.payrollBase)}</span></p>
                  <p>계산식: {formatWon(result.payrollBase).replace('원','').trim()} × {result.totalRate.toFixed(2)} ÷ 1,000 = <span className="text-[#2563EB] font-semibold">{formatWon(result.monthlyFee)}</span></p>
                </>
              ) : (
                <>
                  <p>총공사금액: <span className="text-slate-600 font-medium">{formatWon(totalAmountInput.numericValue)}</span></p>
                  <p>노무비율: <span className="text-slate-600 font-medium">{result.laborRatio ? (result.laborRatio * 100).toFixed(0) : 0}%</span>
                     {isSubcontract ? ' (하도급)' : ' (일반)'}
                  </p>
                  <p>추정 보수총액: <span className="text-slate-600 font-medium">{formatWon(result.payrollBase)}</span></p>
                  <p>개산보험료: {formatWon(result.payrollBase).replace('원','').trim()} × {result.totalRate.toFixed(2)} ÷ 1,000 = <span className="text-[#2563EB] font-semibold">{formatWon(result.constructionFee!)}</span></p>
                </>
              )}
            </div>
          </div>

          {/* 안내 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-800 font-semibold mb-1.5">알아두세요</p>
            <ul className="space-y-1 text-xs text-blue-700">
              <li>• 본 계산은 <strong>일반요율(업종요율)</strong> 기준입니다. 상시 30인 이상 사업장은 개별실적요율(±20%)이 적용될 수 있습니다.</li>
              <li>• 개별실적요율 적용 사업장은 근로복지공단 토탈서비스(total.comwel.or.kr)에서 확인하세요.</li>
              <li>• 건설업 개산보험료는 착공 전 신고·납부하며, 완공 후 확정보험료 정산이 이루어집니다.</li>
              <li>• 정확한 보험료 산정은 근로복지공단(☎ 1588-0075)에 문의하세요.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── 업종별 요율표 ── */}
      <RateTable />
    </div>
  );
}
