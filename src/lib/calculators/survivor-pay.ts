/**
 * 유족급여·장의비 계산기
 *
 * 법령 근거:
 *  - 유족급여    산재보험법 제62조
 *  - 유족보상연금 산재보험법 제62조 제2항, 제64조
 *  - 장의비      산재보험법 제71조
 *  - 보상기준    고용노동부 고시 제2025-84호 (2026년 기준)
 */

import { SURVIVOR_PAY_CONSTANTS } from '@/constants/survivor-pay';

const C = SURVIVOR_PAY_CONSTANTS;

// ── 인터페이스 ────────────────────────────────────────────────

export type PaymentType = 'pension' | 'half' | 'lump-sum' | 'compare';

export interface SurvivorPayInput {
  dailyAvgWage: number;          // 1일 평균임금
  qualifiedSurvivors: number;    // 수급자격자 수 (0~4+)
  paymentType: PaymentType;
}

export interface SurvivorPayResult {
  appliedWage: number;           // 적용 평균임금 (최저/최고 보정)
  wageAdjusted: boolean;
  adjustmentType?: 'min' | 'max';
  originalWage: number;

  survivor: {
    hasQualifiedSurvivors: boolean;

    pension?: {
      baseAnnualAmount: number;  // 급여기초연액 (평균임금 × 365)
      basicRate: number;         // 47 (%)
      bonusRate: number;         // 수급자격자 수 × 5, max 20 (%)
      basicAmount: number;       // 기본금액
      bonusAmount: number;       // 가산금액
      annualTotal: number;       // 연간 연금 합계
      monthlyTotal: number;      // 월간 연금
    };

    halfOption?: {
      lumpSum: number;           // 일시금 50% (평균임금 × 650일분)
      annualPension: number;     // 연금 50%
      monthlyPension: number;
    };

    lumpSum: {
      days: number;              // 1,300일
      amount: number;            // 평균임금 × 1,300
    };

    breakEvenYears?: number;     // 전액연금으로 일시금 총액 초과까지 걸리는 연수
  };

  funeral: {
    calculatedAmount: number;    // 평균임금 × 120
    appliedAmount: number;       // 최저/최고 적용 후
    min: number;
    max: number;
    adjustmentApplied: 'none' | 'min' | 'max';
  };
}

// ── 계산 ──────────────────────────────────────────────────────

export function calculateSurvivorPay(input: SurvivorPayInput): SurvivorPayResult {
  // Step 1: 평균임금 보정
  let appliedWage    = input.dailyAvgWage;
  let wageAdjusted   = false;
  let adjustmentType: 'min' | 'max' | undefined;

  if (input.dailyAvgWage < C.MIN_DAILY_BASE_2026) {
    appliedWage    = C.MIN_DAILY_BASE_2026;
    wageAdjusted   = true;
    adjustmentType = 'min';
  } else if (input.dailyAvgWage > C.MAX_DAILY_BASE_2026) {
    appliedWage    = C.MAX_DAILY_BASE_2026;
    wageAdjusted   = true;
    adjustmentType = 'max';
  }

  // Step 2: 수급자격자 여부
  const n                     = Math.max(0, input.qualifiedSurvivors);
  const hasQualifiedSurvivors = n > 0;

  // Step 3: 연금 계산 (수급자격자 있을 때)
  let pension:    SurvivorPayResult['survivor']['pension'];
  let halfOption: SurvivorPayResult['survivor']['halfOption'];

  if (hasQualifiedSurvivors) {
    const baseAnnualAmount    = Math.round(appliedWage * 365);
    const bonusRateFraction   = Math.min(C.PENSION_BONUS_RATE_PER_PERSON * n, C.PENSION_BONUS_RATE_MAX);
    const basicRate           = Math.round(C.PENSION_BASIC_RATE * 100);   // 47
    const bonusRate           = Math.round(bonusRateFraction * 100);      // 5~20

    const basicAmount         = Math.round(baseAnnualAmount * C.PENSION_BASIC_RATE);
    const bonusAmount         = Math.round(baseAnnualAmount * bonusRateFraction);
    const annualTotal         = basicAmount + bonusAmount;
    const monthlyTotal        = Math.round(annualTotal / 12);

    pension = { baseAnnualAmount, basicRate, bonusRate, basicAmount, bonusAmount, annualTotal, monthlyTotal };

    halfOption = {
      lumpSum:        Math.round(appliedWage * C.HALF_LUMP_SUM_DAYS),
      annualPension:  Math.round(annualTotal * 0.5),
      monthlyPension: Math.round(monthlyTotal * 0.5),
    };
  }

  // Step 4: 유족보상일시금 (항상 계산)
  const lumpSumAmount = Math.round(appliedWage * C.LUMP_SUM_DAYS);

  // Step 5: 손익분기점 (전액연금 vs 일시금)
  let breakEvenYears: number | undefined;
  if (pension) {
    breakEvenYears = parseFloat((lumpSumAmount / pension.annualTotal).toFixed(1));
  }

  // Step 6: 장의비
  const calculatedFuneral      = Math.round(appliedWage * C.FUNERAL_DAYS);
  let appliedFuneral            = calculatedFuneral;
  let funeralAdj: 'none' | 'min' | 'max' = 'none';

  if (calculatedFuneral < C.FUNERAL_MIN_2026) {
    appliedFuneral = C.FUNERAL_MIN_2026;
    funeralAdj     = 'min';
  } else if (calculatedFuneral > C.FUNERAL_MAX_2026) {
    appliedFuneral = C.FUNERAL_MAX_2026;
    funeralAdj     = 'max';
  }

  return {
    appliedWage,
    wageAdjusted,
    adjustmentType,
    originalWage: input.dailyAvgWage,

    survivor: {
      hasQualifiedSurvivors,
      pension,
      halfOption,
      lumpSum: {
        days:   C.LUMP_SUM_DAYS,
        amount: lumpSumAmount,
      },
      breakEvenYears,
    },

    funeral: {
      calculatedAmount:  calculatedFuneral,
      appliedAmount:     appliedFuneral,
      min:               C.FUNERAL_MIN_2026,
      max:               C.FUNERAL_MAX_2026,
      adjustmentApplied: funeralAdj,
    },
  };
}
