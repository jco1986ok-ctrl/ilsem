// ─────────────────────────────────────────────
// 4대보험료 계산 로직 · 2026년 기준
// ─────────────────────────────────────────────

// ── 국민연금 ──
export const NPS_RATE          = 0.095;
export const NPS_EMPLOYEE_RATE = 0.0475;
export const NPS_EMPLOYER_RATE = 0.0475;
export const NPS_UPPER_BEFORE_JULY = 6_370_000;
export const NPS_LOWER_BEFORE_JULY =   400_000;
export const NPS_UPPER_FROM_JULY   = 6_590_000;
export const NPS_LOWER_FROM_JULY   =   410_000;

// ── 건강보험 ──
export const HI_RATE          = 0.0719;
export const HI_EMPLOYEE_RATE = 0.03595;
export const HI_EMPLOYER_RATE = 0.03595;
export const HI_PREMIUM_UPPER = 9_183_480;
export const HI_PREMIUM_LOWER =    20_160;

// ── 장기요양보험 ──
export const LTC_RATE          = 0.009448;
export const LTC_OVER_HI_RATE  = 0.1314;
export const LTC_EMPLOYEE_RATE = 0.004724;
export const LTC_EMPLOYER_RATE = 0.004724;

// ── 고용보험 (실업급여) ──
export const EI_UI_RATE          = 0.018;
export const EI_UI_EMPLOYEE_RATE = 0.009;
export const EI_UI_EMPLOYER_RATE = 0.009;

// ── 고용보험 (고용안정·직업능력개발) ──
export interface EIStabilityTier {
  label: string;
  value: string;
  rate:  number;
}
export const EI_STABILITY_TIERS: EIStabilityTier[] = [
  { label: '150인 미만',                        value: 'under150',        rate: 0.0025 },
  { label: '150인 이상 (우선지원대상기업)',       value: 'over150priority', rate: 0.0045 },
  { label: '150인 이상 ~ 1,000인 미만',          value: 'over150under1000',rate: 0.0065 },
  { label: '1,000인 이상 / 국가·지자체',         value: 'over1000',        rate: 0.0085 },
];

// ── 산재보험 업종별 요율 (‰) ──
export interface IndustryRate {
  label: string;
  value: string;
  rate:  number; // ‰
}
export const INDUSTRY_RATES: IndustryRate[] = [
  // 광업
  { label: '석탄광업 및 채석업',                        value: 'coal_mining',       rate: 185 },
  { label: '석회석·금속·비금속·기타광업',               value: 'other_mining',      rate:  57 },
  // 제조업
  { label: '식료품 제조업',                             value: 'food_mfg',          rate:  16 },
  { label: '섬유 및 섬유제품 제조업',                   value: 'textile_mfg',       rate:  11 },
  { label: '목재 및 종이제품 제조업',                   value: 'wood_paper_mfg',    rate:  20 },
  { label: '출판·인쇄·제본업',                          value: 'print_mfg',         rate:   9 },
  { label: '화학 및 고무제품 제조업',                   value: 'chem_rubber_mfg',   rate:  13 },
  { label: '의약품·화장품·연탄·석유제품 제조업',        value: 'pharma_petro_mfg',  rate:   7 },
  { label: '기계기구·금속·비금속광물제품 제조업',        value: 'metal_mfg',         rate:  13 },
  { label: '금속제련업',                                value: 'smelting',          rate:  10 },
  { label: '전기기계기구·정밀기구·전자제품 제조업',      value: 'electronics_mfg',   rate:   6 },
  { label: '선박건조 및 수리업',                        value: 'shipbuilding',      rate:  24 },
  { label: '수제품 및 기타제품 제조업',                 value: 'other_mfg',         rate:  12 },
  // 전기·가스·수도
  { label: '전기·가스·증기·수도사업',                   value: 'utility',           rate:   7 },
  // 건설업
  { label: '건설업',                                    value: 'construction',      rate:  35 },
  // 운수·창고·통신
  { label: '철도·항공·창고·운수관련서비스업',            value: 'rail_air_logis',    rate:   8 },
  { label: '육상 및 수상운수업',                        value: 'land_water_trans',  rate:  18 },
  { label: '통신업',                                    value: 'telecom',           rate:   9 },
  // 1차산업
  { label: '임업',                                      value: 'forestry',          rate:  58 },
  { label: '어업',                                      value: 'fishing',           rate:  27 },
  { label: '농업',                                      value: 'agriculture',       rate:  20 },
  // 기타
  { label: '시설관리 및 사업지원 서비스업',              value: 'facility_svc',      rate:   8 },
  { label: '기타의 각종사업',                           value: 'other_biz',         rate:   8 },
  { label: '전문·보건·교육·여가관련 서비스업',           value: 'prof_health_edu',   rate:   6 },
  { label: '도소매·음식·숙박업',                        value: 'retail_food_hotel', rate:   8 },
  { label: '부동산 및 임대업',                          value: 'real_estate',       rate:   7 },
  { label: '국가 및 지방자치단체의 사업',               value: 'gov_local',         rate:   9 },
  { label: '금융 및 보험업',                            value: 'finance',           rate:   5 },
];

