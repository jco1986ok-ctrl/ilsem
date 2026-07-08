/** 계산기 입력 공통 기반 타입 */
export interface BaseCalcInput {
  /** 계산 기준일 */
  baseDate?: string;
}

/** 계산기 결과 공통 기반 타입 */
export interface BaseCalcResult {
  /** 계산 성공 여부 */
  success: boolean;
  /** 오류 메시지 */
  errorMessage?: string;
  /** 계산 수행 일시 */
  calculatedAt: string;
}

/** 평균임금 계산 입력 */
export interface AverageWageInput extends BaseCalcInput {
  /** 산정 사유 발생일 */
  eventDate: string;
  /** 직전 3개월 임금 총액 (원) */
  totalWage3Months: number;
  /** 직전 3개월 일수 */
  totalDays3Months: number;
}

/** 평균임금 계산 결과 */
export interface AverageWageResult extends BaseCalcResult {
  /** 평균임금 (원/일) */
  averageWage: number;
  /** 통상임금 (원/일) */
  normalWage?: number;
  /** 적용 평균임금 (원/일) - 최저임금 기준 미달 시 보정 */
  appliedAverageWage: number;
}

/** 퇴직금 계산 입력 */
export interface RetirementPayInput extends BaseCalcInput {
  /** 입사일 */
  hireDate: string;
  /** 퇴사일 */
  retireDate: string;
  /** 평균임금 (원/일) */
  averageWage: number;
}

/** 퇴직금 계산 결과 */
export interface RetirementPayResult extends BaseCalcResult {
  /** 총 근무일수 */
  totalWorkDays: number;
  /** 총 근무년수 (소수점) */
  totalWorkYears: number;
  /** 퇴직금 (원) */
  retirementPay: number;
}

/** 연차수당 계산 입력 */
export interface AnnualLeavePayInput extends BaseCalcInput {
  /** 입사일 */
  hireDate: string;
  /** 계산 기준일 */
  calcDate: string;
  /** 1일 통상임금 (원) */
  dailyWage: number;
  /** 사용한 연차일수 */
  usedLeaveDays: number;
}

/** 연차수당 계산 결과 */
export interface AnnualLeavePayResult extends BaseCalcResult {
  /** 발생 연차일수 */
  earnedDays: number;
  /** 미사용 연차일수 */
  unusedDays: number;
  /** 연차수당 (원) */
  annualLeavePay: number;
}

/** 4대보험 계산 입력 */
export interface FourInsuranceInput extends BaseCalcInput {
  /** 월 급여 (원) */
  monthlySalary: number;
  /** 사업장 규모 */
  businessSize: '150under' | '150to1000' | 'over1000' | 'priority';
}

/** 4대보험 계산 결과 */
export interface FourInsuranceResult extends BaseCalcResult {
  /** 국민연금 - 근로자 (원) */
  pensionEmployee: number;
  /** 국민연금 - 사업주 (원) */
  pensionEmployer: number;
  /** 건강보험 - 근로자 (원) */
  healthEmployee: number;
  /** 건강보험 - 사업주 (원) */
  healthEmployer: number;
  /** 장기요양 - 근로자 (원) */
  ltcEmployee: number;
  /** 장기요양 - 사업주 (원) */
  ltcEmployer: number;
  /** 고용보험 - 근로자 (원) */
  employmentEmployee: number;
  /** 고용보험 - 사업주 (원) */
  employmentEmployer: number;
  /** 근로자 합계 (원) */
  totalEmployee: number;
  /** 사업주 합계 (원) */
  totalEmployer: number;
}

/** 산재 휴업급여 계산 입력 */
export interface InjuryLeavePayInput extends BaseCalcInput {
  /** 평균임금 (원/일) */
  averageWage: number;
  /** 휴업 일수 */
  leaveDays: number;
}

/** 산재 휴업급여 계산 결과 */
export interface InjuryLeavePayResult extends BaseCalcResult {
  /** 휴업급여 총액 (원) */
  totalPay: number;
  /** 1일 휴업급여 (원) */
  dailyPay: number;
}

/** 계산기 종류 */
export type CalcType =
  | 'average-wage'
  | 'retirement-pay'
  | 'annual-leave-pay'
  | 'four-insurance'
  | 'injury-leave-pay'
  | 'disability-pay'
  | 'survivor-pay'
  | 'overwork-risk'
  | 'injury-insurance-fee'
  | 'self-diagnosis';
