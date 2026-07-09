'use client';

import { useState } from 'react';
import {
  calculateSurvivorPay,
  type SurvivorPayInput,
  type SurvivorPayResult,
  type PaymentType,
} from '@/lib/calculators/survivor-pay';
import { SURVIVOR_PAY_CONSTANTS } from '@/constants/survivor-pay';
import { useNumberFormat } from '@/hooks/useNumberFormat';
import { formatWon } from '@/lib/helpers';

const C = SURVIVOR_PAY_CONSTANTS;

// ── 보조 컴포넌트 ─────────────────────────────────────────────

function Row({ label, value, sub, bold, accent, muted, green, purple, indent }: {
  label: string; value: string; sub?: string;
  bold?: boolean; accent?: boolean; muted?: boolean; green?: boolean; purple?: boolean; indent?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-1.5 ${indent ? 'ml-3' : ''}`}>
      <span className={`text-sm ${muted ? 'text-slate-400' : bold ? 'text-[#1E293B] font-semibold' : 'text-slate-500'}`}>
        {label}
        {sub && <span className="text-xs text-slate-400 font-normal ml-1">({sub})</span>}
      </span>
      <span className={`tabular-nums font-semibold text-sm ${
        accent ? 'text-[#2563EB]' : green ? 'text-[#16A34A]' : purple ? 'text-[#7C3AED]' : muted ? 'text-slate-400' : 'text-[#1E293B]'
      }`}>{value}</span>
    </div>
  );
}

function SectionCard({ title, icon, law, children }: {
  title: string; icon: string; law?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h3 className="text-base font-bold text-[#1E293B] mb-4 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        {title}
        {law && <span className="text-xs font-normal text-slate-400 ml-1">{law}</span>}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

// ── 결과 하위 섹션 ─────────────────────────────────────────────

function PensionDetail({ r }: { r: SurvivorPayResult }) {
  const p = r.survivor.pension!;
  return (
    <SectionCard title="유족보상연금 (전액)" icon="📊" law="산재보험법 제62조 제2항">
      <Row label="급여기초연액 (일 × 365)" value={formatWon(p.baseAnnualAmount)} />
      <hr className="border-slate-100" />
      <Row label="기본 비율" value={`${p.basicRate}%`} />
      <Row label="기본금액" value={formatWon(p.basicAmount)} indent />
      <Row label={`가산 비율 (수급자격자 ${r.survivor.pension ? Math.min(r.survivor.halfOption ? Math.round(p.bonusRate / 5) : 0, 4) : 0}인 × 5%)`}
        value={`+${p.bonusRate}%`} />
      <Row label="가산금액" value={formatWon(p.bonusAmount)} indent />
      <hr className="border-slate-100" />
      <Row label="연간 연금 합계" value={formatWon(p.annualTotal)} bold accent />
      <Row label="월 연금 (÷12)" value={formatWon(p.monthlyTotal)} bold accent />
    </SectionCard>
  );
}

function HalfDetail({ r }: { r: SurvivorPayResult }) {
  const h = r.survivor.halfOption!;
  const p = r.survivor.pension!;
  return (
    <SectionCard title="반액연금 + 반액일시금" icon="📊" law="산재보험법 제62조 제3항">
      <Row label="전액 연간 연금 기준" value={formatWon(p.annualTotal)} muted />
      <hr className="border-slate-100" />
      <Row label="반액 연금 (× 50%)" value="" bold />
      <Row label="연간" value={formatWon(h.annualPension)} indent accent />
      <Row label="월" value={formatWon(h.monthlyPension)} indent accent />
      <hr className="border-slate-100" />
      <Row label={`반액 일시금 (평균임금 × ${C.HALF_LUMP_SUM_DAYS}일)`} value={formatWon(h.lumpSum)} bold green />
    </SectionCard>
  );
}

function LumpSumDetail({ r }: { r: SurvivorPayResult }) {
  return (
    <SectionCard title="유족보상일시금" icon="📊" law="산재보험법 제62조 제1항">
      <Row label="적용 평균임금" value={formatWon(r.appliedWage)} />
      <Row label="보상일수" value={`${C.LUMP_SUM_DAYS}일`} />
      <hr className="border-slate-100" />
      <Row label="유족보상일시금" value={formatWon(r.survivor.lumpSum.amount)} bold accent />
    </SectionCard>
  );
}

function CompareView({ r }: { r: SurvivorPayResult }) {
  const p    = r.survivor.pension;
  const h    = r.survivor.halfOption;
  const ls   = r.survivor.lumpSum;
  const bey  = r.survivor.breakEvenYears;

  return (
    <div className="space-y-4">
      {/* 비교 카드 그리드 */}
      <div className={`grid gap-4 ${p ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1'}`}>
        {/* 연금 전액 */}
        {p && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-xs font-semibold text-blue-700 mb-2">유족보상연금 전액</p>
            <p className="text-xl font-bold text-[#2563EB] tabular-nums">{formatWon(p.monthlyTotal)}</p>
            <p className="text-xs text-slate-400 mt-1">월 수령</p>
            <p className="text-xs text-slate-500 mt-2">{formatWon(p.annualTotal)} / 년</p>
          </div>
        )}

        {/* 반액연금 + 반액일시금 */}
        {h && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-xs font-semibold text-green-700 mb-2">반액연금 + 반액일시금</p>
            <p className="text-xl font-bold text-[#16A34A] tabular-nums">{formatWon(h.monthlyPension)}</p>
            <p className="text-xs text-slate-400 mt-1">월 연금</p>
            <p className="text-xs text-slate-500 mt-2">+ 일시금 {formatWon(h.lumpSum)}</p>
          </div>
        )}

        {/* 일시금 */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-xs font-semibold text-slate-600 mb-2">
            {r.survivor.hasQualifiedSurvivors ? '전액일시금 선택 시' : '유족보상일시금'}
          </p>
          <p className="text-xl font-bold text-[#1E293B] tabular-nums">{formatWon(ls.amount)}</p>
          <p className="text-xs text-slate-400 mt-1">일시금 전액</p>
          <p className="text-xs text-slate-500 mt-2">{C.LUMP_SUM_DAYS}일분</p>
        </div>
      </div>

      {/* 손익분기점 */}
      {p && bey !== undefined && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
          <span className="text-amber-500 text-base shrink-0 mt-0.5">💡</span>
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>손익분기점:</strong> 전액 연금으로 수령하면 약 <strong>{bey}년</strong> 후 일시금 총액을 초과합니다.
            {bey <= 10 ? ' 기대여명을 고려할 때 연금이 유리할 수 있습니다.' :
             bey <= 15 ? ' 평균 기대여명 수준에서 손익이 교차됩니다.' :
             ' 장기 수령 가능 여부를 신중히 검토하세요.'}
          </p>
        </div>
      )}
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────────────

const PAYMENT_OPTIONS: { val: PaymentType; label: string; desc: string; disabled?: boolean }[] = [
  { val: 'compare',   label: '전체 비교',                desc: '연금·반액·일시금 금액을 한눈에 비교' },
  { val: 'pension',   label: '유족보상연금 (전액)',       desc: '수급자격자가 있고 연금 전액 수령' },
  { val: 'half',      label: '반액연금 + 반액일시금',    desc: '연금 50% + 일시금(평균임금×650일) 병행' },
  { val: 'lump-sum',  label: '유족보상일시금',           desc: '수급자격자 없거나 일시금 선택' },
];

export default function SurvivorPayCalculator() {
  const dailyWageInput                    = useNumberFormat(0);
  const [survivors, setSurvivors]         = useState(1);
  const [payType, setPayType]             = useState<PaymentType>('compare');
  const [result, setResult]               = useState<SurvivorPayResult | null>(null);
  const [errors, setErrors]               = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!dailyWageInput.numericValue) errs.wage = '1일 평균임금을 입력해 주세요.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleCalculate() {
    if (!validate()) return;

    const effectiveSurvivors = (payType === 'lump-sum') ? 0 : Math.max(0, survivors);
    const effectiveType: PaymentType =
      effectiveSurvivors === 0 ? 'lump-sum' : payType;

    const input: SurvivorPayInput = {
      dailyAvgWage:        dailyWageInput.numericValue,
      qualifiedSurvivors:  effectiveSurvivors,
      paymentType:         effectiveType,
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
    dailyWageInput.reset();
    setSurvivors(1); setPayType('compare');
    setResult(null); setErrors({});
  }

  const iCls = (k: string) =>
    `w-full border-2 rounded-xl px-4 py-3 text-right pr-10 text-[#1E293B] font-medium outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 ${
      errors[k] ? 'border-red-400' : 'border-slate-200'
    }`;

  // 수급자격자 수에 따른 연금율 미리보기
  const bonusRatePct  = Math.min(5 * Math.min(survivors, 4), 20);
  const totalRatePct  = 47 + bonusRatePct;
  const needsSurvivors = payType !== 'lump-sum';

  return (
    <div className="space-y-8">
      {/* ── 입력 카드 ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-[#1E293B]">정보 입력</h2>

        {/* 1일 평균임금 */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            1일 평균임금 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input type="text" inputMode="numeric"
              value={dailyWageInput.displayValue} onChange={dailyWageInput.onChange}
              placeholder="예: 100,000" className={iCls('wage')} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">원</span>
          </div>
          {errors.wage && <p className="text-xs text-red-500 mt-1">{errors.wage}</p>}
          <p className="text-xs text-slate-400 mt-1">
            퇴직 전 3개월 임금 합계 ÷ 총 일수.&nbsp;
            <a href="/calc/average-wage" className="text-[#2563EB] underline">평균임금 계산기</a>에서 먼저 계산하세요.
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* 유족급여 유형 */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">조회 방식 <span className="text-red-500">*</span></p>
          {PAYMENT_OPTIONS.map(({ val, label, desc }) => (
            <label key={val}
              className={`flex items-start gap-3 cursor-pointer rounded-xl border-2 p-4 transition-colors ${
                payType === val ? 'border-[#2563EB] bg-blue-50' : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => {
                setPayType(val);
                if (val === 'lump-sum') setSurvivors(0);
                else if (survivors === 0) setSurvivors(1);
              }}>
              <input type="radio" name="payType" value={val} checked={payType === val} onChange={() => {}}
                className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#1E293B]">
                  {label}
                  {val === 'compare' && (
                    <span className="ml-2 text-xs bg-[#2563EB] text-white px-1.5 py-0.5 rounded font-medium">추천</span>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
            </label>
          ))}
        </div>

        {/* 수급자격자 수 */}
        {needsSurvivors && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              수급자격자 수 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input type="number" min="0" max="10" value={survivors}
                onChange={(e) => setSurvivors(Math.max(0, parseInt(e.target.value) || 0))}
                className={`${iCls('survivors')}`} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">인</span>
            </div>
            {survivors > 0 && (
              <p className="text-xs text-[#2563EB] mt-1 font-medium">
                {survivors}인 → 연금율 {totalRatePct}% (기본 47% + 가산 {bonusRatePct}%)
              </p>
            )}
            {survivors === 0 && (
              <p className="text-xs text-amber-600 mt-1">수급자격자가 없으면 유족보상일시금만 지급됩니다.</p>
            )}
            <p className="text-xs text-slate-400 mt-1">
              배우자·자녀(25세 미만)·부모(60세 이상) 등 생계를 같이하던 유족 수
            </p>
          </div>
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
          {result.wageAdjusted && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2">
              <span className="text-amber-500 text-lg shrink-0">⚠️</span>
              <p className="text-xs text-amber-700 leading-relaxed">
                입력 평균임금 <strong>{formatWon(result.originalWage)}</strong>이
                1일 {result.adjustmentType === 'min' ? '최저' : '최고'}보상기준금액
                ({result.adjustmentType === 'min'
                  ? formatWon(C.MIN_DAILY_BASE_2026)
                  : formatWon(C.MAX_DAILY_BASE_2026)}) {result.adjustmentType === 'min' ? '미만' : '초과'} →
                보정 적용 <strong>{formatWon(result.appliedWage)}</strong>
              </p>
            </div>
          )}

          {/* 유족급여 결과 */}
          {result.survivor.hasQualifiedSurvivors ? (
            <>
              {/* 전체 비교 */}
              {result.survivor.pension && (payType === 'compare') && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h3 className="text-base font-bold text-[#1E293B] mb-4 flex items-center gap-2">
                    <span className="text-lg">⚖️</span> 유형별 비교
                  </h3>
                  <CompareView r={result} />
                </div>
              )}

              {/* 연금 전액 상세 */}
              {(payType === 'pension' || payType === 'compare') && result.survivor.pension && (
                <PensionDetail r={result} />
              )}

              {/* 반액연금 + 반액일시금 */}
              {(payType === 'half' || payType === 'compare') && result.survivor.halfOption && (
                <HalfDetail r={result} />
              )}
            </>
          ) : (
            <LumpSumDetail r={result} />
          )}

          {/* payType이 lump-sum이고 수급자격자 있을 때 */}
          {payType === 'lump-sum' && result.survivor.hasQualifiedSurvivors && (
            <LumpSumDetail r={result} />
          )}

          {/* 장의비 */}
          <SectionCard title="장의비" icon="🌿" law="산재보험법 제71조">
            <Row label="적용 평균임금" value={formatWon(result.appliedWage)} />
            <Row label="보상일수" value={`${C.FUNERAL_DAYS}일`} />
            <Row label="산정액" value={formatWon(result.funeral.calculatedAmount)} />
            {result.funeral.adjustmentApplied !== 'none' && (
              <>
                <hr className="border-slate-100" />
                <Row label="최저 장의비" value={formatWon(result.funeral.min)} muted />
                <Row label="최고 장의비" value={formatWon(result.funeral.max)} muted />
              </>
            )}
            <hr className="border-slate-100" />
            <Row
              label={`최종 장의비${result.funeral.adjustmentApplied === 'min' ? ' (최저 적용)' : result.funeral.adjustmentApplied === 'max' ? ' (최고 적용)' : ''}`}
              value={formatWon(result.funeral.appliedAmount)}
              bold purple
            />
          </SectionCard>

          {/* 알아두세요 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-blue-800 mb-2">알아두세요</h4>
            <ul className="space-y-1.5 text-xs text-blue-700 leading-relaxed">
              <li>• <strong>수급자격자</strong>: 배우자(사실혼 포함), 자녀(25세 미만), 부모(60세 이상), 손자녀(25세 미만), 조부모(60세 이상), 형제자매(19세 미만 or 60세 이상)</li>
              <li>• 연령 미해당이라도 장애인복지법상 <strong>중증장애인</strong>은 수급자격자 포함</li>
              <li>• 수급 순위: 배우자 → 자녀 → 부모 → 손자녀 → 조부모 → 형제자매 (최우선 순위 1인 수령)</li>
              <li>• 유족보상연금 청구권 소멸시효: <strong>5년</strong></li>
              <li>• 장의비는 실제 장례를 주관한 자에게 지급됩니다.</li>
              <li>• 정확한 산정 및 청구는 근로복지공단(☎ 1588-0075)에 문의하세요.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
