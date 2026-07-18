'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ================================================================
   배너 설정 — 광고 계약이 들어오면 url/text/icon만 채우면 노출됨
   비어있으면 화면에 아예 안 보임
   ================================================================ */
const BANNER_CONFIG = {
  slot1: { url: '', text: '', icon: '' },
  slot2: { url: '', text: '', icon: '' },
};

/* ================================================================
   상황별 계산기 데이터
   ================================================================ */
const SITUATIONS = [
  {
    id: 'injury',
    emoji: '🤕',
    tab: '산재를 당했어요',
    title: '산재를 당했어요',
    desc: '치료비·휴업급여·장해급여까지, 받을 수 있는 보상금을 한눈에 확인하세요.',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    calcs: [
      {
        href: '/calc/self-diagnosis',
        icon: '🩺',
        name: '산재 승인 자가진단',
        desc: '내 상황이 산재로 인정될 수 있을까?',
      },
      {
        href: '/calc/sick-leave-pay',
        icon: '🏥',
        name: '휴업급여 계산기',
        desc: '일 못하는 동안 매달 받는 금액',
        badge: '인기',
      },
      {
        href: '/calc/disability-pay',
        icon: '📋',
        name: '장해급여 계산기',
        desc: '장해등급별 일시금·연금 예상액',
      },
      {
        href: '/calc/survivor-pay',
        icon: '🕊️',
        name: '유족급여 계산기',
        desc: '유족이 받을 수 있는 연금·일시금',
      },
      {
        href: '/calc/overwork-risk',
        icon: '⚠️',
        name: '과로 위험도 체크',
        desc: '최근 근무시간으로 산재 인정 가능성 확인',
      },
    ],
    reportCta: {
      text: '산재 보상금을 한 번에 계산하고 결과를 정리하세요',
    },
  },
  {
    id: 'quit',
    emoji: '📦',
    tab: '퇴직을 앞두고 있어요',
    title: '퇴직을 앞두고 있어요',
    desc: '퇴직금·연차수당·해고예고수당, 놓치는 돈 없이 다 계산하세요.',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    calcs: [
      {
        href: '/calc/retirement-pay',
        icon: '💼',
        name: '퇴직금 계산기',
        desc: '근속연수 기반 예상 퇴직금',
        badge: '인기',
      },
      {
        href: '/calc/annual-leave-pay',
        icon: '🗓️',
        name: '연차수당 계산기',
        desc: '미사용 연차에 대한 수당',
      },
      {
        href: '/calc/unfair-dismissal-pay',
        icon: '⚖️',
        name: '부당해고 보상금',
        desc: '해고예고수당·금전보상금 한 번에',
      },
    ],
    reportCta: {
      text: '퇴직금·연차수당을 한 번에 정리하세요',
    },
  },
  {
    id: 'paycheck',
    emoji: '💰',
    tab: '급여가 제대로인지 모르겠어요',
    title: '급여가 제대로인지 모르겠어요',
    desc: '평균임금·4대보험료를 직접 계산해서 급여명세서와 비교해 보세요.',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    calcs: [
      {
        href: '/calc/average-wage',
        icon: '🧮',
        name: '평균임금 계산기',
        desc: '퇴직금·산재급여의 기준이 되는 금액',
        badge: '필수',
      },
      {
        href: '/calc/four-insurance',
        icon: '🏛️',
        name: '4대보험료 계산기',
        desc: '내 월급에서 빠지는 보험료 확인',
      },
    ],
  },
  {
    id: 'employer',
    emoji: '🏢',
    tab: '사업주예요',
    title: '사업주인데 보험료가 궁금해요',
    desc: '업종별 산재보험료와 4대보험 사업주 부담분을 미리 계산하세요.',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    calcs: [
      {
        href: '/calc/four-insurance',
        icon: '🏛️',
        name: '4대보험료 계산기',
        desc: '사업주 부담분 포함 전체 보험료',
      },
      {
        href: '/calc/injury-insurance-fee',
        icon: '🏗️',
        name: '산재보험료 계산기',
        desc: '업종별 요율 적용 연간 보험료',
      },
    ],
  },
];

/* ================================================================
   컴포넌트: 배너 슬롯
   ================================================================ */
function BannerSlot({
  config,
}: {
  config: { url: string; text: string; icon: string };
}) {
  if (!config.url) return null;
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 print:hidden">
      <a
        href={config.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="block rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors px-4 py-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 flex items-center gap-2">
            <span>{config.icon}</span>
            <span>{config.text}</span>
          </span>
          <span className="text-gray-300 text-xs">›</span>
        </div>
      </a>
    </div>
  );
}

/* ================================================================
   컴포넌트: 체크 아이콘
   ================================================================ */
