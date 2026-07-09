/**
 * 산재보험 보상기준금액 공통 상수
 * 근거: 고용노동부 고시 (매년 1월 갱신)
 *
 * 사용처:
 *   - 휴업급여 계산기 (sick-leave-pay-data.ts)
 *   - 장해급여 계산기 (disability 관련 계산)
 *   - 향후 추가될 유족급여·간병급여 등
 *
 * 갱신 시 이 파일만 수정하면 모든 계산기에 반영됩니다.
 */

// ── 2026년 기준 ────────────────────────────────────────────────
// 근거: 고용노동부 고시 제2025-84호 (2026.1.1 시행)
export const STANDARDS_2026 = {
  year: 2026,
  minHourlyWage: 10_320,   // 최저시급 (원)
  minDailyBase:  82_560,   // 최저보상기준금액 = 10,320 × 8h (원)
  maxDailyBase: 268_299,   // 최고보상기준금액 (원)
} as const;

/**
 * 현재 연도에 적용할 보상기준금액
 * 새 연도 고시가 나오면 이 변수만 교체하세요.
 */
export const CURRENT_STANDARDS = STANDARDS_2026;

export type CompensationStandards = typeof STANDARDS_2026;
