import type { Metadata } from 'next';
import Link from 'next/link';
import { calculatorList } from '@/lib/constants/calculatorList';

export const metadata: Metadata = {
  title: '일셈 - 근로자를 위한 계산기',
  description: '산재보상, 퇴직금, 연차수당, 평균임금을 한 곳에서 계산하세요. 근로자를 위한 무료 온라인 계산기 서비스.',
};

const calcDescriptions: Record<string, string> = {
  '/calc/average-wage': '통상임금·평균임금을 기준에 맞게 계산합니다.',
  '/calc/retirement-pay': '근무 기간과 평균임금으로 퇴직금을 산출합니다.',
  '/calc/annual-leave-pay': '발생한 연차일수와 수당을 계산합니다.',
  '/calc/four-insurance': '4대보험(국민연금·건강보험·고용보험·산재보험) 보험료를 계산합니다.',
  '/calc/injury-leave-pay': '산업재해로 인한 휴업 기간의 급여를 계산합니다.',
  '/calc/disability-pay': '산재 장해등급에 따른 보상금을 계산합니다.',
  '/calc/survivor-pay': '유족급여 및 장의비를 계산합니다.',
  '/calc/overwork-risk': '주당 근무시간 기반으로 과로 위험도를 진단합니다.',
  '/calc/injury-insurance-fee': '사업장의 산재보험료를 계산합니다.',
  '/calc/self-diagnosis': '산재 승인 가능성을 자가 진단합니다.',
};

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            일셈
          </h1>
          <p className="text-xl sm:text-2xl font-medium text-blue-100 mb-4">
            근로자를 위한 무료 계산기
          </p>
          <p className="text-base sm:text-lg text-blue-200 max-w-2xl mx-auto leading-relaxed">
            산재보상, 퇴직금, 연차수당, 평균임금을 한 곳에서 계산하세요.
            <br className="hidden sm:block" />
            복잡한 노동법 계산을 쉽고 정확하게.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/calc/average-wage"
              className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors shadow-md"
            >
              계산기 시작하기
            </Link>
            <Link
              href="/report"
              className="inline-block bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-400 transition-colors border border-blue-400"
            >
              종합 리포트 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 계산기 목록 섹션 */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">전체 계산기</h2>
            <p className="text-gray-500 mt-2">필요한 계산기를 선택하세요</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {calculatorList.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="group bg-white border border-gray-200 rounded-xl p-5 sm:p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-200"
              >
                <div className="text-3xl mb-3">{calc.emoji}</div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {calc.label}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {calcDescriptions[calc.href]}
                </p>
                <div className="mt-4 flex items-center text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  계산하기
                  <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
            왜 일셈을 사용하나요?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '✅', title: '정확한 계산', desc: '2025년 최신 법령 기준으로 정확하게 계산합니다.' },
              { icon: '🔒', title: '개인정보 보호', desc: '입력한 정보는 서버에 전송되지 않습니다.' },
              { icon: '📊', title: '종합 리포트', desc: '여러 계산 결과를 한눈에 볼 수 있는 리포트를 제공합니다.' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
