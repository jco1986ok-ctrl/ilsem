import { MINIMUM_DAILY_WAGE_2025 } from '@/lib/constants/minimumWage';

export interface AverageWageInput {
  /** 산정 사유 발생일 (YYYY-MM-DD) */
  baseDate: string;
  /** 1개월 전 임금 (원) */
  wage1: number;
  /** 2개월 전 임금 (원) */
  wage2: number;
  /** 3개월 전 임금 (원) */
  wage3: number;
  /** 최근 3개월 내 상여금 합계 (원) */
  bonus: number;
  /** 최근 3개월 내 연차수당 합계 (원) */
  annualLeavePay: number;
}

export interface AverageWageResult {
  /** 3개월간 임금 총액 (원) */
  totalWage: number;
  /** 3개월간 총 일수 */
  totalDays: number;
  /** 각 월의 일수 [1개월 전, 2개월 전, 3개월 전] */
  monthDays: [number, number, number];
  /** 각 월의 시작·종료일 */
  monthRanges: Array<{ label: string; start: string; end: string; days: number }>;
  /** 산출된 1일 평균임금 (원) */
  calculatedDailyWage: number;
  /** 최저임금 기준 1일 금액 */
  minimumDailyWage: number;
  /** 적용 1일 평균임금 (최저임금 미달 시 보정) */
  appliedDailyWage: number;
  /** 최저임금 기준 적용 여부 */
  isMinimumApplied: boolean;
  /** 월 환산 평균임금 (적용 평균임금 × 30) */
  monthlyWage: number;
}

/**
 * 산정 기간의 시작일과 종료일, 일수를 계산한다.
 * 근로기준법상 "이전 3개월"은 사유 발생일 전날부터 역으로 3개월이다.
 *
 * 예) 발생일 2025-07-08
 *   → 1개월 전: 2025-06-08 ~ 2025-07-07 (30일)
 *   → 2개월 전: 2025-05-08 ~ 2025-06-07 (31일)
 *   → 3개월 전: 2025-04-08 ~ 2025-05-07 (30일)
 */
function getThreeMonthRanges(baseDateStr: string): AverageWageResult['monthRanges'] {
  const base = new Date(baseDateStr + 'T00:00:00');

  const ranges: AverageWageResult['monthRanges'] = [];

  for (let i = 0; i < 3; i++) {
    // 구간 종료일: base - (i개월) - 1일
    const endDate = new Date(base);
    endDate.setMonth(endDate.getMonth() - i);
    endDate.setDate(endDate.getDate() - 1);

    // 구간 시작일: base - (i+1)개월
    const startDate = new Date(base);
    startDate.setMonth(startDate.getMonth() - (i + 1));

    const diffMs = endDate.getTime() - startDate.getTime();
    const days = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;

    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    ranges.push({
      label: `${i + 1}개월 전`,
      start: fmt(startDate),
      end: fmt(endDate),
      days,
    });
  }

  return ranges;
}

export function calculateAverageWage(input: AverageWageInput): AverageWageResult {
  const { baseDate, wage1, wage2, wage3, bonus, annualLeavePay } = input;

  const monthRanges = getThreeMonthRanges(baseDate);
  const totalDays = monthRanges.reduce((sum, r) => sum + r.days, 0);
  const monthDays: [number, number, number] = [
    monthRanges[0].days,
    monthRanges[1].days,
    monthRanges[2].days,
  ];

  // 상여금·연차수당은 3개월분 비율로 산입
  // 근로기준법 시행령 제2조: 상여금은 3/12(=1/4) 산입
  const bonusIncluded = bonus * (3 / 12);
  const annualLeavePayIncluded = annualLeavePay * (3 / 12);

  const totalWage = wage1 + wage2 + wage3 + bonusIncluded + annualLeavePayIncluded;

  const calculatedDailyWage = totalDays > 0 ? totalWage / totalDays : 0;
  const minimumDailyWage = MINIMUM_DAILY_WAGE_2025;
  const isMinimumApplied = calculatedDailyWage < minimumDailyWage;
  const appliedDailyWage = isMinimumApplied ? minimumDailyWage : calculatedDailyWage;
  const monthlyWage = appliedDailyWage * 30;

  return {
    totalWage,
    totalDays,
    monthDays,
    monthRanges,
    calculatedDailyWage,
    minimumDailyWage,
    appliedDailyWage,
    isMinimumApplied,
    monthlyWage,
  };
}
