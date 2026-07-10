'use client';

import { useState, useMemo } from 'react';
import {
  calcInjuryReport,
  calcRetireReport,
  type InjuryInput,
  type RetireInput,
  type ReportLine,
  type InjuryResult,
  type RetireResult,
} from '@/lib/calc/report';
import { useNumberFormat } from '@/hooks/useNumberFormat';
import { formatWon } from '@/lib/helpers';

// ── 보조 ─────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{children}</p>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function DateInput({ value, onChange, min, max }: {
  value: string; onChange: (v: string) => void; min?: string; max?: string;
}) {
  return (
    <input type="date" value={value} min={min} max={max}
      onChange={e => onChange(e.target.value)}
      className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-[#1E293B] font-medium outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-sm" />
  );
}

function MoneyInput({ hook, placeholder }: { hook: ReturnType<typeof useNumberFormat>; placeholder?: string }) {
  return (
    <div className="relative">
      <input type="text" inputMode="numeric"
        value={hook.displayValue} onChange={hook.onChange}
        placeholder={placeholder ?? '0'}
        className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-right pr-10 text-[#1E293B] font-medium outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-sm" />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">원</span>
    </div>
  );
}

function WageRow({ n, hook }: { n: number; hook: ReturnType<typeof useNumberFormat> }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400 shrink-0 w-16">{n}번째 달</span>
      <MoneyInput hook={hook} placeholder="예: 3,000,000" />
    </div>
  );
}

function ResultCard({ line, isPension }: { line: ReportLine; isPension?: boolean }) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${
      isPension ? 'bg-purple-50 border-purple-200' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">{line.label}</span>
        <span className={`tabular-nums font-bold text-sm ${
          line.amount === 0 ? 'text-slate-400' : isPension ? 'text-purple-700' : 'text-[#2563EB]'
        }`}>
          {line.amount > 0 ? formatWon(line.amount) : '—'}
        </span>
      </div>
      <p className="text-xs text-slate-400 mt-1">{line.note}</p>
    </div>
  );
}

// ── 메인 ─────────────────────────────────────

type Mode = 'injury' | 'retire';

const iCls = 'w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-[#1E293B] font-medium outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-sm bg-white';