// 산재보험 공통 부가요율 (‰)
export const WC_COMMUTE_RATE    = 0.6;    // 출퇴근재해
export const WC_WAGE_CLAIM_RATE = 0.9;    // 임금채권부담금
export const WC_ASBESTOS_RATE   = 0.06;   // 석면피해구제분담금

/* ─── 입력 ─────────────────────────────────── */
export interface FourInsuranceInput {
  monthlySalary: number;
  npsperiod:     'before_july' | 'from_july';
  eiTier:        string;
  industryType:  string;
  isGovBiz:      boolean;   // 국가·지자체 → 임금채권부담금 면제
  isUnder20:     boolean;   // 20인 미만 → 석면분담금 면제
}

/* ─── 출력 ─────────────────────────────────── */
export interface InsuranceDetail {
  label:    string;
  employee: number;
  employer: number;
  total:    number;
}

export interface FourInsuranceResult {
  monthlySalary:   number;
  npsBasis:        number;
  nps:             InsuranceDetail;
  hi:              InsuranceDetail;
  ltc:             InsuranceDetail;
  eiUI:            InsuranceDetail;
  eiStability:     InsuranceDetail;
  wc:              InsuranceDetail;
  totalEmployee:   number;
  totalEmployer:   number;
  totalAll:        number;
  annualEmployee:  number;
  annualEmployer:  number;
  annualAll:       number;
}

/* ─── 헬퍼: 10원 미만 절사 ─────────────────── */
function floor10(n: number): number {
  return Math.floor(n / 10) * 10;
}

/* ─── 메인 계산 ─────────────────────────────── */
export function calcFourInsurance(input: FourInsuranceInput): FourInsuranceResult {
  const salary = input.monthlySalary;

  // 1) 국민연금
  const npsUpper = input.npsperiod === 'from_july' ? NPS_UPPER_FROM_JULY : NPS_UPPER_BEFORE_JULY;
  const npsLower = input.npsperiod === 'from_july' ? NPS_LOWER_FROM_JULY : NPS_LOWER_BEFORE_JULY;
  const npsBasis = Math.min(Math.max(salary, npsLower), npsUpper);
  const npsTotal = floor10(npsBasis * NPS_RATE);
  const npsEe    = floor10(npsBasis * NPS_EMPLOYEE_RATE);
  const npsEr    = npsTotal - npsEe;

  // 2) 건강보험
  const hiTotal = floor10(salary * HI_RATE);
  const hiEe    = floor10(salary * HI_EMPLOYEE_RATE);
  const hiEr    = hiTotal - hiEe;

  // 3) 장기요양보험 (건강보험료 × 13.14%)
  const ltcTotal = floor10(hiTotal * LTC_OVER_HI_RATE);
  const ltcEe    = floor10(ltcTotal / 2);
  const ltcEr    = ltcTotal - ltcEe;

  // 4) 고용보험 - 실업급여
  const eiUITotal = floor10(salary * EI_UI_RATE);
  const eiUIEe    = floor10(salary * EI_UI_EMPLOYEE_RATE);
  const eiUIEr    = eiUITotal - eiUIEe;

  // 5) 고용보험 - 고용안정·직업능력개발 (사업주 전액)
  const tier     = EI_STABILITY_TIERS.find(t => t.value === input.eiTier) ?? EI_STABILITY_TIERS[0];
  const eiStabEr = floor10(salary * tier.rate);

  // 6) 산재보험 (사업주 전액)
  const industry  = INDUSTRY_RATES.find(r => r.value === input.industryType) ?? INDUSTRY_RATES.at(-1)!;
  let wcAddRate   = WC_COMMUTE_RATE;
  if (!input.isGovBiz)  wcAddRate += WC_WAGE_CLAIM_RATE;
  if (!input.isUnder20) wcAddRate += WC_ASBESTOS_RATE;
  const wcTotalRate = industry.rate + wcAddRate; // ‰
  const wcEr        = floor10(salary * wcTotalRate / 1000);

  // 합계
  const totalEmployee = npsEe + hiEe + ltcEe + eiUIEe;
  const totalEmployer = npsEr + hiEr + ltcEr + eiUIEr + eiStabEr + wcEr;
  const totalAll      = totalEmployee + totalEmployer;

  return {
    monthlySalary: salary,
    npsBasis,
    nps:         { label: '국민연금',                    employee: npsEe,  employer: npsEr,    total: npsTotal  },
    hi:          { label: '건강보험',                    employee: hiEe,   employer: hiEr,     total: hiTotal   },
    ltc:         { label: '장기요양보험',                employee: ltcEe,  employer: ltcEr,    total: ltcTotal  },
    eiUI:        { label: '고용보험(실업급여)',           employee: eiUIEe, employer: eiUIEr,   total: eiUITotal },
    eiStability: { label: '고용보험(고용안정·직능개발)', employee: 0,      employer: eiStabEr, total: eiStabEr  },
    wc:          { label: '산재보험',                    employee: 0,      employer: wcEr,     total: wcEr      },
    totalEmployee,
    totalEmployer,
    totalAll,
    annualEmployee: totalEmployee * 12,
    annualEmployer: totalEmployer * 12,
    annualAll:      totalAll      * 12,
  };
}
