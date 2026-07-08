/**
 * 2025년 사업종류별 산재보험료율
 * 고용노동부 고시 기준 (주요 업종)
 * 단위: % (보수총액 대비)
 */

export interface IndustryRate {
  code: string;
  name: string;
  rate: number;
}

export const INDUSTRY_RATES: IndustryRate[] = [
  { code: '01', name: '광업 - 석탄광업', rate: 18.6 },
  { code: '02', name: '광업 - 금속광업', rate: 5.8 },
  { code: '03', name: '광업 - 비금속광물 광업', rate: 5.8 },
  { code: '04', name: '광업 - 석유 및 천연가스 채굴업', rate: 0.9 },
  { code: '10', name: '식료품 제조업', rate: 1.0 },
  { code: '11', name: '음료 제조업', rate: 0.7 },
  { code: '12', name: '담배 제조업', rate: 0.6 },
  { code: '13', name: '섬유제품 제조업', rate: 0.9 },
  { code: '14', name: '의복 제조업', rate: 0.6 },
  { code: '15', name: '가죽·가방·신발 제조업', rate: 0.9 },
  { code: '16', name: '목재 및 나무제품 제조업', rate: 1.7 },
  { code: '17', name: '펄프·종이 제조업', rate: 1.2 },
  { code: '18', name: '인쇄 및 기록매체 복제업', rate: 0.7 },
  { code: '19', name: '코크스·연탄·석유정제 제조업', rate: 1.0 },
  { code: '20', name: '화학물질 및 화학제품 제조업', rate: 0.9 },
  { code: '21', name: '의료용 물질 및 의약품 제조업', rate: 0.6 },
  { code: '22', name: '고무 및 플라스틱제품 제조업', rate: 1.1 },
  { code: '23', name: '비금속 광물제품 제조업', rate: 2.2 },
  { code: '24', name: '1차 금속 제조업', rate: 1.5 },
  { code: '25', name: '금속가공제품 제조업', rate: 1.3 },
  { code: '26', name: '전자부품·컴퓨터·통신장비 제조업', rate: 0.5 },
  { code: '27', name: '의료·정밀·광학기기 제조업', rate: 0.5 },
  { code: '28', name: '전기장비 제조업', rate: 0.8 },
  { code: '29', name: '기타 기계 및 장비 제조업', rate: 1.0 },
  { code: '30', name: '자동차 및 트레일러 제조업', rate: 0.9 },
  { code: '31', name: '기타 운송장비 제조업', rate: 1.7 },
  { code: '32', name: '가구 제조업', rate: 1.1 },
  { code: '35', name: '전기·가스·증기 공급업', rate: 0.6 },
  { code: '36', name: '수도 및 하수·폐기물 처리업', rate: 1.0 },
  { code: '41', name: '종합건설업 - 건물건설공사', rate: 3.7 },
  { code: '42', name: '종합건설업 - 토목건설공사', rate: 3.7 },
  { code: '45', name: '자동차 판매 및 부품·용품 소매업', rate: 0.9 },
  { code: '46', name: '도매 및 상품중개업', rate: 0.7 },
  { code: '47', name: '소매업', rate: 0.7 },
  { code: '49', name: '육상 운수 및 파이프라인 운송업', rate: 1.7 },
  { code: '50', name: '수상 운송업', rate: 2.8 },
  { code: '51', name: '항공 운송업', rate: 0.7 },
  { code: '52', name: '창고 및 운송 관련 서비스업', rate: 1.2 },
  { code: '55', name: '숙박업', rate: 0.7 },
  { code: '56', name: '음식점 및 주점업', rate: 0.9 },
  { code: '58', name: '출판업', rate: 0.5 },
  { code: '59', name: '영상·오디오 기록물 제작 및 배급업', rate: 0.5 },
  { code: '60', name: '방송업', rate: 0.5 },
  { code: '61', name: '통신업', rate: 0.5 },
  { code: '62', name: '컴퓨터 프로그래밍 및 시스템 통합 관리업', rate: 0.5 },
  { code: '63', name: '정보서비스업', rate: 0.5 },
  { code: '64', name: '금융업', rate: 0.5 },
  { code: '65', name: '보험 및 연금업', rate: 0.5 },
  { code: '68', name: '부동산업', rate: 1.1 },
  { code: '70', name: '연구개발업', rate: 0.5 },
  { code: '71', name: '전문서비스업', rate: 0.5 },
  { code: '72', name: '건축기술·엔지니어링 서비스업', rate: 0.7 },
  { code: '74', name: '기타 전문·과학·기술 서비스업', rate: 0.5 },
  { code: '75', name: '사업지원 서비스업', rate: 1.7 },
  { code: '84', name: '공공행정·국방 및 사회보장행정', rate: 0.5 },
  { code: '85', name: '교육 서비스업', rate: 0.5 },
  { code: '86', name: '보건업', rate: 0.8 },
  { code: '87', name: '사회복지 서비스업', rate: 0.9 },
  { code: '90', name: '창작·예술·여가 서비스업', rate: 0.5 },
  { code: '91', name: '스포츠 및 오락 서비스업', rate: 1.0 },
  { code: '96', name: '개인 서비스업', rate: 0.7 },
];

/** 업종 코드로 요율 조회 */
export function getIndustryRate(code: string): IndustryRate | undefined {
  return INDUSTRY_RATES.find((r) => r.code === code);
}

/** Select 컴포넌트용 옵션 배열 */
export const INDUSTRY_RATE_OPTIONS = INDUSTRY_RATES.map((r) => ({
  value: r.code,
  label: `${r.name} (${r.rate}%)`,
}));
