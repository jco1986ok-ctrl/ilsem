export interface CalcMenuItem {
  label: string;
  href: string;
  emoji: string;
  group: 'injury' | 'worker';
}

export const calculatorList: CalcMenuItem[] = [
  // 산재보상 계산기
  { label: '산재 승인 자가진단',  href: '/calc/self-diagnosis',       emoji: '🩺', group: 'injury' },
  { label: '산재 휴업급여',       href: '/calc/sick-leave-pay',       emoji: '🏥', group: 'injury' },
  { label: '산재 장해급여',       href: '/calc/disability-pay',       emoji: '♿', group: 'injury' },
  { label: '유족급여·장의비',     href: '/calc/survivor-pay',         emoji: '🌿', group: 'injury' },
  { label: '과로 위험도 진단',    href: '/calc/overwork-risk',        emoji: '⚠️', group: 'injury' },
  { label: '산재보험료 계산기',   href: '/calc/injury-insurance-fee', emoji: '📋', group: 'injury' },
  // 근로자 필수 계산기
  { label: '평균임금 계산기',     href: '/calc/average-wage',         emoji: '💰', group: 'worker' },
  { label: '퇴직금 계산기',       href: '/calc/retirement-pay',       emoji: '🏦', group: 'worker' },
  { label: '부당해고 보상금',     href: '/calc/unfair-dismissal-pay', emoji: '⚖️', group: 'worker' },
  { label: '연차수당 계산기',     href: '/calc/annual-leave-pay',     emoji: '📅', group: 'worker' },
  { label: '4대보험 계산기',      href: '/calc/four-insurance',       emoji: '🛡️', group: 'worker' },
];
