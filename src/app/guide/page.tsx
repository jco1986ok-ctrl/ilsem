'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ============================================================
   카테고리 데이터 정의
   ============================================================ */

interface Step {
  icon: string;
  title: string;
  desc: string;
  link?: { label: string; href: string };
}

interface Category {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  colorBorder: string;
  colorText: string;
  steps: Step[];
}

const CATEGORIES: Category[] = [
  /* ── 카테고리 1: 산재를 당했을 때 ── */
  {
    id: 'injury',
    emoji: '🚑',
    title: '산재를 당했을 때',
    subtitle: '산재 인정부터 보상금 수령까지, 단계별로 안내합니다',
    color: 'bg-red-50',
    colorBorder: 'border-red-200',
    colorText: 'text-red-700',
    steps: [
      {
        icon: '🔍',
        title: '1단계 — 내 상황이 산재에 해당할까?',
        desc: '업무상 재해란 "업무수행 중 발생"하고 "업무가 원인"인 부상·질병·사망을 말합니다. 출퇴근 중 사고, 직장 내 과로로 인한 뇌심혈관 질환, 근골격계 질병 모두 해당될 수 있습니다. 자가진단으로 내 상황을 먼저 확인해 보세요.',
        link: { label: '산재 자가진단 →', href: '/calc/self-diagnosis' },
      },
      {
        icon: '📋',
        title: '2단계 — 산재 신청 절차',
        desc: '근로복지공단에 요양급여 신청서를 제출합니다(사업주 경유 또는 직접 신청 가능). 공단이 60일 이내에 업무상 재해 여부를 심사하고, 승인되면 치료비 전액(요양급여)이 지원됩니다. 불승인 시에는 90일 이내에 심사청구, 이후 재심사·행정소송으로 이의를 제기할 수 있습니다.',
      },
      {
        icon: '💰',
        title: '3단계 — 치료 중 받는 돈: 휴업급여',
        desc: '요양(치료) 중 일하지 못하는 기간에는 1일 평균임금의 70%를 휴업급여로 받습니다. 4일째부터 지급되며(1~3일은 사업주 부담), 2025년 기준 1일 최저 64,192원·최고 258,132원의 상·하한이 있습니다.',
        link: { label: '휴업급여 계산기 →', href: '/calc/sick-leave-pay' },
      },
      {
        icon: '🦴',
        title: '4단계 — 치료 후 장해가 남았을 때: 장해급여',
        desc: '치료가 끝난 후에도 신체에 영구적인 장해가 남으면, 장해등급(1~14급)에 따라 연금 또는 일시금을 받습니다. 1급이 가장 중증이며, 4~7급은 일부를 일시금으로 선택할 수도 있습니다.',
        link: { label: '장해급여 계산기 →', href: '/calc/disability-pay' },
      },
      {
        icon: '🕊️',
        title: '5단계 — 사망 사고가 발생했을 때: 유족급여·장의비',
        desc: '근로자가 업무상 재해로 사망한 경우, 유족에게 유족보상연금(또는 일시금)과 장의비가 지급됩니다. 유족보상연금은 급여기초연액의 47%에 수급자격자 수에 따른 가산이 적용됩니다.',
        link: { label: '유족급여·장의비 계산기 →', href: '/calc/survivor-pay' },
      },
      {
        icon: '⏰',
        title: '과로가 원인이라면?',
        desc: '뇌출혈, 심근경색 등 뇌심혈관 질환이 과로로 발생했다면 산재로 인정받을 수 있습니다. 발병 전 12주 평균 주 60시간 초과 근무, 또는 52~60시간 + 야간근무·교대제 등 가중요인이 있으면 인정 가능성이 높습니다.',
        link: { label: '과로 위험도 진단 →', href: '/calc/overwork-risk' },
      },
      {
        icon: '📊',
        title: '모든 계산의 기초: 평균임금',
        desc: '휴업급여, 장해급여, 유족급여 모두 "평균임금"을 기초로 계산됩니다. 평균임금은 재해 발생일 이전 3개월간 임금 총액을 총 일수로 나눈 금액입니다. 정확한 보상금 산정을 위해 평균임금부터 확인하세요.',
        link: { label: '평균임금 계산기 →', href: '/calc/average-wage' },
      },
    ],
  },

  /* ── 카테고리 2: 퇴직할 때 ── */
  {
    id: 'retirement',
    emoji: '📦',
    title: '퇴직할 때',
    subtitle: '퇴직금·연차수당·부당해고, 퇴직 전후로 알아야 할 것들',
    color: 'bg-blue-50',
    colorBorder: 'border-blue-200',
    colorText: 'text-blue-700',
    steps: [
      {
        icon: '✅',
        title: '퇴직금을 받을 수 있는 조건',
        desc: '계속근로기간 1년 이상이고, 1주간 소정근로시간이 15시간 이상이면 퇴직금 수급 대상입니다. 정규직, 계약직, 아르바이트 모두 해당됩니다. 반복 갱신한 계약직은 전체 기간을 합산합니다.',
      },
      {
        icon: '🧮',
        title: '퇴직금 계산',
        desc: '퇴직금 = 1일 평균임금 × 30일 × (총 재직일수 ÷ 365). 평균임금 산정 시 퇴직 전 3개월 임금에 상여금·연차수당의 3/12를 가산하며, 평균임금이 통상임금보다 낮으면 통상임금을 적용합니다.',
        link: { label: '퇴직금 계산기 →', href: '/calc/retirement-pay' },
      },
      {
        icon: '🏖️',
        title: '못 쓴 연차는 돈으로 받는다',
        desc: '퇴직 시 미사용 연차휴가는 연차수당으로 받을 수 있습니다. 1일 통상임금 × 미사용 연차일수로 계산합니다. 단, 사용자가 적법하게 연차사용촉진을 했다면 수당 지급 의무가 면제될 수 있습니다.',
        link: { label: '연차수당 계산기 →', href: '/calc/annual-leave-pay' },
      },
      {
        icon: '⚖️',
        title: '부당해고를 당했다면',
        desc: '정당한 사유 없이 해고된 경우, 5인 이상 사업장이면 해고일로부터 3개월 이내에 노동위원회에 구제신청을 할 수 있습니다. 해고예고(30일 전 통보) 없이 즉시 해고된 경우에는 30일분의 통상임금을 해고예고수당으로 청구할 수 있습니다.',
        link: { label: '부당해고 보상금 계산기 →', href: '/calc/unfair-dismissal-pay' },
      },
      {
        icon: '📝',
        title: '퇴직 후 체크리스트',
        desc: '퇴직금은 퇴직일로부터 14일 이내에 IRP 계좌로 지급되어야 합니다. 미지급 시 관할 고용노동청에 진정할 수 있으며, 3년 이하 징역 또는 3천만원 이하 벌금에 해당합니다. 비자발적 퇴직이라면 실업급여(구직급여) 신청도 잊지 마세요.',
      },
    ],
  },

  /* ── 카테고리 3: 급여명세서 이해하기 ── */
  {
    id: 'payslip',
    emoji: '💵',
    title: '급여명세서 이해하기',
    subtitle: '월급에서 빠지는 돈의 정체를 파악합니다',
    color: 'bg-green-50',
    colorBorder: 'border-green-200',
    colorText: 'text-green-700',
    steps: [
      {
        icon: '🏛️',
        title: '4대보험료는 왜 이만큼 빠질까?',
        desc: '국민연금(4.75%), 건강보험(3.595%), 장기요양보험(0.4724%), 고용보험(0.9%) — 2026년 기준 근로자 부담률은 합계 약 9.72%입니다. 월 보수 300만 원이면 약 29만 원이 공제됩니다. 국민연금은 2025년부터 매년 0.5%p씩 인상 중입니다.',
        link: { label: '4대보험료 계산기 →', href: '/calc/four-insurance' },
      },
      {
        icon: '🦺',
        title: '산재보험료는 내가 안 낸다?',
        desc: '산재보험료는 사업주가 전액 부담합니다. 업종별로 5‰(금융업)부터 185‰(석탄광업)까지 차등 적용되며, 출퇴근재해 요율·임금채권부담금·석면분담금이 추가됩니다. 근로자의 급여에서는 공제되지 않습니다.',
        link: { label: '산재보험료 계산기 →', href: '/calc/injury-insurance-fee' },
      },
      {
        icon: '📑',
        title: '월급에서 빠지는 것들 총정리',
        desc: '근로자의 월급에서 공제되는 항목은 크게 4대보험료와 세금(소득세 + 지방소득세)입니다. 4대보험료는 보수월액(과세 급여) 기준, 소득세는 간이세액표에 따라 원천징수됩니다. 식대(월 20만 원), 자가운전보조금 등 비과세 수당은 보험료·세금 산정에서 제외됩니다.',
      },
    ],
  },
];

