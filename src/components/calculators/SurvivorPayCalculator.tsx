'use client';

import { useState } from 'react';
import {
  calculateSurvivorPay,
  SURVIVOR_CONSTANTS_2026,
  type SurvivorPayInput,
  type SurvivorPayResult,
  type AverageWageMethod,
  type SurvivorPayType,
} from '@/lib/calculators/survivor-pay';
import { useNumberFormat } from '@/hooks/useNumberFormat';
import { formatWon } from '@/lib/helpers';

const C = SURVIVOR_CONSTANTS_2026;

// ── 보조 컴포넌트 ─────────────────────────────────────────────

function MethodTab({ active, onClick, children }: {
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

function Row({ label, value, sub, bold, accent, muted, green, highlight }: {
  label: string; value: string; sub?: string;
  bold?: boolean; accent?: boolean; muted?: boolean; green?: boolean; highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${highlight ? 'bg-blue-50 -mx-2 px-2 rounded-lg' : ''}`}>
      <span className={`text-sm ${muted ? 'text-slate-400' : bold ? 'text-[#1E293B] font-semibold' : 'text-slate-500'}`}>
        {label}
        {sub && <span className="text-xs text-slate-400 font-normal ml-1">({sub})</span>}
      </span>
      <span className={`tabular-nums font-semibold text-sm ${
        accent ? 'text-[#2563EB]' : green ? 'text-[#16A34A]' : muted ? 'text-slate-400' : 'text-[#1E293B]'
      }`}>{value}</span>
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────────────

export default function SurvivorPayCalculator() {
  const [method, setMethod]           = useState<AverageWageMethod>('direct');
  const dailyWageInput                = useNumberFormat(0);
  const totalWageInput                = useNumberFormat(0);
  const [totalDays, setTotalDays]     = useState('90');
  const [payType, setPayType]         = useState<SurvivorPayType>('pension-full');
  const [eligibleCount, setEligibleCount] = useState(1);
  const [result, setResult]           = useState<SurvivorPayResult | null>(null);
  const [errors, setErrors]           = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (method === 'direct' && !dailyWageInput.numericValue) {
      errs.dailyWage = '1일 평균임금을 입력해 주세요.';
    }
    if (method === 'calculate') {
      if (!totalWageInput.numericValue) errs.totalWage = '3개월 임금 총액을 입력해 주세요.';
      const d = parseFloat(totalDays);
      if (!d || d < 1) errs.totalDays = '총 일수를 입력해 주세요.';
    }
    if ((payType === 'pension-full' || payType === 'pension-half') && eligibleCount < 1) {
      errs.eligible = '수급자격자가 없는 경우 유족보상일시금을 선택해 주세요.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleCalculate() {
    if (!validate()) return;

    const effectivePayType: SurvivorPayType =
      eligibleCount === 0 ? 'lump-sum' : payType;

    const input: SurvivorPayInput = {
      averageWageMethod: method,
      dailyAverageWage:  method === 'direct' ? dailyWageInput.numericValue : undefined,
      totalWage3Months:  method === 'calculate' ? totalWageInput.numericValue : undefined,
      totalDays3Months:  method === 'calculate' ? (parseFloat(totalDays) || 90) : undefined,
      payType: effectivePayType,
      eligibleCount,
    };

    const res = calculateSurvivorPay(input);
    setResult(res);

    try {
      localStorage.setItem('ilsem-survivor-pay', JSON.stringify({
        input, result: res, timestamp: new Date().toISOString(),
      }));
    } catch { /* ignore */ }

    setTimeout(
      () => document.getElementById('sp-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      50
    );
  }

  function handleReset() {
    dailyWageInput.reset(); totalWageInput.reset();
    setMethod('direct'); setTotalDays('90');
    setPayType('pension-full'); setEligibleCount(1);
    setResult(null); setErrors({});
  }

  const iCls = (k: string) =>
    `w-full border-2 rounded-xl px-4 py-3 text-right pr-10 text-[#1E293B] font-medium outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 ${
      errors[k] ? 'border-red-400' : 'border-slate-200'
    }`;

  // 연금 가산 미리보기
  const addCount  = Math.min(eligibleCount, 4);
  const addRatePct = Math.min(5 * addCount, 20);
  const totalRatePct = 47 + addRatePct;

  return (
    <div className="space-y-8">
      {/* ── 입력 카드 ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-[#1E293B]">정보 입력</h2>

        {/* 평균임금 입력 방식 */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">평균임금 입력 방식 <span className="text-red-500">*</span></p>
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            <MethodTab active={method === 'direct'}    onClick={() => setMethod('direct')}>직접 입력</MethodTab>
            <MethodTab active={method === 'calculate'} onClick={() => setMethod('calculate')}>3개월 임금으로 계산</MethodTab>
          </div>
        </div>

        {/* 평균임금 입력 */}
        {method === 'direct' ? (
          <InputField label="1일 평균임금" required unit="원" error={errors.dailyWage}
            hint="퇴직 전 3개월 임금 합계 ÷ 총 일수">
            <input type="text" inputMode="numeric"
              value={dailyWageInput.displayValue} onChange={dailyWageInput.onChange}
              placeholder="예: 100,000" className={iCls('dailyWage')} />
          </InputField>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="최근 3개월 임금 총액" required unit="원" error={errors.totalWage}>
              <input type="text" inputMode="numeric"
                value={totalWageInput.displayValue} onChange={totalWageInput.onChange}
                placeholder="예: 9,000,000" className={iCls('totalWage')} />
            </InputField>
            <InputField label="3개월 총 일수" required unit="일" error={errors.totalDays}
              hint="기본 90일">
              <input type="number" value={totalDays}
                onChange={(e) => setTotalDays(e.target.value)}
                placeholder="90" className={iCls('totalDays')} />
            </InputField>
            {totalWageInput.numericValue > 0 && parseFloat(totalDays) > 0 && (
              <div className="col-span-2 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-600">
                <svg className="w-4 h-4 text-[#2563EB] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                1일 평균임금 자동 계산:&nbsp;
                <strong className="text-[#2563EB]">
                  {Math.round(totalWageInput.numericValue / (parseFloat(totalDays) || 90)).toLocaleString()}원
                </strong>
              </div>
            )}
          </div>
        )}

        <hr className="border-slate-100" />

        {/* 유족급여 유형 */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700">유족급여 유형 <span className="text-red-500">*</span></p>
          {([
            { val: 'pension-full',  label: '유족보상연금 (전액)',        badge: '추천',  desc: '수급자격자가 있고 연금 전액 수령 선택' },
            { val: 'pension-half',  label: '반액연금 + 반액일시금',      badge: null,    desc: '연금 50% + 일시금(평균임금×650일분) 병행' },
            { val: 'lump-sum',      label: '유족보상일시금',             badge: null,    desc: '수급자격자가 없는 경우 (평균임금×1,300일)' },
          ] as const).map(({ val, label, badge, desc }) => (
            <label key={val}
              className={`flex items-start gap-3 cursor-pointer rounded-xl border-2 p-4 transition-colors ${
                payType === val
                  ? 'border-[#2563EB] bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => {
                setPayType(val as SurvivorPayType);
                if (val === 'lump-sum') setEligibleCount(0);
                else if (eligibleCount === 0) setEligibleCount(1);
              }}>
              <input type="radio" name="payType" value={val}
                checked={payType === val} onChange={() => {}}
                className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#1E293B]">
                  {label}
                  {badge && (
                    <span className="ml-2 text-xs bg-[#2563EB] text-white px-1.5 py-0.5 rounded font-medium">
                      {badge}
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
            </label>
          ))}
        </div>

        {/* 수급자격자 수 */}
        {payType !== 'lump-sum' && (
          <InputField label="수급자격자 수" required error={errors.eligible}
            hint={
              <>
                배우자·자녀·부모 등 생계를 같이하던 유족 — 1인 +5%, 2인 +10%, 3인 +15%, 4인 이상 +20%
                {eligibleCount > 0 && (
                  <span className="block mt-1 text-[#2563EB] font-medium">
                    현재: {eligibleCount}인 → 연금율 {totalRatePct}% (기본 47% + 가산 {addRatePct}%)
                  </span>
                )}
              </>
            }>
            <input type="number" min="1" max="10" value={eligibleCount}
              onChange={(e) => setEligibleCount(Math.max(1, parseInt(e.target.value) || 1))}
              className={iCls('eligible')} />
          </InputField>
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={handleCalculate}
            className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
            유족급여 계산하기
          </button>
          <button onClick={handleReset}
            className="px-5 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
            초기화
          </button>
        </div>
      </div>

      {/* ── 결과 ── */}
      {result && (
        <div id="sp-result" className="space-y-5 scroll-mt-20">

          {/* 평균임금 조정 경고 */}
          {result.isAdjusted && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
              <span className="text-amber-500 text-lg shrink-0">⚠️</span>
              <p className="text-xs text-amber-700 leading-relaxed">{result.adjustedReason}</p>
            </div>
          )}

          {/* 메인 결과 카드 */}
          <div className="bg-gradient-to-br from-[#EEF2FF] to-[#F0FDF4] rounded-2xl border border-[#2563EB]/20 p-6 sm:p-8">
            <p className="text-xs text-slate-500 text-center mb-5 font-medium">{result.payTypeLabel}</p>

            {/* 연금 전액 */}
            {result.payType === 'pension-full' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">연간 유족보상연금</p>
                  <p className="text-2xl font-bold text-[#2563EB] tabular-nums">{formatWon(result.annualPension!)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">월 환산 (÷12)</p>
                  <p className="text-2xl font-bold text-[#16A34A] tabular-nums">{formatWon(result.monthlyPension!)}</p>
                </div>
              </div>
            )}

            {/* 반액연금 + 반액일시금 */}
            {result.payType === 'pension-half' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">연간 연금 (50%)</p>
                  <p className="text-xl font-bold text-[#2563EB] tabular-nums">{formatWon(result.annualPension!)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">월 연금 (÷12)</p>
                  <p className="text-xl font-bold text-[#2563EB] tabular-nums">{formatWon(result.monthlyPension!)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 mb-1">반액 일시금</p>
                  <p className="text-xl font-bold text-[#16A34A] tabular-nums">{formatWon(result.lumpSum!)}</p>
                </div>
              </div>
            )}

            {/* 유족보상일시금 */}
            {result.payType === 'lump-sum' && (
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">유족보상일시금</p>
                <p className="text-3xl font-bold text-[#2563EB] tabular-nums">{formatWon(result.lumpSum!)}</p>
              </div>
            )}

            {/* 장의비 */}
            <div className="mt-6 pt-5 border-t border-white/60 text-center">
              <p className="text-xs text-slate-400 mb-1">장의비 (별도 지급)</p>
              <p className="text-xl font-bold text-[#7C3AED] tabular-nums">{formatWon(result.funeral)}</p>
              {result.funeralCapped && (
                <p className="text-xs text-amber-600 mt-1">{result.funeralCapReason}</p>
              )}
            </div>
          </div>

          {/* 산정 상세 — 유족보상연금 */}
          {(result.payType === 'pension-full' || result.payType === 'pension-half') && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                <span className="text-lg">📊</span> 유족보상연금 산정 내역
              </h3>
              <div className="space-y-2">
                <Row label="1일 평균임금 (입력값)" value={formatWon(result.rawDailyWage)} />
                {result.isAdjusted && (
                  <Row label="1일 평균임금 (보상기준 적용)" value={formatWon(result.adjustedDailyWage)} accent />
                )}
                <Row label="급여기초연액 (일 × 365)" value={formatWon(result.annualBase)} />
                <hr className="border-slate-100" />
                <Row label="기본 비율" value="47%" />
                <Row label={`가산 비율 (수급자격자 ${result.eligibleCount}인)`}
                  value={`+${result.pensionAddRatePct}%`} />
                <Row label="적용 연금율 합계" value={`${47 + (result.pensionAddRatePct ?? 0)}%`} bold />
                <hr className="border-slate-100" />
                {result.payType === 'pension-full' ? (
                  <>
                    <Row label="연간 유족보상연금" value={formatWon(result.annualPension!)} bold accent />
                    <Row label="월 유족보상연금 (÷12)" value={formatWon(result.monthlyPension!)} bold accent />
                  </>
                ) : (
                  <>
                    <Row label="전액 연간 연금" value={formatWon(Math.round(result.annualBase * (0.47 + (result.pensionAddRatePct ?? 0) / 100)))} muted />
                    <Row label="반액 연간 연금 (× 50%)" value={formatWon(result.annualPension!)} bold accent />
                    <Row label="반액 월 연금 (÷12)" value={formatWon(result.monthlyPension!)} bold accent />
                    <Row label={`반액 일시금 (평균임금×${C.halfLumpSumDays}일)`} value={formatWon(result.lumpSum!)} bold green />
                  </>
                )}
              </div>
            </div>
          )}

          {/* 산정 상세 — 유족보상일시금 */}
          {result.payType === 'lump-sum' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="text-base font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                <span className="text-lg">📊</span> 유족보상일시금 산정 내역
              </h3>
              <div className="space-y-2">
                <Row label="1일 평균임금 (보상기준 적용)" value={formatWon(result.adjustedDailyWage)} />
                <Row label="보상일수" value={`${C.lumpSumDays}일`} />
                <hr className="border-slate-100" />
                <Row label="유족보상일시금" value={formatWon(result.lumpSum!)} bold accent />
              </div>
            </div>
          )}

          {/* 장의비 상세 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-[#1E293B] mb-4 flex items-center gap-2">
              <span className="text-lg">🌿</span> 장의비 산정 내역
              <span className="text-xs font-normal text-slate-400 ml-1">산재보험법 제71조</span>
            </h3>
            <div className="space-y-2">
              <Row label="1일 평균임금 (보상기준 적용)" value={formatWon(result.adjustedDailyWage)} />
              <Row label="보상일수" value={`${C.funeralDays}일`} />
              <Row label="산정액 (일 × {일수})" value={formatWon(result.funeralRaw)} />
              <hr className="border-slate-100" />
              <Row label="최저 장의비" value={formatWon(C.funeralMin)} muted />
              <Row label="최고 장의비" value={formatWon(C.funeralMax)} muted />
              <hr className="border-slate-100" />
              <Row label="최종 장의비" value={formatWon(result.funeral)} bold
                accent={!result.funeralCapped} green={result.funeralCapped} />
            </div>
          </div>

          {/* 알아두세요 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-blue-800 mb-2">알아두세요</h4>
            <ul className="space-y-1.5 text-xs text-blue-700 leading-relaxed">
              <li>• 수급자격자: 배우자(사실혼 포함), 자녀(25세 미만), 부모(60세 이상), 손자녀(25세 미만), 조부모(60세 이상), 형제자매(19세 미만 또는 60세 이상)</li>
              <li>• 장애인복지법상 <strong>중증장애인</strong>은 연령 요건 미충족이라도 수급자격자에 포함됩니다.</li>
              <li>• 수급 순위: 배우자 → 자녀 → 부모 → 손자녀 → 조부모 → 형제자매</li>
              <li>• 유족보상연금 청구권 소멸시효: <strong>5년</strong> (산재보험법 제112조)</li>
              <li>• 장의비는 실제 장례를 주관한 자에게 지급됩니다.</li>
              <li>• 이 계산기는 2026년 고용노동부 고시 기준입니다. 정확한 상담은 근로복지공단(☎ 1588-0075)에 문의하세요.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
