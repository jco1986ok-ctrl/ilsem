import type { Metadata } from 'next';
import InjuryInsuranceFeeCalculator from '@/components/calculators/InjuryInsuranceFeeCalculator';

export const metadata: Metadata = {
  title: '산재보험료 계산기 2026 | 업종별 요율 자동 적용 | 일셈',
  description:
    '2026년 고용노동부 고시 업종별 산재보험료율을 자동 적용하여 산재보험료를 계산합니다. 월평균 보수 입력만으로 업종요율, 출퇴근재해요율, 임금채권부담금, 석면분담금까지 한 번에 확인하세요.',
  keywords: [
    '산재보험료 계산기', '산재보험료율 2026', '업종별 산재보험료',
    '출퇴근재해요율', '건설업 산재보험료', '산재보험 사업주 부담',
    '임금채권부담금', '석면피해구제분담금', '산재보험료 자동계산',
  ],
};

/* ─────────────────────────────────────
   SEO 콘텐츠
───────────────────────────────────── */
function SeoContent() {
  return (
    <article className="mt-8 text-sm leading-7 text-slate-600 space-y-6">
      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">산재보험료란? — 보험료징수법 완전 해설</h2>
        <p>
          산재보험료는 「고용보험 및 산업재해보상보험의 보험료징수 등에 관한 법률」 제13조~제14조에 따라
          <strong> 사업주가 전액 부담</strong>하는 보험료입니다.
          근로자의 업무상 재해(사고·질병)에 대한 보상 재원으로 사용됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">산재보험료 구성 4가지</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium text-[#1E293B] mb-4">
          산재보험료 = 보수총액 × (업종별 요율 + 출퇴근재해 0.6‰ + 임금채권부담금 0.9‰ + 석면분담금 0.06‰) ÷ 1,000
        </div>
        <ul className="space-y-3">
          <li>
            <strong>① 업종별 산재보험료율</strong>: 사업 종류에 따라 5‰(금융업) ~ 185‰(석탄광업) 차등 적용.
            업종별 재해 발생 위험도를 반영하며, 28개 업종으로 분류됩니다.
          </li>
          <li>
            <strong>② 출퇴근재해 요율</strong>: 전 업종 동일 <strong>0.6‰</strong>.
            통상적인 경로와 방법으로 출퇴근하는 중 발생한 재해에 대한 보상 재원입니다.
          </li>
          <li>
            <strong>③ 임금채권부담금</strong>: <strong>0.9‰</strong> (2026년, 전년 0.6‰에서 인상).
            사업주 도산 시 근로자의 체불임금을 보장하기 위한 기금입니다.
            국가·지방자치단체 사업은 면제됩니다.
          </li>
          <li>
            <strong>④ 석면피해구제분담금</strong>: <strong>0.06‰</strong> (10만분의 6).
            석면 관련 건강피해 구제를 위한 분담금입니다. 상시 20인 미만 사업장은 면제됩니다.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">보수총액이란?</h2>
        <p>
          보수총액은 해당 사업에서 사용하는 모든 근로자에게 지급하는 보수의 총액입니다.
          보수란 소득세법상 근로소득에서 <strong>비과세 근로소득을 제외</strong>한 금액을 말합니다.
          식대보조금, 차량유지비 등 비과세 항목은 제외하고 계산합니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">건설업 특례</h2>
        <p>
          건설업은 근로자 수와 임금을 사전에 확정하기 어려우므로,
          총공사금액에 <strong>노무비율</strong>을 곱해 보수총액을 추정합니다.
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>일반 건설공사: 총공사금액 × <strong>27%</strong></li>
          <li>하도급 공사: 하도급금액 × <strong>29%</strong></li>
        </ul>
        <p className="mt-2 text-slate-500">
          이 추정 보수총액에 보험요율을 적용하여 개산보험료를 산정하고, 완공 후 확정 정산합니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">개별실적요율 (참고)</h2>
        <p>
          상시 <strong>30인 이상</strong> 사업장(건설업은 일정 규모 이상)은
          과거 3년간의 산재보험 급여 지급 실적에 따라
          일반요율에서 <strong>±20% 범위</strong> 내에서 할인 또는 할증됩니다.
          이를 개별실적요율이라 하며, 본 계산기에서는 일반요율 기준으로 계산합니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">2026년 주요 변경사항</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>평균 산재보험료율: <strong>1.47%</strong> (3년 연속 동결)</li>
          <li>임금채권부담금: 0.6‰ → <strong>0.9‰</strong> (50% 인상)</li>
          <li>건설업 하도급 노무비율: 30% → <strong>29%</strong> (인하)</li>
          <li>석면피해구제분담금: 0.06‰ (유지)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">자주 묻는 질문</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold text-slate-700">Q. 산재보험료는 사업주만 내나요?</dt>
            <dd className="mt-1 text-slate-500">
              네. 산재보험료는 전액 사업주가 부담합니다. 국민연금·건강보험·고용보험과 달리 근로자 부담분이 없습니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 프리랜서(특수형태근로종사자)도 산재보험료를 내나요?</dt>
            <dd className="mt-1 text-slate-500">
              특수형태근로종사자(보험설계사, 대리운전기사, 배달라이더 등)는 산재보험 특례 적용 대상이며,
              보험료의 <strong>50%를 사업주가, 50%를 종사자가 부담</strong>합니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 개별실적요율은 어떻게 확인하나요?</dt>
            <dd className="mt-1 text-slate-500">
              근로복지공단 토탈서비스(total.comwel.or.kr)에서 사업장별 적용 요율을 조회할 수 있습니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 건설업에서 원도급과 하도급 구분은?</dt>
            <dd className="mt-1 text-slate-500">
              원도급(발주자와 직접 계약)은 일반 건설공사(노무비율 27%),
              하도급(원도급자로부터 재하도급받은 경우)은 하도급 노무비율(29%)을 적용합니다.
            </dd>
          </div>
        </dl>
      </section>

      {/* 관련 계산기 */}
      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">관련 계산기</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/calc/sick-leave-pay',  emoji: '🏥', label: '산재 휴업급여 계산기' },
            { href: '/calc/disability-pay',  emoji: '♿', label: '산재 장해급여 계산기' },
            { href: '/calc/survivor-pay',    emoji: '🌿', label: '유족급여·장의비 계산기' },
          ].map(({ href, emoji, label }) => (
            <a key={href} href={href}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50 transition-colors text-sm font-medium text-slate-700">
              <span className="text-lg">{emoji}</span>{label}
            </a>
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-400 border-t border-slate-100 pt-4">
        본 계산기는 2026년 기준 산재보험료징수법 및 고용노동부 고시(제2025-91호)를 기반으로 하며 참고용입니다.
        정확한 보험료 산정은 근로복지공단(☎ 1588-0075)에 문의하세요.&nbsp;
        <a href="https://www.moel.go.kr/info/lawinfo/instruction/view.do?bbs_seq=20251201757"
          target="_blank" rel="noopener noreferrer" className="text-[#2563EB] underline">
          2026년 고용노동부 고시 원문 보기 →
        </a>
      </p>
    </article>
  );
}

/* ─────────────────────────────────────
   페이지
───────────────────────────────────── */
export default function InjuryInsuranceFeePage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-1">산재보험료 계산기</h1>
        <p className="text-slate-500 text-sm">업종별 요율 자동 적용 — 고용노동부 고시 제2025-91호 (2026년 기준)</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['업종별 요율', '출퇴근재해 0.6‰', '임금채권부담금 0.9‰', '건설업 노무비율', '2026년 기준'].map(tag => (
            <span key={tag} className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </div>

      <InjuryInsuranceFeeCalculator />
      <SeoContent />
    </div>
  );
}
