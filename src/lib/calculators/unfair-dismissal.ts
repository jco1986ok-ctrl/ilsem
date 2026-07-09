/**
 * 부당해고 보상금 계산기
 *
 * [A] 해고예고수당 (근로기준법 제26조)
 *   - 풀타임 : 시간급 × 8h × 30일
 *   - 단시간 : 시간급 × (주 소정근로시간 ÷ 주 근무일수) × 30일
 *   - 예외조항 해당 시 0원
 *
 * [B] 부당해고 금전보상금 (근로기준법 제30조 제3항)
 *   - 임금상당액 = 월급 × 해고일~판정일 개월 수
 *   - 최소 = 임금상당액
 *   - 최대 = 임금상당액 + 위로금(최대 3개월)
 */

// ── 입력 ──────────────────────────────────────────────────────

export type EmploymentType = 'fulltime' | 'parttime';

export interface UnfairDismissalInput {
  employmentType: EmploymentType;

  /** 시간급 통상임금 (원) */
  hourlyWage: number;

  /** 월 임금 (금전보상금 기준, 원) */
  monthlyWage: number;

  /**
   * 단시간 근로자 전용
   * - weeklyHours: 주 소정근로시간
   * - weeklyWorkDays: 주 근무일수
   */
  weeklyHours?: number;
  weeklyWorkDays?: number;

  /** 해고예고수당 예외 사유 해당 여부 (근로기준법 제35조) */
  hasException: boolean;
  /** 예외 사유 코드 (참고용) */
  exceptionCode?: ExceptionCode;

  /** 해고일 (YYYY-MM-DD) */
  dismissalDate: string;
  /** 판정 예상일 (YYYY-MM-DD) — 미입력 시 해고일로부터 75일(평균) 적용 */
  judgmentDate?: string;
  /** 위로금 개월 수 (0~3, 기본 0) */
  consolationMonths: number;
}

export type ExceptionCode =
  | 'daily-worker-3m'   // 일용근로자 3개월 미만
  | 'fixed-term-2m'     // 2개월 이내 기간제
  | 'probation-3m'      // 수습 3개월 이내
  | 'force-majeure'     // 천재·사변 등
  | 'gross-negligence'; // 고의적 손해

// ── 출력 ──────────────────────────────────────────────────────

export interface UnfairDismissalResult {
  /** [A] 해고예고수당 */
  noticePay: {
    /** 예외 적용 여부 */
    isExcepted: boolean;
    /** 1일 소정근로시간 */
    dailyHours: number;
    /** 금액 (예외 시 0) */
    amount: number;
  };

  /** [B] 부당해고 금전보상금 */
  unfairDismissal: {
    /** 해고일 ~ 판정일 개월 수 (소수점 포함) */
    compensationMonths: number;
    /** 임금상당액 */
    wageEquivalent: number;
    /** 위로금 (consolationMonths × monthlyWage) */
    consolation: number;
    /** 최소 보상금 (임금상당액) */
    minCompensation: number;
    /** 최대 보상금 (임금상당액 + 위로금) */
    maxCompensation: number;
  };

  /** 합산 최소 총액 */
  totalMin: number;
  /** 합산 최대 총액 */
  totalMax: number;
}

// ── 계산 ──────────────────────────────────────────────────────

/** 두 날짜 사이의 개월 수 (소수점 1자리) */
function monthsBetween(from: string, to: string): number {
  const a = new Date(from);
  const b = new Date(to);
  const diffMs   = b.getTime() - a.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return Math.round((diffDays / 30) * 10) / 10;
}

export function calculateUnfairDismissal(input: UnfairDismissalInput): UnfairDismissalResult {
  // ── A. 해고예고수당 ──────────────────────────────────────────

  // 1일 소정근로시간 산정
  let dailyHours: number;
  if (input.employmentType === 'fulltime') {
    dailyHours = 8;
  } else {
    const weeklyHours    = input.weeklyHours    ?? 0;
    const weeklyWorkDays = input.weeklyWorkDays ?? 5;
    dailyHours = parseFloat((weeklyHours / weeklyWorkDays).toFixed(2));
  }

  const noticePayAmount = input.hasException
    ? 0
    : Math.round(input.hourlyWage * dailyHours * 30);

  // ── B. 부당해고 금전보상금 ────────────────────────────────────

  // 판정일 결정: 미입력 시 해고일로부터 75일 후
  let judgmentDate = input.judgmentDate;
  if (!judgmentDate || judgmentDate < input.dismissalDate) {
    const d = new Date(input.dismissalDate);
    d.setDate(d.getDate() + 75);
    judgmentDate = d.toISOString().slice(0, 10);
  }

  const compensationMonths = monthsBetween(input.dismissalDate, judgmentDate);
  const wageEquivalent     = Math.round(input.monthlyWage * compensationMonths);
  const consolation        = Math.round(input.monthlyWage * Math.min(input.consolationMonths, 3));

  const minCompensation    = wageEquivalent;
  const maxCompensation    = wageEquivalent + consolation;

  return {
    noticePay: {
      isExcepted: input.hasException,
      dailyHours,
      amount: noticePayAmount,
    },
    unfairDismissal: {
      compensationMonths,
      wageEquivalent,
      consolation,
      minCompensation,
      maxCompensation,
    },
    totalMin: noticePayAmount + minCompensation,
    totalMax: noticePayAmount + maxCompensation,
  };
}
