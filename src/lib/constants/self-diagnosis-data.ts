/**
 * 산재 승인 자가진단 — 질문·선택지·배점 데이터
 * 산업재해보상보험법 제37조 및 관련 고시 기준
 */

export type QuestionType = 'single' | 'multiple' | 'number' | 'conditional';
export type DiagnosisType = 'accident' | 'disease';

export interface Choice {
  id: string;
  label: string;
  /** 점수 (없으면 0으로 처리 — 분류용 질문 등) */
  score?: number;
  description?: string;
}

export interface Question {
  id: string;
  step: number;
  category: string;
  title: string;
  subtitle: string;
  type: QuestionType;
  /** 이 질문에서 얻을 수 있는 최대 점수 (감점 전용 항목은 0) */
  maxScore: number;
  choices: Choice[];
  /** 조건부 질문: condition을 만족할 때만 표시 */
  condition?: {
    questionId: string;
    choiceId: string;
  };
  numberConfig?: {
    min: number;
    max: number;
    unit: string;
    scoreRanges: { min: number; max: number; score: number }[];
  };
}

/* ═══════════════════════════════════════
   사고 유형 (업무상 사고) — 8문항
   산재보험법 제37조 제1항 제1호 기준
═══════════════════════════════════════ */
export const accidentQuestions: Question[] = [
  {
    id: 'acc-1',
    step: 1,
    category: '업무수행성',
    title: '사고가 발생한 정확한 상황을 선택해주세요',
    subtitle: '법적 쟁점: 사고 당시 사업주의 지배·관리 하에 있었는가',
    type: 'single',
    maxScore: 20,
    choices: [
      {
        id: 'acc-1-1',
        label: '사업주가 지시한 업무를 수행하는 중이었다',
        score: 20,
        description: '업무수행성이 가장 명확한 경우입니다',
      },
      {
        id: 'acc-1-2',
        label: '업무 준비·정리 중이었다 (장비 점검, 청소 등)',
        score: 17,
        description: '판례상 업무의 연장으로 인정됩니다',
      },
      {
        id: 'acc-1-3',
        label: '생리적 필요 행위 중이었다 (화장실, 음수 등)',
        score: 15,
        description: '사회통념상 업무 부수행위로 인정됩니다',
      },
      {
        id: 'acc-1-4',
        label: '휴게시간 중 사업장 내에서 발생했다',
        score: 12,
        description: '시설물 결함이면 인정, 개인 행위면 불인정 가능',
      },
      {
        id: 'acc-1-5',
        label: '사업주 지시에 의한 회식·행사 중이었다',
        score: 10,
        description: '자유 참석이면 불인정, 사실상 강제면 인정',
      },
      {
        id: 'acc-1-6',
        label: '자발적으로 참석한 사내 행사 중이었다',
        score: 5,
        description: '불인정 가능성이 높습니다',
      },
      {
        id: 'acc-1-7',
        label: '개인적 용무 중이었다 (사적 외출 등)',
        score: 2,
        description: '업무수행성이 부정됩니다',
      },
    ],
  },
  {
    id: 'acc-2',
    step: 2,
    category: '업무기인성',
    title: '사고의 직접적인 원인은 무엇이었나요?',
    subtitle: '법적 쟁점: 사고와 업무 사이에 인과관계가 있는가',
    type: 'single',
    maxScore: 20,
    choices: [
      {
        id: 'acc-2-1',
        label: '작업 환경·설비의 결함',
        score: 20,
        description: '안전장치 미설치, 바닥 미끄러움, 장비 고장 등',
      },
      {
        id: 'acc-2-2',
        label: '작업 방법 자체의 위험성',
        score: 18,
        description: '고소 작업, 중량물 취급, 밀폐공간 작업 등',
      },
      {
        id: 'acc-2-3',
        label: '교통사고 (업무 목적 이동 중)',
        score: 15,
        description: '업무 목적 입증 시 인정',
      },
      {
        id: 'acc-2-4',
        label: '제3자의 행위로 인한 사고',
        score: 14,
        description: '동료·고객 등 — 업무 관련성 있으면 인정',
      },
      {
        id: 'acc-2-5',
        label: '자연재해·돌발상황',
        score: 13,
        description: '업무 장소의 위험이 기여했으면 인정',
      },
      {
        id: 'acc-2-6',
        label: '출퇴근 중 교통사고',
        score: 12,
        description: '통상 경로·방법이면 인정 (2018년 개정법)',
      },
      {
        id: 'acc-2-7',
        label: '본인의 부주의·실수',
        score: 10,
        description: '중과실이 아닌 한 인정 (근로자 과실만으로 불인정 안 됨)',
      },
      {
        id: 'acc-2-8',
        label: '원인 불명',
        score: 5,
        description: '입증 곤란 — 불인정 위험이 높습니다',
      },
    ],
  },
  {
    id: 'acc-3',
    step: 3,
    category: '출퇴근 재해 세부',
    title: '출퇴근 경로에 대해 선택해주세요',
    subtitle: '법적 쟁점: 통상적인 경로와 방법이었는가',
    type: 'multiple',
    maxScore: 8,
    condition: { questionId: 'acc-2', choiceId: 'acc-2-6' },
    choices: [
      { id: 'acc-3-1', label: '통상적으로 이용하던 경로였다', score: 4 },
      {
        id: 'acc-3-2',
        label: '회사가 제공하는 교통수단을 이용 중이었다',
        score: 4,
      },
      {
        id: 'acc-3-3',
        label: '경로를 일탈했지만 일상생활에 필요한 행위였다',
        score: 2,
        description: '병원, 어린이집, 마트 등',
      },
      {
        id: 'acc-3-4',
        label: '경로를 일탈하여 사적 용무를 보는 중이었다',
        score: -6,
      },
      { id: 'acc-3-5', label: '음주 상태였다', score: -8 },
      { id: 'acc-3-6', label: '무면허 운전이었다', score: -8 },
    ],
  },
  {
    id: 'acc-4',
    step: 4,
    category: '부상 심각도',
    title: '사고로 인한 부상 정도를 선택해주세요',
    subtitle: '요양의 필요성 판단 기준',
    type: 'single',
    maxScore: 15,
    choices: [
      { id: 'acc-4-1', label: '수술이 필요하거나 이미 수술을 받았다', score: 15 },
      {
        id: 'acc-4-2',
        label: '입원 치료 중이다 (4일 이상)',
        score: 14,
      },
      { id: 'acc-4-3', label: '골절이 확인되었다', score: 13 },
      {
        id: 'acc-4-4',
        label: '인대·힘줄 파열로 진단받았다',
        score: 12,
      },
      { id: 'acc-4-5', label: '통원 치료 중이다', score: 8 },
      { id: 'acc-4-6', label: '타박상·찰과상 수준이다', score: 4 },
      { id: 'acc-4-7', label: '아직 병원에 가지 않았다', score: 2 },
    ],
  },
  {
    id: 'acc-5',
    step: 5,
    category: '의료 시점',
    title: '사고 후 얼마 만에 병원에 가셨나요?',
    subtitle: '사고와 부상 사이의 시간적 인과관계 — 늦을수록 불리합니다',
    type: 'single',
    maxScore: 10,
    choices: [
      {
        id: 'acc-5-1',
        label: '사고 당일 (응급이송 포함)',
        score: 10,
      },
      { id: 'acc-5-2', label: '1~3일 이내', score: 8 },
      { id: 'acc-5-3', label: '4일~1주일 이내', score: 5 },
      { id: 'acc-5-4', label: '1주일~1개월 이내', score: 3 },
      {
        id: 'acc-5-5',
        label: '1개월 이후 또는 아직 미방문',
        score: 1,
      },
    ],
  },
  {
    id: 'acc-6',
    step: 6,
    category: '증거 확보',
    title: '다음 중 확보하고 있는 것을 모두 선택해주세요',
    subtitle: '업무상 사고임을 입증할 수 있는 증거',
    type: 'multiple',
    maxScore: 20,
    choices: [
      {
        id: 'acc-6-1',
        label: '사업주(회사)가 산재 신청에 동의하고 있다',
        score: 8,
      },
      { id: 'acc-6-2', label: '사고 목격자가 있다 (동료 등)', score: 5 },
      { id: 'acc-6-3', label: 'CCTV 영상이 존재한다', score: 5 },
      {
        id: 'acc-6-4',
        label: '사고 당일 진단서·응급기록이 있다',
        score: 4,
      },
      { id: 'acc-6-5', label: '작업지시서·근무기록이 있다', score: 3 },
      {
        id: 'acc-6-6',
        label: '사고 현장·부상 사진을 촬영했다',
        score: 3,
      },
      { id: 'acc-6-7', label: '사고 경위서를 작성했다', score: 2 },
    ],
  },
  {
    id: 'acc-7',
    step: 7,
    category: '사업주 협조',
    title: '회사(사업주)의 태도는 어떤가요?',
    subtitle: '산재 신청 절차 진행의 현실적 난이도',
    type: 'single',
    maxScore: 10,
    choices: [
      {
        id: 'acc-7-1',
        label: '산재 신청에 적극 협조하고 있다',
        score: 10,
      },
      {
        id: 'acc-7-2',
        label: '반대하지는 않지만 소극적이다',
        score: 7,
      },
      { id: 'acc-7-3', label: '아직 회사에 알리지 않았다', score: 5 },
      {
        id: 'acc-7-4',
        label: '공상 처리를 권유하고 있다',
        score: 4,
      },
      {
        id: 'acc-7-5',
        label: '산재 신청을 적극 반대하거나 불이익을 암시하고 있다',
        score: 3,
      },
    ],
  },
  {
    id: 'acc-8',
    step: 8,
    category: '감점 요소',
    title: '다음 중 해당하는 것이 있나요?',
    subtitle: '불승인 사유에 해당할 수 있는 요소입니다 — 솔직하게 선택해주세요',
    type: 'multiple',
    maxScore: 0,
    choices: [
      { id: 'acc-8-1', label: '해당 없음', score: 0 },
      {
        id: 'acc-8-2',
        label: '사고 당시 음주 상태였다',
        score: -10,
      },
      {
        id: 'acc-8-3',
        label: '안전수칙을 의도적으로 위반했다',
        score: -5,
        description: '안전모 미착용 등 단순 부주의는 해당 안 됨',
      },
      {
        id: 'acc-8-4',
        label: '자해·자작 의심을 받고 있다',
        score: -15,
      },
      {
        id: 'acc-8-5',
        label: '동료와의 사적 다툼 중 발생했다',
        score: -10,
      },
      {
        id: 'acc-8-6',
        label: '허위·과장 신고 이력이 있다',
        score: -8,
      },
    ],
  },
];

