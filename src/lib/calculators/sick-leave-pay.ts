/**
 * 산재 휴업급여 계산기 (산재보험법 제52조, 2025년 기준)
 *
 * calculationType 5단계:
 *   maxCap        : 평균임금×70% > 최고보상기준금액×70%
 *   standard      : 평균임금×70% > 최저보상기준금액×80%
 *   lowIncomeMin80: 저소득 — 평균임금×90% > 최저보상기준금액×80% → 하한 지급
 *   lowIncome90   : 저소득 — 평균임금×90% ≤ 최저보상기준금액×80%, 최저임금 ≥ 90%
 *   minimumWage   : 평균임금×90%가 최저임금 미달 → 최저임금 지급
 *
 * 고령자 유예:
 *   만 61세 이상 + isCurrentlyEmployed61Plus = true → 재해일로부터 2년 유예
 *   만 61세 이상 + isCurrentlyEmployed61Plus = false → 즉시 감액
 */

import { SICK_LEAVE_PAY_CONSTANTS } from '@/lib/constants/sick-leave-pay-data';

const C = SICK_LEAVE_PAY_CONSTANTS;

// ── 입력 ──────────────────────────────────────────────────────
export interface SickLeavePayInput {
  averageWageMethod: 'direct' | 'calculate';
  dailyAverageWage?: number;
  totalWage3Months?: number;
  totalDays3Months?: number;           // 기본 90일
  sickLeaveDays: number;
  birthYear: number;
  isCurrentlyEmployed61Plus: boolean;
  injuryDate: string;                  // YYYY-MM-DD
}

// ── 출력 ──────────────────────────────────────────────────────
export type CalculationType =
  | 'standard'
  | 'lowIncome90'
  | 'lowIncomeMin80'
  | 'minimumWage'
  | 'maxCap';

export interface SickLeavePayResult {
  // 기본 정보
  dailyAverageWage: number;

  // 산정 방식
  calculationType: CalculationType;
  calculationTypeLabel: string;
  calculationDetail: string;

  // 금액
  dailySickLeavePay: number;              // 고령자 감액 전
  dailySickLeavePayAfterElderly: number;  // 고령자 감액 후

  // 고령자 감액
  isElderlyReduction: boolean;
  isElderlyGracePeriod: boolean;
  elderlyAge: number;                     // 재해일 기준 만 나이
  elderlyReductionRate?: string;          // 예: "66/70"

  // 총액
  totalSickLeavePay: number;
  sickLeaveDays: number;

  // 월 환산
  monthlyEstimate: number;               // 1일 × 30
}

// ── 보조 ──────────────────────────────────────────────────────

function calculateAge(birthYear: number, referenceDate: string): number {
  return new Date(referenceDate).getFullYear() - birthYear;
}

function getCalcTypeLabel(type: CalculationType): string {
  const labels: Record<CalculationType, string> = {
    standard: '일반 기준 (평균임금의 70%)',
    lowIncome90: '저소득 근로자 기준 (평균임금의 90%)',
    lowIncomeMin80: '저소득 근로자 기준 (최저보상기준금액의 80%)',
    minimumWage: '최저임금 기준',
    maxCap: '최고보상기준금액 적용',
  };
  return labels[type];
}

// ── 핵심 계산 ─────────────────────────────────────────────────