function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-yellow-300 shrink-0"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* ================================================================
   컴포넌트: 계산기 카드
   ================================================================ */
function CalcCard({
  href,
  icon,
  name,
  desc,
  badge,
}: {
  href: string;
  icon: string;
  name: string;
  desc: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg hover:border-[#2563EB]/30 transition-all duration-200 flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        {badge && (
          <span className="bg-[#F97316] text-white text-xs px-2 py-0.5 rounded-full font-medium">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-base font-bold text-slate-800 group-hover:text-[#2563EB] transition-colors mb-1">
        {name}
      </h3>
      <p className="text-sm text-slate-500 flex-1">{desc}</p>
      <div className="mt-4 flex items-center text-xs font-medium text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">
        계산하기
        <svg
          className="w-3.5 h-3.5 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}

/* ================================================================
   메인 페이지
   ================================================================ */
export default function HomePage() {
  const [activeSituation, setActiveSituation] = useState('injury');
  const currentSituation = SITUATIONS.find((s) => s.id === activeSituation)!;

  return (
    <div className="bg-[#F8FAFC]">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          섹션 1: 히어로
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
          <div className="absolute -top-10 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-[300px] h-[300px] bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 w-full relative">
          <div className="max-w-3xl">
            <span className="inline-block bg-white/15 backdrop-blur text-white text-sm rounded-full px-4 py-1.5 mb-6 font-medium border border-white/20">
              2026년 7월 기준 · 무료 · 회원가입 없음
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.3] mb-6">
              산재 당했을 때, 퇴직할 때,
              <br />
              급여가 이상할 때
              <br />
              <span className="text-yellow-300">받을 수 있는 돈</span>
              <span className="text-white">을 미리 계산하세요</span>
            </h1>

            <div className="space-y-2.5 mb-8">
              {[
                '산재 휴업급여·장해급여 예상 보상금 계산',
                '퇴직금·연차수당 정확한 금액 확인',
                '4대보험료·평균임금으로 내 급여 검증',
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-2.5 text-white/85 text-sm sm:text-base"
                >
                  <CheckIcon />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <p className="text-sm text-white/45 mb-6">
              예: 월급 300만원 · 근속 3년 → 퇴직금 약 910만원
            </p>

            <a
              href="#situations"
              className="inline-flex items-center justify-center bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl px-8 py-4 font-bold text-lg transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:translate-y-[-1px]"
            >
              내 상황에 맞는 계산기 찾기 →
            </a>

            <div className="mt-5 inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur rounded-lg px-4 py-2.5 border border-white/10">
              <svg
                className="w-4 h-4 text-green-300 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-white/80 text-sm">
                회원가입 없이 바로 사용할 수 있어요. 마음껏 계산해 보세요.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          섹션 2: 숫자 하이라이트
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                num: '10종',
                label: '노동·산재 계산기',
                sub: '퇴직금부터 장해급여까지',
              },
              {
                num: '2026년',
                label: '최신 법령 반영',
                sub: '최저임금 10,320원 적용',
              },
              {
                num: '0건',
                label: '서버 저장 데이터',
                sub: '브라우저에서만 계산',
              },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2563EB]">
                  {item.num}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
                  {item.label}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          섹션 3: 이런 걸 계산할 수 있어요
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-white py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-2">
              일셈에서 이런 것들을 알 수 있어요
            </h2>
            <p className="text-slate-400 text-sm">
              월급 300만원, 근속 3년 기준 예시
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                icon: '💼',
                title: '퇴직금',
                amount: '약 910만원',
                formula: '근속연수 × 30일분 평균임금',
                href: '/calc/retirement-pay',
              },
              {
                icon: '🏥',
                title: '휴업급여',
                amount: '월 약 210만원',
                formula: '평균임금 70% × 요양기간',
                href: '/calc/sick-leave-pay',
              },
              {
                icon: '🗓️',
                title: '연차수당',
                amount: '약 120만원',
                formula: '미사용 연차 10일 기준',
                href: '/calc/annual-leave-pay',
              },
              {
                icon: '🏛️',
                title: '4대보험료',
                amount: '월 약 28만원',
                formula: '근로자 부담분 합계',
                href: '/calc/four-insurance',
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group bg-[#F8FAFC] hover:bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-[#2563EB]/30 hover:shadow-lg transition-all duration-200"
              >
                <span className="text-2xl">{item.icon}</span>
                <h3 className="text-sm font-semibold text-slate-600 mt-3 mb-1.5 group-hover:text-[#2563EB] transition-colors">
                  {item.title}
                </h3>
                <div className="text-lg sm:text-xl font-bold text-[#1E293B]">
                  {item.amount}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                  {item.formula}
                </p>
              </Link>
            ))}
          </div>

          <p className="text-center text-[11px] text-slate-400 mt-5">
            * 위 금액은 월급 300만원·근속 3년 가정 시 예시이며, 실제 금액은
            입력값에 따라 달라집니다.
          </p>
        </div>
      </section>

      <BannerSlot config={BANNER_CONFIG.slot1} />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          섹션 4: 어떤 상황이신가요?
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="situations" className="bg-[#F8FAFC] py-14 sm:py-16 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-2">
              어떤 상황이신가요?
            </h2>
            <p className="text-slate-400 text-sm">
              상황을 선택하면 필요한 계산기를 바로 안내해 드립니다
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {SITUATIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSituation(s.id)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeSituation === s.id
                    ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="mr-1.5">{s.emoji}</span>
                {s.tab}
              </button>
            ))}
          </div>

          <div
            className={`${currentSituation.bgColor} ${currentSituation.borderColor} border rounded-2xl p-5 sm:p-6 mb-6`}
          >
            <p className="text-sm text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">
                {currentSituation.emoji} {currentSituation.title}
              </span>{' '}
              — {currentSituation.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSituation.calcs.map((c) => (
              <CalcCard key={c.href + currentSituation.id} {...c} />
            ))}

            {'reportCta' in currentSituation && currentSituation.reportCta && (
              <Link
                href="/report"
                className="group bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-blue-200/60 hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col justify-center"
              >
                <span className="text-2xl mb-2">📊</span>
                <h3 className="text-base font-bold text-[#2563EB] mb-1">
                  종합 리포트 만들기
                </h3>
                <p className="text-sm text-slate-500">
                  {currentSituation.reportCta.text}
                </p>
                <div className="mt-3 flex items-center text-xs font-medium text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">
                  리포트 시작
                  <svg
                    className="w-3.5 h-3.5 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          섹션 5: 왜 일셈인가요?
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-white py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B]">
              왜 일셈인가요?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: '✅',
                iconBg: 'bg-blue-100',
                title: '2026년 7월 기준 법령 반영',
                desc: '최저임금 10,320원, 국민연금 9.5%, 건강보험 7.19%, 산재보험 최고보상기준 268,299원 등 올해 변경된 요율이 모두 반영되어 있습니다.',
              },
              {
                icon: '🔒',
                iconBg: 'bg-green-100',
                title: '입력한 정보, 어디에도 안 갑니다',
                desc: '모든 계산은 사용자의 브라우저에서만 처리됩니다. 회원가입도 없고, 급여 정보가 서버에 저장되거나 전송되지 않습니다.',
              },
              {
                icon: '📋',
                iconBg: 'bg-orange-100',
                title: '노무사 상담 전에 써먹으세요',
                desc: '계산 결과를 종합 리포트로 정리하면 상담 시 바로 활용할 수 있습니다. 예상 금액을 알고 가면 상담이 달라집니다.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#F8FAFC] rounded-2xl p-7 sm:p-8 border border-slate-200"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center text-lg mb-4`}
                >
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-[#1E293B] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BannerSlot config={BANNER_CONFIG.slot2} />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          섹션 6: 아직 잘 모르겠다면
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="bg-[#F8FAFC] py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-[#1E293B] mb-2">
              아직 잘 모르겠다면
            </h2>
            <p className="text-sm text-slate-400">
              계산 전에 이것부터 확인해 보세요
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              {
                icon: '📖',
                title: '산재 신청 절차 가이드',
                desc: '산재 인정 기준부터 신청 방법까지',
                href: '/guide',
              },
              {
                icon: '💼',
                title: '퇴직금 받는 조건',
                desc: '1년 미만도 받을 수 있을까?',
                href: '/guide',
              },
              {
                icon: '📋',
                title: '급여명세서 읽는 법',
                desc: '내 월급에서 빠지는 항목 이해하기',
                href: '/guide',
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group bg-white hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#2563EB]/30 hover:shadow-lg transition-all duration-200 text-center"
              >
                <span className="text-2xl">{item.icon}</span>
                <h3 className="text-sm font-bold text-slate-800 mt-3 mb-1 group-hover:text-[#2563EB] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </Link>
            ))}
          </div>

          <div className="text-center pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-5">
              급여명세서 하나면 준비 끝입니다
            </p>
            <a
              href="#situations"
              className="inline-flex items-center justify-center bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl px-8 py-4 font-bold text-base transition-all duration-200 hover:translate-y-[-1px]"
            >
              계산기 바로가기 →
            </a>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          면책조항
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-slate-400 text-center leading-relaxed">
            일셈은 법률 자문 서비스가 아닙니다. 정확한 판단은 전문 노무사와
            상담하세요.
            <br />본 서비스의 계산 결과는 2026년 7월 기준 참고용이며, 실제
            지급액과 다를 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
