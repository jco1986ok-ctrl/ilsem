/**
 * 유족급여·장의비 계산기
 *
 * 법령 근거:
 *  - 유족급여    산재보험법 제62조
 *  - 유족보상연금 산재보험법 제62조 제2항, 제64조
 *  - 장의비      산재보험법 제71조
 *  - 보상기준    고용노동부 고시 (2026년 기준)
 */

// ── 2026년 상수 ────────────────────────────────────────────────

export const SURVIVOR_CONSTANTS_2026 = {
  year: 2026,

  // 보상기준금액 (1일)
  minCompensationDaily: 82_560,   // 최저시급 10,320원 × 8h
  maxCompensationDaily: 268_299,

  // 유족보상연금 기본 비율 (급여기초연액 = 평균임금 × 365)
  pensionBaseRate:     0.47,      // 기본금액: 연액 × 47%
  pensionAddRate:      0.05,      // 수급자격자 1인당 가산: 연액 × 5%
  pensionAddMax:       0.20,      // 가산 상한: 연액 × 20% (4인 이상)

  // 일시금 보상일수
  lumpSumDays:        1_300,      // 수급자격자 없을 때
  halfLumpSumDays:      650,      // 반액연금+반액일시금의 일시금 부분

  // 장의비
  funeralDays:          120,
  funeralMin:    13_943_000,      // 최저 장의비 (2026년 고시)
  funeralMax:    19_279_760,      // 최고 장의비 (2026년 고시)
} as const;

// ── 입력 ──────────────────────────────────────────────────────

export type AverageWageMethod = 'direct' | 'calculate';

/**
 * 유족급여 지급 유형
 *  pension-full  : 유족보상연금 전액
 *  pension-half  : 반액연금 + 반액일시금 (수급자격자 있음)
 *  lump-sum      : 유족보상일시금 (수급자격자 없음)
 */
export type SurvivorPayType = 'pension-full' | 'pension-half' | 'lump-sum';

export interface SurvivorPayInput {
  averageWageMethod: AverageWageMethod;

  /** 방식1: 1일 평균임금 직접 입력 */
  dailyAverageWage?: number;

  /** 방식2: 3개월 임금 총액 기반 계산 */
  totalWage3Months?: number;
  totalDays3Months?: number;

  /** 지급 유형 */
  payType: SurvivorPayType;

  /**
   * 수급자격자 수 (pension-full / pension-half 시 필요)
   * 0이면 lump-sum으로 강제 전환
   */
  eligibleCount: number;
}

// ── 출력 ──────────────────────────────────────────────────────

export interface SurvivorPayResult {
  /** 입력된 1일 평균임금 */
  rawDailyWage: number;
  /** 보상기준 적용 후 1일 평균임금 */
  adjustedDailyWage: number;
  /** 보상기준 조정 여부 */
  isAdjusted: boolean;
  adjustedReason?: string;

  /** 급여기초연액 (조정 후 평균임금 × 365) */
  annualBase: number;

  payType: SurvivorPayType;
  payTypeLabel: string;

  /** [연금 전액 / 반액] 연간 연금액 */
  annualPension?: number;
  /** [연금 전액 / 반액] 월 연금액 (연간 ÷ 12) */
  monthlyPension?: number;
  /** [반액 / 일시금] 일시금 */
  lumpSum?: number;

  /** 수급자격자 수 */
  eligibleCount: number;
  /** 연금 가산 비율 (%) */
  pensionAddRatePct?: number;

  /** 장의비 */
  funeralRaw: number;
  funeral: number;
  funeralCapped: boolean;
  funeralCapReason?: string;
}

// ── 계산 ──────────────────────────────────────────────────────

