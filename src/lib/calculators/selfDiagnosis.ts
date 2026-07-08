import type { DiagnosisType, Question } from '@/lib/constants/self-diagnosis-data';

export interface CategoryScore {
  category: string;
  earned: number;
  max: number;
  percentage: number;
}

export type DiagnosisGrade = 'very-high' | 'high' | 'medium' | 'low' | 'very-low';

export interface DiagnosisResult {
  /** 내부 원점수 (0~100, 감점 반영) */
  totalScore: number;
  /** 보정된 승인 가능성 퍼센티지 (5~95%) — 화면 표시용 */
  percentage: number;
  grade: DiagnosisGrade;
  gradeLabel: string;
  gradeColor: string;
  categoryScores: CategoryScore[];
  weakPoints: string[];
  advice: string[];
}

/* ─────────────────────────────────────────
   표시용 퍼센티지 보정
   0점 → 5%, 100점 → 95% (극단값 방지)
───────────────────────────────────────── */
function scoreToPercentage(rawScore: number): number {
  const percentage = Math.round(5 + (rawScore / 100) * 90);
  return Math.min(95, Math.max(5, percentage));
}

/* ─────────────────────────────────────────
   질문별 점수 계산
   - single   : 선택한 choice의 score
   - multiple : 합산 → maxScore 상한 적용 (감점 전용은 maxScore=0, 음수 허용)
   - number   : numberConfig.scoreRanges 구간 매핑
───────────────────────────────────────── */
export function calcQuestionScore(question: Question, selectedIds: string[]): number {
  if (question.type === 'number' && question.numberConfig) {
    const numVal = parseInt(selectedIds[0] ?? '0', 10);
    if (Number.isNaN(numVal)) return 0;
    const range = question.numberConfig.scoreRanges.find(
      (r) => numVal >= r.min && numVal <= r.max
    );
    return range?.score ?? 0;
  }

  const rawSum = selectedIds.reduce((sum, id) => {
    const choice = question.choices.find((c) => c.id === id);
    return sum + (choice?.score ?? 0);
  }, 0);

  if (question.type === 'single') return rawSum;

  // multiple: 양수는 maxScore 상한, 음수(감점)는 제한 없음
  if (rawSum > question.maxScore) return question.maxScore;
  return rawSum;
}

/* ─────────────────────────────────────────
   answers 빌드 헬퍼
───────────────────────────────────────── */
export interface AnswerRecord {
  questionId: string;
  selectedIds: string[];
  score: number;
  maxScore: number;
  category: string;
}

export function buildAnswers(
  selectedMap: Record<string, string[]>,
  questions: Question[]
): AnswerRecord[] {
  return questions
    .filter((q) => (selectedMap[q.id]?.length ?? 0) > 0)
    .map((q) => {
      const selectedIds = selectedMap[q.id] ?? [];
      const score = calcQuestionScore(q, selectedIds);
      return { questionId: q.id, selectedIds, score, maxScore: q.maxScore, category: q.category };
    });
}

/* ─────────────────────────────────────────
   조건부 질문 필터 — 현재 answers 기준 보여야 할 질문만 반환
───────────────────────────────────────── */
export function getVisibleQuestions(
  questions: Question[],
  selectedMap: Record<string, string[]>
): Question[] {
  return questions.filter((q) => {
    if (!q.condition) return true;
    const condAnswers = selectedMap[q.condition.questionId] ?? [];
    return condAnswers.includes(q.condition.choiceId);
  });
}

/* ─────────────────────────────────────────
   핵심 점수 계산
───────────────────────────────────────── */
export function calculateDiagnosisScore(
  answers: AnswerRecord[],
  type: DiagnosisType
): DiagnosisResult {
  const totalEarned = answers.reduce((s, a) => s + a.score, 0);
  const totalMax = answers.reduce((s, a) => s + a.maxScore, 0);

  // 0~100 정규화 (음수 감점 → clamp)
  const rawPercentage = totalMax > 0 ? (totalEarned / totalMax) * 100 : 0;
  const percentage = Math.max(0, Math.min(100, Math.round(rawPercentage)));

  const maxPossibleScore = totalMax;
  const totalScore = Math.max(0, totalEarned);   // raw 점수 (감점 반영, 0 하한)

  // 카테고리별 집계
  const catMap = new Map<string, { earned: number; max: number }>();
  for (const a of answers) {
    const cur = catMap.get(a.category) ?? { earned: 0, max: 0 };
    catMap.set(a.category, { earned: cur.earned + a.score, max: cur.max + a.maxScore });
  }
  const categoryScores: CategoryScore[] = Array.from(catMap.entries()).map(
    ([category, v]) => ({
      category,
      earned: v.earned,
      max: v.max,
      percentage: v.max > 0 ? Math.max(0, Math.round((v.earned / v.max) * 100)) : 0,
    })
  );

  const grade = getGrade(percentage);
  const { gradeLabel, gradeColor } = GRADE_META[grade];

  const weakPoints = buildWeakPoints(categoryScores, type);
  const advice = buildAdvice(categoryScores, answers, type, grade);

  return {
    totalScore,
    percentage: scoreToPercentage(percentage),
    grade,
    gradeLabel,
    gradeColor,
    categoryScores,
    weakPoints,
    advice,
  };
}

