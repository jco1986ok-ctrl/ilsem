// ──────────────────────────────────────────────
// 연차수당 계산 로직
// 근거: 근로기준법 제60조, 제61조
// ──────────────────────────────────────────────

/**
 * 근속연수별 연차 발생일수 계산
 */
export function getAnnualLeaveDays(yearsWorked: number): number {
  if (yearsWorked < 1) {
    const months = Math.floor(yearsWorked * 12);
    return Math.min(months, 11);
  }
  const fullYears = Math.floor(yearsWorked);
  const bonusDays = fullYears >= 3 ? Math.floor((fullYears - 1) / 2) : 0;
  return Math.min(15 + bonusDays, 25);
}

export interface AnnualLeaveYear {
  year:        number;   // 몇 년차 (0=1년 미만, 1=만1년~2년 ...)
  yearsWorked: number;
  leaveDays:   number;
  label:       string;
}

/**
 * 입사일·기준일 기반으로 연도별 연차 발생 구간 생성
 */
export function generateLeaveTable(
  startDate: string,
  endDate: string
): AnnualLeaveYear[] {
  const start = new Date(startDate);
  const end   = new Date(endDate);
  const result: AnnualLeaveYear[] = [];

  const oneYearLater = new Date(start);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  if (end < oneYearLater) {
    const monthsDiff =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    const leaveDays = Math.min(Math.max(monthsDiff, 0), 11);
    result.push({
      year: 0,
      yearsWorked: 0,
      leaveDays,
      label: `입사일 ~ 만 1년 미만 (월 개근 시 ${leaveDays}일)`,
    });
    return result;
  }

  result.push({
    year: 0,
    yearsWorked: 0,
    leaveDays: 11,
    label: '입사일 ~ 만 1년 (월 개근 시 최대 11일)',
  });

  let currentYear = 1;
  while (currentYear <= 50) {
    const periodStart = new Date(start);
    periodStart.setFullYear(periodStart.getFullYear() + currentYear);
    if (periodStart > end) break;

    const periodEnd = new Date(start);
    periodEnd.setFullYear(periodEnd.getFullYear() + currentYear + 1);

    const leaveDays = getAnnualLeaveDays(currentYear);
    const isCurrent = periodEnd > end;

    result.push({
      year: currentYear,
      yearsWorked: currentYear,
      leaveDays,
      label: isCurrent
        ? `만 ${currentYear}년 ~ 현재/퇴직일`
        : `만 ${currentYear}년 ~ 만 ${currentYear + 1}년`,
    });

    currentYear++;
  }

  return result;
}

export interface AnnualLeavePayInput {
  wageType:             'monthly' | 'hourly';
  monthlyWage?:         number;
  hourlyWage?:          number;
  weeklyWorkHours:      number;
  weeklyWorkDays:       number;
  dailyWorkHours:       number;
  monthlyFixedAllowance: number;
  annualBonus:          number;
  unusedLeaveDays:      number;
}

export interface AnnualLeavePayResult {
  monthlyWorkHours:          number;
  hourlyOrdinaryWage:        number;
  dailyOrdinaryWage:         number;
  unusedLeaveDays:           number;
  totalPay:                  number;
  monthlyOrdinaryWageTotal:  number;
}

/**
 * 월 소정근로시간 계산
 * (주 소정근로 + 주휴시간) × 365/12/7
 */
export function calcMonthlyWorkHours(
  weeklyWorkHours: number,
  dailyWorkHours: number
): number {
  const weeklyHolidayHours = weeklyWorkHours >= 15 ? dailyWorkHours : 0;
  return Math.round((weeklyWorkHours + weeklyHolidayHours) * (365 / 12 / 7) * 100) / 100;
}

export function calcAnnualLeavePay(input: AnnualLeavePayInput): AnnualLeavePayResult {
  const monthlyWorkHours = calcMonthlyWorkHours(input.weeklyWorkHours, input.dailyWorkHours);

  const monthlyBase = input.wageType === 'monthly'
    ? (input.monthlyWage ?? 0)
    : (input.hourlyWage ?? 0) * monthlyWorkHours;

  const monthlyBonusPortion = Math.round(input.annualBonus / 12);
  const monthlyOrdinaryWageTotal =
    monthlyBase + input.monthlyFixedAllowance + monthlyBonusPortion;

  const hourlyOrdinaryWage = monthlyWorkHours > 0
    ? Math.round(monthlyOrdinaryWageTotal / monthlyWorkHours)
    : 0;

  const dailyOrdinaryWage  = hourlyOrdinaryWage * input.dailyWorkHours;
  const totalPay           = dailyOrdinaryWage * input.unusedLeaveDays;

  return {
    monthlyWorkHours,
    hourlyOrdinaryWage,
    dailyOrdinaryWage,
    unusedLeaveDays: input.unusedLeaveDays,
    totalPay,
    monthlyOrdinaryWageTotal,
  };
}
