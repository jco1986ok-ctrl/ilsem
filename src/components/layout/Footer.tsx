import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-gray-700">일셈</p>
            <p className="text-xs text-gray-500 mt-1">근로자를 위한 무료 계산기 서비스</p>
          </div>

          <nav className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">홈</Link>
            <Link href="/calc/average-wage" className="hover:text-blue-600 transition-colors">계산기</Link>
            <Link href="/report" className="hover:text-blue-600 transition-colors">종합리포트</Link>
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">개인정보처리방침</Link>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            © {currentYear} 일셈. 본 서비스의 계산 결과는 참고용이며, 법적 효력이 없습니다.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            정확한 판단을 위해 전문가에게 문의하시기 바랍니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
