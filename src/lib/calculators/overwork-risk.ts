/**
 * 과로 위험도 진단 (뇌심혈관질환 산재 인정 가능성)
 *
 * 법령 근거: 산재보험법 시행령 별표3 제1호 가목
 *   A. 돌발상황(급성 스트레스) — 발병 전 24시간
 *   B. 단기과로             — 발병 전 1주 근로시간 30% 이상 증가
 *   C. 만성과로             — 발병 전 12주(4주) 평균 주 근로시간
 *   D. 업무부담 가중요인 7가지
 *   E. 야간근무(22~06시) 30% 가산
 */

// ── 상수 ──────────────────────────────────────────────────────

export const OVERWORK_THRESHOLDS = {
  // 만성과로 기준 (가산 후)
  strongHours12w:  60,  // 12주 평균 > 60h → 강함
  strong4wHours:   64,  // 4주 평균 > 64h  → 강함
  increasedHours:  52,  // 12주 평균 > 52h  → 증가
  // 단기과로 기준
  shortTermRate:   30,  // 전주 ≥ 30% 증가 → 단기과로 해당
  // 야간 가산
  nightBonus:      0.3, // 야간 시간 × 1.3
  // 가중요인 격상 기준
  upgradeToStrongFactors:    2,  // 52-60h 구간 + 가중요인 ≥2 → 강함
  upgradeToIncreasedFactors: 3,  // ≤52h       + 가중요인 ≥3 → 증가
} as const;

// ── 가중요인 목록 ──────────────────────────────────────────────

export const WEIGHT_FACTORS = [
  { id: 'w1', label: '근무일정 예측 어려움',   desc: '불규칙 스케줄, 호출대기(on-call) 근무' },
  { id: 'w2', label: '교대제 업무',           desc: '2교대·3교대·격일제 등 교대 근무' },
  { id: 'w3', label: '휴일 부족',             desc: '월 휴일 4일 미만, 연차 미사용 지속' },
  { id: 'w4', label: '유해한 작업환경',        desc: '한랭, 급격한 온도변화, 소음 반복 노출' },
  { id: 'w5', label: '육체적 강도 높은 업무',  desc: '중량물 취급, 장시간 서서 작업 등' },
  { id: 'w6', label: '시차 큰 출장 잦음',      desc: '해외출장, 장거리 이동 빈번' },
  { id: 'w7', label: '정신적 긴장 큰 업무',    desc: '고객 응대, 감정노동, 마감·실적 압박 등' },
] as const;

// ── 인터페이스 ────────────────────────────────────────────────

export type WorkRelationLevel = 'strong' | 'increased' | 'low';

export interface OverworkRiskInput {
  // 근로시간 (야간 가산 전, 주 단위)
  avg12WeekHours:    number;  // 발병 전 12주 주평균
  avg4WeekHours:     number;  // 발병 전 4주 주평균
  lastWeekHours:     number;  // 발병 전 1주

  // 야간근무 (22~06시) 주당 시간 (위 근로시간에 포함된 야간시간)
  nightHoursPerWeek: number;

  // A. 돌발상황
  hasAcuteStress: boolean;

  // D. 가중요인 (w1~w7 순서, 7개 boolean)
  weightFactors: boolean[];
}

export interface OverworkRiskResult {
  // 야간 가산 후 조정 근로시간
  adj12WeekAvg:  number;
  adj4WeekAvg:   number;
  adjLastWeek:   number;
  nightBonus:    number;  // 가산된 시간 (야간 × 0.3)

  // A. 돌발상황
  acuteStress: {
    detected: boolean;
    level: WorkRelationLevel;
  };

  // B. 단기과로
  shortTerm: {
    detected: boolean;
    increaseRate: number;   // 증가율 (%)
    level: WorkRelationLevel;
  };

  // C. 만성과로
  chronic: {
    level: WorkRelationLevel;
    trigger: '12w-over60' | '4w-over64' | '52to60-upgraded' | '52to60-base' | 'below52-upgraded' | 'below52-base';
    upgradedByWeightFactors: boolean;
  };

  // D. 가중요인
  weightFactorCount: number;

  // 종합 판정
  overall: WorkRelationLevel;
  overallLabel: string;
  overallColor: 'red' | 'orange' | 'blue';
  summary: string;     // 한 줄 요약
  keyFactors: string[];   // 인정 근거 목록
  advice: string[];
}

// ── 헬퍼 ──────────────────────────────────────────────────────

export function levelToOrder(l: WorkRelationLevel): number {
  return l === 'strong' ? 3 : l === 'increased' ? 2 : 1;
}

export function maxLevel(a: WorkRelationLevel, b: WorkRelationLevel): WorkRelationLevel {
  return levelToOrder(a) >= levelToOrder(b) ? a : b;
}

// ── 진단 ──────────────────────────────────────────────────────

