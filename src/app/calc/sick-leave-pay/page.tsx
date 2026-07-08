import type { Metadata } from 'next';
import SickLeavePayCalculator from '@/components/calculators/SickLeavePayCalculator';

export const metadata: Metadata = {
  title: '산재 휴업급여 계산기 | 일셈',
  description:
    '산재로 일을 못하는 동안 받을 수 있는 휴업급여를 계산해보세요. 평균임금의 70% 기준, 저소득 근로자 보호, 고령자 감액까지 2025년 최신 법령을 반영한 정확한 계산기입니다.',
  keywords: [
    '산재 휴업급여 계산기',
    '휴업급여 계산',
    '산재보험 휴업급여',
    '평균임금 70%',
    '최저보상기준금액',
    '최고보상기준금액',
    '고령자 감액',
    '산재 요양급여',
  ],
};

export default function SickLeavePayPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🏥</span>
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">산재 휴업급여 계산기</h1>
            <p className="text-slate-500 mt-0.5 text-sm">
              산재보험법 제52조 기준 · 2025년 최저·최고 보상기준금액 자동 반영
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {['평균임금 × 70%', '최저·최고 보상기준금액', '고령자 감액', '2025년 기준'].map((tag) => (
            <span
              key={tag}
              className="text-xs bg-blue-50 text-[#2563EB] border border-blue-200 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <SickLeavePayCalculator />

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <article className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6 text-sm text-gray-700 leading-relaxed">
      <h2 className="text-xl font-bold text-gray-900">휴업급여란? — 산재보험법 제52조 완전 해설</h2>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">1. 휴업급여의 정의</h3>
        <p>
          <strong>휴업급여</strong>는 업무상 재해를 당한 근로자가 요양(치료)으로 인해 취업하지 못하는 기간 동안 생계를 보장하기 위해 지급하는 산재보험 급여입니다.
          근로자가 병원에서 치료를 받는 동안 일을 하지 못해 임금을 받지 못할 때, 그 손실을 보전해 주는 역할을 합니다.
        </p>
        <p>
          산업재해보상보험법 제52조에 따라, 업무상 재해로 요양 중인 근로자에게는 취업하지 못한 날에 대하여 <strong>1일 평균임금의 70%</strong>를 휴업급여로 지급합니다.
          다만, 최저·최고 보상기준금액 제도와 고령자 감액 제도가 있어 실제 수령액은 달라질 수 있습니다.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">2. 휴업급여 지급 요건</h3>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>업무상 재해(사고 또는 질병)로 근로복지공단으로부터 요양 승인을 받은 경우</li>
          <li>요양으로 인해 취업하지 못한 날이 <strong>4일 이상</strong>인 경우 (1~3일은 사업주 부담)</li>
          <li>근로자가 실제로 취업하지 못한 날에 한하여 지급 (부분 취업 시 별도 계산)</li>
          <li>요양 종결 전까지 지급 원칙 (요양 2년 후 미치유 시 상병보상연금으로 전환 가능)</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="font-bold text-gray-900">3. 휴업급여 계산 방법</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
          <p className="font-semibold text-blue-900">기본 계산식</p>
          <p className="font-mono text-blue-800 bg-white border border-blue-100 rounded-lg px-4 py-2">
            1일 휴업급여 = 1일 평균임금 × 70%
          </p>
          <p className="font-mono text-blue-800 bg-white border border-blue-100 rounded-lg px-4 py-2">
            총 휴업급여 = 1일 휴업급여 × 요양 일수
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-gray-900">최저 보상 기준 (하한선)</p>
          <p>
            1일 평균임금의 70%가 <strong>최저보상기준금액의 80% 미만</strong>인 경우에는 최저보상기준금액의 80%를 지급합니다.
            2025년 기준 최저보상기준금액은 80,240원(최저시급 10,030원 × 8시간)이므로, 하한선은 <strong>64,192원(80,240원 × 80%)</strong>입니다.
            평균임금이 낮은 저소득 근로자를 보호하기 위한 규정입니다.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-gray-900">최고 보상 기준 (상한선)</p>
          <p>
            1일 휴업급여가 <strong>최고보상기준금액(258,132원)</strong>을 초과할 수 없습니다.
            고소득 근로자의 경우 평균임금의 70%가 상한선을 초과하더라도 258,132원만 지급됩니다.
            최고보상기준금액은 고용노동부 고시로 매년 변경되므로 해당 연도 기준을 확인해야 합니다.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="font-bold text-gray-900">4. 고령자 감액 제도 (산재보험법 별표1)</h3>
        <p>
          요양 중인 근로자가 <strong>만 61세 이상</strong>이 되면, 재해일로부터 2년이 경과한 시점부터 휴업급여가 감액됩니다.
          이는 65세 이상의 근로자는 취업 가능성이 낮아 소득 손실이 상대적으로 적다는 점을 반영한 규정입니다.
          단, 재해일로부터 <strong>2년간은 유예</strong>되어 감액이 적용되지 않습니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">연령</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 border-b border-gray-200">70% 수급자 감액률</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 border-b border-gray-200">최저기준 80% 수급자 감액률</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { age: '61세', r70: '66/70 (94.3%)', r90: '86/90 (95.6%)' },
                { age: '62세', r70: '62/70 (88.6%)', r90: '82/90 (91.1%)' },
                { age: '63세', r70: '58/70 (82.9%)', r90: '78/90 (86.7%)' },
                { age: '64세', r70: '54/70 (77.1%)', r90: '74/90 (82.2%)' },
                { age: '65세 이상', r70: '50/70 (71.4%)', r90: '70/90 (77.8%)' },
              ].map((row) => (
                <tr key={row.age}>
                  <td className="px-3 py-2 font-medium text-gray-700">{row.age}</td>
                  <td className="px-3 py-2 text-center text-gray-600">{row.r70}</td>
                  <td className="px-3 py-2 text-center text-gray-600">{row.r90}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500">※ 재해일로부터 2년간은 유예, 2년 경과 후부터 감액 적용</p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">5. 평균임금이란?</h3>
        <p>
          휴업급여 계산의 기초가 되는 <strong>평균임금</strong>은 사유 발생일(재해 발생일) 이전 3개월간 지급된 임금 총액을 그 기간의 총일수로 나눈 금액입니다.
          3개월간 총임금에는 기본급 외에도 연장·야간·휴일 수당, 상여금(3개월분 해당액), 각종 수당이 포함됩니다.
          단, 개인적 사유로 인한 결근일의 임금은 분자(임금총액)에서만 제외되고 분모(총일수)는 줄어들지 않습니다.
        </p>
        <p>
          만약 평균임금이 통상임금보다 적을 경우에는 통상임금을 평균임금으로 사용합니다.
          또한 근무기간이 3개월 미만인 경우에는 실제 재직 기간을 기준으로 계산하며, 일용직 근로자는 별도 규정을 적용합니다.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">6. 부분 휴업급여 (부분 취업 시)</h3>
        <p>
          요양 중에 부분적으로 취업하게 된 경우(의사 소견에 따른 경미한 업무 복귀 등), 취업한 날의 임금과 휴업급여 지급 기준 임금의 차액에 <strong>90%를 곱한 금액</strong>을 지급합니다.
          단, 이 금액이 1일 휴업급여액보다 적으면 1일 휴업급여액을 지급합니다.
          이는 부분 취업을 유도하면서도 근로자의 생계를 보호하기 위한 규정입니다.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">7. 상병보상연금 전환</h3>
        <p>
          요양 개시 후 <strong>2년이 경과</strong>하였는데도 부상 또는 질병이 치유되지 않고, 폐질(장해) 등급이 제1급~제3급에 해당하는 경우 상병보상연금으로 전환됩니다.
          상병보상연금으로 전환되면 휴업급여는 지급이 중지되며, 장기 요양자의 생활 안정을 위해 더 높은 수준의 보상이 이루어집니다.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">8. 2025년 보상기준금액 기준</h3>
        <ul className="list-disc list-inside space-y-1.5 pl-2">
          <li>2025년 최저시급: 10,030원</li>
          <li>1일 최저보상기준금액: 80,240원 (10,030원 × 8시간)</li>
          <li>1일 최저 휴업급여 하한: 64,192원 (80,240원 × 80%)</li>
          <li>1일 최고보상기준금액: 258,132원</li>
          <li>보상기준금액은 매년 1월 고용노동부 고시로 개정됩니다.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">9. 자주 묻는 질문</h3>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-gray-800">Q. 사고 다음 날부터 바로 휴업급여를 받을 수 있나요?</p>
            <p className="text-gray-600 mt-1">
              아닙니다. 재해 발생 후 <strong>처음 3일(1~3일차)은 사업주가 부담</strong>하며, 4일째부터 근로복지공단의 휴업급여가 지급됩니다.
              다만, 사업주가 3일분을 지급하지 않는 경우 공단에 이의를 제기할 수 있습니다.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Q. 요양 중에 아르바이트를 하면 휴업급여가 줄어드나요?</p>
            <p className="text-gray-600 mt-1">
              네. 요양 중 취업한 날에는 통상 휴업급여 대신 부분 휴업급여(차액의 90%)가 지급됩니다.
              무단으로 다른 업무를 하면 급여 지급이 중단되거나 환수될 수 있습니다.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Q. 프리랜서나 특수고용직도 휴업급여를 받을 수 있나요?</p>
            <p className="text-gray-600 mt-1">
              산재보험 특례(제125조)에 따라 보험설계사, 대리운전기사, 플랫폼 노동자 등 일부 특수고용직은 산재보험에 가입되어 있는 경우 휴업급여를 받을 수 있습니다.
              가입 여부는 근로복지공단에 확인하세요.
            </p>
          </div>
        </div>
      </section>

      <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
        ※ 본 계산기는 2025년 기준 산재보험법 제52조 및 고용노동부 고시 금액을 기반으로 제공되며, 참고용입니다.
        정확한 급여액 및 수급 여부는 근로복지공단(1588-0075) 또는 전문 노무사와 상담하세요.
      </p>
    </article>
  );
}
