// ─────────────────────────────────────────────
// 종합 리포트 계산 로직 · 독립 내장 · 2025~2026 기준
// ─────────────────────────────────────────────

/* ── 상수 ─────────────────────────────────── */

export const MIN_DAILY_COMP = 80_240;
export const MIN_SICK_LEAVE = 64_192;
export const MAX_SICK_LEAVE = 258_132;

export const DISABILITY_PENSION_DAYS: Record<number, number> = {
  1: 329, 2: 291, 3: 257, 4: 224, 5: 193, 6: 164, 7: 138,
};
export const DISABILITY_LUMP_DAYS: Record<number, number> = {
  1: 1474, 2: 1309, 3: 1155, 4: 1012, 5:  869, 6:  737, 7: 616,
  8:  495, 9:  385, 10:  297, 11:  220, 12: 154, 13:  99, 14:  55,
};

export const SURVIVOR_BASE_RATE  = 0.47;
export const SURVIVOR_ADD_RATES  = [0, 0.05, 0.10, 0.15, 0.20];
export const SURVIVOR_LUMP_DAYS  = 1300;
export const FUNERAL_DAYS        = 120;
export const FUNERAL_MIN         = 13_943_000;
export const FUNERAL_MAX         = 19_279_760;

export const ELDERLY_REDUCTION: Record<number, number> = {
  61: 66, 62: 62, 63: 58, 64: 54, 65: 50,
};

/* ── 타입 ─────────────────────────────────── */

export interface InjuryInput {
  monthlyWage1:    number;
  monthlyWage2:    number;
  monthlyWage3:    number;
  annualBonus:     number;
  birthDate:       string;  // YYYY-MM-DD
  injuryDate:      string;
  healStartDate:   string;
  healEndDate:     string;
  disabilityGrade: number | null;
  disabilityType:  'pension' | 'lump' | null;
  isDead:          boolean;
  survivorCount:   number;
}

export interface RetireInput {
  hireDate:              string;
  quitDate:              string;
  monthlyWage1:          number;
  monthlyWage2:          number;
  monthlyWage3:          number;
  annualBonus:           number;
  annualLeaveAllowance:  number;
  dailyOrdinaryWage:     number;
  unusedLeaveDays:       number;
  wasFiredWithoutNotice: boolean;
}

export interface ReportLine {
  label:  string;
  amount: number;
  note:   string;
}

export interface InjuryResult {
  dailyAvgWage:  number;
  totalHealDays: number;
  lines:         ReportLine[];
  grandTotal:    number;
}

export interface RetireResult {
  dailyAvgWage:     number;
  totalServiceDays: number;
  lines:            ReportLine[];
  grandTotal:       number;
}

/* ── 유틸 ─────────────────────────────────── */