/* ─────────────────────────────────────────
   등급 (5단계)
───────────────────────────────────────── */
function getGrade(percentage: number): DiagnosisGrade {
  if (percentage >= 85) return 'very-high';
  if (percentage >= 70) return 'high';
  if (percentage >= 50) return 'medium';
  if (percentage >= 30) return 'low';
  return 'very-low';
}

const GRADE_META: Record<DiagnosisGrade, { gradeLabel: string; gradeColor: string }> = {
  'very-high': { gradeLabel: '승인 가능성 매우 높음', gradeColor: '#16A34A' },
  high:        { gradeLabel: '승인 가능성 높음',      gradeColor: '#22C55E' },
  medium:      { gradeLabel: '보통 — 추가 준비 필요', gradeColor: '#F97316' },
  low:         { gradeLabel: '승인 가능성 낮음',      gradeColor: '#EF4444' },
  'very-low':  { gradeLabel: '승인 가능성 매우 낮음', gradeColor: '#DC2626' },
};

/** 등급별 배경 색상 (컴포넌트에서 직접 사용) */
export const GRADE_BG: Record<DiagnosisGrade, string> = {
  'very-high': '#F0FDF4',
  high:        '#F0FDF4',
  medium:      '#FFF7ED',
  low:         '#FEF2F2',
  'very-low':  '#FEF2F2',
};

/* ─────────────────────────────────────────
   약점 분석 — 카테고리 점수 50% 미만인 항목 전체 표시
───────────────────────────────────────── */
const ADVICE_MAP: Record<string, string> = {
  // 사고 산재
  '업무수행성':
    '사고 당시 업무 지시를 받은 상태였음을 입증할 수 있는 자료(작업지시서, 업무일지, 동료 진술)를 확보하세요.',
  '업무기인성':
    '사고 원인이 업무 환경·설비와 관련되어 있음을 보여줄 수 있는 사진, 안전점검 기록, 안전관리자 보고서를 확인하세요.',
  '부상 심각도':
    '가능한 빨리 전문의 진료를 받으시고, 정확한 진단서를 확보하세요. 진단서에 사고 경위가 기재되면 유리합니다.',
  '의료 시점':
    '사고 후 병원 방문이 늦어지면 인과관계 입증이 불리합니다. 지금이라도 빨리 진료를 받으시고, 초진 시 반드시 사고 날짜와 경위를 말씀하세요.',
  '증거 확보':
    '목격자 진술서를 확보하세요. 양식은 근로복지공단 홈페이지에서 다운로드할 수 있습니다. CCTV가 있다면 보존 요청을 하세요 (보통 30일 후 삭제됩니다).',
  '사업주 협조':
    '사업주가 비협조적이더라도 근로자 단독으로 산재 신청이 가능합니다. 고용노동부(1350)에 전화하시면 절차를 안내받을 수 있습니다.',
  '출퇴근 재해 세부':
    '출퇴근 경로가 통상적이었음을 입증할 수 있는 자료(네비게이션 기록, 교통카드 이력, 블랙박스 영상)를 확보하세요.',
  '감점 요소':
    '감점 요소가 있더라도 포기하지 마세요. 전문 노무사와 상담하면 대응 방법을 찾을 수 있습니다.',
  // 질병 산재
  '근무 기간':
    '동일 직종에서의 총 경력을 합산할 수 있습니다. 이전 직장에서 같은 업무를 했다면 해당 경력 증빙을 준비하세요.',
  '업무 부하':
    '근무시간 기록, 작업 환경 자료, 업무량 변화를 보여줄 수 있는 증빙을 최대한 확보하세요. 동료의 진술도 큰 도움이 됩니다.',
  '의료 입증':
    '산업의학과 전문의의 소견이 가장 중요합니다. 주치의에게 "업무와의 관련성"에 대한 의견을 소견서에 포함해달라고 요청하세요.',
  '기존 질환':
    '기존 질환이 있더라도 업무가 질병을 "의미 있게 악화"시켰다면 산재 인정이 가능합니다. 발병 전후 건강검진 결과를 비교할 수 있으면 유리합니다.',
  '발병 시점':
    '퇴직 후 발병한 경우, 재직 중 업무 부하와 발병 사이의 인과관계를 의학적으로 설명할 수 있는 전문의 소견서가 중요합니다.',
};

