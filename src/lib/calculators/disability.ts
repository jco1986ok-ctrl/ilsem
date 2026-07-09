/**
 * 산재 장해급여 계산기 (산재보험법 제57조)
 *
 * [지급 방식]
 *   1~3급 (pension-only)  : 연금만
 *   4~7급 (choice)        : 연금 또는 일시금 선택 — 결과에 둘 다 + 손익분기 포함
 *   8~14급 (lump-sum-only): 일시금만
 *
 * [평균임금 보정]
 *   최저보상기준금액 미달 시 최저기준으로 올림
 *   최고보상기준금액 초과 시 최고기준으로 내림
 */

import { CURRENT_STANDARDS } from '@/lib/constants/compensation-standards';
import {
  DISABILITY_TABLE,
  DisabilityGrade,
  DisabilityType,
  getGradeInfo,
} from '@/lib/constants/disability-data';

// ── 입력 ──────────────────────────────────────────────────────

export interface DisabilityInput {
  /** 1일 평균임금 (원) */
  dailyAvgWage: number;
  /** 장해등급 1~14 */
  grade: number;
  /** 4~7급에서 선택한 수령 방식 (선택 안 하면 둘 다 계산) */
  paymentType?: 'pension' | 'lump-sum';
}

// ── 출력 ──────────────────────────────────────────────────────

export interface DisabilityResult {
  /** 보정 후 적용 평균임금 */
  appliedWage: number;
  /** 원래 입력 평균임금 */
  originalWage: number;
  /** 최저/최고 기준 보정 여부 */
  wageAdjusted: boolean;
  /** 보정 방향 */
  adjustmentType?: 'min' | 'max';

  grade: number;
  gradeType: DisabilityType;
  /** 노동력 상실률 (%) */
  lossRate: number;

  /** 일시금 (4~14급) */
  lumpSum?: {
    days: number;
    amount: number;
  };

  /** 연금 (1~7급) */
  pension?: {
    daysPerYear: number;
    annualAmount: number;
    monthlyAmount: number;
  };

  /** 4~7급 선택 비교용 */
  comparison?: {
    lumpSum: number;
    annualPension: number;
    /** 연금 수령 합계가 일시금을 넘어서는 연수 */
    breakEvenYears: number;
  };
}

// ── 계산 ──────────────────────────────────────────────────────

export function calculateDisability(input: DisabilityInput): DisabilityResult {
  const S = CURRENT_STANDARDS;

  // 1. 평균임금 보정 (최저·최고 보상기준금액)
  const originalWage = input.dailyAvgWage;
  let appliedWage = originalWage;
  let wageAdjusted = false;
  let adjustmentType: 'min' | 'max' | undefined;

  if (originalWage < S.minDailyBase) {
    appliedWage = S.minDailyBase;
    wageAdjusted = true;
    adjustmentType = 'min';
  } else if (originalWage > S.maxDailyBase) {
    appliedWage = S.maxDailyBase;
    wageAdjusted = true;
    adjustmentType = 'max';
  }

  // 2. 등급별 보상일수 조회
  const info = getGradeInfo(input.grade as DisabilityGrade);
  const { pensionDays, lumpSumDays, type: gradeType, lossRate } = info;

  // 3. 지급 유형에 따른 금액 계산
  let lumpSum: DisabilityResult['lumpSum'];
  let pension: DisabilityResult['pension'];

  // 연금 계산 — 1~7급
  if (pensionDays !== null) {
    const annualAmount = Math.round(appliedWage * pensionDays);
    pension = {
      daysPerYear: pensionDays,
      annualAmount,
      monthlyAmount: Math.round(annualAmount / 12),
    };
  }

  // 일시금 계산 — 4~14급 (choice + lump-sum-only)
  if (gradeType === 'choice' || gradeType === 'lump-sum-only') {
    lumpSum = {
      days: lumpSumDays,
      amount: Math.round(appliedWage * lumpSumDays),
    };
  }

  // 4. 4~7급 비교 데이터 (손익분기점)
  let comparison: DisabilityResult['comparison'];
  if (gradeType === 'choice' && pension && lumpSum) {
    comparison = {
      lumpSum:       lumpSum.amount,
      annualPension: pension.annualAmount,
      breakEvenYears: parseFloat(
        (lumpSum.amount / pension.annualAmount).toFixed(1)
      ),
    };
  }

  return {
    appliedWage,
    originalWage,
    wageAdjusted,
    adjustmentType,
    grade: input.grade,
    gradeType,
    lossRate,
    lumpSum,
    pension,
    comparison,
  };
}
