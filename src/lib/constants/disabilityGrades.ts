/**
 * 산재보험 장해등급별 보상일수
 * 산업재해보상보험법 시행령 별표 6 기준 (2025년)
 */

export interface DisabilityGrade {
  /** 장해등급 (1~14급) */
  grade: number;
  /** 등급 설명 */
  description: string;
  /** 장해보상연금 지급일수 (일/년) */
  pensionDays: number | null;
  /** 장해보상일시금 지급일수 (일) */
  lumpSumDays: number;
}

export const DISABILITY_GRADES: DisabilityGrade[] = [
  {
    grade: 1,
    description: '신체기능을 완전히 잃은 경우',
    pensionDays: 329,
    lumpSumDays: 1_474,
  },
  {
    grade: 2,
    description: '신체기능의 대부분을 잃은 경우',
    pensionDays: 291,
    lumpSumDays: 1_309,
  },
  {
    grade: 3,
    description: '신체기능이 매우 현저하게 상실된 경우',
    pensionDays: 257,
    lumpSumDays: 1_155,
  },
  {
    grade: 4,
    description: '신체기능이 현저하게 상실된 경우',
    pensionDays: 224,
    lumpSumDays: 1_012,
  },
  {
    grade: 5,
    description: '신체기능이 상당히 상실된 경우',
    pensionDays: 193,
    lumpSumDays: 869,
  },
  {
    grade: 6,
    description: '신체기능이 많이 상실된 경우',
    pensionDays: 164,
    lumpSumDays: 737,
  },
  {
    grade: 7,
    description: '신체기능이 어느 정도 상실된 경우',
    pensionDays: 138,
    lumpSumDays: 616,
  },
  {
    grade: 8,
    description: '신체기능이 일부 상실된 경우',
    pensionDays: null,
    lumpSumDays: 495,
  },
  {
    grade: 9,
    description: '신체기능이 다소 상실된 경우',
    pensionDays: null,
    lumpSumDays: 385,
  },
  {
    grade: 10,
    description: '신체기능이 약간 상실된 경우',
    pensionDays: null,
    lumpSumDays: 297,
  },
  {
    grade: 11,
    description: '신체기능이 다소 장해를 남긴 경우',
    pensionDays: null,
    lumpSumDays: 220,
  },
  {
    grade: 12,
    description: '신체기능에 장해를 남긴 경우',
    pensionDays: null,
    lumpSumDays: 154,
  },
  {
    grade: 13,
    description: '신체기능에 약간의 장해를 남긴 경우',
    pensionDays: null,
    lumpSumDays: 99,
  },
  {
    grade: 14,
    description: '신체기능에 경미한 장해를 남긴 경우',
    pensionDays: null,
    lumpSumDays: 55,
  },
];

/** 등급 번호로 장해등급 정보 조회 */
export function getDisabilityGrade(grade: number): DisabilityGrade | undefined {
  return DISABILITY_GRADES.find((g) => g.grade === grade);
}

/** 연금 수급 가능 등급 (1~7급) */
export const PENSION_ELIGIBLE_GRADES = DISABILITY_GRADES.filter((g) => g.pensionDays !== null);
