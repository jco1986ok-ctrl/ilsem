import type { Metadata } from 'next';
import AverageWageCalculator from './AverageWageCalculator';

export const metadata: Metadata = {
  title: '평균임금 계산기',
  description:
    '근로기준법 기준으로 1일 평균임금을 정확하게 계산하세요. 퇴직금, 산재보상, 휴업급여 계산의 기초가 되는 평균임금을 쉽게 산출합니다.',
  keywords: ['평균임금 계산기', '1일 평균임금', '평균임금 계산', '퇴직금 기준', '산재 평균임금'],
};

export default function AverageWagePage() {
  return (
    <div className="space-y-12">
      <AverageWageCalculator />
      <SeoContent />
    </div>
  );
}

function SeoContent() {
  return (
    <article className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6 text-sm text-gray-700 leading-relaxed">
      <h2 className="text-xl font-bold text-gray-900">평균임금이란?</h2>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">1. 평균임금의 정의 (근로기준법 제2조)</h3>
        <p>
          <strong>평균임금</strong>이란 이를 산정하여야 할 사유가 발생한 날 이전 3개월 동안에 그 근로자에게
          지급된 임금의 총액을 그 기간의 총일수로 나눈 금액을 말합니다(근로기준법 제2조 제1항 제6호).
          쉽게 말해, 산재 발생일이나 퇴직일 직전 3달 동안 실제로 받은 임금을 그 기간의 달력 일수로 나눈
          하루치 임금입니다.
        </p>
        <p>
          평균임금이 통상임금보다 낮은 경우에는 통상임금을 평균임금으로 합니다. 또한 산출된 평균임금이
          최저임금에 미치지 못할 경우에는 최저임금 기준 금액(2025년 기준 1일 80,240원)을 적용합니다.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">2. 평균임금에 포함되는 임금 항목</h3>
        <p>
          평균임금 산정의 기초가 되는 임금에는 근로의 대가로 사용자가 근로자에게 지급하는 모든 금품이
          포함됩니다. 주요 항목은 다음과 같습니다.
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li><strong>기본급</strong>: 근로계약에 따른 기본 급여</li>
          <li><strong>각종 수당</strong>: 직책수당, 직무수당, 기술수당, 위험수당, 가족수당 등 정기적·일률적으로 지급되는 수당</li>
          <li><strong>상여금</strong>: 단체협약·취업규칙에 따라 지급되는 상여금(단, 3개월 이내에 지급된 경우 3/12 산입)</li>
          <li><strong>연차수당</strong>: 연차 미사용으로 인해 지급된 연차유급휴가 미사용 수당(3/12 산입)</li>
          <li><strong>연장·야간·휴일 근로수당</strong>: 법정 가산임금</li>
          <li><strong>식대·교통비 등</strong>: 근로 제공의 대가로 정기적으로 지급되는 경우</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">3. 평균임금에 포함되지 않는 항목</h3>
        <p>
          아래 항목은 임금의 성격이 없거나 임시로 지급된 것으로, 평균임금 산정 기초에서 제외됩니다.
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li><strong>퇴직금</strong>: 퇴직 시 지급되는 퇴직급여는 임금이 아님</li>
          <li><strong>경조사비</strong>: 결혼축하금, 조의금 등 복리후생 차원의 임시 지급금</li>
          <li><strong>실비변상적 금품</strong>: 업무 수행에 소요된 실제 비용을 변상하는 출장비, 작업용품 등</li>
          <li><strong>임시·일시적 수당</strong>: 특정 사유로 일시적으로 지급된 금품</li>
          <li><strong>재해보상금</strong>: 업무상 재해에 따른 보상금</li>
          <li><strong>주택 제공·숙식 제공</strong>: 현물 급여(단, 취업규칙 등에 의해 금액이 정해진 경우 포함)</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">4. 통상임금과 평균임금의 차이</h3>
        <p>
          평균임금과 통상임금은 이름이 비슷하지만 산정 방식과 용도가 다릅니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 border-b border-gray-200">구분</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 border-b border-gray-200">평균임금</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 border-b border-gray-200">통상임금</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-2.5 font-medium">산정 방식</td>
                <td className="px-4 py-2.5">사유 발생 전 3개월 총임금 ÷ 총일수</td>
                <td className="px-4 py-2.5">소정 근로에 대해 정기적·일률적으로 지급되는 임금</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium">특징</td>
                <td className="px-4 py-2.5">실제 받은 임금 기준, 변동 가능</td>
                <td className="px-4 py-2.5">고정된 임금 항목 기준</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium">주요 용도</td>
                <td className="px-4 py-2.5">퇴직금, 산재보상, 휴업수당</td>
                <td className="px-4 py-2.5">연장·야간·휴일 가산수당, 해고예고수당</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">5. 평균임금이 사용되는 경우</h3>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li><strong>퇴직금</strong>: 1일 평균임금 × 30일 × 근속연수 (근로자퇴직급여보장법)</li>
          <li><strong>산재 휴업급여</strong>: 1일 평균임금의 70% × 휴업일수</li>
          <li><strong>산재 장해급여</strong>: 평균임금 × 장해등급별 지급일수</li>
          <li><strong>산재 유족급여</strong>: 평균임금 × 급여 산정 기간</li>
          <li><strong>휴업수당</strong>: 사용자 귀책으로 휴업 시, 평균임금의 70% 이상 지급</li>
          <li><strong>감급 제재 한도</strong>: 1회 제재 시 평균임금 1일분의 1/2 초과 불가</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-bold text-gray-900">6. 평균임금 계산 시 주의사항</h3>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>
            <strong>3개월의 의미</strong>: 달력상 정확히 3개월 전 같은 날부터 사유 발생일 전날까지입니다.
            월마다 일수가 다르므로 (28~31일) 실제 총일수를 정확히 계산해야 합니다.
          </li>
          <li>
            <strong>수습 기간 제외 가능</strong>: 수습 중인 기간이 3개월 이내이면 수습 시작일을 산정 기간
            기산점으로 합니다.
          </li>
          <li>
            <strong>육아휴직·산전후휴가 기간 제외</strong>: 육아휴직, 업무 외 부상·질병 등으로 임금을
            받지 못한 기간은 산정 기간과 임금 총액에서 제외합니다.
          </li>
          <li>
            <strong>상여금 산입 방법</strong>: 상여금은 사유 발생 전 12개월 내에 지급된 상여금 총액의
            3/12를 산정 기간의 임금에 포함합니다.
          </li>
          <li>
            <strong>최저임금 미달 보호</strong>: 산출된 평균임금이 최저임금 기준보다 낮으면 최저임금 기준
            금액을 적용합니다(2025년 기준 1일 80,240원).
          </li>
          <li>
            <strong>일용근로자</strong>: 일용근로자는 해당 직종의 통상 임금을 기준으로 별도 산정합니다.
          </li>
        </ul>
      </section>

      <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
        ※ 본 계산기는 참고용이며, 정확한 산정을 위해서는 노동청 또는 전문 노무사에게 문의하시기 바랍니다.
        관련 법령: 근로기준법 제2조, 제19조, 근로기준법 시행령 제2조
      </p>
    </article>
  );
}
