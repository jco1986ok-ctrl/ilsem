'use client';

import { useState, useMemo } from 'react';
import {
  calculateUnfairDismissal,
  type UnfairDismissalInput,
  type UnfairDismissalResult,
  type EmploymentType,
  type ExceptionCode,
} from '@/lib/calculators/unfair-dismissal';
import { useNumberFormat } from '@/hooks/useNumberFormat';
import { formatWon, formatNumber } from '@/lib/helpers';

// ── 예외 사유 목록 ─────────────────────────────────────────────

const EXCEPTIONS: { code: ExceptionCode; label: string; desc: string }[] = [
  { code: 'daily-worker-3m',  label: '일용근로자 3개월 미만',         desc: '계속 근무 기간이 3개월 미만인 일용직' },
  { code: 'fixed-term-2m',   label: '2개월 이내 기간제',              desc: '2개월 이내로 기간을 정해 고용된 경우' },
  { code: 'probation-3m',    label: '수습 3개월 이내',                desc: '수습 사용 중인 근로자로 3개월 미만' },
  { code: 'force-majeure',   label: '천재·사변 등 사업 불가',         desc: '부득이한 사유로 사업 계속이 불가능한 경우' },
  { code: 'gross-negligence',label: '근로자의 고의적 중대 손해',       desc: '고의로 사업에 막대한 지장·재산상 손해를 끼친 경우' },
];

// ── 보조 컴포넌트 ─────────────────────────────────────────────

