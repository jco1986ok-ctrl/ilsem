import type { Metadata } from 'next';
import DisabilityPayCalculator from '@/components/calculators/DisabilityPayCalculator';

export const metadata: Metadata = {
  title: '산재 장해급여 계산기 | 일셈',
  description: '산재 장해등급에 따른 장해보상연금·일시금을 계산합니다. 1~14급 등급별 보상일수, 2026년 최저·최고 보상기준금액 반영.',
  keywords: '산재 장해급여 계산기,장해보상연금,장해보상일시금,장해등급,산재보험법 제57조,평균임금,노동력상실률',
};

export default function DisabilityPayPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">♿</span>
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">산재 장해급여 계산기</h1>
            <p className="text-slate-500 mt-0.5 text-sm">
              산재보험법 제57조 기준 · 1~14급 전 등급 연금·일시금 동시 계산
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {['장해등급 1~14급', '연금·일시금 선택', '일부연금 비교', '노동력 상실률'].map((tag) => (
            <span
              key={tag}
              className="text-xs bg-blue-50 text-[#2563EB] border border-blue-200 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <DisabilityPayCalculator />

      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <article className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6 text-sm text-gray-700 leading-relaxed">
      <h2 className="text-xl font-bold text-gray-900">장해급여란? — 산재보험법 제57조 완전 해설</h2>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">1. 장해급여의 정의</h3>
        <p>
          <strong>장해급여</strong>는 업무상 재해로 인해 부상·질병이 치유된 후에도 신체에 영구적인 장해가 남는 경우 지급되는
          산재보험 급여입니다. 요양이 종결된 시점부터 지급되며, 장해의 정도에 따라 1급~14급으로 분류됩니다.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="font-bold text-gray-900">2. 등급별 지급 방식</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">등급</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 border-b border-gray-200">지급 방식</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 border-b border-gray-200">연금 지급일수</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 border-b border-gray-200">일시금 지급일수</th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 border-b border-gray-200">상실률</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { grade: '1급', method: '연금만', pension: '329일', lump: '1,474일', loss: '100%' },
                { grade: '2급', method: '연금만', pension: '291일', lump: '1,309일', loss: '100%' },
                { grade: '3급', method: '연금만', pension: '257일', lump: '1,155일', loss: '100%' },
                { grade: '4급', method: '연금/일시금 선택', pension: '224일', lump: '1,012일', loss: '90%' },
                { grade: '5급', method: '연금/일시금 선택', pension: '193일', lump: '869일', loss: '80%' },
                { grade: '6급', method: '연금/일시금 선택', pension: '164일', lump: '737일', loss: '70%' },
                { grade: '7급', method: '연금/일시금 선택', pension: '138일', lump: '616일', loss: '60%' },
                { grade: '8급', method: '일시금만', pension: '—', lump: '495일', loss: '45%' },
                { grade: '9급', method: '일시금만', pension: '—', lump: '385일', loss: '35%' },
                { grade: '10급', method: '일시금만', pension: '—', lump: '297일', loss: '27%' },
                { grade: '11급', method: '일시금만', pension: '—', lump: '220일', loss: '20%' },
                { grade: '12급', method: '일시금만', pension: '—', lump: '154일', loss: '15%' },
                { grade: '13급', method: '일시금만', pension: '—', lump: '99일', loss: '10%' },
                { grade: '14급', method: '일시금만', pension: '—', lump: '55일', loss: '5%' },
              ].map((row) => (
                <tr key={row.grade}>
                  <td className="px-3 py-2 font-medium text-gray-700">{row.grade}</td>
                  <td className="px-3 py-2 text-center text-gray-600">{row.method}</td>
                  <td className="px-3 py-2 text-center text-gray-600">{row.pension}</td>
                  <td className="px-3 py-2 text-center text-gray-600">{row.lump}</td>
                  <td className="px-3 py-2 text-center text-gray-600">{row.loss}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">3. 장해급여 계산 방법</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
          <p className="font-mono text-blue-800 bg-white border border-blue-100 rounded-lg px-4 py-2">
            연간 장해연금 = 1일 평균임금 × 연금 지급일수
          </p>
          <p className="font-mono text-blue-800 bg-white border border-blue-100 rounded-lg px-4 py-2">
            장해일시금 = 1일 평균임금 × 일시금 지급일수
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">4. 일부연금 제도 (4~7급)</h3>
        <p>
          4~7급 수급자는 연금과 일시금 외에 <strong>일부연금</strong>을 선택할 수 있습니다.
          일시금의 50%를 선급(전불)으로 받고, 나머지 50%를 연금으로 수령하는 방식입니다.
          초기에 목돈이 필요한 경우 유용하며, 장기 생존 시에는 연금 전액 수령이 유리합니다.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">5. 장해등급 판정 기준</h3>
        <p>
          장해등급은 근로복지공단의 장해등급 판정 기준에 따라 신체 부위별로 결정됩니다.
          동일 사고로 여러 신체 부위에 장해가 남은 경우 <strong>조합 등급</strong> 또는 <strong>가중 적용</strong> 규정이 적용되어
          단순 합산보다 높은 등급이 인정될 수 있습니다.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">6. 자주 묻는 질문</h3>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-gray-800">Q. 요양 중에도 장해급여를 받을 수 있나요?</p>
            <p className="text-gray-600 mt-1">
              아닙니다. 장해급여는 <strong>요양이 종결된 후</strong>, 즉 치료가 완료되어 더 이상 치료 효과를 기대하기 어려운
              시점(의학적 치유)에서 신청할 수 있습니다.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Q. 연금과 일시금 중 어느 것이 유리한가요?</p>
            <p className="text-gray-600 mt-1">
              일반적으로 장기 생존 시에는 연금이 유리하며, 단기적으로 목돈이 필요한 경우 일시금이 유리합니다.
              기대수명, 현재 재정 상황, 세금 등을 종합적으로 고려해 노무사와 상담하세요.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Q. 장해등급에 불복하려면?</p>
            <p className="text-gray-600 mt-1">
              공단의 장해등급 결정에 이의가 있으면 결정 통지를 받은 날로부터 <strong>90일 이내</strong>에 심사청구를,
              그 결과에도 불복하는 경우 재심사청구를 제기할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
        ※ 본 계산기는 산재보험법 제57조 및 별표를 기반으로 제공되며 참고용입니다.
        정확한 급여액 및 등급 판정은 근로복지공단(1588-0075) 또는 전문 노무사와 상담하세요.
      </p>
    </article>
  );
}
