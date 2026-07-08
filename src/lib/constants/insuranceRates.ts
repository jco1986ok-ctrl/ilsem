/**
 * 2025년 4대보험 요율
 * 국민건강보험공단, 국민연금공단, 고용노동부 기준
 */

/** 국민연금 요율 */
export const NATIONAL_PENSION = {
  /** 전체 요율 (%) */
  total: 9.0,
  /** 근로자 부담 (%) */
  employee: 4.5,
  /** 사업주 부담 (%) */
  employer: 4.5,
  /** 2025년 기준소득월액 하한액 (원) */
  incomeFloor: 390_000,
  /** 2025년 기준소득월액 상한액 (원) */
  incomeCeiling: 6_170_000,
} as const;

/** 건강보험 요율 */
export const HEALTH_INSURANCE = {
  /** 전체 요율 (%) */
  total: 7.09,
  /** 근로자 부담 (%) */
  employee: 3.545,
  /** 사업주 부담 (%) */
  employer: 3.545,
  /** 장기요양보험 요율 - 건강보험료 대비 (%) */
  ltcRate: 12.95,
  /** 장기요양 근로자 부담 (%) */
  ltcEmployee: 6.475,
  /** 장기요양 사업주 부담 (%) */
  ltcEmployer: 6.475,
} as const;

/** 고용보험 요율 */
export const EMPLOYMENT_INSURANCE = {
  /** 실업급여 - 근로자 부담 (%) */
  unemploymentEmployee: 0.9,
  /** 실업급여 - 사업주 부담 (%) - 150인 미만 사업장 */
  unemploymentEmployer150Under: 0.9,
  /** 실업급여 - 사업주 부담 (%) - 150인 이상 우선지원대상기업 */
  unemploymentEmployer150Over: 1.05,
  /** 실업급여 - 사업주 부담 (%) - 150인 이상 1000인 미만 */
  unemploymentEmployer1000Under: 1.3,
  /** 실업급여 - 사업주 부담 (%) - 1000인 이상 및 국가·지방자치단체 */
  unemploymentEmployer1000Over: 1.5,
  /** 고용안정·직업능력개발 - 150인 미만 (%) */
  stabilityUnder150: 0.25,
  /** 고용안정·직업능력개발 - 150인 이상 우선지원 (%) */
  stability150Priority: 0.45,
  /** 고용안정·직업능력개발 - 150인 이상 1000인 미만 (%) */
  stability150to1000: 0.65,
  /** 고용안정·직업능력개발 - 1000인 이상 및 국가 (%) */
  stabilityOver1000: 0.85,
} as const;

/** 산재보험 요율 - 업종별 상이 (기본값: 일반 제조업 기준) */
export const INDUSTRIAL_ACCIDENT_INSURANCE = {
  /** 산재보험은 사업주 전액 부담 */
  employeeRate: 0,
  /** 평균 요율 참고값 (%) - 실제는 업종별 상이 */
  averageRate: 1.53,
} as const;

/** 4대보험 통합 요율 요약 */
export const INSURANCE_RATES_SUMMARY = {
  nationalPension: NATIONAL_PENSION,
  healthInsurance: HEALTH_INSURANCE,
  employmentInsurance: EMPLOYMENT_INSURANCE,
  industrialAccident: INDUSTRIAL_ACCIDENT_INSURANCE,
} as const;
