import CalcCTA from './CalcCTA';

interface CalcPlaceholderProps {
  title: string;
  description: string;
  emoji: string;
}

export default function CalcForm({ title, description, emoji }: CalcPlaceholderProps) {
  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-start gap-4">
        <span className="text-4xl">{emoji}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 mt-1">{description}</p>
        </div>
      </div>

      {/* 준비 중 카드 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
        <div className="text-5xl mb-4">🔧</div>
        <h2 className="text-xl font-bold text-blue-800 mb-2">준비 중입니다</h2>
        <p className="text-blue-600 text-sm leading-relaxed max-w-md mx-auto">
          현재 {title}를 개발 중입니다.<br />
          빠른 시일 내에 서비스를 제공할 예정입니다.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 bg-white border border-blue-200 rounded-full px-4 py-2 text-xs text-blue-600 font-medium">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          개발 진행 중
        </div>
      </div>

      {/* 임시 폼 골격 */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 opacity-40 pointer-events-none select-none">
        <h3 className="text-base font-semibold text-gray-700">입력 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-100 rounded-lg border border-gray-200"></div>
            </div>
          ))}
        </div>
        <div className="h-11 bg-blue-200 rounded-lg"></div>
      </div>

      <CalcCTA />
    </div>
  );
}
