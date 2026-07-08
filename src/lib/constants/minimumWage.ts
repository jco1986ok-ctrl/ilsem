/**
 * 2025년 최저임금 기준
 * 고용노동부 고시 제2024-65호
 */

/** 2025년 시간급 최저임금 (원) */
export const MINIMUM_HOURLY_WAGE_2025 = 10_030;

/** 2025년 일급 최저임금 - 8시간 기준 (원) */
export const MINIMUM_DAILY_WAGE_2025 = MINIMUM_HOURLY_WAGE_2025 * 8; // 80,240원

/** 2025년 월급 최저임금 - 209시간 기준 (원) */
export const MINIMUM_MONTHLY_WAGE_2025 = MINIMUM_HOURLY_WAGE_2025 * 209; // 2,096,270원

/** 연도별 최저임금 이력 (원/시간) */
export const MINIMUM_WAGE_HISTORY: Record<number, number> = {
  2020: 8_590,
  2021: 8_720,
  2022: 9_160,
  2023: 9_620,
  2024: 9_860,
  2025: 10_030,
};

/** 주 40시간제 기준 월 소정근로시간 */
export const MONTHLY_WORK_HOURS = 209;

/** 1일 법정근로시간 */
export const DAILY_WORK_HOURS = 8;

/** 1주 법정근로시간 */
export const WEEKLY_WORK_HOURS = 40;
