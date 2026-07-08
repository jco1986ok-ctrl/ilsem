'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useNumberFormat } from '@/hooks/useNumberFormat';
import {
  calculateSickLeavePay,
  type SickLeavePayInput,
  type SickLeavePayResult,
  type CalculationType,
} from '@/lib/calculators/sick-leave-pay';
import { SICK_LEAVE_PAY_CONSTANTS as C } from '@/lib/constants/sick-leave-pay-data';
import { formatWon, formatNumber } from '@/lib/helpers';

// ── 상수 ──────────────────────────────────────────────────────
const CALC_TYPE_STYLE: Record<CalculationType, { bg: string; text: string; border: string; icon: string }> = {
  standard:      { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   icon: '✅' },
  lowIncome90:   { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: '🔵' },
  lowIncomeMin80:{ bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  icon: '⚠️' },
  minimumWage:   { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: '🔶' },
  maxCap:        { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: '🟣' },
};

// ── 보조 컴포넌트 ─────────────────────────────────────────────
function MethodTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
        active ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
      }`}
    >
      {children}
    </button>
  );
}

function InputField({ label, required, unit, error, hint, children }: {
  label: string; required?: boolean; unit?: string; error?: string;
  hint?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {children}
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {hint && <div className="text-xs text-slate-400 mt-1 leading-relaxed">{hint}</div>}
    </div>
  );
}

function ResultRow({ label, value, sub, highlight, bold, accent, warn, large }: {
  label: string; value: string; sub?: string;
  highlight?: boolean; bold?: boolean; accent?: boolean; warn?: boolean; large?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${highlight ? 'bg-blue-50 -mx-2 px-2 rounded-lg' : ''}`}>
      <span className={`text-sm flex items-center gap-1.5 ${
        warn ? 'text-amber-700 font-medium' : bold ? 'text-[#1E293B] font-semibold' : 'text-slate-500'
      }`}>
        {label}
        {sub && <span className="text-xs text-slate-400 font-normal">({sub})</span>}
        {highlight && (
          <span className="text-[10px] bg-[#2563EB] text-white px-1.5 py-0.5 rounded font-semibold ml-1">적용</span>
        )}
      </span>
      <span className={`tabular-nums font-semibold ${large ? 'text-lg' : 'text-sm'} ${
        accent ? 'text-[#2563EB]' : warn ? 'text-amber-700' : 'text-[#1E293B]'
      }`}>
        {value}
      </span>
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────────────
export default function SickLeavePayCalculator() {
  const [method, setMethod] = useState<'direct' | 'calculate'>('direct');
  const dailyWageInput = useNumberFormat(0);
  const totalWageInput = useNumberFormat(0);
  const [totalDays, setTotalDays] = useState('90');
  const [sickLeaveDays, setSickLeaveDays] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [injuryDate, setInjuryDate] = useState('');
  const [isEmployed61Plus, setIsEmployed61Plus] = useState(false);
  const [result, setResult] = useState<SickLeavePayResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // 재해일 기준 만 나이 미리보기
  const ageAtInjury = useMemo(() => {
    const yr = parseInt(birthYear, 10);
    if (!yr || !injuryDate) return null;
    return new Date(injuryDate + 'T00:00:00').getFullYear() - yr;
  }, [birthYear, injuryDate]);

  const isElderlyAtInjury = ageAtInjury !== null && ageAtInjury >= 61;

  // 3개월 계산 미리보기
  const previewDailyWage = useMemo(() => {
    if (method !== 'calculate') return null;
    const total = totalWageInput.numericValue;
    const days = parseInt(totalDays, 10) || 90;
    return total > 0 && days > 0 ? Math.round(total / days) : null;
  }, [method, totalWageInput.numericValue, totalDays]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (method === 'direct') {
      if (!dailyWageInput.numericValue) errs.dailyWage = '1일 평균임금을 입력해 주세요.';
    } else {
      if (!totalWageInput.numericValue) errs.totalWage = '3개월 임금 총액을 입력해 주세요.';
      const d = parseInt(totalDays, 10);
      if (!d || d < 1 || d > 120) errs.totalDays = '총 일수를 입력해 주세요. (1~120일)';
    }
    if (!sickLeaveDays || parseInt(sickLeaveDays, 10) < 1) errs.sickLeaveDays = '요양 기간을 입력해 주세요.';
    const yr = parseInt(birthYear, 10);
    if (!yr || yr < 1920 || yr > 2005) errs.birthYear = '출생 연도를 4자리로 입력해 주세요.';
    if (!injuryDate) errs.injuryDate = '재해 발생일을 입력해 주세요.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleCalculate() {
    if (!validate()) return;
    const input: SickLeavePayInput = {
      averageWageMethod: method,
      dailyAverageWage: method === 'direct' ? dailyWageInput.numericValue : undefined,
      totalWage3Months: method === 'calculate' ? totalWageInput.numericValue : undefined,
      totalDays3Months: method === 'calculate' ? (parseInt(totalDays, 10) || 90) : undefined,
      sickLeaveDays: parseInt(sickLeaveDays, 10),
      birthYear: parseInt(birthYear, 10),
      isCurrentlyEmployed61Plus: isEmployed61Plus,
      injuryDate,
    };
    const res = calculateSickLeavePay(input);
    setResult(res);
    try {
      localStorage.setItem(
        'ilsem-sick-leave-pay',
        JSON.stringify({ input, result: res, timestamp: new Date().toISOString() })
      );
    } catch {
      // localStorage 사용 불가 환경 무시
    }
    setTimeout(
      () => document.getElementById('slp-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      50
    );
  }

  function handleReset() {
    dailyWageInput.reset(); totalWageInput.reset();
    setTotalDays('90'); setSickLeaveDays(''); setBirthYear('');
    setInjuryDate(''); setIsEmployed61Plus(false);
    setResult(null); setErrors({});
  }

  const iCls = (k: string) =>
    `w-full border-2 rounded-xl px-4 py-3 text-right pr-10 text-[#1E293B] font-medium outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 ${
      errors[k] ? 'border-red-400' : 'border-slate-200'
    }`;
  const iClsL = (k: string) =>
    `w-full border-2 rounded-xl px-4 py-3 text-[#1E293B] font-medium outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 ${
      errors[k] ? 'border-red-400' : 'border-slate-200'
    }`;

  return (
    <div className="space-y-8">
      {/* ── 입력 카드 ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-[#1E293B]">정보 입력</h2>

        {/* 방식 탭 */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">평균임금 산정 방식 <span className="text-red-500">*</span></p>
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            <MethodTab active={method === 'direct'} onClick={() => setMethod('direct')}>1일 평균임금 직접 입력</MethodTab>
            <MethodTab active={method === 'calculate'} onClick={() => setMethod('calculate')}>3개월 임금으로 계산</MethodTab>
          </div>
        </div>

        {method === 'direct' && (
          <InputField label="1일 평균임금" required unit="원" error={errors.dailyWage}
            hint={<>평균임금 미산정 시 <Link href="/calc/average-wage" className="text-[#2563EB] hover:underline">평균임금 계산기</Link> 이용</>}>
            <input type="text" inputMode="numeric" value={dailyWageInput.displayValue}
              onChange={dailyWageInput.onChange} placeholder="예: 100,000" className={iCls('dailyWage')} />
          </InputField>
        )}

        {method === 'calculate' && (
          <div className="space-y-4">
            <InputField label="최근 3개월 임금 총액" required unit="원" error={errors.totalWage} hint="기본급 + 각종 수당 + 상여금(3개월분) 합산">
              <input type="text" inputMode="numeric" value={totalWageInput.displayValue}
                onChange={totalWageInput.onChange} placeholder="예: 9,000,000" className={iCls('totalWage')} />
            </InputField>
            <InputField label="3개월 총 일수" required unit="일" error={errors.totalDays} hint="달력상 일수 (기본 90일)">
              <input type="number" min="1" max="120" value={totalDays}
                onChange={(e) => setTotalDays(e.target.value)} className={iCls('totalDays')} />
            </InputField>
            {previewDailyWage !== null && (
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-[#2563EB] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-slate-600">
                  산출된 1일 평균임금: <strong className="text-[#2563EB] tabular-nums">{formatWon(previewDailyWage)}</strong>
                </span>
              </div>
            )}
          </div>
        )}

        <hr className="border-slate-100" />

        <InputField label="요양 기간" required unit="일" error={errors.sickLeaveDays} hint="4일 이상 요양 시 지급 (1~3일은 사업주 부담)">
          <input type="number" min="1" max="3650" value={sickLeaveDays}
            onChange={(e) => setSickLeaveDays(e.target.value)} placeholder="예: 90" className={iCls('sickLeaveDays')} />
        </InputField>

        <hr className="border-slate-100" />

        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-700">재해 및 연령 정보</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="재해 발생일" required error={errors.injuryDate} hint="고령자 감액 유예 기간 계산에 사용">
              <input type="date" value={injuryDate} onChange={(e) => setInjuryDate(e.target.value)} className={iClsL('injuryDate')} />
            </InputField>
            <InputField label="출생 연도" required unit="년" error={errors.birthYear} hint="재해일 기준 만 나이 자동 계산">
              <input type="number" min="1920" max="2005" value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)} placeholder="예: 1975" className={iCls('birthYear')} />
            </InputField>
          </div>

          {ageAtInjury !== null && (
            <div className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl border ${
              isElderlyAtInjury ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <span>{isElderlyAtInjury ? '⚠️' : 'ℹ️'}</span>
              <span>재해 당시 만 <strong>{ageAtInjury}세</strong>{isElderlyAtInjury && ' — 고령자 감액 규정 대상'}</span>
            </div>
          )}

          {isElderlyAtInjury && (
            <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-amber-200 bg-amber-50 cursor-pointer hover:bg-amber-100/60 transition-colors">
              <input type="checkbox" checked={isEmployed61Plus}
                onChange={(e) => setIsEmployed61Plus(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">만 61세 이상 재직 중 재해 발생</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  체크 시 재해일로부터 2년 유예 기간이 적용되어 그 기간 동안 감액되지 않습니다.
                </p>
              </div>
            </label>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={handleCalculate}
            className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
            휴업급여 계산하기
          </button>
          <button onClick={handleReset}
            className="px-5 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
            초기화
          </button>
        </div>
      </div>

      {/* ── 결과 ── */}
      {result && (() => {
        // 로컬에서 중간값 계산 (UI 표시용)
        const base70 = Math.round(result.dailyAverageWage * C.standardRate);
        const base90 = Math.round(result.dailyAverageWage * C.lowIncomeRate);
        const minFloor = Math.round(C.minCompensationDaily * C.minCompensationRate);
        const maxCap70 = Math.round(C.maxCompensationDaily * C.standardRate);
        const s = CALC_TYPE_STYLE[result.calculationType];

        return (
          <div id="slp-result" className="space-y-5 scroll-mt-20">
            {/* 기준 배지 */}
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
              <span className="text-base">📅</span>
              <span>
                {C.year}년 기준 · 최저보상기준금액 {formatWon(C.minCompensationDaily)} · 최고보상기준금액 {formatWon(C.maxCompensationDaily)}
              </span>
            </div>

            {/* 산정 방식 배너 */}
            <div className={`rounded-xl border ${s.border} ${s.bg} p-4 flex items-start gap-3`}>
              <span className="text-xl shrink-0">{s.icon}</span>
              <div>
                <p className={`text-sm font-bold ${s.text}`}>{result.calculationTypeLabel}</p>
                <p className={`text-xs mt-1 ${s.text} opacity-80 leading-relaxed`}>{result.calculationDetail}</p>
              </div>
            </div>

            {/* 메인 결과 */}
            <div className="bg-gradient-to-br from-[#EEF2FF] to-[#F0FDF4] rounded-2xl border border-[#2563EB]/20 p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">1일 휴업급여</p>
                  <p className="text-2xl font-bold text-[#2563EB] tabular-nums">
                    {formatWon(result.dailySickLeavePayAfterElderly)}
                  </p>
                  {result.isElderlyReduction && (
                    <p className="text-[10px] text-amber-600 mt-1">감액 전 {formatWon(result.dailySickLeavePay)}</p>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">총 휴업급여 ({formatNumber(result.sickLeaveDays)}일)</p>
                  <p className="text-2xl font-bold text-[#16A34A] tabular-nums">{formatWon(result.totalSickLeavePay)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">월 환산 예상액</p>
                  <p className="text-2xl font-bold text-slate-700 tabular-nums">{formatWon(result.monthlyEstimate)}</p>
                  <p className="text-[10px] text-slate-400 mt-1">1일 × 30일</p>
                </div>
              </div>
            </div>

            {/* 계산 상세 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-[#1E293B] mb-4">계산 상세</h3>
              <div className="space-y-3">
                <ResultRow label="1일 평균임금" value={formatWon(result.dailyAverageWage)} />
                <ResultRow
                  label="평균임금 × 70%"
                  value={formatWon(base70)}
                  highlight={result.calculationType === 'standard'}
                />
                <ResultRow
                  label="평균임금 × 90%"
                  value={formatWon(base90)}
                  highlight={result.calculationType === 'lowIncome90'}
                />
                <ResultRow
                  label="최저보상기준금액 × 80%"
                  value={formatWon(minFloor)}
                  highlight={result.calculationType === 'lowIncomeMin80' || result.calculationType === 'minimumWage'}
                  sub="하한선"
                />
                <ResultRow
                  label="최고보상기준금액 × 70%"
                  value={formatWon(maxCap70)}
                  highlight={result.calculationType === 'maxCap'}
                  sub="상한선"
                />
                <hr className="border-slate-100" />
                <ResultRow label="1일 휴업급여 (감액 전)" value={formatWon(result.dailySickLeavePay)} bold />
                {result.isElderlyReduction && result.elderlyReductionRate && (
                  <ResultRow
                    label={`고령자 감액 (만 ${result.elderlyAge}세)`}
                    value={`× ${result.elderlyReductionRate}`}
                    warn
                  />
                )}
                <ResultRow label="1일 휴업급여 (최종)" value={formatWon(result.dailySickLeavePayAfterElderly)} bold accent />
                <hr className="border-slate-100" />
                <ResultRow
                  label={`총 휴업급여 (× ${formatNumber(result.sickLeaveDays)}일)`}
                  value={formatWon(result.totalSickLeavePay)}
                  bold accent large
                />
                <ResultRow label="월 환산 예상액 (× 30일)" value={formatWon(result.monthlyEstimate)} bold />
              </div>
            </div>

            {/* 고령자 감액 섹션 */}
            {result.elderlyAge >= 61 && (
              <div className={`rounded-xl border p-5 ${
                result.isElderlyReduction ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'
              }`}>
                <h4 className={`text-sm font-bold mb-3 flex items-center gap-1.5 ${
                  result.isElderlyReduction ? 'text-amber-800' : 'text-green-800'
                }`}>
                  {result.isElderlyReduction ? '⚠️ 고령자 감액 적용' : '✅ 고령자 감액 미적용 (유예 기간 중)'}
                </h4>
                <div className="space-y-1.5 text-xs">
                  <p className={result.isElderlyReduction ? 'text-amber-700' : 'text-green-700'}>
                    재해 당시 만 <strong>{result.elderlyAge}세</strong>
                    {result.isElderlyGracePeriod && ' · 재해일로부터 2년 유예 기간 중'}
                  </p>
                  {result.isElderlyReduction && result.elderlyReductionRate && (
                    <>
                      <p className="text-amber-700">
                        적용 감액률: <strong>{result.elderlyReductionRate}</strong>
                        {' '}({(() => {
                          const [n, d] = result.elderlyReductionRate!.split('/').map(Number);
                          return ((n / d) * 100).toFixed(1);
                        })()}%)
                      </p>
                      {/* 감액률 테이블 */}
                      <div className="mt-2 bg-white rounded-lg border border-amber-200 overflow-hidden">
                        <table className="w-full text-xs text-center">
                          <thead className="bg-amber-100 text-amber-700">
                            <tr>
                              {['61세', '62세', '63세', '64세', '65세+'].map((a) => (
                                <th key={a} className="py-2 font-semibold">{a}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="text-amber-700">
                              {(result.calculationType === 'standard' || result.calculationType === 'maxCap'
                                ? [[66, 70], [62, 70], [58, 70], [54, 70], [50, 70]]
                                : [[86, 90], [82, 90], [78, 90], [74, 90], [70, 90]]
                              ).map(([n, d], i) => {
                                const ageKey = Math.min(result.elderlyAge, 65);
                                const isActive = i + 61 === ageKey || (i === 4 && ageKey >= 65);
                                return (
                                  <td key={i} className={`py-2 ${isActive ? 'font-bold text-amber-900 bg-amber-100' : ''}`}>
                                    {n}/{d}
                                  </td>
                                );
                              })}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                  {result.isElderlyGracePeriod && (
                    <p className="text-green-600 mt-1">
                      재해일로부터 2년 이내 유예 기간이 적용되어 감액되지 않습니다.
                      유예 종료 후 위 감액률이 적용됩니다.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 주의 사항 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-blue-800 mb-2">알아두세요</h4>
              <ul className="space-y-1.5 text-xs text-blue-700 leading-relaxed">
                <li>• 휴업급여는 4일 이상 요양 시 지급. 1~3일은 사업주 부담입니다.</li>
                <li>• 부분 취업 시 취업한 날의 임금을 공제한 차액의 90%를 지급할 수 있습니다.</li>
                <li>• 요양 2년 후 미치유 시 상병보상연금으로 전환될 수 있습니다.</li>
                <li>• 본 결과는 참고용이며, 정확한 급여는 근로복지공단(1588-0075)에 확인하세요.</li>
              </ul>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