export function diagnoseOverworkRisk(input: OverworkRiskInput): OverworkRiskResult {
  const T = OVERWORK_THRESHOLDS;

  // Step 1: 야간 가산
  const nightBonus  = parseFloat((input.nightHoursPerWeek * T.nightBonus).toFixed(1));
  const adj12Week   = parseFloat((input.avg12WeekHours + nightBonus).toFixed(1));
  const adj4Week    = parseFloat((input.avg4WeekHours   + nightBonus).toFixed(1));
  const adjLastWeek = parseFloat((input.lastWeekHours   + nightBonus).toFixed(1));

  // Step 2: 가중요인 수
  const wCount = input.weightFactors.filter(Boolean).length;

  // Step 3: 만성과로 판정
  let chronicLevel:   WorkRelationLevel;
  let chronicTrigger: OverworkRiskResult['chronic']['trigger'];
  let upgradedByWF   = false;

  if (adj12Week > T.strongHours12w || adj4Week > T.strong4wHours) {
    chronicLevel   = 'strong';
    chronicTrigger = adj4Week > T.strong4wHours ? '4w-over64' : '12w-over60';
  } else if (adj12Week > T.increasedHours) {
    // 52 < x ≤ 60 구간
    if (wCount >= T.upgradeToStrongFactors) {
      chronicLevel   = 'strong';
      chronicTrigger = '52to60-upgraded';
      upgradedByWF   = true;
    } else {
      chronicLevel   = 'increased';
      chronicTrigger = '52to60-base';
    }
  } else {
    // ≤ 52
    if (wCount >= T.upgradeToIncreasedFactors) {
      chronicLevel   = 'increased';
      chronicTrigger = 'below52-upgraded';
      upgradedByWF   = true;
    } else {
      chronicLevel   = 'low';
      chronicTrigger = 'below52-base';
    }
  }

  // Step 4: 단기과로
  const increaseRate =
    input.avg12WeekHours > 0
      ? parseFloat((((input.lastWeekHours - input.avg12WeekHours) / input.avg12WeekHours) * 100).toFixed(1))
      : 0;
  const shortTermDetected = increaseRate >= T.shortTermRate;
  const shortTermLevel: WorkRelationLevel = shortTermDetected ? 'strong' : 'low';

  // Step 5: 돌발상황
  const acuteLevel: WorkRelationLevel = input.hasAcuteStress ? 'strong' : 'low';

  // Step 6: 종합 판정 (세 기준 중 최고 레벨)
  const overall = maxLevel(chronicLevel, maxLevel(shortTermLevel, acuteLevel));

  // Step 7: 인정 근거 목록
  const keyFactors: string[] = [];

  if (input.hasAcuteStress) {
    keyFactors.push('발병 전 24시간 이내 돌발상황·급성 스트레스 사건');
  }
  if (shortTermDetected) {
    keyFactors.push(`단기과로: 발병 전 1주 근로시간이 12주 평균 대비 ${increaseRate}% 증가`);
  }
  if (adj12Week > T.strongHours12w) {
    keyFactors.push(`만성과로: 12주 평균 ${adj12Week}h (기준 60h 초과)`);
  } else if (adj4Week > T.strong4wHours) {
    keyFactors.push(`만성과로: 4주 평균 ${adj4Week}h (기준 64h 초과)`);
  } else if (adj12Week > T.increasedHours) {
    keyFactors.push(`만성과로: 12주 평균 ${adj12Week}h (52~60h 구간)`);
  }
  if (upgradedByWF) {
    keyFactors.push(`업무부담 가중요인 ${wCount}개 해당 → 위험도 격상`);
  } else if (wCount > 0) {
    keyFactors.push(`업무부담 가중요인 ${wCount}개 해당`);
  }

  // Step 8: 종합 설명
  const labels: Record<WorkRelationLevel, string> = {
    strong:    '업무 관련성 강함',
    increased: '업무 관련성 증가',
    low:       '업무 관련성 낮음',
  };
  const colors: Record<WorkRelationLevel, 'red' | 'orange' | 'blue'> = {
    strong:    'red',
    increased: 'orange',
    low:       'blue',
  };

  const summaryMap: Record<WorkRelationLevel, string> = {
    strong:    '뇌심혈관질환 산재 신청 시 인정 가능성이 높습니다. 전문가 상담을 권장합니다.',
    increased: '인정 가능성이 어느 정도 있으나 추가 입증 자료가 필요합니다.',
    low:       '현재 기준상 인정 가능성이 낮습니다. 가중요인을 다시 검토해 보세요.',
  };

  const adviceMap: Record<WorkRelationLevel, string[]> = {
    strong: [
      '근무기록(출퇴근 시간, 연장근무 내역)을 최소 12주치 확보하세요.',
      '담당 의사에게 업무 관련성 소견서를 요청하세요.',
      '발병 전후 업무 일지·이메일·메신저 기록을 보관하세요.',
      '근로복지공단에 산재요양급여 청구 시 업무 관련성 소명서를 함께 제출하세요.',
      '노무사·변호사 등 전문가 조력을 받는 것을 적극 권장합니다.',
    ],
    increased: [
      '근무기록을 빠짐없이 정리하고, 특히 연장·야간 근무 내역을 확인하세요.',
      '업무량 급증, 돌발 이벤트 등 발병 전후 상황을 기록해 두세요.',
      '가중요인(교대제, 환경, 출장 등)에 해당하는 증빙 자료를 확보하세요.',
      '전문가 상담으로 추가 인정 근거를 점검하세요.',
    ],
    low: [
      '근무시간이 기준에 미달하더라도 돌발상황·가중요인 복합 노출 시 인정될 수 있습니다.',
      '질병 발생 전 특이한 업무 변화나 스트레스 사건이 있었다면 상세히 기록하세요.',
      '정확한 판단은 노무사·근로복지공단(☎ 1588-0075)에 문의하시기 바랍니다.',
    ],
  };

  return {
    adj12WeekAvg:  adj12Week,
    adj4WeekAvg:   adj4Week,
    adjLastWeek:   adjLastWeek,
    nightBonus,

    acuteStress:  { detected: input.hasAcuteStress, level: acuteLevel },
    shortTerm:    { detected: shortTermDetected, increaseRate, level: shortTermLevel },
    chronic:      { level: chronicLevel, trigger: chronicTrigger, upgradedByWeightFactors: upgradedByWF },

    weightFactorCount: wCount,

    overall,
    overallLabel: labels[overall],
    overallColor: colors[overall],
    summary:      summaryMap[overall],
    keyFactors,
    advice:       adviceMap[overall],
  };
}
