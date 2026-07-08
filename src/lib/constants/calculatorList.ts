export interface CalcMenuItem {
  label: string;
  href: string;
  emoji: string;
}

export const calculatorList: CalcMenuItem[] = [
  { label: '평균임금 계산기', href: '/calc/average-wage', emoji: '💰' },
  { label: '퇴직금 계산기', href: '/calc/retirement-pay', emoji: '🏦' },
  { label: '연차수당 계산기', href: '/calc/annual-leave-pay', emoji: '📅' },
  { label: '4대보험 계산기', href: '/calc/four-insurance', emoji: '🛡️' },
  { label: '산재 휴업급여', href: '/calc/injury-leave-pay', emoji: '🏥' },
  { label: '산재 장해급여', href: '/calc/disability-pay', emoji: '♿' },
  { label: '유족급여·장의비', href: '/calc/survivor-pay', emoji: '🌿' },
  { label: '과로 위험도 진단', href: '/calc/overwork-risk', emoji: '⚠️' },
  { label: '산재보험료 계산기', href: '/calc/injury-insurance-fee', emoji: '📋' },
  { label: '산재 승인 자가진단', href: '/calc/self-diagnosis', emoji: '🔍' },
];
