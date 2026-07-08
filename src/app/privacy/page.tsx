import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 일셈',
  description: '일셈은 사용자의 개인정보를 수집·저장하지 않습니다.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[#1E293B] mb-2">개인정보처리방침</h1>
      <p className="text-slate-500 text-sm mb-10">최종 수정일: 2025년 1월 1일</p>

      {/* 핵심 요약 */}
      <div className="bg-[#16A34A]/10 border border-[#16A34A]/30 rounded-xl p-6 mb-10">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="font-bold text-[#16A34A] text-base mb-1">개인정보를 수집하지 않습니다</p>
            <p className="text-sm text-[#475569] leading-relaxed">
              일셈은 사용자의 개인정보를 <strong>수집·저장하지 않습니다</strong>.
              모든 계산은 사용자의 브라우저에서 처리되며, 서버로 전송되지 않습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-10 text-sm text-[#475569] leading-relaxed">

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E293B]">제1조 (목적)</h2>
          <p>
            일셈(이하 "서비스")은 이용자의 개인정보를 매우 중요하게 생각합니다.
            본 방침은 서비스가 개인정보를 처리하는 방식에 대해 안내합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E293B]">제2조 (수집하는 개인정보)</h2>
          <p>
            서비스는 계산기 이용을 위한 어떠한 개인정보도 서버에 수집·저장하지 않습니다.
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>계산기 입력값(임금, 근무기간 등)은 이용자의 브라우저 내에서만 처리됩니다.</li>
            <li>입력값은 서버로 전송되지 않으며, 서버에 저장되지 않습니다.</li>
            <li>이용자가 직접 삭제할 수 있는 브라우저 로컬스토리지에 계산 결과가 임시 저장될 수 있습니다.</li>
            <li>서비스 개선을 위한 익명 방문 통계(페이지 URL, 방문 시간 등)는 Google Analytics 등을 통해 수집될 수 있습니다.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E293B]">제3조 (쿠키 및 유사 기술)</h2>
          <p>
            서비스는 방문 통계 수집을 위해 쿠키를 사용할 수 있습니다.
            이용자는 브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수 있으며,
            이 경우 일부 서비스 기능 이용이 제한될 수 있습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E293B]">제4조 (로컬스토리지 데이터)</h2>
          <p>
            계산 결과는 다른 계산기에서 불러오는 편의 기능을 위해 이용자의 브라우저 로컬스토리지에
            저장될 수 있습니다. 이 데이터는 서버로 전송되지 않으며, 이용자가 언제든지
            브라우저 설정 또는 서비스 내 초기화 기능으로 삭제할 수 있습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E293B]">제5조 (제3자 제공)</h2>
          <p>
            서비스는 수집된 정보를 제3자에게 제공하지 않습니다.
            단, 법령에 의해 요구되는 경우는 예외로 합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E293B]">제6조 (이용자의 권리)</h2>
          <p>
            이용자는 언제든지 브라우저 설정을 통해 로컬스토리지에 저장된 데이터를 삭제할 수 있습니다.
            개인정보와 관련된 문의는 아래 연락처로 문의해 주시기 바랍니다.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 text-sm">
            <p className="font-medium text-[#1E293B]">개인정보 관련 문의</p>
            <p className="mt-1">이메일: <a href="mailto:contact@ilsem.kr" className="text-[#2563EB] hover:underline">contact@ilsem.kr</a></p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E293B]">부칙</h2>
          <p>본 방침은 2025년 1월 1일부터 시행됩니다.</p>
        </section>
      </div>
    </div>
  );
}
