'use client';

import { useState, useMemo } from 'react';
import {
  calcAnnualLeavePay,
  calcMonthlyWorkHours,
  generateLeaveTable,
  type AnnualLeaveYear,
} from '@/lib/calc/annual-leave-pay';
import { useNumberFormat } from '@/hooks/useNumberFormat';
import { formatWon } from '@/lib/helpers';

// ── 보조 ────────────────────────────────────────

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

function formatServiceDuration(days: number): string {
  const y = Math.floor(days / 365);
  const m = Math.floor((days - y * 365) / 30);
  return [y > 0 && `${y}년`, m > 0 && `${m}개월`].filter(Boolean).join(' ') || '1개월 미만';
}

// ── 메인 컴포넌트 ────────────────────────────────

const todayStr = new Date().toISOString().split('T')[0];

export default function AnnualLeavePayCalculator() {
  // STEP 1: 입사일·기준일
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate]     = useState(todayStr);
  const [showTable, setShowTable] = useState(false);

  // STEP 2: 미사용 연차일수
  const [unusedLeaveStr, setUnusedLeaveStr] = useState('');

  // STEP 3: 급여
  const [wageType, setWageType] = useState<'monthly' | 'hourly'>('monthly');
  const monthlyWageInput    = useNumberFormat(0);
  const fixedAllowanceInput = useNumberFormat(0);
  const annualBonusInput    = useNumberFormat(0);
  const hourlyWageInput     = useNumberFormat(0);

  // 근로시간
  const [weeklyWorkHours, setWeeklyWorkHours] = useState(40);
  const [weeklyWorkDays,  setWeeklyWorkDays]  = useState(5);
  const [dailyWorkHours,  setDailyWorkHours]  = useState(8);

  // ── 유도 ─────────────────────────────────────

  const isDateError = !!(startDate && endDate && new Date(endDate) <= new Date(startDate));

  const serviceDays = useMemo(() => {
    if (!startDate || !endDate || isDateError) return null;
    return Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000);
  }, [startDate, endDate, isDateError]);

  const leaveTable = useMemo<AnnualLeaveYear[]>(() => {
    if (!startDate || !endDate || isDateError) return [];
    try { return generateLeaveTable(startDate, endDate); }
    catch { return []; }
  }, [startDate, endDate, isDateError]);

  const currentPeriod = leaveTable.length > 0 ? leaveTable[leaveTable.length - 1] : null;

  const monthlyWorkHours = useMemo(
    () => calcMonthlyWorkHours(weeklyWorkHours, dailyWorkHours),
    [weeklyWorkHours, dailyWorkHours]
  );

  const isLowHours = weeklyWorkHours > 0 && weeklyWorkHours < 15;

  const unusedLeaveDays = Math.max(parseInt(unusedLeaveStr) || 0, 0);

  // 실시간 임금 미리보기
  const hourlyOrdinaryWage = useMemo(() => {
    if (monthlyWorkHours <= 0) return 0;
    const bonus = Math.round(annualBonusInput.numericValue / 12);
    const monthlyTotal = wageType === 'monthly'
      ? monthlyWageInput.numericValue + fixedAllowanceInput.numericValue + bonus
      : hourlyWageInput.numericValue * monthlyWorkHours + fixedAllowanceInput.numericValue + bonus;
    return Math.round(monthlyTotal / monthlyWorkHours);
  }, [wageType, monthlyWageInput.numericValue, hourlyWageInput.numericValue,
      fixedAllowanceInput.numericValue, annualBonusInput.numericValue, monthlyWorkHours]);

  const dailyOrdinaryWage = hourlyOrdinaryWage * dailyWorkHours;

  // 전체 결과
  const result = useMemo(() => {
    const hasWage = wageType === 'monthly'
      ? monthlyWageInput.numericValue > 0
      : hourlyWageInput.numericValue > 0;
    if (!hasWage) return null;
    return calcAnnualLeavePay({
      wageType,
      monthlyWage: monthlyWageInput.numericValue,
      hourlyWage:  hourlyWageInput.numericValue,
      weeklyWorkHours,
      weeklyWorkDays,
      dailyWorkHours,
      monthlyFixedAllowance: fixedAllowanceInput.numericValue,
      annualBonus:           annualBonusInput.numericValue,
      unusedLeaveDays,
    });
  }, [wageType, monthlyWageInput.numericValue, hourlyWageInput.numericValue,
      weeklyWorkHours, weeklyWorkDays, dailyWorkHours,
      fixedAllowanceInput.numericValue, annualBonusInput.numericValue, unusedLeaveDays]);

  // ── 핸들러 ─────────────────────────────────────

  function handleWeeklyHoursChange(v: number) {
    setWeeklyWorkHours(v);
    if (weeklyWorkDays > 0) setDailyWorkHours(Math.round(v / weeklyWorkDays * 10) / 10);
  }
  function handleWeeklyDaysChange(v: number) {
    setWeeklyWorkDays(v);
    if (v > 0) setDailyWorkHours(Math.round(weeklyWorkHours / v * 10) / 10);
  }
  function handleReset() {
    setStartDate(''); setEndDate(todayStr); setShowTable(false);
    setUnusedLeaveStr(''); setWageType('monthly');
    setWeeklyWorkHours(40); setWeeklyWorkDays(5); setDailyWorkHours(8);
    [monthlyWageInput, fixedAllowanceInput, annualBonusInput, hourlyWageInput].forEach(f => f.reset());
  }

  // ── 스타일 ─────────────────────────────────────
  const iCls = 'w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[#1E293B] font-medium outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100';
  const numCls = `${iCls} text-right pr-10`;

  // ── 렌더 ─────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* ── STEP 1: 입사일·기준일 ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
        <StepHeader step="1" title="입사일 · 기준일" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              입사일 <span className="text-red-500">*</span>
            </label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={iCls} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              기준일 <span className="text-red-500">*</span>
            </label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              min={startDate || undefined} className={iCls} />
            <p className="text-xs text-slate-400 mt-1">
              재직 중이면 오늘 날짜, 퇴직한 경우 퇴직일(마지막 근무일 다음 날) 입력
            </p>
          </div>
        </div>

        {isDateError && (
          <p className="text-xs text-red-500">기준일은 입사일 이후여야 합니다.</p>
        )}

        {serviceDays !== null && serviceDays > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
            <span className="text-slate-500">근속기간</span>
            <span className="font-semibold text-[#1E293B]">
              {formatServiceDuration(serviceDays)}
              <span className="text-slate-400 font-normal ml-2">({serviceDays.toLocaleString()}일)</span>
            </span>
          </div>
        )}

        {currentPeriod && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
            <span className="text-blue-600">현재 구간 연차 발생일수</span>
            <span className="font-bold text-[#2563EB] text-base">{currentPeriod.leaveDays}일</span>
          </div>
        )}
      </div>

      {/* ── 연차 발생 테이블 ── */}
      {leaveTable.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <button type="button" onClick={() => setShowTable(s => !s)}
            className="w-full flex items-center justify-between px-6 sm:px-8 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <span className="flex items-center gap-2">
              <span className="text-base">📋</span> 근속연수별 연차 발생일수 테이블
            </span>
            <span className={`text-slate-400 transition-transform text-xs ${showTable ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {showTable && (
            <div className="overflow-x-auto border-t border-slate-100">
              <table className="w-full text-sm min-w-[300px]">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">구간</th>
                    <th className="px-4 py-2.5 text-center text-xs font-semibold text-slate-500 w-24">연차일수</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaveTable.map((row, i) => {
                    const isCurrent = i === leaveTable.length - 1;
                    return (
                      <tr key={i} className={isCurrent ? 'bg-blue-50' : i % 2 === 1 ? 'bg-slate-50/50' : ''}>
                        <td className={`px-4 py-2.5 text-xs ${isCurrent ? 'text-blue-700 font-semibold' : 'text-slate-500'}`}>
                          {row.label}
                          {isCurrent && <span className="ml-2 text-[10px] bg-blue-200 text-blue-700 px-1.5 py-0.5 rounded-full">현재</span>}
                        </td>
                        <td className={`px-4 py-2.5 text-center font-bold ${isCurrent ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}>
                          {row.leaveDays}일
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-xs text-slate-400 px-4 py-3 border-t border-slate-100">
                ※ 입사 1년차에 사용한 연차일수는 만 1년 시점의 15일에서 차감됩니다 (근로기준법 제60조 제3항)
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: 미사용 연차일수 ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <StepHeader step="2" title="미사용 연차일수" />
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            미사용 연차일수 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number" min={0} max={25}
                value={unusedLeaveStr}
                onChange={e => setUnusedLeaveStr(e.target.value)}
                placeholder="예: 10"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-right pr-10 text-[#1E293B] font-medium outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">일</span>
            </div>
            {currentPeriod && (
              <button
                type="button"
                onClick={() => setUnusedLeaveStr(String(currentPeriod.leaveDays))}
                className="shrink-0 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-[#2563EB] text-sm font-semibold hover:bg-blue-100 transition-colors"
              >
                현재 구간 자동입력 ({currentPeriod.leaveDays}일)
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            위 테이블에서 현재 구간의 발생일수를 참고하세요.
          </p>
        </div>
      </div>

      {/* ── STEP 3: 통상임금 ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
        <StepHeader step="3" title="통상임금 정보" />

        {/* 급여 유형 탭 */}
        <div className="flex rounded-xl border border-slate-200 overflow-hidden text-sm font-semibold">
          {(['monthly', 'hourly'] as const).map(t => (
            <button key={t} type="button"
              onClick={() => setWageType(t)}
              className={`flex-1 py-2.5 transition-colors ${
                wageType === t
                  ? 'bg-[#2563EB] text-white'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}>
              {t === 'monthly' ? '월급제' : '시급제'}
            </button>
          ))}
        </div>

        {/* 월급제 */}
        {wageType === 'monthly' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                월 기본급 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input type="text" inputMode="numeric"
                  value={monthlyWageInput.displayValue} onChange={monthlyWageInput.onChange}
                  placeholder="예: 3,000,000" className={numCls} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">월 고정수당 합계</label>
              <div className="relative">
                <input type="text" inputMode="numeric"
                  value={fixedAllowanceInput.displayValue} onChange={fixedAllowanceInput.onChange}
                  placeholder="예: 200,000" className={numCls} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">직책수당, 직무수당 등 매월 정기·고정 지급 수당 합계</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">연간 상여금 합계</label>
              <div className="relative">
                <input type="text" inputMode="numeric"
                  value={annualBonusInput.displayValue} onChange={annualBonusInput.onChange}
                  placeholder="예: 4,000,000" className={numCls} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">정기·일률적 상여금의 연간 합계 (통상임금에 포함되는 경우)</p>
              {annualBonusInput.numericValue > 0 && (
                <p className="text-xs text-[#2563EB] mt-1 font-medium">
                  → 월할액: {Math.round(annualBonusInput.numericValue / 12).toLocaleString()}원 (÷12)
                </p>
              )}
            </div>
          </div>
        )}

        {/* 시급제 */}
        {wageType === 'hourly' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                시급 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input type="text" inputMode="numeric"
                  value={hourlyWageInput.displayValue} onChange={hourlyWageInput.onChange}
                  placeholder="예: 12,000" className={numCls} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">월 고정수당 합계</label>
              <div className="relative">
                <input type="text" inputMode="numeric"
                  value={fixedAllowanceInput.displayValue} onChange={fixedAllowanceInput.onChange}
                  placeholder="예: 200,000" className={numCls} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
              </div>
            </div>
          </div>
        )}

        {/* 근로시간 */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">근로시간 정보</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">주 소정근로시간</label>
              <div className="relative">
                <input type="number" min={1} max={52} value={weeklyWorkHours}
                  onChange={e => handleWeeklyHoursChange(Number(e.target.value))}
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-right pr-8 text-[#1E293B] font-medium outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-sm" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">h</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">주 근무일수</label>
              <div className="relative">
                <input type="number" min={1} max={7} value={weeklyWorkDays}
                  onChange={e => handleWeeklyDaysChange(Number(e.target.value))}
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-right pr-7 text-[#1E293B] font-medium outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-sm" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">일</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">1일 소정근로시간</label>
              <div className="relative">
                <input type="number" min={1} max={12} step={0.5} value={dailyWorkHours}
                  onChange={e => setDailyWorkHours(Number(e.target.value))}
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-right pr-7 text-[#1E293B] font-medium outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-sm" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">h</span>
              </div>
            </div>
          </div>

          {isLowHours && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
              ⚠️ 주 15시간 미만은 연차유급휴가 적용 제외 대상입니다 (초단시간 근로자).
            </div>
          )}

          {/* 실시간 임금 미리보기 */}
          {hourlyOrdinaryWage > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">월 소정근로시간</span>
                <span className="font-semibold text-[#1E293B]">
                  {monthlyWorkHours}시간
                  <span className="text-slate-400 font-normal ml-1">(주 {weeklyWorkHours}h+주휴) × 365/12/7</span>
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">시간급 통상임금</span>
                <span className="font-semibold text-[#1E293B]">{hourlyOrdinaryWage.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-200 pt-1.5">
                <span className="text-slate-600 font-medium">1일 통상임금</span>
                <span className="font-bold text-[#2563EB]">{dailyOrdinaryWage.toLocaleString()}원</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 결과 ── */}
      {result && (
        <div className="space-y-5">
          {/* 메인 결과 */}
          <div className="bg-gradient-to-br from-[#EEF2FF] to-[#F0FDF4] rounded-2xl border border-[#2563EB]/20 p-6 sm:p-8 text-center">
            <p className="text-xs text-slate-500 mb-3 font-medium">미사용 연차수당 (세전)</p>
            <p className="text-3xl sm:text-4xl font-bold text-[#2563EB] tabular-nums">
              {formatWon(result.totalPay)}
            </p>
            <p className="text-sm text-slate-500 mt-3">
              1일 통상임금&nbsp;
              <strong className="text-[#1E293B]">{result.dailyOrdinaryWage.toLocaleString()}원</strong>
              &nbsp;×&nbsp;미사용&nbsp;
              <strong className="text-[#1E293B]">{result.unusedLeaveDays}일</strong>
            </p>
          </div>

          {/* 산정 과정 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-[#1E293B] mb-4 flex items-center gap-2">
              <span className="text-lg">📊</span> 산정 과정
            </h3>

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">통상임금 산정</p>
            <div className="space-y-0.5">
              {wageType === 'monthly' ? (
                <>
                  <Row label="월 기본급" value={formatWon(monthlyWageInput.numericValue)} />
                  <Row
                    label="월 고정수당"
                    value={fixedAllowanceInput.numericValue > 0 ? formatWon(fixedAllowanceInput.numericValue) : '—'}
                    muted={fixedAllowanceInput.numericValue === 0}
                  />
                  <Row
                    label="상여금 월할액"
                    sub={`연 ${formatWon(annualBonusInput.numericValue)} ÷ 12`}
                    value={annualBonusInput.numericValue > 0
                      ? formatWon(Math.round(annualBonusInput.numericValue / 12))
                      : '—'}
                    muted={annualBonusInput.numericValue === 0}
                  />
                </>
              ) : (
                <>
                  <Row label="시급" value={`${hourlyWageInput.numericValue.toLocaleString()}원`} />
                  <Row label="월 고정수당" value={fixedAllowanceInput.numericValue > 0 ? formatWon(fixedAllowanceInput.numericValue) : '—'} muted={fixedAllowanceInput.numericValue === 0} />
                </>
              )}
              <div className="border-t border-slate-100 my-2" />
              <Row label="월 통상임금 합계" value={formatWon(result.monthlyOrdinaryWageTotal)} bold />
              <Row label={`÷ 월 소정근로시간`} value={`${result.monthlyWorkHours}시간`} muted />
              <Row label="= 시간급 통상임금" value={`${result.hourlyOrdinaryWage.toLocaleString()}원`} bold />
              <Row label={`× 1일 소정근로시간`} value={`${dailyWorkHours}시간`} muted />
              <Row label="= 1일 통상임금" value={`${result.dailyOrdinaryWage.toLocaleString()}원`} bold accent />
            </div>

            <div className="border-t border-slate-100 my-4" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">연차수당</p>
            <div className="space-y-0.5">
              <Row label="1일 통상임금" value={`${result.dailyOrdinaryWage.toLocaleString()}원`} />
              <Row label="× 미사용 연차일수" value={`${result.unusedLeaveDays}일`} />
              <div className="border-t border-slate-100 my-2" />
              <Row label="= 미사용 연차수당" value={formatWon(result.totalPay)} bold accent />
            </div>
          </div>

          {/* 연차사용촉진 안내 */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2 text-xs text-amber-700">
            <span className="shrink-0 mt-0.5">💡</span>
            <span>
              <strong>연차사용촉진 제도 (근로기준법 제61조):</strong> 사용자가 적법한 촉진 절차를 이행한 경우
              미사용 연차수당 지급 의무가 면제됩니다. 퇴직 시 발생 연차는 사용촉진 면책이 적용되지 않습니다.
            </span>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-2 text-xs text-blue-700">
            <span className="shrink-0 mt-0.5">📌</span>
            연차수당은 연차가 소멸하는 날의 다음 임금 지급일에 지급해야 합니다.
            청구 시효는 <strong>3년</strong>입니다 (근로기준법 제49조).
          </div>
        </div>
      )}

      {/* 초기화 */}
      {startDate && (
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
