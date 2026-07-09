/**
 * 유족급여·장의비 계산기
 *
 * 법령 근거:
 *  - 유족급여    산재보험법 제62조
 *  - 유족보상연금 산재보험법 제62조 제2항, 제64조
 *  - 장의비      산재보험법 제71조
 *  - 보상기준    고용노동부 고시 제2025-84호 (2026년 기준)
 */

// ── 2026년 상수 ────────────────────────────────────────────────

export const SURVIVOR_CONSTANTS_2026 = {
  year: 2026,

  // 보상기준금액 (1일)
  minCompensationDaily: 82_560,
  maxCompensationDaily: 268_299,

  // 유족보상연금 비율
  pensionBaseRate:  0.47,   // 기본금액: 급여기초연액 × 47%
  pensionBonusRate: 0.05,   // 수급자격자 1인당 가산: × 5%
  pensionBonusMax:  0.20,   // 가산 상한: × 20%

  // 일시금 보상일수
  lumpSumFullDays: 1_300,   // 유족보상일시금 (수급자격자 없음)
  lumpSumHalfDays:   650,   // 반액연금+반액일시금의 일시금 부분

  // 장의비
  funeralDays: 120,
  funeralMin:  13_943_000,  // 2026년 고시
  funeralMax:  19_279_760,  // 2026년 고시
} as const;

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
  const C = SURVIVOR_CONSTANTS_2026;

  // Step 1: 평균임금 보정
  let appliedWage  = input.dailyAvgWage;
  let wageAdjusted = false;
  let adjustmentType: 'min' | 'max' | undefined;

  if (input.dailyAvgWage < C.minCompensationDaily) {
    appliedWage    = C.minCompensationDaily;
    wageAdjusted   = true;
    adjustmentType = 'min';
  } else if (input.dailyAvgWage > C.maxCompensationDaily) {
    appliedWage    = C.maxCompensationDaily;
    wageAdjusted   = true;
    adjustmentType = 'max';
  }

  // Step 2: 수급자격자 여부
  const n                   = Math.max(0, input.qualifiedSurvivors);
  const hasQualifiedSurvivors = n > 0;

  // Step 3: 연금 계산 (수급자격자 있을 때)
  let pension: SurvivorPayResult['survivor']['pension'];
  let halfOption: SurvivorPayResult['survivor']['halfOption'];

  if (hasQualifiedSurvivors) {
    const baseAnnualAmount = Math.round(appliedWage * 365);
    const bonusRateFraction = Math.min(C.pensionBonusRate * n, C.pensionBonusMax);
    const basicRate  = Math.round(C.pensionBaseRate * 100);    // 47
    const bonusRate  = Math.round(bonusRateFraction * 100);    // 5~20

    const basicAmount  = Math.round(baseAnnualAmount * C.pensionBaseRate);
    const bonusAmount  = Math.round(baseAnnualAmount * bonusRateFraction);
    const annualTotal  = basicAmount + bonusAmount;
    const monthlyTotal = Math.round(annualTotal / 12);

    pension = { baseAnnualAmount, basicRate, bonusRate, basicAmount, bonusAmount, annualTotal, monthlyTotal };

    halfOption = {
      lumpSum:        Math.round(appliedWage * C.lumpSumHalfDays),
      annualPension:  Math.round(annualTotal * 0.5),
      monthlyPension: Math.round(monthlyTotal * 0.5),
    };
  }

  // Step 4: 유족보상일시금 (항상 계산)
  const lumpSumAmount = Math.round(appliedWage * C.lumpSumFullDays);

  // Step 5: 손익분기점 (연금 vs 일시금)
  let breakEvenYears: number | undefined;
  if (pension) {
    // 전액 연금을 받아 일시금(1,300일분)을 넘기까지 걸리는 연수
    breakEvenYears = parseFloat((lumpSumAmount / pension.annualTotal).toFixed(1));
  }

  // Step 6: 장의비
  const calculatedFuneral = Math.round(appliedWage * C.funeralDays);
  let appliedFuneral      = calculatedFuneral;
  let funeralAdj: 'none' | 'min' | 'max' = 'none';

  if (calculatedFuneral < C.funeralMin) {
    appliedFuneral = C.funeralMin;
    funeralAdj     = 'min';
  } else if (calculatedFuneral > C.funeralMax) {
    appliedFuneral = C.funeralMax;
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
        days:   C.lumpSumFullDays,
        amount: lumpSumAmount,
      },
      breakEvenYears,
    },

    funeral: {
      calculatedAmount: calculatedFuneral,
      appliedAmount:    appliedFuneral,
      min:              C.funeralMin,
      max:              C.funeralMax,
      adjustmentApplied: funeralAdj,
    },
  };
}
