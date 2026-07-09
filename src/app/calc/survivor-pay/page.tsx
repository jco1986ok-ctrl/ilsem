import type { Metadata } from 'next';
import SurvivorPayCalculator from '@/components/calculators/SurvivorPayCalculator';

export const metadata: Metadata = {
  title: '산재 유족급여·장의비 계산기 | 일셈',
  description:
    '산재 사망 시 유족보상연금·일시금과 장의비를 계산합니다. 수급자격자 수에 따른 연금 가산, 반액연금+반액일시금 비교, 2026년 장의비 최저·최고 금액 반영.',
  keywords:
    '유족급여 계산기,유족보상연금,유족보상일시금,장의비 계산기,산재 사망 보상금,산재보험법 제62조,산재보험법 제71조,수급자격자',
};

/* ─────────────────────────────────────
   SEO 콘텐츠
───────────────────────────────────── */
function SeoContent() {
  return (
    <div className="prose prose-slate max-w-none mt-8 text-sm leading-7 text-slate-600 space-y-6">
      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">유족급여·장의비란?</h2>
        <p>
          근로자가 <strong>업무상 사유로 사망</strong>하면, 유족에게 <strong>유족급여</strong>가,
          실제 장례를 주관한 자에게 <strong>장의비</strong>가 지급됩니다.
          유족급여는 수급자격자 유무와 선택에 따라 연금 또는 일시금 형태로 지급됩니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">유족급여 지급 유형 (산재보험법 제62조)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-3 py-2 text-left font-semibold border border-slate-200">유형</th>
                <th className="px-3 py-2 text-left font-semibold border border-slate-200">조건</th>
                <th className="px-3 py-2 text-left font-semibold border border-slate-200">지급 내용</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-3 py-2 border border-slate-200 font-medium">유족보상연금 (전액)</td>
                <td className="px-3 py-2 border border-slate-200">수급자격자 있음 + 연금 선택</td>
                <td className="px-3 py-2 border border-slate-200">급여기초연액 × (47% + 수급자격자별 가산)</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-slate-200 font-medium">반액연금 + 반액일시금</td>
                <td className="px-3 py-2 border border-slate-200">수급자격자 있음 + 반액 선택</td>
                <td className="px-3 py-2 border border-slate-200">연금 50% + 평균임금×650일 일시금</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-slate-200 font-medium">유족보상일시금</td>
                <td className="px-3 py-2 border border-slate-200">수급자격자 없음</td>
                <td className="px-3 py-2 border border-slate-200">평균임금 × 1,300일</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">유족보상연금 계산 공식</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>급여기초연액</strong> = 1일 평균임금 × 365일</li>
          <li><strong>연간 연금</strong> = 급여기초연액 × (47% + 가산율)</li>
          <li>수급자격자 1인: +5%, 2인: +10%, 3인: +15%, 4인 이상: +20% (상한)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">수급자격자 기준 (산재보험법 제63조)</h2>
        <p>근로자 사망 당시 생계를 같이하던 유족 중 아래에 해당하는 자:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>배우자 (사실혼 포함, 연령 제한 없음)</li>
          <li>자녀: 25세 미만</li>
          <li>부모: 60세 이상</li>
          <li>손자녀: 25세 미만</li>
          <li>조부모: 60세 이상</li>
          <li>형제자매: 19세 미만 또는 60세 이상</li>
          <li className="text-slate-500">* 연령 미해당이라도 장애인복지법상 중증장애인은 수급자격자 포함</li>
        </ul>
        <p className="mt-2 text-slate-500 text-xs">
          수급 순위: 배우자 → 자녀 → 부모 → 손자녀 → 조부모 → 형제자매 (순위 최우선자만 수급)
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">장의비 (산재보험법 제71조)</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>산정액: 1일 평균임금 × 120일</li>
          <li>최저: <strong>13,943,000원</strong> (2026년 고시)</li>
          <li>최고: <strong>19,279,760원</strong> (2026년 고시)</li>
          <li>산정액이 최저 미만이면 최저 적용, 최고 초과이면 최고 적용</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">자주 묻는 질문</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold text-slate-700">Q. 수급자격자가 여러 명이면 연금을 나눠 받나요?</dt>
            <dd className="mt-1 text-slate-500">
              수급 순위가 가장 높은 1인이 전액 수령합니다. 동 순위자가 여러 명이면 인원수에 따라 가산되지만 지급은 1인 수급자에게 이루어집니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 유족보상연금은 언제까지 받을 수 있나요?</dt>
            <dd className="mt-1 text-slate-500">
              수급자격자 요건을 갖추는 동안 계속 지급됩니다. 배우자의 경우 재혼하면 수급권이 소멸합니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 업무상 사망 인정을 어떻게 받나요?</dt>
            <dd className="mt-1 text-slate-500">
              근로복지공단에 유족급여 청구서를 제출하면 업무상 사망 여부를 심사합니다. 청구 기한은 사망일로부터 <strong>5년</strong>입니다.
            </dd>
          </div>
        </dl>
      </section>

      <p className="text-xs text-slate-400 border-t border-slate-100 pt-4">
        이 계산기는 2026년 고용노동부 고시 기준 참고용입니다. 정확한 급여 산정 및 청구 절차는 근로복지공단(☎ 1588-0075)에 문의하시기 바랍니다.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────
   페이지
───────────────────────────────────── */
export default function SurvivorPayPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-1">유족급여·장의비 계산기</h1>
        <p className="text-slate-500 text-sm">산재 사망 시 유족보상연금·일시금 + 장의비 — 산재보험법 제62조·제71조</p>
      </div>

      <SurvivorPayCalculator />
      <SeoContent />
    </div>
  );
}