function buildWeakPoints(
  categoryScores: CategoryScore[],
  _type: DiagnosisType
): string[] {
  return categoryScores
    .filter((c) => c.max > 0 && c.percentage < 50)
    .sort((a, b) => a.percentage - b.percentage)
    .map(
      (c) =>
        ADVICE_MAP[c.category] ??
        `${c.category} 항목 점수가 낮습니다. 관련 자료를 보완하세요.`
    );
}

/* ─────────────────────────────────────────
   맞춤 조언
───────────────────────────────────────── */
function buildAdvice(
  categoryScores: CategoryScore[],
  answers: AnswerRecord[],
  type: DiagnosisType,
  grade: DiagnosisGrade
): string[] {
  const advice: string[] = [];

  if (type === 'accident') {
    const evidence = categoryScores.find((c) => c.category === '증거 확보');
    if (evidence && evidence.percentage < 50) {
      advice.push('📸 사고 현장 사진, CCTV 영상, 목격자 진술서를 최대한 빠르게 확보하세요.');
    }
    const deduction = answers.find((a) => a.category === '감점 요소' && a.score < 0);
    if (deduction) {
      advice.push('⚠️ 감점 요소가 있습니다. 전문 노무사와 상담해 대응 전략을 수립하세요.');
    }
    const coop = categoryScores.find((c) => c.category === '사업주 협조');
    if (coop && coop.percentage < 50) {
      advice.push('🏢 사업주가 비협조적이더라도 근로자가 직접 근로복지공단에 신청할 수 있습니다.');
    }
    if (grade === 'very-high' || grade === 'high') {
      advice.push('📋 요양급여 신청서에 재해경위서·진단서를 첨부하면 심사가 신속해집니다.');
    }
  } else {
    const medical = categoryScores.find(
      (c) => c.category === '의학적인과관계' || c.category === '의료 입증'
    );
    if (medical && medical.percentage < 50) {
      advice.push('🏥 담당 의사에게 업무 관련성 소견서 발급을 요청하세요. 가장 중요한 증거입니다.');
    }
    const workload = categoryScores.find(
      (c) => c.category === '업무 부하' || c.category === '과로'
    );
    if (workload && workload.percentage >= 65) {
      advice.push('⏱️ 근태 기록·야근 지시 메시지·업무일지 등 과로 입증 자료를 확보하세요.');
    }
    const deduction = answers.find((a) => a.category === '감점 요소' && a.score < 0);
    if (deduction) {
      advice.push('⚠️ 감점 요소가 확인됩니다. 전문 노무사와 상담해 대응 전략을 세우세요.');
    }
    advice.push('📝 작업환경 측정 결과서·고용 기록·업무 내용 확인서를 사전에 준비하세요.');
  }

  if (grade === 'low' || grade === 'very-low') {
    advice.push('⚖️ 전문 노무사 상담으로 실제 승인 가능성을 정확히 파악하는 것을 권장합니다.');
  }

  return advice;
}

/* ─────────────────────────────────────────
   다음 단계 (컴포넌트에서 직접 호출 가능)
───────────────────────────────────────── */
export function getNextSteps(grade: DiagnosisGrade): string[] {
  const common = [
    '근로복지공단(1588-0075)에 요양급여 신청',
    '노무사 무료 상담 활용 (근로복지공단 또는 지역 노동청)',
  ];

  if (grade === 'very-high' || grade === 'high') {
    return [
      '가능한 빨리 근로복지공단에 요양급여 신청서를 제출하세요',
      '평균임금 계산기로 예상 보상금 규모를 미리 파악하세요',
      '사업주 미협조 시 근로자 직접 청구 제도를 이용하세요',
      ...common,
    ];
  }
  if (grade === 'medium') {
    return [
      '전문 노무사 사전 검토 후 신청 여부를 결정하세요',
      '부족한 자료(의사 소견서·목격자 진술 등)를 먼저 보완하세요',
      '근로복지공단 업무상 질병 판정위원회 활용을 고려하세요',
      ...common,
    ];
  }
  return [
    '전문 노무사 상담을 통해 승인 가능성을 재평가받으세요',
    '진단서·소견서·목격자 진술 등 추가 입증 자료를 최대한 확보하세요',
    '불승인 시 심사청구(90일) → 재심사청구 → 행정소송 이의 절차가 있습니다',
    ...common,
  ];
}
