'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useNumberFormat } from '@/hooks/useNumberFormat';
import {
  calculateDisabilityPay,
  type DisabilityPayInput,
  type DisabilityPayResult,
} from '@/lib/calculators/disability';
import { DISABILITY_TABLE, type DisabilityGrade } from '@/lib/constants/disability-data';
import { formatWon, formatNumber } from '@/lib/helpers';

// ── 보조 컴포넌트 ─────────────────────────────────────────────

function MethodTab({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
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

function ResultRow({ label, value, sub, highlight, bold, accent, large, muted }: {
  label: string; value: string; sub?: string;
  highlight?: boolean; bold?: boolean; accent?: boolean; large?: boolean; muted?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${highlight ? 'bg-blue-50 -mx-2 px-2 rounded-lg' : ''}`}>
      <span className={`text-sm ${muted ? 'text-slate-400' : bold ? 'text-[#1E293B] font-semibold' : 'text-slate-500'}`}>
        {label}
        {sub && <span className="text-xs text-slate-400 font-normal ml-1">({sub})</span>}
        {highlight && (
          <span className="text-[10px] bg-[#2563EB] text-white px-1.5 py-0.5 rounded font-semibold ml-1">적용</span>
        )}
      </span>
      <span className={`tabular-nums font-semibold ${large ? 'text-lg' : 'text-sm'} ${
        accent ? 'text-[#2563EB]' : muted ? 'text-slate-400' : 'text-[#1E293B]'
      }`}>
        {value}
      </span>
    </div>
  );
}

// 등급 유형 스타일
const TYPE_STYLE = {
  'pension-only':  { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700',   label: '연금 지급' },
  'choice':        { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-700', label: '연금/일시금 선택' },
  'lump-sum-only': { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  badge: 'bg-green-100 text-green-700',  label: '일시금 지급' },
} as const;

// ── 메인 ─────────────────────────────────────────────────────

export default function DisabilityPayCalculator() {
  const [method, setMethod] = useState<'direct' | 'calculate'>('direct');
  const dailyWageInput  = useNumberFormat(0);
  const totalWageInput  = useNumberFormat(0);
  const [totalDays, setTotalDays]     = useState('90');
  const [grade, setGrade]             = useState<DisabilityGrade | null>(null);
  const [result, setResult]           = useState<DisabilityPayResult | null>(null);
  const [errors, setErrors]           = useState<Record<string, string>>({});

  // 3개월 계산 미리보기
  const previewDailyWage = useMemo(() => {
    if (method !== 'calculate') return null;
    const total = totalWageInput.numericValue;
    const days  = parseInt(totalDays, 10) || 90;
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
    if (!grade) errs.grade = '장해등급을 선택해 주세요.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleCalculate() {
    if (!validate()) return;
    const input: DisabilityPayInput = {
      averageWageMethod: method,
      dailyAverageWage:  method === 'direct'    ? dailyWageInput.numericValue  : undefined,
      totalWage3Months:  method === 'calculate' ? totalWageInput.numericValue  : undefined,
      totalDays3Months:  method === 'calculate' ? (parseInt(totalDays, 10) || 90) : undefined,
      grade: grade!,
    };
    const res = calculateDisabilityPay(input);
    setResult(res);
    try {
      localStorage.setItem('ilsem-disability-pay', JSON.stringify({
        input, result: res, timestamp: new Date().toISOString(),
      }));
    } catch { /* ignore */ }
    setTimeout(
      () => document.getElementById('dp-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      50
    );
  }

  function handleReset() {
    dailyWageInput.reset(); totalWageInput.reset();
    setTotalDays('90'); setGrade(null);
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

        {/* 평균임금 방식 탭 */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">
            평균임금 산정 방식 <span className="text-red-500">*</span>
          </p>
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            <MethodTab active={method === 'direct'}    onClick={() => setMethod('direct')}>1일 평균임금 직접 입력</MethodTab>
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
            <InputField label="최근 3개월 임금 총액" required unit="원" error={errors.totalWage}
              hint="기본급 + 각종 수당 + 상여금(3개월분) 합산">
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

        {/* 장해등급 선택 */}
        <div>
          <p className={`text-sm font-semibold mb-3 ${errors.grade ? 'text-red-500' : 'text-slate-700'}`}>
            장해등급 <span className="text-red-500">*</span>
            {errors.grade && <span className="font-normal ml-2">{errors.grade}</span>}
          </p>
          <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
            {DISABILITY_TABLE.map((row) => {
              const s = TYPE_STYLE[row.type];
              const isSelected = grade === row.grade;
              return (
                <button
                  key={row.grade}
                  type="button"
                  onClick={() => { setGrade(row.grade as DisabilityGrade); setErrors((e) => ({ ...e, grade: '' })); }}
                  className={`relative flex flex-col items-center justify-center py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                    isSelected
                      ? `${s.bg} ${s.border} ${s.text} shadow-sm ring-2 ring-offset-1 ${
                          row.type === 'pension-only'  ? 'ring-blue-400' :
                          row.type === 'choice'        ? 'ring-indigo-400' : 'ring-green-400'
                        }`
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className={isSelected ? '' : 'text-slate-400'}>{row.grade}급</span>
                </button>
              );
            })}
          </div>

          {/* 선택된 등급 안내 */}
          {grade && (() => {
            const info = DISABILITY_TABLE.find((r) => r.grade === grade)!;
            const s = TYPE_STYLE[info.type];
            return (
              <div className={`mt-3 flex items-center gap-2.5 px-4 py-3 rounded-xl border ${s.border} ${s.bg}`}>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.badge}`}>{grade}급</span>
                <span className={`text-sm font-semibold ${s.text}`}>{s.label}</span>
                <span className={`text-xs ${s.text} opacity-70`}>
                  · 노동력 상실률 {info.lossRate}%
                  {info.pensionDays && ` · 연금 ${info.pensionDays}일`}
                  {` · 일시금 ${info.lumpSumDays}일`}
                </span>
              </div>
            );
          })()}

          {/* 범례 */}
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-100 border border-blue-200"></span>1~3급 연금
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-indigo-100 border border-indigo-200"></span>4~7급 선택
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-100 border border-green-200"></span>8~14급 일시금
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={handleCalculate}
            className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
            장해급여 계산하기
          </button>
          <button onClick={handleReset}
            className="px-5 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
            초기화
          </button>
        </div>
      </div>

      {/* ── 결과 ── */}
      {result && (() => {
        const s = TYPE_STYLE[result.gradeType];
        return (
          <div id="dp-result" className="space-y-5 scroll-mt-20">

            {/* 등급 배지 */}
            <div className={`rounded-xl border ${s.border} ${s.bg} p-4 flex items-center gap-3`}>
              <span className={`text-xl font-black ${s.text}`}>{result.grade}급</span>
              <div>
                <p className={`text-sm font-bold ${s.text}`}>{s.label}</p>
                <p className={`text-xs mt-0.5 ${s.text} opacity-70`}>
                  노동력 상실률 {result.lossRate}% ·{' '}
                  {result.pensionDays && `연금 ${formatNumber(result.pensionDays)}일 · `}
                  일시금 {formatNumber(result.lumpSumDays)}일
                </p>
              </div>
            </div>

            {/* 1~3급: 연금만 */}
            {result.gradeType === 'pension-only' && result.annualPension !== null && (
              <div className="bg-gradient-to-br from-[#EEF2FF] to-[#F0FDF4] rounded-2xl border border-[#2563EB]/20 p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">월 장해연금</p>
                    <p className="text-2xl font-bold text-[#2563EB] tabular-nums">{formatWon(result.monthlyPension!)}</p>
                    <p className="text-[10px] text-slate-400 mt-1">매월 수령</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">연간 장해연금</p>
                    <p className="text-2xl font-bold text-[#16A34A] tabular-nums">{formatWon(result.annualPension)}</p>
                    <p className="text-[10px] text-slate-400 mt-1">연 {formatNumber(result.pensionDays!)}일 기준</p>
                  </div>
                </div>
                <p className="text-center text-xs text-slate-500 mt-4 pt-4 border-t border-slate-200">
                  1~3급은 연금만 지급됩니다. 일시금으로 수령 불가.
                </p>
              </div>
            )}

            {/* 8~14급: 일시금만 */}
            {result.gradeType === 'lump-sum-only' && (
              <div className="bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] rounded-2xl border border-green-200 p-6 sm:p-8">
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">장해일시금</p>
                  <p className="text-3xl font-bold text-[#16A34A] tabular-nums">{formatWon(result.lumpSumAmount)}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    1일 평균임금 {formatWon(result.dailyAverageWage)} × {formatNumber(result.lumpSumDays)}일
                  </p>
                </div>
              </div>
            )}

            {/* 4~7급: 연금 / 일시금 / 일부연금 3가지 선택지 */}
            {result.gradeType === 'choice' && result.annualPension !== null && (
              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-700">수령 방법 선택 (3가지)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 연금 전액 */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center space-y-1">
                    <p className="text-xs font-bold text-blue-700 mb-2">① 연금 전액 수령</p>
                    <p className="text-lg font-bold text-blue-700 tabular-nums">{formatWon(result.monthlyPension!)}</p>
                    <p className="text-[10px] text-blue-600">월 수령액</p>
                    <p className="text-[10px] text-blue-500 mt-1">연간 {formatWon(result.annualPension)}</p>
                  </div>
                  {/* 일시금 전액 */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center space-y-1">
                    <p className="text-xs font-bold text-green-700 mb-2">② 일시금 전액 수령</p>
                    <p className="text-lg font-bold text-green-700 tabular-nums">{formatWon(result.lumpSumAmount)}</p>
                    <p className="text-[10px] text-green-600">일시 수령액</p>
                    <p className="text-[10px] text-green-500 mt-1">{formatNumber(result.lumpSumDays)}일분 일괄</p>
                  </div>
                  {/* 일부연금 */}
                  <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 text-center space-y-1">
                    <p className="text-xs font-bold text-indigo-700 mb-2">③ 일부연금 (50%+50%)</p>
                    <p className="text-xs text-indigo-700">선급 일시금</p>
                    <p className="text-base font-bold text-indigo-700 tabular-nums">{formatWon(result.partialLumpSum!)}</p>
                    <p className="text-xs text-indigo-700 mt-1">잔여 연금 (월)</p>
                    <p className="text-base font-bold text-indigo-700 tabular-nums">{formatWon(result.partialMonthlyPension!)}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400">※ 일부연금: 일시금의 50%를 먼저 받고, 나머지 50%를 연금으로 수령하는 방식입니다.</p>
              </div>
            )}

            {/* 계산 상세 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-[#1E293B] mb-4">계산 상세</h3>
              <div className="space-y-2">
                <ResultRow label="1일 평균임금" value={formatWon(result.dailyAverageWage)} />
                <ResultRow label="장해등급" value={`${result.grade}급`} />
                <ResultRow label="노동력 상실률" value={`${result.lossRate}%`} />
                <hr className="border-slate-100" />
                {result.pensionDays !== null && (
                  <>
                    <ResultRow label="연금 지급일수" value={`${formatNumber(result.pensionDays)}일`} />
                    <ResultRow label="연간 장해연금" value={formatWon(result.annualPension!)} bold />
                    <ResultRow label="월 장해연금" value={formatWon(result.monthlyPension!)} bold accent />
                  </>
                )}
                <ResultRow label="일시금 지급일수" value={`${formatNumber(result.lumpSumDays)}일`} />
                <ResultRow label="장해일시금" value={formatWon(result.lumpSumAmount)} bold accent={result.gradeType === 'lump-sum-only'} />
                {result.gradeType === 'choice' && result.partialLumpSum !== null && (
                  <>
                    <hr className="border-slate-100" />
                    <p className="text-xs text-slate-400 pt-1">일부연금 선택 시</p>
                    <ResultRow label="선급 일시금 (50%)" value={formatWon(result.partialLumpSum)} muted />
                    <ResultRow label="잔여 월 연금 (50%)" value={formatWon(result.partialMonthlyPension!)} muted />
                  </>
                )}
              </div>
            </div>

            {/* 주의 사항 */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="text-xs font-bold text-blue-800 mb-2">알아두세요</h4>
              <ul className="space-y-1.5 text-xs text-blue-700 leading-relaxed">
                <li>• 장해급여는 요양이 종결된 후 신체에 남은 장해에 대해 지급합니다.</li>
                {result.gradeType === 'pension-only' && (
                  <li>• 1~3급은 연금만 지급되며, 일시금 수령은 불가능합니다.</li>
                )}
                {result.gradeType === 'choice' && (
                  <li>• 4~7급은 연금·일시금·일부연금 중 선택할 수 있으며, 장기 수령 시 연금이 유리할 수 있습니다.</li>
                )}
                <li>• 동일 사고로 여러 신체 부위에 장해가 남은 경우 병합 적용 규정이 있으니 공단에 확인하세요.</li>
                <li>• 정확한 장해등급 판정은 근로복지공단(1588-0075) 심사를 거쳐야 합니다.</li>
              </ul>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
