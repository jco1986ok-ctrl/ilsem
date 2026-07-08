import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '일셈 서비스의 개인정보처리방침입니다.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
      <p className="text-gray-500 text-sm mb-8">최종 수정일: 2025년 1월 1일</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">제1조 (목적)</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            일셈(이하 "서비스")은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다.
            본 방침은 서비스가 이용자로부터 수집하는 개인정보의 항목, 수집 방법, 이용 목적, 보유 기간 및
            이용자의 권리 등에 관한 사항을 안내합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">제2조 (수집하는 개인정보 항목 및 방법)</h2>
          <div className="text-gray-600 leading-relaxed text-sm space-y-2">
            <p>본 서비스는 서버에 어떠한 개인정보도 수집·저장하지 않습니다.</p>
            <p>
              계산기에 입력하는 모든 정보(임금, 근무기간 등)는 이용자의 브라우저 내에서만 처리되며,
              서버로 전송되지 않습니다.
            </p>
            <p>
              단, 서비스 개선을 위한 익명 방문 통계(접속 날짜, 접속 URL 등)는 구글 애널리틱스 등의
              분석 도구를 통해 수집될 수 있습니다.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">제3조 (개인정보의 이용 목적)</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            수집된 정보는 서비스 이용 현황 파악 및 서비스 개선 목적으로만 활용됩니다.
            이 외의 목적으로는 사용하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">제4조 (개인정보의 보유 및 이용 기간)</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            본 서비스는 이용자의 개인정보를 서버에 저장하지 않으므로 별도의 보유 기간이 없습니다.
            브라우저 로컬스토리지에 저장되는 계산 결과는 이용자가 직접 삭제할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">제5조 (이용자의 권리)</h2>
          <div className="text-gray-600 leading-relaxed text-sm space-y-2">
            <p>이용자는 언제든지 브라우저 설정을 통해 로컬스토리지에 저장된 데이터를 삭제할 수 있습니다.</p>
            <p>개인정보와 관련된 문의사항은 아래 연락처로 문의해주시기 바랍니다.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">제6조 (쿠키의 사용)</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            본 서비스는 방문 통계 수집을 위해 쿠키를 사용할 수 있습니다. 이용자는 브라우저 설정을 통해
            쿠키 저장을 거부할 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">제7조 (개인정보 보호책임자)</h2>
          <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-2">개인정보 보호책임자</p>
            <p>서비스명: 일셈</p>
            <p className="mt-1">문의: 서비스 내 문의 기능을 이용해주세요.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">부칙</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            본 방침은 2025년 1월 1일부터 시행됩니다. 방침이 변경될 경우 서비스 공지사항을 통해 안내합니다.
          </p>
        </section>
      </div>
    </div>
  );
}
