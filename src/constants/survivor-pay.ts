// src/constants/survivor-pay.ts
// 유족급여·장의비 계산 기준 상수 (매년 고용노동부 고시 확인 후 업데이트)

export const SURVIVOR_PAY_CONSTANTS = {
  // 유족보상일시금 일수
  LUMP_SUM_DAYS: 1300,

  // 반액연금+반액일시금의 일시금 부분 일수
  HALF_LUMP_SUM_DAYS: 650,

  // 장의비 일수
  FUNERAL_DAYS: 120,

  // 유족보상연금 기본 비율
  PENSION_BASIC_RATE: 0.47,

  // 수급자격자 1인당 가산 비율
  PENSION_BONUS_RATE_PER_PERSON: 0.05,

  // 가산 비율 상한
  PENSION_BONUS_RATE_MAX: 0.20,

  // 2026년 장의비 최저·최고 (고용노동부 고시 제2025-84호)
  FUNERAL_MIN_2026: 13_943_000,
  FUNERAL_MAX_2026: 19_279_760,

  // 2026년 보상기준금액 (고용노동부 고시 제2025-84호)
  MIN_DAILY_BASE_2026: 82_560,
  MAX_DAILY_BASE_2026: 268_299,

  YEAR: 2026,
} as const;