/* ============================================================
   용어 사전 데이터
   ============================================================ */
interface Term {
  word: string;
  definition: string;
}

const GLOSSARY: Term[] = [
  {
    word: '평균임금',
    definition: '사유 발생일 이전 3개월간 임금 총액을 그 기간의 총일수로 나눈 금액. 퇴직금, 휴업급여, 장해급여, 유족급여 등의 산정 기초가 됩니다.',
  },
  {
    word: '통상임금',
    definition: '정기적·일률적·고정적으로 소정근로에 대해 지급하기로 약정한 임금. 연장·야간·휴일근로 가산수당, 해고예고수당 등의 산정 기초가 됩니다.',
  },
  {
    word: '기준소득월액',
    definition: '국민연금 보험료 산정의 기초가 되는 월 소득 금액. 매년 7월 상·하한이 조정되며, 2026년 7월부터 하한 41만 원·상한 659만 원이 적용됩니다.',
  },
  {
    word: '보수월액',
    definition: '건강보험·장기요양보험료 산정의 기초가 되는 월 보수 금액. 근로소득에서 비과세 근로소득을 제외한 과세 급여입니다.',
  },
  {
    word: '업무수행성',
    definition: '산재 인정의 핵심 요건 중 하나로, 재해가 근로계약에 따른 업무 수행 중에 발생했는지를 판단하는 기준입니다.',
  },
  {
    word: '업무기인성',
    definition: '산재 인정의 또 다른 핵심 요건으로, 업무와 재해(부상·질병) 사이에 상당한 인과관계가 있는지를 판단하는 기준입니다.',
  },
  {
    word: '개별실적요율',
    definition: '상시 30인 이상 사업장에 적용되는 산재보험 할인·할증 제도. 과거 3년간 보험급여 지급 실적(수지율)에 따라 일반요율에서 ±20% 범위로 조정됩니다.',
  },
  {
    word: 'IRP (개인형 퇴직연금)',
    definition: '2022년 4월부터 퇴직금은 의무적으로 근로자의 IRP 계좌로 지급됩니다. 은행·증권사 등 금융기관에서 개설할 수 있습니다.',
  },
  {
    word: '연차유급휴가',
    definition: '1년간 80% 이상 출근한 근로자에게 15일의 유급휴가가 주어지며, 3년차부터 매 2년마다 1일이 가산됩니다(최대 25일). 1년 미만 근로자는 1개월 개근 시 1일.',
  },
  {
    word: '두루누리 사회보험',
    definition: '10인 미만 사업장에서 월평균보수 270만 원 미만인 근로자의 국민연금·고용보험료 일부(신규가입자 80%)를 정부가 지원하는 제도입니다.',
  },
];

