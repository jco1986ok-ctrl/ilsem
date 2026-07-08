'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { calculateAverageWage, type AverageWageResult } from '@/lib/calculators/averageWage';
import { formatWon, formatDate, parseDate } from '@/lib/helpers';
import { useCalcStorage } from '@/hooks/useCalcStorage';

function today(): string {
  return formatDate(new Date());
}

function useWageInput(initial = '') {
  const [display, setDisplay] = useState(initial);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(digits, 10);
    setDisplay(isNaN(num) ? '' : num.toLocaleString('ko-KR'));
  }, []);

  const numeric = parseInt(display.replace(/,/g, ''), 10) || 0;

  return { display, onChange, numeric, setDisplay };
}

export default function AverageWageCalculator() {
  const [baseDate, setBaseDate] = useState(today());
  const wage1 = useWageInput();
  const wage2 = useWageInput();
  const wage3 = useWageInput();
  const bonus = useWageInput();
  const annualLeavePay = useWageInput();

  const [result, setResult] = useState<AverageWageResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const { save: saveToStorage } = useCalcStorage<{ appliedDailyWage: number; baseDate: string }>(
    'average-wage'
  );

  const canCalculate =
    baseDate.length > 0 && (wage1.numeric > 0 || wage2.numeric > 0 || wage3.numeric > 0);

  const handleCalculate = () => {
    const res = calculateAverageWage({
      baseDate,
      wage1: wage1.numeric,
      wage2: wage2.numeric,
      wage3: wage3.numeric,
      bonus: bonus.numeric,
      annualLeavePay: annualLeavePay.numeric,
    });
    setResult(res);
    saveToStorage({ appliedDailyWage: res.appliedDailyWage, baseDate });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleReset = () => {
    setResult(null);
    wage1.setDisplay('');
    wage2.setDisplay('');
    wage3.setDisplay('');
    bonus.setDisplay('');
    annualLeavePay.setDisplay('');
    setBaseDate(today());
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-start gap-4">
        <span className="text-4xl">💰</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">평균임금 계산기</h1>
          <p className="text-gray-500 mt-1 text-sm">
            근로기준법 기준 · 사유 발생일 이전 3개월 임금 ÷ 총일수
          </p>
        </div>
      </div>

      {/* 입력 폼 */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {/* 산정 사유 발생일 */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">
            산정 사유 발생일
            <span className="ml-1.5 text-xs font-normal text-gray-400">(재해 발생일, 퇴직일 등)</span>
          </label>
          <input
            type="date"
            value={baseDate}
            onChange={(e) => setBaseDate(e.target.value)}
            max={today()}
            className="w-full sm:w-64 px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          {baseDate && (
            <p className="text-xs text-gray-400">
              산정 기간: {getPeriodLabel(baseDate)}
            </p>
          )}
        </div>

        {/* 3개월 임금 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-700">최근 3개월 임금 내역</h3>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">필수</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <WageInput
              label={`1개월 전 임금${baseDate ? ` (${getMonthLabel(baseDate, 1)})` : ''}`}
              value={wage1.display}
              onChange={wage1.onChange}
              placeholder="예: 3,000,000"
            />
            <WageInput
              label={`2개월 전 임금${baseDate ? ` (${getMonthLabel(baseDate, 2)})` : ''}`}
              value={wage2.display}
              onChange={wage2.onChange}
              placeholder="예: 3,000,000"
            />
            <WageInput
              label={`3개월 전 임금${baseDate ? ` (${getMonthLabel(baseDate, 3)})` : ''}`}
              value={wage3.display}
              onChange={wage3.onChange}
              placeholder="예: 3,000,000"
            />
          </div>
          <p className="text-xs text-gray-400">
            기본급 + 고정 수당 + 연장·야간·휴일 근무수당 등 해당 월에 지급된 임금 전체를 입력하세요.
          </p>
        </div>

        {/* 상여금·연차수당 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-700">상여금 · 연차수당</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">선택</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <WageInput
              label="상여금 (최근 12개월 합계)"
              value={bonus.display}
              onChange={bonus.onChange}
              placeholder="예: 6,000,000"
              hint="3개월분(3/12)이 자동 산입됩니다"
            />
            <WageInput
              label="연차수당 (최근 12개월 합계)"
              value={annualLeavePay.display}
              onChange={annualLeavePay.onChange}
              placeholder="예: 500,000"
              hint="3개월분(3/12)이 자동 산입됩니다"
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCalculate}
            disabled={!canCalculate}
            className="flex-1 sm:flex-none sm:min-w-40 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            평균임금 계산하기
          </button>
          {result && (
            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm transition-colors"
            >
              초기화
            </button>
          )}
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div ref={resultRef} className="space-y-4 scroll-mt-20">
          {/* 최저임금 경고 */}
          {result.isMinimumApplied && (
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
              <span className="text-xl shrink-0">⚠️</span>
              <div className="text-sm">
                <p className="font-semibold text-amber-800">최저임금 기준이 적용됩니다</p>
                <p className="text-amber-700 mt-0.5">
                  산출된 평균임금({formatWon(Math.round(result.calculatedDailyWage))}/일)이
                  2025년 최저임금 기준({formatWon(result.minimumDailyWage)}/일)보다 낮아,
                  최저임금 기준이 적용됩니다.
                </p>
              </div>
            </div>
          )}

          {/* 메인 결과 카드 */}
          <div className="bg-blue-600 rounded-xl p-6 text-white">
            <p className="text-blue-200 text-sm font-medium mb-1">1일 평균임금 (적용)</p>
            <p className="text-4xl font-bold tracking-tight">
              {formatWon(Math.round(result.appliedDailyWage))}
            </p>
            <p className="text-blue-200 text-sm mt-2">
              월 환산 (× 30일): {formatWon(Math.round(result.monthlyWage))}
            </p>
          </div>

          {/* 상세 계산 내역 */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">계산 내역</h3>
            </div>
            <div className="divide-y divide-gray-50">
              <ResultRow label="3개월간 임금 총액" value={formatWon(Math.round(result.totalWage))} />
              <ResultRow label="3개월간 총 일수" value={`${result.totalDays}일`} />
              <ResultRow
                label="산출 1일 평균임금"
                value={formatWon(Math.round(result.calculatedDailyWage))}
              />
              {result.isMinimumApplied && (
                <ResultRow
                  label="적용 1일 평균임금 (최저임금 보정)"
                  value={formatWon(result.minimumDailyWage)}
                  highlight
                />
              )}
            </div>
          </div>

          {/* 월별 기간 상세 */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">산정 기간 상세</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {result.monthRanges.map((range) => (
                <div key={range.label} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-gray-500">{range.label}</span>
                  <span className="text-gray-700 font-medium">
                    {range.start} ~ {range.end}
                    <span className="ml-2 text-gray-400 font-normal">({range.days}일)</span>
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between px-5 py-3 text-sm bg-gray-50">
                <span className="font-medium text-gray-700">합계</span>
                <span className="font-bold text-gray-900">{result.totalDays}일</span>
              </div>
            </div>
          </div>

          {/* 최저임금 비교 */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
            <h3 className="text-xs font-semibold text-gray-600 mb-3">2025년 최저임금 기준 비교</h3>
            <div className="flex flex-col sm:flex-row gap-3 text-sm">
              <div className="flex-1 bg-white rounded-lg border border-gray-200 px-4 py-3 text-center">
                <p className="text-xs text-gray-500 mb-1">계산된 1일 평균임금</p>
                <p className={`font-bold ${result.isMinimumApplied ? 'text-amber-600' : 'text-blue-600'}`}>
                  {formatWon(Math.round(result.calculatedDailyWage))}
                </p>
              </div>
              <div className="flex items-center justify-center text-gray-400 font-bold">vs</div>
              <div className="flex-1 bg-white rounded-lg border border-gray-200 px-4 py-3 text-center">
                <p className="text-xs text-gray-500 mb-1">최저임금 기준 1일 금액</p>
                <p className="font-bold text-gray-700">{formatWon(result.minimumDailyWage)}</p>
                <p className="text-xs text-gray-400 mt-0.5">10,030원 × 8시간</p>
              </div>
            </div>
          </div>

          {/* 다음 계산기 연결 링크 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">이 평균임금으로 계속 계산하기</h3>
            <p className="text-xs text-gray-400">
              계산된 평균임금({formatWon(Math.round(result.appliedDailyWage))}/일)이 로컬스토리지에 저장되었습니다.
              아래 계산기에서 자동으로 불러올 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                href="/calc/retirement-pay"
                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <span>🏦</span>
                <span>이 평균임금으로 퇴직금 계산하기</span>
                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/calc/injury-leave-pay"
                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <span>🏥</span>
                <span>이 평균임금으로 산재 휴업급여 계산하기</span>
                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────── 보조 컴포넌트 ──────────────── */

interface WageInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  hint?: string;
}

function WageInput({ label, value, onChange, placeholder, hint }: WageInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-600">{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-3 pr-8 py-2.5 text-sm rounded-lg border border-gray-300 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
          원
        </span>
      </div>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

interface ResultRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function ResultRow({ label, value, highlight = false }: ResultRowProps) {
  return (
    <div className={`flex items-center justify-between px-5 py-3 ${highlight ? 'bg-blue-50' : ''}`}>
      <span className={`text-sm ${highlight ? 'font-medium text-blue-800' : 'text-gray-600'}`}>
        {label}
      </span>
      <span className={`font-bold ${highlight ? 'text-blue-700' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}

/* ──────────────── 날짜 헬퍼 ──────────────── */

function getMonthLabel(baseDateStr: string, monthsAgo: number): string {
  if (!baseDateStr) return '';
  try {
    const d = parseDate(baseDateStr);
    d.setMonth(d.getMonth() - (monthsAgo - 1));
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
  } catch {
    return '';
  }
}

function getPeriodLabel(baseDateStr: string): string {
  if (!baseDateStr) return '';
  try {
    const base = parseDate(baseDateStr);

    const end = new Date(base);
    end.setDate(end.getDate() - 1);

    const start = new Date(base);
    start.setMonth(start.getMonth() - 3);

    const fmt = (d: Date) =>
      `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;

    return `${fmt(start)} ~ ${fmt(end)}`;
  } catch {
    return '';
  }
}