export function calculateSurvivorPay(input: SurvivorPayInput): SurvivorPayResult {
  const C = SURVIVOR_CONSTANTS_2026;

  // Step 1: 평균임금 산정
  let rawDailyWage: number;
  if (input.averageWageMethod === 'direct') {
    rawDailyWage = input.dailyAverageWage!;
  } else {
    rawDailyWage = Math.round(
      input.totalWage3Months! / (input.totalDays3Months || 90)
    );
  }

  // Step 2: 보상기준금액 조정
  let adjustedDailyWage = rawDailyWage;
  let isAdjusted = false;
  let adjustedReason: string | undefined;

  if (rawDailyWage < C.minCompensationDaily) {
    adjustedDailyWage = C.minCompensationDaily;
    isAdjusted = true;
    adjustedReason = `평균임금(${rawDailyWage.toLocaleString()}원)이 1일 최저보상기준금액(${C.minCompensationDaily.toLocaleString()}원) 미만 → 최저 적용`;
  } else if (rawDailyWage > C.maxCompensationDaily) {
    adjustedDailyWage = C.maxCompensationDaily;
    isAdjusted = true;
    adjustedReason = `평균임금(${rawDailyWage.toLocaleString()}원)이 1일 최고보상기준금액(${C.maxCompensationDaily.toLocaleString()}원) 초과 → 최고 적용`;
  }

  // Step 3: 급여기초연액
  const annualBase = Math.round(adjustedDailyWage * 365);

  // Step 4: 수급자격자 수에 따른 지급 유형 결정
  const eligibleCount = Math.max(0, input.eligibleCount);
  let payType: SurvivorPayType = input.payType;
  if (eligibleCount === 0) payType = 'lump-sum';

  const payTypeLabel = {
    'pension-full': '유족보상연금 (전액)',
    'pension-half': '반액연금 + 반액일시금',
    'lump-sum':     '유족보상일시금',
  }[payType];

  // Step 5: 유족보상연금 계산 (full / half 공통)
  let annualPension: number | undefined;
  let monthlyPension: number | undefined;
  let lumpSum: number | undefined;
  let pensionAddRatePct: number | undefined;

  if (payType === 'pension-full' || payType === 'pension-half') {
    const addCount      = Math.min(eligibleCount, 4); // 4인 이상은 동일 상한
    const addRate       = Math.min(C.pensionAddRate * addCount, C.pensionAddMax);
    pensionAddRatePct   = Math.round(addRate * 100); // 5 / 10 / 15 / 20

    const fullAnnual    = Math.round(annualBase * (C.pensionBaseRate + addRate));
    const fullMonthly   = Math.round(fullAnnual / 12);

    if (payType === 'pension-full') {
      annualPension  = fullAnnual;
      monthlyPension = fullMonthly;
    } else {
      // 반액연금
      annualPension  = Math.round(fullAnnual * 0.5);
      monthlyPension = Math.round(fullMonthly * 0.5);
      // 반액일시금 = 평균임금 × 650일
      lumpSum = Math.round(adjustedDailyWage * C.halfLumpSumDays);
    }
  } else {
    // 유족보상일시금 = 평균임금 × 1,300일
    lumpSum = Math.round(adjustedDailyWage * C.lumpSumDays);
  }

  // Step 6: 장의비
  const funeralRaw   = Math.round(adjustedDailyWage * C.funeralDays);
  let funeral        = funeralRaw;
  let funeralCapped  = false;
  let funeralCapReason: string | undefined;

  if (funeralRaw < C.funeralMin) {
    funeral         = C.funeralMin;
    funeralCapped   = true;
    funeralCapReason = `산정액(${funeralRaw.toLocaleString()}원)이 최저 장의비(${C.funeralMin.toLocaleString()}원) 미만 → 최저 적용`;
  } else if (funeralRaw > C.funeralMax) {
    funeral         = C.funeralMax;
    funeralCapped   = true;
    funeralCapReason = `산정액(${funeralRaw.toLocaleString()}원)이 최고 장의비(${C.funeralMax.toLocaleString()}원) 초과 → 최고 적용`;
  }

  return {
    rawDailyWage,
    adjustedDailyWage,
    isAdjusted,
    adjustedReason,
    annualBase,
    payType,
    payTypeLabel,
    annualPension,
    monthlyPension,
    lumpSum,
    eligibleCount,
    pensionAddRatePct,
    funeralRaw,
    funeral,
    funeralCapped,
    funeralCapReason,
  };
}
