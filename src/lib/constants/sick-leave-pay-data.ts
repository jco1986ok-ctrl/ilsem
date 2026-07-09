/**
 * 산재 휴업급여 계산 상수 (산재보험법 제52조)
 * 최저·최고 보상기준금액은 compensation-standards.ts 에서 가져옵니다.
 */
import { CURRENT_STANDARDS } from '@/lib/constants/compensation-standards';

const S = CURRENT_STANDARDS;

export const SICK_LEAVE_PAY_CONSTANTS = {
  year: S.year,

  // ── 최저임금 ──────────────────────────────────────────────
  minimumWageHourly: S.minHourlyWage,
  minimumWageDaily:  S.minDailyBase,   // minHourlyWage × 8h

  // ── 보상기준금액 ───────────────────────────────────────────
  minCompensationDaily: S.minDailyBase,
  maxCompensationDaily: S.maxDailyBase,

  // ── 지급률 (법령 변경 없음) ───────────────────────────────
  standardRate:       0.70,
  lowIncomeRate:      0.90,
  minCompensationRate: 0.80,

  // ── 고령자 감액 기준 (산재보험법 별표1, 변경 없음) ─────────
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
