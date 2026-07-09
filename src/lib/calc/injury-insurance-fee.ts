// ──────────────────────────────────────────────
// 2026년 산재보험료 상수 (고용노동부고시 제2025-91호)
// ──────────────────────────────────────────────

/** 출퇴근재해 요율 (‰) — 전 업종 동일 */
export const COMMUTE_RATE = 0.6;

/** 임금채권부담금 비율 (‰) — 전 업종 동일 (국가·지자체 사업 제외) */
export const WAGE_CLAIM_RATE = 0.9;

/** 석면피해구제분담금 비율 (‰) — 상시 20인 이상 (20인 미만 및 일부 건설공사 제외) */
export const ASBESTOS_RATE = 0.06;

/** 해외파견자 요율 (‰) */
export const OVERSEAS_RATE = 14;

/** 건설업 노무비율 */
export const CONSTRUCTION_LABOR_RATIO = {
  general:     0.27,  // 일반 건설공사: 총공사금액의 27%
  subcontract: 0.29,  // 하도급 공사: 하도급금액의 29%
} as const;

/** 업종 분류 및 요율 (‰) */
export interface IndustryItem {
  code: string;
  category: string;
  name: string;
  rate: number;
}

export const INDUSTRY_TABLE: IndustryItem[] = [
  // 1. 광업
  { code: "mining-coal",          category: "광업",               name: "석탄광업 및 채석업",                       rate: 185 },
  { code: "mining-other",         category: "광업",               name: "석회석·금속·비금속·기타광업",               rate: 57  },

  // 2. 제조업
  { code: "mfg-food",             category: "제조업",             name: "식료품 제조업",                            rate: 16  },
  { code: "mfg-textile",          category: "제조업",             name: "섬유 및 섬유제품 제조업",                   rate: 11  },
  { code: "mfg-wood-paper",       category: "제조업",             name: "목재 및 종이제품 제조업",                   rate: 20  },
  { code: "mfg-publish",          category: "제조업",             name: "출판·인쇄·제본업",                         rate: 9   },
  { code: "mfg-chemical",         category: "제조업",             name: "화학 및 고무제품 제조업",                   rate: 13  },
  { code: "mfg-pharma",           category: "제조업",             name: "의약품·화장품·연탄·석유제품 제조업",        rate: 7   },
  { code: "mfg-machine-metal",    category: "제조업",             name: "기계기구·금속·비금속광물제품 제조업",       rate: 13  },
  { code: "mfg-smelting",         category: "제조업",             name: "금속제련업",                               rate: 10  },
  { code: "mfg-electronics",      category: "제조업",             name: "전기기계기구·정밀기구·전자제품 제조업",     rate: 6   },
  { code: "mfg-shipbuilding",     category: "제조업",             name: "선박건조 및 수리업",                        rate: 24  },
  { code: "mfg-handicraft",       category: "제조업",             name: "수제품 및 기타제품 제조업",                  rate: 12  },

  // 3. 전기·가스·증기·수도사업
  { code: "utility",              category: "전기·가스·증기·수도사업", name: "전기·가스·증기·수도사업",             rate: 7   },

  // 4. 건설업
  { code: "construction",         category: "건설업",             name: "건설업",                                   rate: 35  },

  // 5. 운수·창고·통신업
  { code: "transport-rail",       category: "운수·창고·통신업",   name: "철도·항공·창고·운수관련서비스업",           rate: 8   },
  { code: "transport-land",       category: "운수·창고·통신업",   name: "육상 및 수상운수업",                        rate: 18  },
  { code: "telecom",              category: "운수·창고·통신업",   name: "통신업",                                   rate: 9   },

  // 6. 임업
  { code: "forestry",             category: "임업",               name: "임업",                                     rate: 58  },

  // 7. 어업
  { code: "fishing",              category: "어업",               name: "어업",                                     rate: 27  },

  // 8. 농업
  { code: "agriculture",          category: "농업",               name: "농업",                                     rate: 20  },

  // 9. 기타의 사업
  { code: "service-facility",     category: "기타의 사업",        name: "시설관리 및 사업지원 서비스업",             rate: 8   },
  { code: "service-other",        category: "기타의 사업",        name: "기타의 각종사업",                           rate: 8   },
  { code: "service-pro",          category: "기타의 사업",        name: "전문·보건·교육·여가관련 서비스업",          rate: 6   },
  { code: "service-retail",       category: "기타의 사업",        name: "도소매·음식·숙박업",                        rate: 8   },
  { code: "service-realestate",   category: "기타의 사업",        name: "부동산 및 임대업",                          rate: 7   },
  { code: "service-gov",          category: "기타의 사업",        name: "국가 및 지방자치단체의 사업",               rate: 9   },

  // 10. 금융 및 보험업
  { code: "finance",              category: "금융 및 보험업",     name: "금융 및 보험업",                            rate: 5   },

  // 해외파견
  { code: "overseas",             category: "해외파견",           name: "해외파견자",                               rate: 14  },
];

