/**
 * 산재보험법 제57조 장해급여 등급별 보상일수 테이블
 *
 * type:
 *   'pension-only'  — 1~3급: 연금만 지급
 *   'choice'        — 4~7급: 연금 또는 일시금 선택 가능
 *   'lump-sum-only' — 8~14급: 일시금만 지급
 *
 * pensionDays:  연간 지급일수 (일시금 환산 시 × 1/365)
 * lumpSumDays: 일시금 지급일수
 * lossRate:    노동력 상실률(%) — 참고용
 */
export const DISABILITY_TABLE = [
  { grade: 1,  pensionDays: 329,  lumpSumDays: 1474, type: 'pension-only',  lossRate: 100 },
  { grade: 2,  pensionDays: 291,  lumpSumDays: 1309, type: 'pension-only',  lossRate: 100 },
  { grade: 3,  pensionDays: 257,  lumpSumDays: 1155, type: 'pension-only',  lossRate: 100 },
  { grade: 4,  pensionDays: 224,  lumpSumDays: 1012, type: 'choice',        lossRate: 90  },
  { grade: 5,  pensionDays: 193,  lumpSumDays: 869,  type: 'choice',        lossRate: 80  },
  { grade: 6,  pensionDays: 164,  lumpSumDays: 737,  type: 'choice',        lossRate: 70  },
  { grade: 7,  pensionDays: 138,  lumpSumDays: 616,  type: 'choice',        lossRate: 60  },
  { grade: 8,  pensionDays: null, lumpSumDays: 495,  type: 'lump-sum-only', lossRate: 45  },
  { grade: 9,  pensionDays: null, lumpSumDays: 385,  type: 'lump-sum-only', lossRate: 35  },
  { grade: 10, pensionDays: null, lumpSumDays: 297,  type: 'lump-sum-only', lossRate: 27  },
  { grade: 11, pensionDays: null, lumpSumDays: 220,  type: 'lump-sum-only', lossRate: 20  },
  { grade: 12, pensionDays: null, lumpSumDays: 154,  type: 'lump-sum-only', lossRate: 15  },
  { grade: 13, pensionDays: null, lumpSumDays: 99,   type: 'lump-sum-only', lossRate: 10  },
  { grade: 14, pensionDays: null, lumpSumDays: 55,   type: 'lump-sum-only', lossRate: 5   },
] as const;

export type DisabilityGrade = typeof DISABILITY_TABLE[number]['grade'];
export type DisabilityType  = typeof DISABILITY_TABLE[number]['type'];

export function getGradeInfo(grade: DisabilityGrade) {
  return DISABILITY_TABLE.find((r) => r.grade === grade)!;
}
