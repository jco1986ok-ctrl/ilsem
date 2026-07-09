'use client';

import { useState, useMemo } from 'react';
import {
  calcRetirementPay,
  getThreeMonthPeriods,
  type MonthlyWage,
  type RetirementResult,
} from '@/lib/calc/retirement-pay';
import { useNumberFormat } from '@/hooks/useNumberFormat';
import { formatWon } from '@/lib/helpers';

// ── 보조 컴포넌트 ─────────────────────────────────────────────

function Row({ label, value, muted, bold, accent, sub }: {
  label: string; value: string; muted?: boolean; bold?: boolean; accent?: boolean; sub?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className={`text-sm ${muted ? 'text-slate-400' : bold ? 'text-[#1E293B] font-semibold' : 'text-slate-500'}`}>
        {label}
        {sub && <span className="text-xs text-slate-400 font-normal ml-1">({sub})</span>}
      </span>
      <span className={`tabular-nums font-semibold text-sm ${
        accent ? 'text-[#2563EB]' : muted ? 'text-slate-400' : bold ? 'text-[#1E293B]' : 'text-slate-700'
      }`}>{value}</span>
    </div>
  );
}

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

// ── 헬퍼 ──────────────────────────────────────────────────────

function fmtDec(n: number) {
  return n.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatServiceDuration(days: number): string {
  const y = Math.floor(days / 365);
  const rem = days - y * 365;
  const m = Math.floor(rem / 30);
  const d = rem - m * 30;
  return [y > 0 && `${y}년`, m > 0 && `${m}개월`, d > 0 && `${d}일`]
    .filter(Boolean).join(' ') || `${days}일`;
}

// ── 메인 ─────────────────────────────────────────────────────

export default function RetirementPayCalculator() {
  // STEP 1: 재직기간
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate]     = useState('');

  // STEP 2: 3개월 임금 — same wage mode
  const [sameWage, setSameWage]   = useState(false);
  const mBase  = useNumberFormat(0);  // 월 기본급 (same)
  const mAllow = useNumberFormat(0);  // 월 기타수당 (same)

  // STEP 2: 3개월 임금 — individual mode (6 hooks, unconditional)
  const bp1 = useNumberFormat(0);  const al1 = useNumberFormat(0);
  const bp2 = useNumberFormat(0);  const al2 = useNumberFormat(0);
  const bp3 = useNumberFormat(0);  const al3 = useNumberFormat(0);

  // STEP 3: 상여금·연차수당
  const bonusInput = useNumberFormat(0);
  const leaveInput = useNumberFormat(0);

  // STEP 4: 통상임금 비교
  const [showOrdinary, setShowOrdinary] = useState(false);
  const ordInput = useNumberFormat(0);

  // 기간 유도
  const periods = useMemo(() => {
    if (!endDate) return null;
    try { return getThreeMonthPeriods(endDate); }
    catch { return null; }
  }, [endDate]);

  const totalServiceDays = useMemo(() => {
    if (!startDate || !endDate) return null;
    const s = new Date(startDate), e = new Date(endDate);
    if (e <= s) return null;
    return Math.round((e.getTime() - s.getTime()) / 86_400_000);
  }, [startDate, endDate]);

  // 3개월 임금 배열
  const periodInputs = [{ bp: bp1, al: al1 }, { bp: bp2, al: al2 }, { bp: bp3, al: al3 }];

  const monthlyWages: MonthlyWage[] = useMemo(() => {
    if (!periods) return [];
    return periods.periods.map((p, i) => {
      const base  = sameWage
        ? Math.round(mBase.numericValue  * Math.min(p.days, 30) / 30)
        : periodInputs[i].bp.numericValue;
      const allow = sameWage
        ? Math.round(mAllow.numericValue * Math.min(p.days, 30) / 30)
        : periodInputs[i].al.numericValue;
      return { days: p.days, basePay: base, allowance: allow };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periods, sameWage, mBase.numericValue, mAllow.numericValue,
      bp1.numericValue, al1.numericValue, bp2.numericValue, al2.numericValue,
      bp3.numericValue, al3.numericValue]);

  // 실시간 계산
  const result = useMemo<RetirementResult | null>(() => {
    if (!startDate || !endDate || !periods) return null;
    if (!monthlyWages.some(w => w.basePay > 0 || w.allowance > 0)) return null;
    try {
      return calcRetirementPay({
        startDate, endDate, monthlyWages,
        annualBonus:       bonusInput.numericValue,
        annualLeavePay:    leaveInput.numericValue,
        dailyOrdinaryWage: showOrdinary && ordInput.numericValue > 0 ? ordInput.numericValue : undefined,
      });
    } catch { return null; }
  }, [startDate, endDate, periods, monthlyWages,
      bonusInput.numericValue, leaveInput.numericValue, showOrdinary, ordInput.numericValue]);

  function handleReset() {
    setStartDate(''); setEndDate(''); setSameWage(false); setShowOrdinary(false);
    [mBase, mAllow, bp1, al1, bp2, al2, bp3, al3, bonusInput, leaveInput, ordInput]
      .forEach(f => f.reset());
  }

  const iCls = 'w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[#1E293B] font-medium outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100';
  const tCls = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-right text-[#1E293B] text-sm font-medium outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-100';

  const wageTotal = monthlyWages.reduce((s, w) => s + w.basePay + w.allowance, 0);
  const isDateError = startDate && endDate && new Date(endDate) <= new Date(startDate);

  return (
    <div className="space-y-6">

      {/* ── STEP 1: 재직기간 ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
        <StepHeader step="1" title="재직기간" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              입사일 <span className="text-red-500">*</span>
            </label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={iCls} />
            <p className="text-xs text-slate-400 mt-1">최초 근로계약 시작일</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              퇴직일 <span className="text-red-500">*</span>
            </label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              min={startDate || undefined} className={iCls} />
            <p className="text-xs text-slate-400 mt-1">마지막 근무일의 다음 날 (예: 3/31 근무 → 4/1 입력)</p>
          </div>
        </div>

        {isDateError && (
          <p className="text-xs text-red-500">퇴직일은 입사일 이후여야 합니다.</p>
        )}

        {totalServiceDays !== null && totalServiceDays > 0 && (
          <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
            totalServiceDays >= 365
              ? 'bg-green-50 border-green-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <span className="text-lg">{totalServiceDays >= 365 ? '✅' : '⚠️'}</span>
            <div>
              <span className={`font-semibold ${totalServiceDays >= 365 ? 'text-green-700' : 'text-amber-700'}`}>
                재직 {totalServiceDays.toLocaleString()}일 ({formatServiceDuration(totalServiceDays)})
              </span>
              <span className={`ml-2 text-xs ${totalServiceDays >= 365 ? 'text-green-600' : 'text-amber-600'}`}>
                {totalServiceDays >= 365 ? '퇴직금 수급 가능' : '1년 미만 — 퇴직금 수급 불가'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── STEP 2: 3개월 임금 ── */}
      {periods && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <StepHeader step="2" title="퇴직 전 3개월 임금" />
            <label className="flex items-center gap-2 cursor-pointer text-sm select-none">
              <input type="checkbox" checked={sameWage} onChange={e => setSameWage(e.target.checked)}
                className="w-4 h-4 accent-blue-600" />
              <span className="text-slate-600 font-medium">매월 동일 급여</span>
            </label>
          </div>

          {/* 동일 급여 입력 */}
          {sameWage && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-50 rounded-xl p-4">
              <div>
                <label className="block text-xs font-semibold text-blue-700 mb-1">월 기본급</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" value={mBase.displayValue} onChange={mBase.onChange}
                    placeholder="예: 3,000,000"
                    className="w-full border border-blue-200 bg-white rounded-lg px-3 py-2 text-right pr-8 text-sm text-[#1E293B] outline-none focus:border-[#2563EB]" />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">원</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-blue-700 mb-1">월 기타수당</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" value={mAllow.displayValue} onChange={mAllow.onChange}
                    placeholder="예: 150,000"
                    className="w-full border border-blue-200 bg-white rounded-lg px-3 py-2 text-right pr-8 text-sm text-[#1E293B] outline-none focus:border-[#2563EB]" />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">원</span>
                </div>
              </div>
              <p className="col-span-2 text-xs text-blue-600">
                각 구간 일수에 비례하여 자동 계산됩니다 (월급 × 구간일수 ÷ 30)
              </p>
            </div>
          )}

          {/* 임금 테이블 */}
          <div className="overflow-x-auto -mx-1">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 rounded-tl-lg">기간</th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500 w-14">일수</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-500">기본급 (원)</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-500">기타수당 (원)</th>
                  <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-500 rounded-tr-lg">합계 (원)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {periods.periods.map((p, i) => {
                  const { bp, al } = periodInputs[i];
                  const autoBase  = sameWage
                    ? Math.round(mBase.numericValue  * Math.min(p.days, 30) / 30)
                    : bp.numericValue;
                  const autoAllow = sameWage
                    ? Math.round(mAllow.numericValue * Math.min(p.days, 30) / 30)
                    : al.numericValue;
                  return (
                    <tr key={i} className={i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                      <td className="px-3 py-2.5 text-xs text-slate-500 whitespace-nowrap">{p.label}</td>
                      <td className="px-3 py-2.5 text-center text-xs font-bold text-[#2563EB]">{p.days}일</td>
                      <td className="px-3 py-2.5">
                        {sameWage
                          ? <p className="text-right font-medium text-[#1E293B]">{autoBase.toLocaleString()}</p>
                          : <input type="text" inputMode="numeric" value={bp.displayValue} onChange={bp.onChange}
                              placeholder="0" className={tCls} />}
                      </td>
                      <td className="px-3 py-2.5">
                        {sameWage
                          ? <p className="text-right font-medium text-[#1E293B]">{autoAllow.toLocaleString()}</p>
                          : <input type="text" inputMode="numeric" value={al.displayValue} onChange={al.onChange}
                              placeholder="0" className={tCls} />}
                      </td>
                      <td className="px-3 py-2.5 text-right font-semibold text-[#1E293B]">
                        {(autoBase + autoAllow) > 0 ? (autoBase + autoAllow).toLocaleString() : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold">
                  <td className="px-3 py-2.5 text-xs text-slate-700">합계</td>
                  <td className="px-3 py-2.5 text-center text-xs text-slate-700">{periods.totalDays}일</td>
                  <td colSpan={2} />
                  <td className="px-3 py-2.5 text-right text-sm text-[#2563EB]">
                    {wageTotal > 0 ? wageTotal.toLocaleString() + '원' : '—'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ── STEP 3: 상여금·연차수당 ── */}
      {periods && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
          <StepHeader step="3" title="상여금 · 연차수당" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">연간 상여금 총액</label>
              <div className="relative">
                <input type="text" inputMode="numeric" value={bonusInput.displayValue} onChange={bonusInput.onChange}
                  placeholder="예: 4,000,000"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-right pr-10 text-[#1E293B] font-medium outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">퇴직 전 1년 이내 지급된 상여금 총액</p>
              {bonusInput.numericValue > 0 && (
                <p className="text-xs text-[#2563EB] mt-1 font-medium">
                  → 가산액: {Math.round(bonusInput.numericValue * 3 / 12).toLocaleString()}원 (× 3/12)
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">연차수당</label>
              <div className="relative">
                <input type="text" inputMode="numeric" value={leaveInput.displayValue} onChange={leaveInput.onChange}
                  placeholder="예: 500,000"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-right pr-10 text-[#1E293B] font-medium outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">퇴직전전년 출근율로 발생한 미사용 연차수당</p>
              {leaveInput.numericValue > 0 && (
                <p className="text-xs text-[#2563EB] mt-1 font-medium">
                  → 가산액: {Math.round(leaveInput.numericValue * 3 / 12).toLocaleString()}원 (× 3/12)
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 4: 통상임금 비교 ── */}
      {periods && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <button type="button" onClick={() => setShowOrdinary(o => !o)}
            className="flex items-center justify-between w-full">
            <StepHeader step="4" title="통상임금 비교 (선택)" />
            <span className={`text-slate-400 text-sm transition-transform ${showOrdinary ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {showOrdinary && (
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">1일 통상임금</label>
                <div className="relative">
                  <input type="text" inputMode="numeric" value={ordInput.displayValue} onChange={ordInput.onChange}
                    placeholder="예: 96,000"
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-right pr-10 text-[#1E293B] font-medium outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  시간급 통상임금 × 1일 소정근로시간.&nbsp;
                  <a href="/calc/average-wage" className="text-[#2563EB] underline">평균임금 계산기</a>에서 확인하세요.
                </p>
              </div>
              <p className="text-xs text-slate-400">
                1일 평균임금보다 통상임금이 높으면 통상임금으로 퇴직금을 계산합니다 (근로기준법 제2조 제2항)
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── 결과 ── */}
      {result && (
        <div className="space-y-5">
          {/* 수급 불가 */}
          {!result.isEligible && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-bold text-amber-700">퇴직금 수급 대상이 아닙니다</p>
                <p className="text-sm text-amber-600 mt-1">{result.ineligibleReason}</p>
              </div>
            </div>
          )}

          {result.isEligible && (
            <>
              {/* 메인 결과 카드 */}
              <div className="bg-gradient-to-br from-[#EEF2FF] to-[#F0FDF4] rounded-2xl border border-[#2563EB]/20 p-6 sm:p-8 text-center">
                <p className="text-xs text-slate-500 mb-3 font-medium">예상 퇴직금 (세전)</p>
                <p className="text-3xl sm:text-4xl font-bold text-[#2563EB] tabular-nums">
                  {formatWon(result.retirementPay)}
                </p>
                <p className="text-sm text-slate-500 mt-3">
                  적용 기준:&nbsp;
                  <strong className={result.appliedBasis === '통상임금' ? 'text-amber-600' : 'text-[#2563EB]'}>
                    {result.appliedBasis}
                  </strong>
                  {result.appliedBasis === '통상임금' && (
                    <span className="text-xs ml-1 text-amber-500">(통상임금이 더 높아 통상임금 기준 적용)</span>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  근속 {result.yearsOfService}년 ({result.totalDays.toLocaleString()}일) · IRP 계좌 지급
                </p>
              </div>

              {/* 산정 과정 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-base font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                  <span className="text-lg">📊</span> 산정 과정
                </h3>

                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">1일 평균임금 산정</p>
                <div className="space-y-0.5">
                  <Row label="A. 3개월간 임금총액" value={formatWon(result.threeMonthWageTotal)} />
                  <Row
                    label={`B. 상여금 가산액`}
                    sub={`연간 ${formatWon(bonusInput.numericValue)} × 3/12`}
                    value={result.bonusAddition > 0 ? formatWon(result.bonusAddition) : '—'}
                    muted={result.bonusAddition === 0}
                  />
                  <Row
                    label={`C. 연차수당 가산액`}
                    sub={`${formatWon(leaveInput.numericValue)} × 3/12`}
                    value={result.leavePayAddition > 0 ? formatWon(result.leavePayAddition) : '—'}
                    muted={result.leavePayAddition === 0}
                  />
                  <div className="border-t border-slate-100 my-2" />
                  <Row label="합계 (A+B+C)" value={formatWon(result.avgWageBase)} bold />
                  <Row label="÷ 3개월 총 일수" value={`${result.threeMonthDays}일`} muted />
                  <Row label="= 1일 평균임금" value={`${fmtDec(result.dailyAvgWage)}원`} bold accent />
                </div>

                {result.dailyOrdinaryWage !== undefined && (
                  <>
                    <div className="border-t border-slate-100 my-4" />
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">통상임금 비교</p>
                    <div className="space-y-0.5">
                      <Row label="1일 평균임금" value={`${fmtDec(result.dailyAvgWage)}원`} />
                      <Row label="1일 통상임금" value={`${result.dailyOrdinaryWage.toLocaleString()}원`} />
                      <Row
                        label="→ 적용 임금"
                        value={`${fmtDec(result.appliedDailyWage)}원 (${result.appliedBasis})`}
                        bold accent
                      />
                    </div>
                  </>
                )}

                <div className="border-t border-slate-100 my-4" />
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">최종 퇴직금 계산</p>
                <div className="space-y-0.5">
                  <Row
                    label={`${fmtDec(result.appliedDailyWage)}원 × 30일 × (${result.totalDays}일 ÷ 365)`}
                    value={formatWon(result.retirementPay)}
                    bold accent
                  />
                </div>
              </div>

              {/* 참고 카드들 */}
              <div className="space-y-3">
                {result.appliedBasis === '통상임금' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2 text-xs text-amber-700">
                    <span className="shrink-0">💡</span>
                    통상임금이 평균임금보다 높아 통상임금 기준으로 계산되었습니다 (근로기준법 제2조 제2항).
                  </div>
                )}
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-2 text-xs text-blue-700">
                  <span className="shrink-0">📌</span>
                  퇴직금은 퇴직일로부터 <strong>14일 이내</strong> 지급 (근로자퇴직급여 보장법 제9조) ·
                  2022.4.14부터 IRP 계좌로 지급됩니다.
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-start gap-2 text-xs text-slate-500">
                  <span className="shrink-0">ℹ️</span>
                  퇴직 전 3개월 내 육아휴직·출산휴가 등이 포함된 경우 해당 기간 제외 후 별도 산정이 필요합니다.
                  <a href="https://www.moel.go.kr/retirementpayCal.do" target="_blank" rel="noopener noreferrer"
                    className="ml-1 text-[#2563EB] underline whitespace-nowrap">고용노동부 계산기 비교 →</a>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 초기화 */}
      {(startDate || endDate) && (
        <div className="flex justify-end">
          <button onClick={handleReset}
            className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
            입력 초기화
          </button>
        </div>
      )}
    </div>
  );
}
