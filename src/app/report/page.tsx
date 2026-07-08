import type { Metadata } from 'next';
import Link from 'next/link';
import { calculatorList } from '@/lib/constants/calculatorList';

export const metadata: Metadata = {
  title: '종합 리포트',
  description: '여러 계산기 결과를 한 번에 모아볼 수 있는 종합 리포트입니다.',
};

export default function ReportPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">📊</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">종합 리포트</h1>
        <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
          각 계산기에서 계산한 결과를 한 곳에서 모아볼 수 있는 종합 리포트입니다.
          계산기를 먼저 사용해보세요.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center mb-8">
        <div className="text-4xl mb-4">🔧</div>
        <h2 className="text-xl font-bold text-blue-800 mb-2">준비 중입니다</h2>
        <p className="text-blue-600 text-sm leading-relaxed max-w-md mx-auto">
          종합 리포트 기능을 개발 중입니다.<br />
          빠른 시일 내에 서비스를 제공할 예정입니다.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-white border border-blue-200 rounded-full px-4 py-2 text-xs text-blue-600 font-medium">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          개발 진행 중
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">먼저 계산기를 사용해보세요</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {calculatorList.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm text-gray-700 hover:text-blue-600"
            >
              <span>{calc.emoji}</span>
              <span className="font-medium truncate">{calc.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