function diffDays(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

function daysInThreeMonths(endDate: string): number {
  const d  = new Date(endDate);
  const m3 = new Date(d.getFullYear(), d.getMonth() - 3, d.getDate());
  return Math.round((d.getTime() - m3.getTime()) / 86_400_000);
}

function getAge(birth: string, base: string): number {
  const b = new Date(birth);
  const d = new Date(base);
  let age = d.getFullYear() - b.getFullYear();
  const mDiff = d.getMonth() - b.getMonth();
  if (mDiff < 0 || (mDiff === 0 && d.getDate() < b.getDate())) age--;
  return age;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function floor1(n: number) { return Math.floor(n); }

/* ── 산재 보상 종합 ───────────────────────── */

export function calcInjuryReport(input: InjuryInput): InjuryResult {
  const days3m    = daysInThreeMonths(input.injuryDate);
  const wageSum   = input.monthlyWage1 + input.monthlyWage2 + input.monthlyWage3;
  const bonusAdd  = input.annualBonus * 3 / 12;
  const rawAvg    = (wageSum + bonusAdd) / days3m;
  const dailyAvgWage = Math.max(rawAvg, MIN_DAILY_COMP);

  const totalHealDays = Math.max(0, diffDays(input.healStartDate, input.healEndDate));
  const paidHealDays  = Math.max(0, totalHealDays - 3);

  const lines: ReportLine[] = [];

  // 휴업급여
  const age = getAge(input.birthDate, input.healEndDate);
  let dailySick = floor1(dailyAvgWage * 0.7);

  const yearsFromInjury = diffDays(input.injuryDate, input.healEndDate) / 365;
  if (age >= 61 && yearsFromInjury > 2) {
    const ageKey = Math.min(age, 65);
    const ratio  = (ELDERLY_REDUCTION[ageKey] ?? 50) / 70;
    dailySick    = floor1(dailySick * ratio);
  }
  dailySick = clamp(dailySick, MIN_SICK_LEAVE, MAX_SICK_LEAVE);

  lines.push({
    label:  '휴업급여',
    amount: dailySick * paidHealDays,
    note:   `1일 ${dailySick.toLocaleString()}원 × ${paidHealDays}일 (요양 ${totalHealDays}일 중 4일째부터)`,
  });

  // 장해급여
  if (input.disabilityGrade !== null && input.disabilityGrade >= 1 && input.disabilityGrade <= 14) {
    const g = input.disabilityGrade;
    if (input.disabilityType === 'pension' && g <= 7) {
      const days  = DISABILITY_PENSION_DAYS[g]!;
      const amt   = floor1(dailyAvgWage * days);
      lines.push({ label: `장해급여 (연금 ${g}급)`, amount: amt, note: `평균임금 × ${days}일 = 연 ${amt.toLocaleString()}원` });
    } else {
      const days = DISABILITY_LUMP_DAYS[g]!;
      const amt  = floor1(dailyAvgWage * days);
      lines.push({ label: `장해급여 (일시금 ${g}급)`, amount: amt, note: `평균임금 × ${days}일` });
    }
  } else if (input.disabilityGrade === null) {
    lines.push({ label: '장해급여', amount: 0, note: '장해등급 미정 — 요양 종결 후 등급 확정 시 산정' });
  }

  // 유족급여·장의비
  if (input.isDead) {
    const idx  = Math.min(input.survivorCount, 4);
    const rate = SURVIVOR_BASE_RATE + (SURVIVOR_ADD_RATES[idx] ?? 0.20);
    const annualBase = dailyAvgWage * 365;
    lines.push({
      label:  '유족보상연금 (연간)',
      amount: floor1(annualBase * rate),
      note:   `급여기초연액 × ${(rate * 100).toFixed(0)}% (기본 47% + 가산 ${((SURVIVOR_ADD_RATES[idx] ?? 0.20) * 100).toFixed(0)}%)`,
    });
    lines.push({
      label:  '유족보상일시금 (연금 대신 선택 시)',
      amount: floor1(dailyAvgWage * SURVIVOR_LUMP_DAYS),
      note:   `평균임금 × ${SURVIVOR_LUMP_DAYS}일`,
    });
    const funeralRaw = floor1(dailyAvgWage * FUNERAL_DAYS);
    lines.push({
      label:  '장의비',
      amount: clamp(funeralRaw, FUNERAL_MIN, FUNERAL_MAX),
      note:   `평균임금 × ${FUNERAL_DAYS}일 (최저 ${FUNERAL_MIN.toLocaleString()} / 최고 ${FUNERAL_MAX.toLocaleString()})`,
    });
  }

  return {
    dailyAvgWage:  floor1(dailyAvgWage),
    totalHealDays,
    lines,
    grandTotal: lines.reduce((s, l) => s + l.amount, 0),
  };
}

/* ── 퇴직 정산 종합 ───────────────────────── */

export function calcRetireReport(input: RetireInput): RetireResult {
  const days3m   = daysInThreeMonths(input.quitDate);
  const wageSum  = input.monthlyWage1 + input.monthlyWage2 + input.monthlyWage3;
  const bonusAdd = input.annualBonus * 3 / 12;
  const leaveAdd = input.annualLeaveAllowance * 3 / 12;
  const rawAvg   = (wageSum + bonusAdd + leaveAdd) / days3m;
  const dailyAvgWage = Math.max(rawAvg, input.dailyOrdinaryWage);

  const totalServiceDays = diffDays(input.hireDate, input.quitDate);
  const lines: ReportLine[] = [];

  // 퇴직금
  lines.push({
    label:  '퇴직금',
    amount: floor1(dailyAvgWage * 30 * (totalServiceDays / 365)),
    note:   `${floor1(dailyAvgWage).toLocaleString()}원 × 30일 × (${totalServiceDays}일 ÷ 365)`,
  });

  // 연차수당
  if (input.unusedLeaveDays > 0) {
    lines.push({
      label:  '미사용 연차수당',
      amount: floor1(input.dailyOrdinaryWage * input.unusedLeaveDays),
      note:   `통상임금 ${input.dailyOrdinaryWage.toLocaleString()}원 × ${input.unusedLeaveDays}일`,
    });
  }

  // 해고예고수당
  if (input.wasFiredWithoutNotice) {
    lines.push({
      label:  '해고예고수당',
      amount: floor1(input.dailyOrdinaryWage * 30),
      note:   `통상임금 ${input.dailyOrdinaryWage.toLocaleString()}원 × 30일`,
    });
  }

  return {
    dailyAvgWage:     floor1(dailyAvgWage),
    totalServiceDays,
    lines,
    grandTotal: lines.reduce((s, l) => s + l.amount, 0),
  };
}