/* ============================================================
   UI 컴포넌트
   ============================================================ */

function TabButton({ cat, isActive, onClick }: { cat: Category; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-[140px] py-4 px-3 rounded-lg border-2 text-center transition-all ${
        isActive
          ? `${cat.color} ${cat.colorBorder} ${cat.colorText} font-bold shadow-sm`
          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
      }`}
    >
      <span className="text-2xl block mb-1">{cat.emoji}</span>
      <span className="text-sm block">{cat.title}</span>
    </button>
  );
}

function StepCard({ step }: { step: Step }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-lg shrink-0">
          {step.icon}
        </div>
        <div className="w-px flex-1 bg-gray-200 mt-1" />
      </div>
      <div className="pb-8">
        <h3 className="font-bold text-base mb-2">{step.title}</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{step.desc}</p>
        {step.link && (
          <Link
            href={step.link.href}
            className="inline-block mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2"
          >
            {step.link.label}
          </Link>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   메인 페이지
   ============================================================ */
export default function GuidePage() {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].id);
  const activeCat = CATEGORIES.find((c) => c.id === activeTab)!;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-12">
      {/* 헤더 */}
      <section className="text-center">
        <h1 className="text-2xl font-bold mb-2">근로자 가이드</h1>
        <p className="text-gray-600">
          무엇이 궁금하신가요? 상황을 선택하면 단계별로 안내해 드립니다.
        </p>
      </section>

      {/* 카테고리 탭 */}
      <section className="flex gap-3 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <TabButton
            key={cat.id}
            cat={cat}
            isActive={activeTab === cat.id}
            onClick={() => setActiveTab(cat.id)}
          />
        ))}
      </section>

      {/* 선택된 카테고리 콘텐츠 */}
      <section className={`${activeCat.color} ${activeCat.colorBorder} border rounded-xl p-6`}>
        <div className="mb-6">
          <h2 className={`text-xl font-bold ${activeCat.colorText}`}>
            {activeCat.emoji} {activeCat.title}
          </h2>
          <p className="text-sm text-gray-600 mt-1">{activeCat.subtitle}</p>
        </div>
        <div>
          {activeCat.steps.map((step, i) => (
            <StepCard key={i} step={step} />
          ))}
        </div>
      </section>

      {/* 전체 계산기 목록 */}
      <section>
        <h2 className="text-lg font-bold mb-4">전체 계산기 한눈에 보기</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: '산재 자가진단',    href: '/calc/self-diagnosis',       emoji: '🔍' },
            { label: '휴업급여',         href: '/calc/sick-leave-pay',       emoji: '💰' },
            { label: '장해급여',         href: '/calc/disability-pay',       emoji: '🦴' },
            { label: '유족급여·장의비',  href: '/calc/survivor-pay',         emoji: '🕊️' },
            { label: '과로 위험도',      href: '/calc/overwork-risk',        emoji: '⏰' },
            { label: '평균임금',         href: '/calc/average-wage',         emoji: '📊' },
            { label: '퇴직금',           href: '/calc/retirement-pay',       emoji: '🧮' },
            { label: '연차수당',         href: '/calc/annual-leave-pay',     emoji: '🏖️' },
            { label: '부당해고 보상금',  href: '/calc/unfair-dismissal-pay', emoji: '⚖️' },
            { label: '4대보험료',        href: '/calc/four-insurance',       emoji: '🏛️' },
            { label: '산재보험료',       href: '/calc/injury-insurance-fee', emoji: '🦺' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 용어 사전 */}
      <section>
        <h2 className="text-lg font-bold mb-4">용어 사전</h2>
        <p className="text-sm text-gray-600 mb-4">
          계산기에서 자주 등장하는 핵심 용어를 정리했습니다.
        </p>
        <div className="space-y-3">
          {GLOSSARY.map((term) => (
            <details key={term.word} className="group bg-white border rounded-lg">
              <summary className="cursor-pointer px-4 py-3 font-semibold text-sm flex justify-between items-center list-none">
                {term.word}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-4 pb-3 text-sm text-gray-700 leading-relaxed">
                {term.definition}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 도움이 필요할 때 */}
      <section className="bg-gray-50 border rounded-xl p-6">
        <h2 className="text-lg font-bold mb-3">더 정확한 도움이 필요하다면</h2>
        <div className="space-y-3 text-sm text-gray-700">
          {[
            {
              icon: '📞',
              title: '근로복지공단 (산재보상)',
              contact: '☎ 1588-0075',
              href: 'https://total.comwel.or.kr',
              linkLabel: 'One-Click 산재상담',
            },
            {
              icon: '📞',
              title: '고용노동부 (퇴직금·임금·해고)',
              contact: '☎ 1350',
              href: 'https://www.moel.go.kr',
              linkLabel: '고용노동부 홈페이지',
            },
            {
              icon: '📞',
              title: '4대사회보험 정보연계센터',
              contact: '☎ 1588-0083',
              href: 'https://www.4insure.or.kr',
              linkLabel: '4대보험 포털',
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 items-start">
              <span className="text-lg">{item.icon}</span>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p>
                  {item.contact} |{' '}
                  <a href={item.href} target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 underline">{item.linkLabel}</a>
                </p>
              </div>
            </div>
          ))}
          <div className="flex gap-3 items-start">
            <span className="text-lg">👤</span>
            <div>
              <p className="font-semibold">공인노무사 상담</p>
              <p>계산 결과를 가지고 전문 노무사에게 상담하면 더 정확한 판단을 받을 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 하단 안내 */}
      <section className="text-sm text-gray-500 border-t pt-6 text-center">
        <p>
          본 가이드는 2026년 기준 관련 법령을 기반으로 작성된 참고 자료이며, 법률 자문이 아닙니다.
          <br />
          정확한 판단은 전문 노무사 또는 관련 기관에 상담하세요.
        </p>
      </section>
    </div>
  );
}
