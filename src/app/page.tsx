import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '일셈 — 근로자를 위한 계산기 | 산재보상·퇴직금·연차수당',
  description:
    '산재 휴업급여, 장해급여, 퇴직금, 연차수당, 4대보험료까지. 2025년 최신 법령이 반영된 무료 계산기로 3분 안에 계산하세요.',
  openGraph: {
    title: '일셈 — 근로자를 위한 계산기 | 산재보상·퇴직금·연차수당',
    description:
      '산재 휴업급여, 장해급여, 퇴직금, 연차수당, 4대보험료까지. 2025년 최신 법령이 반영된 무료 계산기로 3분 안에 계산하세요.',
    type: 'website',
    locale: 'ko_KR',
    siteName: '일셈',
  },
};

/* ────────────────────────────────────────
   계산기 데이터
──────────────────────────────────────── */
const industrialCalcs = [
  {
    emoji: '🩺',
    title: '산재 승인 자가진단',
    desc: '내 상황이 산재로 인정될 수 있는지 간단히 확인합니다',
    href: '/calc/self-diagnosis',
    badge: null,
  },
  {
    emoji: '🏥',
    title: '휴업급여 계산기',
    desc: '산재로 쉬는 동안 받을 수 있는 금액 (평균임금의 70%)',
    href: '/calc/sick-leave-pay',
    badge: '인기',
  },
  {
    emoji: '📋',
    title: '장해급여 계산기',
    desc: '장해등급별 일시금 또는 연금 예상 수령액을 계산합니다',
    href: '/calc/disability-pay',
    badge: null,
  },
  {
    emoji: '🕯️',
    title: '유족급여·장의비',
    desc: '유족연금, 일시금, 장의비 예상 금액을 확인합니다',
    href: '/calc/survivor-pay',
    badge: null,
  },
  {
    emoji: '⏰',
    title: '과로 위험도 진단',
    desc: '최근 12주 근무시간으로 과로사 산재 인정 가능성을 진단합니다',
    href: '/calc/overwork-risk',
    badge: null,
  },
  {
    emoji: '🏭',
    title: '산재보험료 계산기',
    desc: '업종별 산재보험료율을 적용한 예상 보험료를 계산합니다',
    href: '/calc/injury-insurance-fee',
    badge: null,
  },
];

const laborCalcs = [
  {
    emoji: '💰',
    title: '평균임금 계산기',
    desc: '퇴직금·산재급여의 기준이 되는 평균임금을 계산합니다',
    href: '/calc/average-wage',
    badge: '인기',
  },
  {
    emoji: '💼',
    title: '퇴직금 계산기',
    desc: '근속연수와 평균임금 기반 예상 퇴직금을 계산합니다',
    href: '/calc/retirement-pay',
    badge: null,
  },
  {
    emoji: '⚖️',
    title: '부당해고 보상금 계산기',
    desc: '해고예고수당·금전보상금을 한 번에 계산합니다',
    href: '/calc/unfair-dismissal-pay',
    badge: 'NEW',
  },
  {
    emoji: '🗓️',
    title: '연차수당 계산기',
    desc: '미사용 연차에 대한 수당을 계산합니다',
    href: '/calc/annual-leave-pay',
    badge: null,
  },
  {
    emoji: '🛡️',
    title: '4대보험료 계산기',
    desc: '국민연금·건강·고용·산재 보험료를 한 번에 계산합니다',
    href: '/calc/four-insurance',
    badge: null,
  },
];

