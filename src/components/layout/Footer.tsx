import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 메인 푸터 영역 */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
          {/* 로고 */}
          <div>
            <p className="text-white text-lg font-bold">일셈</p>
            <p className="text-sm text-slate-500 mt-1">근로자를 위한 계산기</p>
          </div>

          {/* 링크 */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/terms" className="hover:text-white transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              개인정보처리방침
            </Link>
            <a href="mailto:contact@ilsem.kr" className="hover:text-white transition-colors">
              문의하기
            </a>
          </nav>

          {/* 저작권 */}
          <p className="text-sm text-slate-500">© 2025 일셈. All rights reserved.</p>
        </div>

        {/* 하단 안내 */}
        <div className="border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-500 leading-relaxed">
            일셈은 법률 자문 서비스가 아닙니다. 정확한 판단은 전문 노무사와 상담하세요.
            본 서비스의 계산 결과는 참고용이며, 실제 지급액과 다를 수 있습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
