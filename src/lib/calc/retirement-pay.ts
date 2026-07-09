// ──────────────────────────────────────────────
// 퇴직금 계산 로직
// 근거: 근로자퇴직급여 보장법 제8조, 근로기준법 제2조
// ──────────────────────────────────────────────

export interface MonthlyWage {
  days:      number;  // 해당 구간 일수
  basePay:   number;  // 기본급 (원)
  allowance: number;  // 기타수당 (원)
}

export interface RetirementInput {
  startDate:          string;          // 입사일 (YYYY-MM-DD)
  endDate:            string;          // 퇴직일 = 마지막 근무일 다음 날
  monthlyWages:       MonthlyWage[];   // 퇴직 전 3개월 임금
  annualBonus:        number;          // 연간 상여금 총액
  annualLeavePay:     number;          // 연차수당
  dailyOrdinaryWage?: number;          // 1일 통상임금 (선택)
}

export interface RetirementResult {
  totalDays:            number;
  threeMonthDays:       number;
  threeMonthWageTotal:  number;
  bonusAddition:        number;
  leavePayAddition:     number;
  avgWageBase:          number;
  dailyAvgWage:         number;
  dailyOrdinaryWage?:   number;
  appliedDailyWage:     number;
  appliedBasis:         '평균임금' | '통상임금';
  retirementPay:        number;
  yearsOfService:       number;
  isEligible:           boolean;
  ineligibleReason?:    string;
}

// ── 유틸 ──────────────────────────────────────────────────────

function daysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

// ── 3개월 구간 자동 생성 ───────────────────────────────────────

export function getThreeMonthPeriods(endDate: string): {
  periods: { start: string; end: string; days: number; label: string }[];
  totalDays: number;
} {
  const ed = new Date(endDate);

  // 마지막 근무일 = 퇴직일 - 1일
  const lastWorkDay = new Date(ed);
  lastWorkDay.setDate(lastWorkDay.getDate() - 1);

  // 3개월 전 같은 날 (역산 기준)
  const threeMonthsAgo = new Date(lastWorkDay);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  // 구간 시작: 3개월 전 날의 다음 날
  const periodStart0 = new Date(threeMonthsAgo);
  periodStart0.setDate(periodStart0.getDate() + 1);

  const periods: { start: string; end: string; days: number; label: string }[] = [];
  let cursor = new Date(periodStart0);

  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  const iso = (d: Date) => d.toISOString().split('T')[0];

  for (let i = 0; i < 3; i++) {
    const pStart = new Date(cursor);
    let pEnd: Date;

    if (i < 2) {
      const nextMonth = new Date(cursor);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      pEnd = new Date(nextMonth);
      pEnd.setDate(pEnd.getDate() - 1);
      cursor = new Date(nextMonth);
    } else {
      pEnd = new Date(lastWorkDay);
    }

    const days = daysBetween(iso(pStart), iso(pEnd)) + 1; // 양 끝 포함

    periods.push({
      start: iso(pStart),
      end:   iso(pEnd),
      days,
      label: `${fmt(pStart)} ~ ${fmt(pEnd)}`,
    });
  }

  return { periods, totalDays: periods.reduce((s, p) => s + p.days, 0) };
}

// ── 메인 계산 함수 ─────────────────────────────────────────────

export function calcRetirementPay(input: RetirementInput): RetirementResult {
  // 1. 재직일수
  const totalDays = daysBetween(input.startDate, input.endDate);
  const isEligible = totalDays >= 365;

  // 2. 3개월 임금총액 (A)
  const threeMonthDays       = input.monthlyWages.reduce((s, m) => s + m.days, 0);
  const threeMonthWageTotal  = input.monthlyWages.reduce((s, m) => s + m.basePay + m.allowance, 0);

  // 3. 상여금 가산액 (B)
  const bonusAddition    = Math.round(input.annualBonus * 3 / 12);

  // 4. 연차수당 가산액 (C)
  const leavePayAddition = Math.round(input.annualLeavePay * 3 / 12);

  // 5. 평균임금 산정 기초 (A+B+C)
  const avgWageBase  = threeMonthWageTotal + bonusAddition + leavePayAddition;

  // 6. 1일 평균임금 (소수점 2자리까지)
  const dailyAvgWage = threeMonthDays > 0
    ? Math.round((avgWageBase / threeMonthDays) * 100) / 100
    : 0;

  // 7. 통상임금 비교
  const dailyOrdinaryWage = input.dailyOrdinaryWage ?? 0;
  let appliedDailyWage: number;
  let appliedBasis: '평균임금' | '통상임금';

  if (dailyOrdinaryWage > 0 && dailyOrdinaryWage > dailyAvgWage) {
    appliedDailyWage = dailyOrdinaryWage;
    appliedBasis     = '통상임금';
  } else {
    appliedDailyWage = dailyAvgWage;
    appliedBasis     = '평균임금';
  }

  // 8. 퇴직금
  const retirementPay = isEligible
    ? Math.round(appliedDailyWage * 30 * (totalDays / 365))
    : 0;

  const yearsOfService = Math.round((totalDays / 365) * 10) / 10;

  return {
    totalDays,
    threeMonthDays,
    threeMonthWageTotal,
    bonusAddition,
    leavePayAddition,
    avgWageBase,
    dailyAvgWage,
    dailyOrdinaryWage: dailyOrdinaryWage > 0 ? dailyOrdinaryWage : undefined,
    appliedDailyWage,
    appliedBasis,
    retirementPay,
    yearsOfService,
    isEligible,
    ineligibleReason: !isEligible ? '계속근로기간이 1년 미만입니다.' : undefined,
  };
}