/* ────────────────────────────────────────
   페이지
──────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="bg-[#F8FAFC]">
      {/* ── 섹션 B: 히어로 ── */}
      <section className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] min-h-[480px] flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            {/* 뱃지 */}
            <span className="inline-block bg-white/20 text-white text-sm rounded-full px-4 py-1 mb-6 font-medium">
              2025년 최신 법령 반영
            </span>

            {/* 제목 */}
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              내 보상금,<br />정확히 계산해 보세요
            </h1>

            {/* 서브 */}
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              산재 휴업급여부터 퇴직금까지 — 복잡한 계산을 3분 안에 끝내세요
            </p>

            {/* CTA 버튼 */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <a
                href="#calculators"
                className="inline-flex items-center justify-center bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl px-8 py-4 font-bold text-lg transition-colors duration-200"
              >
                내 보상금 계산하기 →
              </a>
              <Link
                href="/report"
                className="inline-flex items-center justify-center border-2 border-white/40 hover:border-white/70 text-white rounded-xl px-6 py-3 font-medium transition-colors duration-200"
              >
                종합 리포트 보기
              </Link>
            </div>

            {/* 통계 바 */}
            <div className="flex flex-wrap gap-6 text-white/70 text-sm">
              {[
                { label: '계산기 10종' },
                { label: '누적 계산 1,000회+', divider: true },
                { label: '서버 전송 없음', divider: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-6">
                  {item.divider && <span className="border-l border-white/20 h-4" />}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 섹션 C: 3단계 흐름 ── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B]">
              3단계로 끝나는 보상금 계산
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            {[
              { step: 1, emoji: '🔍', title: '계산기 선택', desc: '10가지 계산기 중 필요한 항목을 고르세요' },
              { step: 2, emoji: '✏️', title: '정보 입력', desc: '급여, 근무기간 등 기본 정보만 입력하세요' },
              { step: 3, emoji: '📊', title: '결과 확인', desc: '즉시 계산 결과를 확인하고 PDF로 저장하세요' },
            ].map((item, idx) => (
              <div key={item.step} className="flex flex-col md:flex-row items-center gap-4 flex-1 w-full">
                <div className="flex-1 bg-[#F8FAFC] rounded-2xl p-8 text-center border border-slate-200 w-full">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-full bg-[#2563EB] text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {item.step}
                    </span>
                    <span className="text-3xl">{item.emoji}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1E293B] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="text-2xl text-slate-300 font-bold rotate-90 md:rotate-0 shrink-0">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 섹션 D: 계산기 그리드 ── */}
      <section id="calculators" className="bg-[#F8FAFC] py-20 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B]">
              어떤 계산이 필요하신가요?
            </h2>
          </div>

          {/* 그룹 1: 산재보상 */}
          <div className="mb-12">
            <h3 className="text-lg font-bold text-[#1E293B] mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#2563EB] rounded-full inline-block" />
              산재보상 계산기
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industrialCalcs.map((calc) => (
                <CalcCard key={calc.href} {...calc} />
              ))}
            </div>
          </div>

          {/* 그룹 2: 근로자 필수 */}
          <div>
            <h3 className="text-lg font-bold text-[#1E293B] mb-6 flex items-center gap-2">
              <span className="w-1 h-5 bg-[#2563EB] rounded-full inline-block" />
              근로자 필수 계산기
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {laborCalcs.map((calc) => (
                <CalcCard key={calc.href} {...calc} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 섹션 E: 사용자 유형 ── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B]">
              이런 분들이 사용하고 있습니다
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: '🚑',
                title: '산재를 당했는데 보상금이 얼마인지 모르겠어요',
                desc: '휴업급여, 장해급여 예상 금액을 미리 확인하고 노무사 상담에 활용하세요',
              },
              {
                emoji: '📦',
                title: '퇴직을 앞두고 퇴직금을 확인하고 싶어요',
                desc: '평균임금 기반으로 정확한 퇴직금을 계산해 드립니다',
              },
              {
                emoji: '⚖️',
                title: '노무사 상담 전에 예상 금액을 알고 싶어요',
                desc: '계산 결과를 PDF로 저장해서 상담 시 바로 활용하세요',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#F8FAFC] rounded-2xl p-8 text-center border border-slate-200"
              >
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-base font-bold text-[#1E293B] mb-3 leading-snug">{item.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 섹션 F: 신뢰 요소 ── */}
      <section className="bg-[#F8FAFC] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1E293B]">왜 일셈인가요?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: '✅',
                title: '2025년 최신 법령 반영',
                desc: '최저임금 10,030원, 변경된 장해등급표와 보험료율이 즉시 적용됩니다',
              },
              {
                emoji: '🔒',
                title: '내 브라우저에서만 계산',
                desc: '입력한 정보는 서버로 전송되지 않습니다. 모든 계산은 사용자의 브라우저에서 처리됩니다',
              },
              {
                emoji: '📄',
                title: '노무사 상담 전 필수 준비물',
                desc: '계산 결과를 종합 리포트로 정리해 PDF 저장하면 상담 시 바로 활용할 수 있습니다',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-lg font-bold text-[#1E293B] mb-3">{item.title}</h3>
                <p className="text-sm text-[#475569] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 섹션 G: CTA 배너 ── */}
      <section className="bg-[#F8FAFC] pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-2xl px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                지금 바로 계산해 보세요
              </h2>
              <p className="text-white/80">복잡한 노동법, 일셈이 쉽게 풀어드립니다</p>
            </div>
            <a
              href="#calculators"
              className="shrink-0 inline-flex items-center justify-center bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl px-8 py-4 font-bold text-lg transition-colors duration-200"
            >
              계산기 바로가기 →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ──────────────────────────
   계산기 카드 컴포넌트
────────────────────────── */
interface CalcCardProps {
  emoji: string;
  title: string;
  desc: string;
  href: string;
  badge: string | null;
}

function CalcCard({ emoji, title, desc, href, badge }: CalcCardProps) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-md hover:border-[#2563EB]/30 transition-all duration-200 cursor-pointer flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{emoji}</span>
        {badge && (
          <span className="bg-[#F97316] text-white text-xs px-2 py-0.5 rounded-full font-medium">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-base font-bold text-slate-800 group-hover:text-[#2563EB] transition-colors mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed flex-1">{desc}</p>
      <div className="mt-4 flex items-center text-xs font-medium text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">
        계산하기
        <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
