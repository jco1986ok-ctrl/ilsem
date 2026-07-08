import Link from 'next/link';

export default function CalcCTA() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg">📊 종합 리포트 받아보기</h3>
          <p className="text-blue-100 text-sm mt-1">
            여러 계산기 결과를 한 번에 모아 종합 리포트로 확인하세요.
          </p>
        </div>
        <Link
          href="/report"
          className="shrink-0 bg-white text-blue-600 font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-sm"
        >
          리포트 보기
        </Link>
      </div>
    </div>
  );
}
