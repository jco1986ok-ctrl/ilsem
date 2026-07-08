// 2026년 기준 (매년 1월 업데이트 필요)
// 근거: 고용노동부 고시 제2025-84호 (2026.1.1 시행)
export const SICK_LEAVE_PAY_CONSTANTS = {
  year: 2026,

  // 2026년 최저임금 (고용노동부 고시, 2026.1.1 시행)
  minimumWageHourly: 10320,          // 시급
  minimumWageDaily: 82560,           // 10,320 × 8시간

  // 2026년 최저·최고 보상기준금액 (고용노동부 고시 제2025-84호)
  minCompensationDaily: 82560,       // 1일 최저보상기준금액
  maxCompensationDaily: 268299,      // 1일 최고보상기준금액

  // 지급률 (법령 변경 없음)
  standardRate: 0.70,
  lowIncomeRate: 0.90,
  minCompensationRate: 0.80,

  // 고령자 감액 기준 (산업재해보상보험법 별표1, 변경 없음)
  elderlyReduction70: {
    61: { numerator: 66, denominator: 70 },
    62: { numerator: 62, denominator: 70 },
    63: { numerator: 58, denominator: 70 },
    64: { numerator: 54, denominator: 70 },
    65: { numerator: 50, denominator: 70 },
  } as Record<number, { numerator: number; denominator: number }>,

  elderlyReduction90: {
    61: { numerator: 86, denominator: 90 },
    62: { numerator: 82, denominator: 90 },
    63: { numerator: 78, denominator: 90 },
    64: { numerator: 74, denominator: 90 },
    65: { numerator: 70, denominator: 90 },
  } as Record<number, { numerator: number; denominator: number }>,

  elderlyReductionMin80: {
    61: { numerator: 86, denominator: 90 },
    62: { numerator: 82, denominator: 90 },
    63: { numerator: 78, denominator: 90 },
    64: { numerator: 74, denominator: 90 },
    65: { numerator: 70, denominator: 90 },
  } as Record<number, { numerator: number; denominator: number }>,

  elderlyGracePeriodYears: 2,
} as const;