// ──────────────────────────────────────────────
// 계산 옵션 타입
// ──────────────────────────────────────────────

export type CalcMode = "payroll" | "construction";

export interface PayrollInput {
  mode: "payroll";
  monthlyWage: number;
  industryCode: string;
  isGovProject: boolean;
  employees20Plus: boolean;
  hasRetirementPension: boolean;
}

export interface ConstructionInput {
  mode: "construction";
  totalAmount: number;
  isSubcontract: boolean;
  employees20Plus: boolean;
}

// ──────────────────────────────────────────────
// 계산 결과 타입
// ──────────────────────────────────────────────

export interface FeeResult {
  payrollBase: number;
  industryRate: number;
  commuteRate: number;
  wageClaimRate: number;
  asbestosRate: number;
  totalRate: number;
  monthlyFee: number;
  annualFee: number;
  constructionFee?: number;
  laborRatio?: number;
}

// ──────────────────────────────────────────────
// 계산 함수
// ──────────────────────────────────────────────

export function calcPayroll(input: PayrollInput): FeeResult {
  const industry = INDUSTRY_TABLE.find(i => i.code === input.industryCode);
  if (!industry) throw new Error("업종을 선택해 주세요.");

  const industryRate  = industry.rate;
  const commuteRate   = COMMUTE_RATE;
  const wageClaimRate = input.isGovProject ? 0 : WAGE_CLAIM_RATE;
  const asbestosRate  = input.employees20Plus ? ASBESTOS_RATE : 0;
  const totalRate     = industryRate + commuteRate + wageClaimRate + asbestosRate;

  const monthlyFee = Math.round(input.monthlyWage * totalRate / 1000);
  const annualFee  = monthlyFee * 12;

  return { payrollBase: input.monthlyWage, industryRate, commuteRate, wageClaimRate, asbestosRate, totalRate, monthlyFee, annualFee };
}

export function calcConstruction(input: ConstructionInput): FeeResult {
  const industryRate  = 35;
  const commuteRate   = COMMUTE_RATE;
  const wageClaimRate = WAGE_CLAIM_RATE;
  const asbestosRate  = input.employees20Plus ? ASBESTOS_RATE : 0;
  const totalRate     = industryRate + commuteRate + wageClaimRate + asbestosRate;

  const laborRatio    = input.isSubcontract
    ? CONSTRUCTION_LABOR_RATIO.subcontract
    : CONSTRUCTION_LABOR_RATIO.general;

  const payrollBase      = Math.round(input.totalAmount * laborRatio);
  const constructionFee  = Math.round(payrollBase * totalRate / 1000);

  return { payrollBase, industryRate, commuteRate, wageClaimRate, asbestosRate, totalRate, monthlyFee: 0, annualFee: constructionFee, constructionFee, laborRatio };
}
