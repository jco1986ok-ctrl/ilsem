/**
 * 산재 장해급여 계산기 (산재보험법 제57조)
 *
 * [지급 방식]
 *   1~3급: 연금만 지급 (pension-only)
 *   4~7급: 연금 또는 일시금 선택 (choice)
 *   8~14급: 일시금만 지급 (lump-sum-only)
 *
 * [연금 계산]
 *   연간 연금 = 1일 평균임금 × 연금 지급일수
 *   월 연금   = 연간 연금 ÷ 12
 *
 * [일시금 계산]
 *   일시금 = 1일 평균임금 × 일시금 지급일수
 *
 * [4~7급 연금 선택 시 유의]
 *   연금을 선택하면 즉시 일시금의 50%를 선급(전불)받고
 *   나머지를 연금으로 수령하는 '일부연금' 제도가 있음 (참고 표시만)
 */

import { DISABILITY_TABLE, DisabilityGrade, DisabilityType, getGradeInfo } from '@/lib/constants/disability-data';

// ── 입력 ──────────────────────────────────────────────────────

export interface DisabilityPayInput {
  /** 평균임금 산정 방식 */
  averageWageMethod: 'direct' | 'calculate';
  /** 방식1: 1일 평균임금 직접 입력 */
  dailyAverageWage?: number;
  /** 방식2: 최근 3개월 임금 총액 */
  totalWage3Months?: number;
  /** 방식2: 최근 3개월 총 일수 (기본 90일) */
  totalDays3Months?: number;
  /** 장해등급 (1~14급) */
  grade: DisabilityGrade;
}

// ── 출력 ──────────────────────────────────────────────────────

export interface DisabilityPayResult {
  /** 산정된 1일 평균임금 */
  dailyAverageWage: number;

  /** 장해등급 */
  grade: DisabilityGrade;
  /** 지급 방식 */
  gradeType: DisabilityType;
  /** 일시금 보상일수 */
  lumpSumDays: number;
  /** 연금 지급일수 (8~14급은 null) */
  pensionDays: number | null;
  /** 노동력 상실률 */
  lossRate: number;

  // ─ 일시금 ─
  /** 일시금 총액 */
  lumpSumAmount: number;

  // ─ 연금 (1~7급) ─
  /** 연간 연금액 */
  annualPension: number | null;
  /** 월 연금액 (연간 ÷ 12) */
  monthlyPension: number | null;

  // ─ 4~7급 선택 시 참고 ─
  /** 일부연금 선택 시: 선급 일시금 (일시금의 50%) */
  partialLumpSum: number | null;
  /** 일부연금 선택 시: 잔여 연금 (연간 기준) */
  partialAnnualPension: number | null;
  /** 일부연금 선택 시: 잔여 월 연금 */
  partialMonthlyPension: number | null;
}

// ── 계산 ──────────────────────────────────────────────────────

export function calculateDisabilityPay(input: DisabilityPayInput): DisabilityPayResult {
  // 1. 평균임금 산정
  let dailyAvgWage: number;
  if (input.averageWageMethod === 'direct') {
    dailyAvgWage = input.dailyAverageWage!;
  } else {
    dailyAvgWage = Math.round(
      input.totalWage3Months! / (input.totalDays3Months ?? 90)
    );
  }

  // 2. 등급 정보 조회
  const info = getGradeInfo(input.grade);
  const { pensionDays, lumpSumDays, type, lossRate } = info;

  // 3. 일시금 계산
  const lumpSumAmount = Math.round(dailyAvgWage * lumpSumDays);

  // 4. 연금 계산 (1~7급)
  let annualPension: number | null = null;
  let monthlyPension: number | null = null;
  if (pensionDays !== null) {
    annualPension  = Math.round(dailyAvgWage * pensionDays);
    monthlyPension = Math.round(annualPension / 12);
  }

  // 5. 일부연금 참고값 계산 (4~7급 choice)
  let partialLumpSum: number | null = null;
  let partialAnnualPension: number | null = null;
  let partialMonthlyPension: number | null = null;
  if (type === 'choice' && annualPension !== null) {
    // 일부연금: 일시금의 50%를 선급받고, 남은 연금은 50% 수령
    partialLumpSum         = Math.round(lumpSumAmount * 0.5);
    partialAnnualPension   = Math.round(annualPension * 0.5);
    partialMonthlyPension  = Math.round(partialAnnualPension / 12);
  }

  return {
    dailyAverageWage: dailyAvgWage,
    grade: input.grade,
    gradeType: type,
    lumpSumDays,
    pensionDays: pensionDays ?? null,
    lossRate,
    lumpSumAmount,
    annualPension,
    monthlyPension,
    partialLumpSum,
    partialAnnualPension,
    partialMonthlyPension,
  };
}
