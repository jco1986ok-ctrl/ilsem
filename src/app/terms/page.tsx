import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이용약관 | 일셈',
  description: '일셈 서비스 이용약관입니다.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-[#1E293B] mb-2">이용약관</h1>
      <p className="text-slate-500 text-sm mb-10">최종 수정일: 2025년 1월 1일</p>

      <div className="space-y-10 text-sm text-[#475569] leading-relaxed">

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E293B]">제1조 (목적)</h2>
          <p>
            본 약관은 일셈(이하 "서비스")이 제공하는 온라인 계산기 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E293B]">제2조 (서비스의 성격 및 면책 조항)</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-2">
            <p className="font-semibold text-amber-800">⚠️ 중요 안내</p>
            <p className="text-amber-700">
              본 서비스의 계산 결과는 <strong>참고용</strong>이며, 법적 효력이 없습니다.
              정확한 보상금 산정은 근로복지공단 또는 전문 노무사와 상담하시기 바랍니다.
            </p>
          </div>
          <p>
            일셈은 근로기준법, 산업재해보상보험법 등 관련 법령을 기반으로 계산 로직을 구성하고 있으나,
            개인의 구체적인 사정, 법령의 해석 차이, 법령 개정 등에 따라 실제 지급액과 다를 수 있습니다.
          </p>
          <p>
            서비스는 법률 자문, 노무 자문, 의학적 조언을 제공하지 않습니다.
            계산 결과를 법적 근거로 사용하거나, 중요한 법적·재정적 결정의 유일한 근거로 삼지 마십시오.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E293B]">제3조 (서비스 제공 및 변경)</h2>
          <p>
            서비스는 최신 법령 기준을 반영하기 위해 계산 로직을 수시로 업데이트합니다.
            서비스의 내용, 기능은 사전 고지 없이 변경될 수 있습니다.
          </p>
          <p>
            서비스는 천재지변, 서버 장애, 기술적 문제 등의 사유로 일시 중단될 수 있으며,
            이로 인한 손해에 대해 서비스는 책임을 지지 않습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E293B]">제4조 (개인정보)</h2>
          <p>
            서비스는 이용자의 개인정보를 서버에 수집·저장하지 않습니다.
            계산기에 입력한 모든 정보는 이용자의 브라우저 내에서만 처리됩니다.
            자세한 내용은 <a href="/privacy" className="text-[#2563EB] hover:underline">개인정보처리방침</a>을 참조하십시오.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E293B]">제5조 (지식재산권)</h2>
          <p>
            서비스의 콘텐츠, 디자인, 계산 로직 등에 관한 지식재산권은 서비스 운영자에게 귀속됩니다.
            이용자는 서비스의 내용을 상업적 목적으로 무단 복제·배포·수정할 수 없습니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E293B]">제6조 (준거법 및 관할)</h2>
          <p>
            본 약관의 해석 및 분쟁 해결에 관하여는 대한민국 법률을 준거법으로 합니다.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1E293B]">부칙</h2>
          <p>본 약관은 2025년 1월 1일부터 시행됩니다.</p>
        </section>
      </div>
    </div>
  );
}