function TypeTab({ active, onClick, children }: {
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

function Row({ label, value, sub, bold, accent, muted, highlight, large, warn }: {
  label: string; value: string; sub?: string;
  bold?: boolean; accent?: boolean; muted?: boolean; highlight?: boolean; large?: boolean; warn?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${highlight ? 'bg-blue-50 -mx-2 px-2 rounded-lg' : ''}`}>
      <span className={`text-sm ${muted ? 'text-slate-400' : warn ? 'text-amber-700 font-medium' : bold ? 'text-[#1E293B] font-semibold' : 'text-slate-500'}`}>
        {label}
        {sub && <span className="text-xs text-slate-400 font-normal ml-1">({sub})</span>}
        {highlight && <span className="text-[10px] bg-[#2563EB] text-white px-1.5 py-0.5 rounded font-semibold ml-1">적용</span>}
      </span>
      <span className={`tabular-nums font-semibold ${large ? 'text-lg' : 'text-sm'} ${
        accent ? 'text-[#2563EB]' : warn ? 'text-amber-700' : muted ? 'text-slate-400' : 'text-[#1E293B]'
      }`}>{value}</span>
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────────────

export default function UnfairDismissalCalculator() {
  const [empType, setEmpType]             = useState<EmploymentType>('fulltime');
  const hourlyWageInput                   = useNumberFormat(0);
  const monthlyWageInput                  = useNumberFormat(0);
  const [weeklyHours, setWeeklyHours]     = useState('');
  const [weeklyDays, setWeeklyDays]       = useState('5');
  const [hasException, setHasException]   = useState(false);
  const [exceptionCode, setExceptionCode] = useState<ExceptionCode | undefined>();
  const [dismissalDate, setDismissalDate] = useState('');
  const [judgmentDate, setJudgmentDate]   = useState('');
  const [consolation, setConsolation]     = useState(0);
  const [result, setResult]               = useState<UnfairDismissalResult | null>(null);
  const [errors, setErrors]               = useState<Record<string, string>>({});

  // 해고일 기준 판정 예상일 자동 계산 (75일 후)
  const autoJudgmentDate = useMemo(() => {
    if (!dismissalDate) return '';
    const d = new Date(dismissalDate);
    d.setDate(d.getDate() + 75);
    return d.toISOString().slice(0, 10);
  }, [dismissalDate]);

  // 단시간 1일 소정근로시간 미리보기
  const previewDailyHours = useMemo(() => {
    if (empType !== 'parttime') return null;
    const h = parseFloat(weeklyHours);
    const d = parseFloat(weeklyDays) || 5;
    return h > 0 ? parseFloat((h / d).toFixed(2)) : null;
  }, [empType, weeklyHours, weeklyDays]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!hourlyWageInput.numericValue) errs.hourlyWage = '시간급 통상임금을 입력해 주세요.';
    if (!monthlyWageInput.numericValue) errs.monthlyWage = '월 임금을 입력해 주세요.';
    if (empType === 'parttime') {
      const h = parseFloat(weeklyHours);
      if (!h || h <= 0 || h > 40) errs.weeklyHours = '주 소정근로시간을 입력해 주세요. (1~40시간)';
    }
    if (!dismissalDate) errs.dismissalDate = '해고일을 입력해 주세요.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleCalculate() {
    if (!validate()) return;
    const input: UnfairDismissalInput = {
      employmentType:  empType,
      hourlyWage:      hourlyWageInput.numericValue,
      monthlyWage:     monthlyWageInput.numericValue,
      weeklyHours:     empType === 'parttime' ? parseFloat(weeklyHours) : undefined,
      weeklyWorkDays:  empType === 'parttime' ? (parseFloat(weeklyDays) || 5) : undefined,
      hasException,
      exceptionCode:   hasException ? exceptionCode : undefined,
      dismissalDate,
      judgmentDate:    judgmentDate || undefined,
      consolationMonths: consolation,
    };
    const res = calculateUnfairDismissal(input);
    setResult(res);
    try {
      localStorage.setItem('ilsem-unfair-dismissal', JSON.stringify({
        input, result: res, timestamp: new Date().toISOString(),
      }));
    } catch { /* ignore */ }
    setTimeout(
      () => document.getElementById('ud-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      50
    );
  }

  function handleReset() {
    hourlyWageInput.reset(); monthlyWageInput.reset();
    setEmpType('fulltime'); setWeeklyHours(''); setWeeklyDays('5');
    setHasException(false); setExceptionCode(undefined);
    setDismissalDate(''); setJudgmentDate(''); setConsolation(0);
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

        {/* 고용 형태 */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">고용 형태 <span className="text-red-500">*</span></p>
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            <TypeTab active={empType === 'fulltime'}  onClick={() => setEmpType('fulltime')}>풀타임 (통상 8시간)</TypeTab>
            <TypeTab active={empType === 'parttime'}  onClick={() => setEmpType('parttime')}>단시간 근로자</TypeTab>
          </div>
        </div>

        {/* 단시간 근로시간 */}
        {empType === 'parttime' && (
          <div className="grid grid-cols-2 gap-4">
            <InputField label="주 소정근로시간" required unit="h" error={errors.weeklyHours} hint="1주일 총 근무시간">
              <input type="number" min="1" max="40" value={weeklyHours}
                onChange={(e) => setWeeklyHours(e.target.value)} placeholder="예: 20" className={iCls('weeklyHours')} />
            </InputField>
            <InputField label="주 근무일수" required unit="일" hint="주당 실제 출근일">
              <input type="number" min="1" max="6" value={weeklyDays}
                onChange={(e) => setWeeklyDays(e.target.value)} className={iCls('weeklyDays')} />
            </InputField>
            {previewDailyHours !== null && (
              <div className="col-span-2 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-600">
                <svg className="w-4 h-4 text-[#2563EB] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                1일 소정근로시간: <strong className="text-[#2563EB] ml-1">{previewDailyHours}시간</strong>
              </div>
            )}
          </div>
        )}

        <hr className="border-slate-100" />

        {/* 임금 입력 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="시간급 통상임금" required unit="원" error={errors.hourlyWage}
            hint="기본급 ÷ (월 소정근로시간) 또는 최저시급 이상">
            <input type="text" inputMode="numeric" value={hourlyWageInput.displayValue}
              onChange={hourlyWageInput.onChange} placeholder="예: 12,000" className={iCls('hourlyWage')} />
          </InputField>
          <InputField label="월 임금 (통상임금 기준)" required unit="원" error={errors.monthlyWage}
            hint="금전보상금 산정 기준 — 기본급+고정수당 합계">
            <input type="text" inputMode="numeric" value={monthlyWageInput.displayValue}
              onChange={monthlyWageInput.onChange} placeholder="예: 3,000,000" className={iCls('monthlyWage')} />
          </InputField>
        </div>

        <hr className="border-slate-100" />

        {/* 날짜 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="해고일" required error={errors.dismissalDate} hint="실제 해고 통보일 또는 해고 효력 발생일">
            <input type="date" value={dismissalDate} onChange={(e) => setDismissalDate(e.target.value)}
              className={iClsL('dismissalDate')} />
          </InputField>
          <InputField label="초심 판정 예상일"
            hint={dismissalDate ? `미입력 시 자동 적용: ${autoJudgmentDate} (해고일 +75일)` : '해고일 입력 후 자동 계산'}>
            <input type="date" value={judgmentDate} onChange={(e) => setJudgmentDate(e.target.value)}
              min={dismissalDate} className={iClsL('judgmentDate')} />
          </InputField>
        </div>

        <hr className="border-slate-100" />

        {/* 해고예고수당 예외 */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={hasException} onChange={(e) => setHasException(e.target.checked)}
              className="w-4 h-4 accent-blue-600" />
            <span className="text-sm font-semibold text-slate-700">
              해고예고수당 예외 사유 해당 (근로기준법 제35조)
            </span>
          </label>
          {hasException && (
            <div className="ml-7 space-y-2">
              {EXCEPTIONS.map((ex) => (
                <label key={ex.code} className="flex items-start gap-2.5 cursor-pointer group">
                  <input type="radio" name="exception" value={ex.code}
                    checked={exceptionCode === ex.code}
                    onChange={() => setExceptionCode(ex.code)}
                    className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-700 font-medium group-hover:text-blue-600 transition-colors">{ex.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{ex.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <hr className="border-slate-100" />

        {/* 위로금 슬라이더 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">위로금 설정</p>
            <span className="text-sm font-bold text-[#2563EB]">
              {consolation === 0 ? '위로금 없음 (최소 기준)' : `+${consolation}개월`}
            </span>
          </div>
          <input type="range" min="0" max="3" step="1" value={consolation}
            onChange={(e) => setConsolation(Number(e.target.value))}
            className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-slate-400">
            <span>0개월 (임금상당액만)</span>
            <span>1개월</span>
            <span>2개월</span>
            <span>3개월 (최대)</span>
          </div>
          <p className="text-xs text-slate-400">
            실무상 99.2% 사건에서 위로금은 별도 인정되지 않습니다. 참고용으로만 활용하세요.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={handleCalculate}
            className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
            보상금 계산하기
          </button>
          <button onClick={handleReset}
            className="px-5 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
            초기화
          </button>
        </div>
      </div>

      {/* ── 결과 ── */}
      {result && (
        <div id="ud-result" className="space-y-5 scroll-mt-20">

          {/* 합산 총액 메인 카드 */}
          <div className="bg-gradient-to-br from-[#EEF2FF] to-[#F0FDF4] rounded-2xl border border-[#2563EB]/20 p-6 sm:p-8">
            <p className="text-xs text-slate-500 text-center mb-4 font-medium">예상 수령 총액</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">최소 (임금상당액 기준)</p>
                <p className="text-2xl font-bold text-[#2563EB] tabular-nums">{formatWon(result.totalMin)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">
                  최대 (+위로금 {consolation}개월)
                </p>
                <p className={`text-2xl font-bold tabular-nums ${
                  result.totalMax > result.totalMin ? 'text-[#16A34A]' : 'text-slate-400'
                }`}>
                  {formatWon(result.totalMax)}
                </p>
              </div>
            </div>
            {result.noticePay.isExcepted && (
              <p className="text-center text-xs text-amber-600 mt-4 bg-amber-50 rounded-lg px-3 py-2">
                ⚠️ 해고예고수당 예외 사유 적용 — 해고예고수당 0원
              </p>
            )}
          </div>

          {/* A. 해고예고수당 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-[#1E293B] mb-4 flex items-center gap-2">
              <span className="text-lg">📋</span> A. 해고예고수당
              <span className="text-xs font-normal text-slate-400 ml-1">근로기준법 제26조</span>
            </h3>
            <div className="space-y-2">
              <Row label="고용 형태" value={empType === 'fulltime' ? '풀타임' : '단시간'} />
              <Row label="시간급 통상임금" value={formatWon(hourlyWageInput.numericValue)} />
              <Row label="1일 소정근로시간" value={`${result.noticePay.dailyHours}시간`} />
              <Row label="예고 의무 일수" value="30일" />
              <hr className="border-slate-100" />
              {result.noticePay.isExcepted ? (
                <Row label="해고예고수당" value="0원 (예외 사유 해당)" warn />
              ) : (
                <Row label="해고예고수당" value={formatWon(result.noticePay.amount)} bold accent />
              )}
            </div>
          </div>

          {/* B. 부당해고 금전보상금 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-[#1E293B] mb-4 flex items-center gap-2">
              <span className="text-lg">⚖️</span> B. 부당해고 금전보상금
              <span className="text-xs font-normal text-slate-400 ml-1">근로기준법 제30조 제3항</span>
            </h3>
            <div className="space-y-2">
              <Row label="월 임금 (산정 기준)" value={formatWon(monthlyWageInput.numericValue)} />
              <Row
                label="보상 기간"
                value={`${result.unfairDismissal.compensationMonths}개월`}
                sub="해고일 ~ 판정일"
              />
              <hr className="border-slate-100" />
              <Row label="임금상당액" value={formatWon(result.unfairDismissal.wageEquivalent)} bold />
              {consolation > 0 && (
                <Row
                  label={`위로금 (+${consolation}개월)`}
                  value={formatWon(result.unfairDismissal.consolation)}
                  muted
                />
              )}
              <hr className="border-slate-100" />
              <Row label="금전보상금 (최소)" value={formatWon(result.unfairDismissal.minCompensation)} bold accent />
              {consolation > 0 && (
                <Row label="금전보상금 (최대)" value={formatWon(result.unfairDismissal.maxCompensation)} bold />
              )}
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-blue-800 mb-2">알아두세요</h4>
            <ul className="space-y-1.5 text-xs text-blue-700 leading-relaxed">
              <li>• 부당해고 구제신청은 해고일로부터 <strong>3개월 이내</strong>에 노동위원회에 제기해야 합니다.</li>
              <li>• 상시 5인 미만 사업장은 부당해고 구제신청 대상이 아닙니다. (해고예고수당은 적용)</li>
              <li>• 위로금은 실무상 인정이 매우 드물며, 이 계산기의 위로금 항목은 참고용입니다.</li>
              <li>• 임금채권 소멸시효는 3년이므로 기간 내 청구하세요.</li>
              <li>• 정확한 상담은 노동부 고객상담센터(1350) 또는 노무사에게 문의하세요.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