export default function ReportCalculator() {
  const [mode, setMode] = useState<Mode>('injury');

  // ── 산재 모드 상태 ──────────────────────────

  const [injuryDate, setInjuryDate]         = useState('');
  const [birthDate, setBirthDate]           = useState('');
  const [healStart, setHealStart]           = useState('');
  const [healEnd, setHealEnd]               = useState('');
  const iw1 = useNumberFormat(0);
  const iw2 = useNumberFormat(0);
  const iw3 = useNumberFormat(0);
  const iBonus = useNumberFormat(0);
  const [disGrade, setDisGrade]             = useState<string>('none');
  const [disType, setDisType]               = useState<'pension' | 'lump'>('lump');
  const [isDead, setIsDead]                 = useState(false);
  const [survivorCount, setSurvivorCount]   = useState(1);

  // ── 퇴직 모드 상태 ──────────────────────────

  const [hireDate, setHireDate]             = useState('');
  const [quitDate, setQuitDate]             = useState('');
  const rw1 = useNumberFormat(0);
  const rw2 = useNumberFormat(0);
  const rw3 = useNumberFormat(0);
  const rBonus = useNumberFormat(0);
  const rLeave = useNumberFormat(0);
  const rOrdinary = useNumberFormat(0);
  const [unusedLeave, setUnusedLeave]       = useState('');
  const [wasFired, setWasFired]             = useState(false);

  // ── 산재 계산 ──────────────────────────────

  const injuryResult = useMemo<InjuryResult | null>(() => {
    if (!injuryDate || !healStart || !healEnd || !birthDate) return null;
    const w = iw1.numericValue + iw2.numericValue + iw3.numericValue;
    if (w === 0) return null;
    const input: InjuryInput = {
      monthlyWage1:    iw1.numericValue,
      monthlyWage2:    iw2.numericValue,
      monthlyWage3:    iw3.numericValue,
      annualBonus:     iBonus.numericValue,
      birthDate, injuryDate,
      healStartDate:   healStart,
      healEndDate:     healEnd,
      disabilityGrade: disGrade === 'none' ? null : Number(disGrade),
      disabilityType:  disGrade === 'none' ? null : disType,
      isDead,
      survivorCount,
    };
    try { return calcInjuryReport(input); }
    catch { return null; }
  }, [injuryDate, birthDate, healStart, healEnd,
      iw1.numericValue, iw2.numericValue, iw3.numericValue, iBonus.numericValue,
      disGrade, disType, isDead, survivorCount]);

  // ── 퇴직 계산 ──────────────────────────────

  const retireResult = useMemo<RetireResult | null>(() => {
    if (!hireDate || !quitDate) return null;
    const w = rw1.numericValue + rw2.numericValue + rw3.numericValue;
    if (w === 0) return null;
    const input: RetireInput = {
      hireDate, quitDate,
      monthlyWage1:         rw1.numericValue,
      monthlyWage2:         rw2.numericValue,
      monthlyWage3:         rw3.numericValue,
      annualBonus:          rBonus.numericValue,
      annualLeaveAllowance: rLeave.numericValue,
      dailyOrdinaryWage:    rOrdinary.numericValue,
      unusedLeaveDays:      parseInt(unusedLeave) || 0,
      wasFiredWithoutNotice: wasFired,
    };
    try { return calcRetireReport(input); }
    catch { return null; }
  }, [hireDate, quitDate,
      rw1.numericValue, rw2.numericValue, rw3.numericValue,
      rBonus.numericValue, rLeave.numericValue, rOrdinary.numericValue,
      unusedLeave, wasFired]);

  const activeResult = mode === 'injury' ? injuryResult : retireResult;

  // ── 렌더 ──────────────────────────────────

  return (
    <div className="space-y-6">
      {/* 모드 탭 */}
      <div className="flex rounded-xl border border-slate-200 overflow-hidden">
        {(['injury', 'retire'] as const).map(m => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              mode === m ? 'bg-[#2563EB] text-white' : 'text-slate-500 hover:bg-slate-50'
            }`}>
            {m === 'injury' ? '🚑 산재 보상 종합' : '📦 퇴직 정산 종합'}
          </button>
        ))}
      </div>

      {/* ── 산재 입력 ── */}
      {mode === 'injury' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">

          {/* 날짜 */}
          <div>
            <SectionTitle>기본 정보</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="재해일" hint="업무상 재해가 발생한 날">
                <DateInput value={injuryDate} onChange={setInjuryDate} />
              </Field>
              <Field label="생년월일" hint="고령자 감액 계산에 사용">
                <DateInput value={birthDate} onChange={setBirthDate} />
              </Field>
              <Field label="요양 시작일">
                <DateInput value={healStart} onChange={setHealStart} />
              </Field>
              <Field label="요양 종료일(예상)">
                <DateInput value={healEnd} onChange={setHealEnd} />
              </Field>
            </div>
          </div>

          {/* 임금 */}
          <div>
            <SectionTitle>재해일 이전 3개월 임금</SectionTitle>
            <div className="space-y-2">
              <WageRow n={1} hook={iw1} />
              <WageRow n={2} hook={iw2} />
              <WageRow n={3} hook={iw3} />
            </div>
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-1">연간 상여금 총액</p>
              <MoneyInput hook={iBonus} placeholder="예: 4,000,000" />
            </div>
          </div>

          {/* 장해 */}
          <div>
            <SectionTitle>장해 정보 (선택)</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="장해등급">
                <select value={disGrade} onChange={e => setDisGrade(e.target.value)} className={iCls}>
                  <option value="none">미정 / 해당 없음</option>
                  {Array.from({ length: 14 }, (_, i) => i + 1).map(g => (
                    <option key={g} value={g}>{g}급</option>
                  ))}
                </select>
              </Field>
              {disGrade !== 'none' && Number(disGrade) <= 7 && (
                <Field label="지급 방식">
                  <select value={disType} onChange={e => setDisType(e.target.value as 'pension' | 'lump')} className={iCls}>
                    <option value="lump">일시금</option>
                    <option value="pension">연금</option>
                  </select>
                </Field>
              )}
            </div>
          </div>

          {/* 사망 */}
          <div>
            <SectionTitle>사망 시 유족급여 (선택)</SectionTitle>
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input type="checkbox" checked={isDead} onChange={e => setIsDead(e.target.checked)}
                className="w-4 h-4 accent-blue-600" />
              <span className="text-sm text-slate-700 font-medium">사망 사고 발생</span>
            </label>
            {isDead && (
              <Field label="수급자격자 수" hint="배우자, 자녀 등 유족보상연금 수급 자격이 있는 인원">
                <select value={survivorCount} onChange={e => setSurvivorCount(Number(e.target.value))} className={iCls}>
                  {[1, 2, 3, 4].map(n => (
                    <option key={n} value={n}>{n}인 이상{n === 4 ? ' (최대)' : ''}</option>
                  ))}
                </select>
              </Field>
            )}
          </div>
        </div>
      )}

      {/* ── 퇴직 입력 ── */}
      {mode === 'retire' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">

          {/* 날짜 */}
          <div>
            <SectionTitle>재직 기간</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="입사일">
                <DateInput value={hireDate} onChange={setHireDate} />
              </Field>
              <Field label="퇴직일" hint="마지막 근무일의 다음 날">
                <DateInput value={quitDate} onChange={setQuitDate} />
              </Field>
            </div>
            {hireDate && quitDate && new Date(quitDate) > new Date(hireDate) && (
              <div className="mt-3 bg-slate-50 rounded-xl px-4 py-2.5 flex items-center justify-between text-sm">
                <span className="text-slate-500">재직일수</span>
                <span className="font-bold text-[#1E293B]">
                  {Math.round((new Date(quitDate).getTime() - new Date(hireDate).getTime()) / 86_400_000).toLocaleString()}일
                </span>
              </div>
            )}
          </div>

          {/* 임금 */}
          <div>
            <SectionTitle>퇴직 전 3개월 임금</SectionTitle>
            <div className="space-y-2">
              <WageRow n={1} hook={rw1} />
              <WageRow n={2} hook={rw2} />
              <WageRow n={3} hook={rw3} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-xs text-slate-500 mb-1">연간 상여금 총액</p>
                <MoneyInput hook={rBonus} placeholder="예: 4,000,000" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">연차수당 (연간)</p>
                <MoneyInput hook={rLeave} placeholder="예: 500,000" />
              </div>
            </div>
          </div>

          {/* 통상임금·연차 */}
          <div>
            <SectionTitle>통상임금 · 연차 · 해고 정보</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="1일 통상임금" hint="평균임금보다 높은 경우 자동 적용">
                <MoneyInput hook={rOrdinary} placeholder="예: 96,000" />
              </Field>
              <Field label="미사용 연차일수">
                <div className="relative">
                  <input type="number" min={0} max={25} value={unusedLeave}
                    onChange={e => setUnusedLeave(e.target.value)}
                    placeholder="예: 10"
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-right pr-10 text-[#1E293B] font-medium outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 text-sm" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">일</span>
                </div>
              </Field>
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-3">
              <input type="checkbox" checked={wasFired} onChange={e => setWasFired(e.target.checked)}
                className="w-4 h-4 accent-blue-600" />
              <span className="text-sm text-slate-700">해고예고 없이 즉시 해고 (해고예고수당 30일분 산정)</span>
            </label>
          </div>
        </div>
      )}

      {/* ── 결과 ── */}
      {activeResult && (
        <div className="space-y-5">
          {/* 평균임금 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400 text-xs mb-0.5">1일 평균임금</p>
              <p className="font-bold text-[#1E293B] tabular-nums text-base">
                {(activeResult as InjuryResult | RetireResult).dailyAvgWage.toLocaleString()}원
              </p>
            </div>
            {mode === 'injury' && (
              <div>
                <p className="text-slate-400 text-xs mb-0.5">총 요양일수</p>
                <p className="font-bold text-[#1E293B] tabular-nums text-base">
                  {(activeResult as InjuryResult).totalHealDays.toLocaleString()}일
                </p>
              </div>
            )}
            {mode === 'retire' && (
              <div>
                <p className="text-slate-400 text-xs mb-0.5">총 재직일수</p>
                <p className="font-bold text-[#1E293B] tabular-nums text-base">
                  {(activeResult as RetireResult).totalServiceDays.toLocaleString()}일
                </p>
              </div>
            )}
          </div>

          {/* 항목별 결과 */}
          <div className="space-y-3">
            {activeResult.lines.map((line, i) => (
              <ResultCard
                key={i}
                line={line}
                isPension={line.label.includes('연금') || line.label.includes('연간')}
              />
            ))}
          </div>

          {/* 합계 */}
          <div className="bg-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">
                {mode === 'injury' ? '산재 보상 합계' : '퇴직 정산 합계'}
                {mode === 'injury' && injuryResult?.lines.some(l => l.label.includes('연금')) &&
                  <span className="ml-1 text-slate-500">(연금 포함 시 연간 금액)</span>}
              </p>
              <p className="text-2xl font-bold text-white tabular-nums">
                {formatWon(activeResult.grandTotal)}
              </p>
            </div>
            {mode === 'injury' && (
              <div className="text-right text-xs text-slate-400 max-w-[140px]">
                연금 항목은 연간 금액 기준. 실제 수령 총액은 수령 기간에 따라 다릅니다.
              </div>
            )}
          </div>

          {/* 안내 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700 flex items-start gap-2">
            <span className="shrink-0">📌</span>
            <span>
              본 리포트는 참고용이며, 실제 수령액은 공단 심사 결과·근속일수 특례 등에 따라 달라질 수 있습니다.
              정확한 산정은 근로복지공단(☎ 1588-0075) 또는 공인노무사에게 문의하세요.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