export function calculateSickLeavePay(input: SickLeavePayInput): SickLeavePayResult {
  // Step 1: 평균임금 산정
  let dailyAvgWage: number;
  if (input.averageWageMethod === 'direct') {
    dailyAvgWage = input.dailyAverageWage!;
  } else {
    dailyAvgWage = Math.round(
      input.totalWage3Months! / (input.totalDays3Months ?? 90)
    );
  }

  // Step 2: 기준 금액
  const standard70 = Math.round(dailyAvgWage * C.standardRate);
  const percent90 = Math.round(dailyAvgWage * C.lowIncomeRate);
  const minComp80 = Math.round(C.minCompensationDaily * C.minCompensationRate);
  const minimumWageDaily = C.minimumWageDaily;
  const maxCompDaily70 = Math.round(C.maxCompensationDaily * C.standardRate);

  // Step 2-1 ~ 2-3: 지급 방식 결정
  let dailyPay: number;
  let calculationType: CalculationType;
  let calculationDetail: string;

  if (standard70 > maxCompDaily70) {
    // 최고 보상기준금액 × 70% 초과
    dailyPay = maxCompDaily70;
    calculationType = 'maxCap';
    calculationDetail =
      `평균임금의 70%(${standard70.toLocaleString()}원)이 최고 보상기준금액의 70%(${maxCompDaily70.toLocaleString()}원)를 초과하여, 최고 보상기준금액이 적용됩니다.`;

  } else if (standard70 > minComp80) {
    // 일반 기준
    dailyPay = standard70;
    calculationType = 'standard';
    calculationDetail =
      `평균임금의 70%(${standard70.toLocaleString()}원)이 최저 보상기준금액의 80%(${minComp80.toLocaleString()}원)보다 높아, 일반 기준이 적용됩니다.`;

  } else if (percent90 <= minComp80) {
    // 저소득 — 90%도 하한 미달
    if (percent90 < minimumWageDaily) {
      // 최저임금 적용
      dailyPay = minimumWageDaily;
      calculationType = 'minimumWage';
      calculationDetail =
        `평균임금의 90%(${percent90.toLocaleString()}원)이 최저임금 일액(${minimumWageDaily.toLocaleString()}원)보다 적어, 최저임금이 적용됩니다.`;
    } else {
      // 평균임금 90% 적용
      dailyPay = percent90;
      calculationType = 'lowIncome90';
      calculationDetail =
        `저소득 근로자 기준: 평균임금의 90%(${percent90.toLocaleString()}원)이 적용됩니다. (평균임금의 70%가 최저 보상기준의 80% 이하)`;
    }

  } else {
    // 저소득 — 90%가 하한 초과 → 하한 지급
    dailyPay = minComp80;
    calculationType = 'lowIncomeMin80';
    calculationDetail =
      `저소득 근로자 기준: 평균임금의 90%(${percent90.toLocaleString()}원)이 최저 보상기준의 80%(${minComp80.toLocaleString()}원)를 초과하여, 최저 보상기준의 80%가 적용됩니다.`;
  }

  // Step 3: 고령자 감액
  const elderlyAge = calculateAge(input.birthYear, input.injuryDate);
  let isElderlyReduction = false;
  let isElderlyGracePeriod = false;
  let dailySickLeavePayAfterElderly = dailyPay;
  let elderlyReductionRate: string | undefined;

  if (elderlyAge >= 61) {
    // 유예 판단: 61세 이후 재직 중 재해 → 재해일로부터 2년 유예
    if (input.isCurrentlyEmployed61Plus) {
      const injDate = new Date(input.injuryDate);
      const graceEnd = new Date(injDate);
      graceEnd.setFullYear(graceEnd.getFullYear() + C.elderlyGracePeriodYears);
      if (new Date() <= graceEnd) {
        isElderlyGracePeriod = true;
      }
    }

    if (!isElderlyGracePeriod) {
      isElderlyReduction = true;
      const ageKey = Math.min(elderlyAge, 65);

      if (calculationType === 'standard' || calculationType === 'maxCap') {
        const rate = C.elderlyReduction70[ageKey];
        dailySickLeavePayAfterElderly = Math.round(dailyPay * rate.numerator / rate.denominator);
        elderlyReductionRate = `${rate.numerator}/${rate.denominator}`;
      } else if (calculationType === 'lowIncomeMin80') {
        const rate = C.elderlyReductionMin80[ageKey];
        dailySickLeavePayAfterElderly = Math.round(
          C.minCompensationDaily * C.minCompensationRate * rate.numerator / rate.denominator
        );
        elderlyReductionRate = `${rate.numerator}/${rate.denominator}`;
      } else {
        // lowIncome90 or minimumWage
        const rate = C.elderlyReduction90[ageKey];
        dailySickLeavePayAfterElderly = Math.round(dailyPay * rate.numerator / rate.denominator);
        elderlyReductionRate = `${rate.numerator}/${rate.denominator}`;
      }
    }
  }

  // Step 4: 총액 산정
  const finalDailyPay = isElderlyReduction ? dailySickLeavePayAfterElderly : dailyPay;
  const totalSickLeavePay = finalDailyPay * input.sickLeaveDays;
  const monthlyEstimate = finalDailyPay * 30;

  return {
    dailyAverageWage: dailyAvgWage,
    calculationType,
    calculationTypeLabel: getCalcTypeLabel(calculationType),
    calculationDetail,
    dailySickLeavePay: dailyPay,
    dailySickLeavePayAfterElderly,
    isElderlyReduction,
    isElderlyGracePeriod,
    elderlyAge,
    elderlyReductionRate,
    totalSickLeavePay,
    sickLeaveDays: input.sickLeaveDays,
    monthlyEstimate,
  };
}