/* ═══════════════════════════════════════
   질병 유형 (업무상 질병) — 고도화 버전
   산재보험법 제37조 제1항 제2호 기준
   질병 유형별 맞춤 질문 분기 포함
═══════════════════════════════════════ */
export const diseaseQuestions: Question[] = [
  {
    id: 'dis-1',
    step: 1,
    category: '질병 분류',
    title: '진단받은 (또는 의심되는) 질병 유형을 선택해주세요',
    subtitle: '선택에 따라 맞춤형 질문이 달라집니다',
    type: 'single',
    maxScore: 0,
    choices: [
      { id: 'dis-1-1', label: '근골격계 질환', description: '허리디스크, 회전근개파열, 손목터널증후군, 무릎연골 등' },
      { id: 'dis-1-2', label: '뇌심혈관 질환', description: '뇌출혈, 뇌경색, 심근경색, 대동맥박리 등' },
      { id: 'dis-1-3', label: '정신질환', description: '우울증, PTSD, 적응장애, 공황장애 등' },
      { id: 'dis-1-4', label: '호흡기·피부 질환', description: '진폐증, 직업성 천식, 접촉성 피부염 등' },
      { id: 'dis-1-5', label: '직업성 암', description: '석면 관련 암, 백혈병, 방광암 등' },
      { id: 'dis-1-6', label: '기타·잘 모르겠음' },
    ],
  },
  {
    id: 'dis-2',
    step: 2,
    category: '근무 기간',
    title: '해당 직장(또는 동일 직종)에서 총 얼마나 근무하셨나요?',
    subtitle: '충분한 업무 노출 기간 판단 기준',
    type: 'single',
    maxScore: 10,
    choices: [
      { id: 'dis-2-1', label: '10년 이상', score: 10 },
      { id: 'dis-2-2', label: '5년~10년', score: 9 },
      { id: 'dis-2-3', label: '3년~5년', score: 7 },
      { id: 'dis-2-4', label: '1년~3년', score: 5 },
      { id: 'dis-2-5', label: '6개월~1년', score: 3 },
      { id: 'dis-2-6', label: '6개월 미만', score: 1 },
    ],
  },

  /* ── 질병 유형별 맞춤 업무 부하 질문 (step 3) ── */
  {
    id: 'dis-3-msk',
    step: 3,
    category: '업무 부하',
    title: '주 업무에서 다음 중 해당하는 것을 모두 선택해주세요',
    subtitle: '고용노동부 고시 "업무상 질병 인정 기준" — 신체에 과도한 부담을 주는 업무',
    type: 'multiple',
    maxScore: 25,
    condition: { questionId: 'dis-1', choiceId: 'dis-1-1' },
    choices: [
      { id: 'dis-3-msk-1', label: '하루 4시간 이상 같은 동작을 반복한다', score: 7, description: '반복동작 기준' },
      { id: 'dis-3-msk-2', label: '하루 2시간 이상 쪼그려 앉거나 무릎 꿇는 자세로 작업한다', score: 6, description: '부자연스러운 자세 기준' },
      { id: 'dis-3-msk-3', label: '20kg 이상 물건을 반복적으로 들거나 운반한다', score: 7, description: '중량물 취급 기준' },
      { id: 'dis-3-msk-4', label: '팔을 어깨 위로 올린 상태에서 하루 2시간 이상 작업한다', score: 6, description: '부자연스러운 자세 기준' },
      { id: 'dis-3-msk-5', label: '진동 공구를 하루 2시간 이상 사용한다', score: 5, description: '진동 작업 기준' },
      { id: 'dis-3-msk-6', label: '하루 4시간 이상 키보드·마우스 작업을 한다', score: 4, description: 'VDT 증후군 기준' },
      { id: 'dis-3-msk-7', label: '장시간 서서 작업하거나 걸어다닌다 (하루 6시간 이상)', score: 4, description: '하지 부담 기준' },
    ],
  },
  {
    id: 'dis-3-cvd',
    step: 3,
    category: '업무 부하',
    title: '발병 전 12주간 근무 상황을 알려주세요',
    subtitle: '만성 과중업무 판단 — 근로복지공단 핵심 기준',
    type: 'number',
    maxScore: 15,
    condition: { questionId: 'dis-1', choiceId: 'dis-1-2' },
    choices: [],
    numberConfig: {
      min: 20,
      max: 100,
      unit: '시간/주',
      scoreRanges: [
        { min: 60, max: 100, score: 15 },
        { min: 52, max: 59, score: 11 },
        { min: 45, max: 51, score: 7 },
        { min: 40, max: 44, score: 3 },
        { min: 20, max: 39, score: 1 },
      ],
    },
  },
  {
    id: 'dis-3-cvd-extra',
    step: 3,
    category: '업무 부하',
    title: '다음 업무 가중 요인에 해당하는 것을 선택해주세요',
    subtitle: '야간근무·교대근무 등 추가 가중 요인',
    type: 'multiple',
    maxScore: 10,
    condition: { questionId: 'dis-1', choiceId: 'dis-1-2' },
    choices: [
      { id: 'dis-3-cvd-e1', label: '야간근무(22시~06시)를 월 4회 이상 했다', score: 4, description: '야간 가중치 30% 적용' },
      { id: 'dis-3-cvd-e2', label: '교대근무를 하고 있다 (2교대 또는 3교대)', score: 3, description: '생체리듬 교란' },
      { id: 'dis-3-cvd-e3', label: '발병 전 1주일 이내 극심한 업무 변화가 있었다', score: 4, description: '급성 과중업무 기준' },
      { id: 'dis-3-cvd-e4', label: '휴일 근무가 월 4일 이상이었다', score: 3 },
      { id: 'dis-3-cvd-e5', label: '출장이 잦았다 (월 2회 이상 장거리)', score: 2 },
      { id: 'dis-3-cvd-e6', label: '온도·소음 등 열악한 작업 환경이었다', score: 2 },
    ],
  },
  {
    id: 'dis-3-mental',
    step: 3,
    category: '업무 부하',
    title: '다음 중 해당하는 것을 모두 선택해주세요',
    subtitle: '업무상 스트레스가 발병의 주된 원인인지 판단합니다',
    type: 'multiple',
    maxScore: 25,
    condition: { questionId: 'dis-1', choiceId: 'dis-1-3' },
    choices: [
      { id: 'dis-3-m1', label: '성희롱·성폭력을 경험했다', score: 10, description: '단일 사건으로도 인정 가능' },
      { id: 'dis-3-m2', label: '상사·동료로부터 지속적인 폭언·모욕·따돌림을 받았다', score: 8, description: '직장 내 괴롭힘 (근로기준법 제76조의2)' },
      { id: 'dis-3-m3', label: '산업재해·사망사고를 목격했다', score: 7, description: 'PTSD 주요 인정 사유' },
      { id: 'dis-3-m4', label: '부당한 인사조치를 받았다', score: 6, description: '강등, 전보, 해고 위협 등' },
      { id: 'dis-3-m5', label: '과도한 업무량·책임으로 극심한 스트레스를 받았다', score: 5 },
      { id: 'dis-3-m6', label: '고객·민원인으로부터 지속적 폭언·위협을 받았다', score: 5, description: '감정노동 보호 규정 적용' },
    ],
  },
  {
    id: 'dis-3-resp',
    step: 3,
    category: '업무 부하',
    title: '업무 중 다음 환경에 노출된 적이 있나요?',
    subtitle: '유해물질 노출 평가',
    type: 'multiple',
    maxScore: 25,
    condition: { questionId: 'dis-1', choiceId: 'dis-1-4' },
    choices: [
      { id: 'dis-3-r1', label: '분진에 장기간 노출', score: 8, description: '먼지, 석면, 용접 흄 등' },
      { id: 'dis-3-r2', label: '화학물질을 취급', score: 8, description: '유기용제, 산·알칼리, 농약 등' },
      { id: 'dis-3-r3', label: '특수건강검진에서 이상 소견이 나온 적 있다', score: 7 },
      { id: 'dis-3-r4', label: '소음이 심한 환경에서 근무 (85dB 이상)', score: 5 },
      { id: 'dis-3-r5', label: '보호구를 지급받지 못했거나 착용하지 않았다', score: 5 },
      { id: 'dis-3-r6', label: '고온·저온 환경에서 근무', score: 4 },
    ],
  },
  {
    id: 'dis-3-cancer',
    step: 3,
    category: '업무 부하',
    title: '업무 중 다음 물질에 노출된 적이 있나요?',
    subtitle: '발암물질 노출 평가 — IARC 분류 기준',
    type: 'multiple',
    maxScore: 25,
    condition: { questionId: 'dis-1', choiceId: 'dis-1-5' },
    choices: [
      { id: 'dis-3-c1', label: '석면', score: 10, description: '중피종, 폐암' },
      { id: 'dis-3-c2', label: '방사선', score: 8, description: '백혈병, 갑상선암' },
      { id: 'dis-3-c3', label: '벤젠', score: 8, description: '백혈병' },
      { id: 'dis-3-c4', label: '6가 크롬', score: 7, description: '폐암' },
      { id: 'dis-3-c5', label: '포름알데히드', score: 6, description: '비인두암, 백혈병' },
      { id: 'dis-3-c6', label: '야간 교대근무 15년 이상', score: 6, description: '유방암 (IARC 2A군)' },
      { id: 'dis-3-c7', label: '디젤엔진 배기가스', score: 5, description: '폐암' },
      { id: 'dis-3-c8', label: '잘 모르겠지만 유해물질을 다뤘다', score: 3 },
    ],
  },
  {
    id: 'dis-3-general',
    step: 3,
    category: '업무 부하',
    title: '업무의 강도에 대해 알려주세요',
    subtitle: '기타 질병의 업무 관련성 판단',
    type: 'multiple',
    maxScore: 25,
    condition: { questionId: 'dis-1', choiceId: 'dis-1-6' },
    choices: [
      { id: 'dis-3-g1', label: '주 52시간 이상 근무를 지속했다', score: 8 },
      { id: 'dis-3-g2', label: '야간근무를 월 4회 이상 했다', score: 6 },
      { id: 'dis-3-g3', label: '유해물질·위험환경에 노출되었다', score: 7 },
      { id: 'dis-3-g4', label: '극심한 업무 스트레스가 있었다', score: 5 },
      { id: 'dis-3-g5', label: '반복적인 신체 부담 업무를 수행했다', score: 6 },
    ],
  },

  /* ── 공통 질문 (step 4~9) ── */
  {
    id: 'dis-4',
    step: 4,
    category: '의료 입증',
    title: '현재 의료 기록 상태를 모두 선택해주세요',
    subtitle: '의학적으로 질병이 확인되었는지 판단합니다',
    type: 'multiple',
    maxScore: 20,
    choices: [
      { id: 'dis-4-1', label: '전문의로부터 확정 진단을 받았다', score: 8, description: '산업의학과 또는 해당 진료과' },
      { id: 'dis-4-2', label: '주치의 소견서에 "업무와의 관련성"이 언급되어 있다', score: 6 },
      { id: 'dis-4-3', label: 'MRI·CT·X-ray 등 영상검사 결과가 있다', score: 5 },
      { id: 'dis-4-4', label: '근전도·신경전도·혈액검사 등 정밀검사를 받았다', score: 4 },
      { id: 'dis-4-5', label: '입원 치료 중이거나 수술을 받았다', score: 4 },
      { id: 'dis-4-6', label: '통원 치료만 받고 있다', score: 2 },
      { id: 'dis-4-7', label: '아직 병원에 가지 않았다', score: 0 },
    ],
  },
  {
    id: 'dis-5',
    step: 5,
    category: '기존 질환',
    title: '같은 부위·같은 질환으로 이전에 치료받은 적이 있나요?',
    subtitle: '질병이 업무가 아닌 개인 요인에 의한 것은 아닌지 판단합니다',
    type: 'single',
    maxScore: 10,
    choices: [
      { id: 'dis-5-1', label: '전혀 없다', score: 10 },
      { id: 'dis-5-2', label: '있었으나 완치 후 1년 이상 지나 재발했다', score: 7 },
      { id: 'dis-5-3', label: '치료 중이었는데 업무로 악화되었다', score: 5 },
      { id: 'dis-5-4', label: '같은 질환으로 계속 치료 중이다', score: 3 },
    ],
  },
  {
    id: 'dis-5-cvd-extra',
    step: 5,
    category: '기존 질환',
    title: '다음 기저질환이 있나요?',
    subtitle: '기저질환이 있어도 업무 부하가 질병을 악화시켰다면 산재 인정 가능합니다',
    type: 'multiple',
    maxScore: 0,
    condition: { questionId: 'dis-1', choiceId: 'dis-1-2' },
    choices: [
      { id: 'dis-5-cvd-1', label: '없음', score: 0 },
      { id: 'dis-5-cvd-2', label: '고혈압 (약 복용 중)', score: -2 },
      { id: 'dis-5-cvd-3', label: '당뇨', score: -2 },
      { id: 'dis-5-cvd-4', label: '고지혈증', score: -1 },
      { id: 'dis-5-cvd-5', label: '비만 (BMI 30 이상)', score: -1 },
      { id: 'dis-5-cvd-6', label: '흡연 (현재)', score: -2 },
    ],
  },
  {
    id: 'dis-6',
    step: 6,
    category: '증거 확보',
    title: '다음 중 확보하고 있는 것을 모두 선택해주세요',
    subtitle: '업무와 질병의 인과관계를 입증할 증거',
    type: 'multiple',
    maxScore: 15,
    choices: [
      { id: 'dis-6-1', label: '근무시간 기록 (출퇴근 기록, ERP, 타임카드)', score: 5 },
      { id: 'dis-6-2', label: '업무량 증빙 (업무 메일, 지시서, 실적 자료)', score: 4 },
      { id: 'dis-6-3', label: '동료 진술서 (업무 강도·환경 증언)', score: 4 },
      { id: 'dis-6-4', label: '과거 건강검진 결과 (발병 전 정상 입증)', score: 4 },
      { id: 'dis-6-5', label: '직장 내 괴롭힘 증거 (녹음, 문자, 메일)', score: 4 },
      { id: 'dis-6-6', label: 'MSDS(물질안전보건자료) 또는 작업환경측정 결과', score: 3 },
      { id: 'dis-6-7', label: '산업안전보건위원회 회의록·안전점검 기록', score: 2 },
    ],
  },
  {
    id: 'dis-7',
    step: 7,
    category: '사업주 협조',
    title: '회사(사업주)의 태도는 어떤가요?',
    subtitle: '산재 신청 절차 진행의 현실적 난이도',
    type: 'single',
    maxScore: 10,
    choices: [
      { id: 'dis-7-1', label: '산재 신청에 적극 협조하고 있다', score: 10 },
      { id: 'dis-7-2', label: '반대하지는 않지만 소극적이다', score: 7 },
      { id: 'dis-7-3', label: '아직 회사에 알리지 않았다', score: 5 },
      { id: 'dis-7-4', label: '공상 처리를 권유하고 있다', score: 4 },
      { id: 'dis-7-5', label: '산재 신청을 적극 반대하거나 불이익을 암시하고 있다', score: 3 },
    ],
  },
  {
    id: 'dis-8',
    step: 8,
    category: '발병 시점',
    title: '증상이 처음 나타난 시점은 언제인가요?',
    subtitle: '시간적 인과관계 판단 — 직업성 암은 잠복기가 길어 별도 기준 적용',
    type: 'single',
    maxScore: 10,
    choices: [
      { id: 'dis-8-1', label: '현재 재직 중이며 근무하면서 증상이 발생·악화되었다', score: 10 },
      { id: 'dis-8-2', label: '퇴직 후 6개월 이내에 증상이 나타났다', score: 7 },
      { id: 'dis-8-3', label: '퇴직 후 6개월~1년 사이에 증상이 나타났다', score: 4 },
      { id: 'dis-8-4', label: '퇴직 후 1년 이상 지나서 증상이 나타났다', score: 2 },
    ],
  },
  {
    id: 'dis-9',
    step: 9,
    category: '감점 요소',
    title: '다음 중 해당하는 것이 있나요?',
    subtitle: '솔직하게 선택해주세요 — 대비 방법을 안내해 드립니다',
    type: 'multiple',
    maxScore: 0,
    choices: [
      { id: 'dis-9-1', label: '해당 없음', score: 0 },
      { id: 'dis-9-2', label: '동일 질환에 대해 이전에 산재 불승인된 적 있다', score: -5 },
      { id: 'dis-9-3', label: '업무 외 취미·스포츠로 같은 부위를 다친 적 있다', score: -5 },
      { id: 'dis-9-4', label: '개인 사업이나 부업에서 같은 부담 업무를 병행하고 있다', score: -5 },
      { id: 'dis-9-5', label: '허위·과장 신고 의심을 받고 있다', score: -10 },
    ],
  },
];

export function getQuestions(type: DiagnosisType): Question[] {
  return type === 'accident' ? accidentQuestions : diseaseQuestions;
}
