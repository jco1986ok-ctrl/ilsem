import type { Metadata } from 'next';
import OverworkRiskDiagnosis from '@/components/calculators/OverworkRiskDiagnosis';

export const metadata: Metadata = {
  title: '과로 위험도 진단 | 과로사 산재 인정 가능성 자가진단 | 일셈',
  description:
    '주간 근로시간과 업무환경을 입력하면 뇌심혈관질환(과로사) 산재 인정 가능성을 진단합니다. 만성과로·단기과로·가중요인 기준 반영.',
  keywords:
    '과로 위험도 진단,과로사 산재 인정기준,뇌심혈관질환,만성과로,단기과로,업무부담 가중요인,주52시간,주60시간,교대근무,야간근무',
};

/* ─────────────────────────────────────
   SEO 콘텐츠
───────────────────────────────────── */
function SeoContent() {
  return (
    <div className="prose prose-slate max-w-none mt-8 text-sm leading-7 text-slate-600 space-y-6">
      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">과로 위험도 진단이란?</h2>
        <p>
          이 도구는 <strong>산재보험법 시행령 별표3 제1호 가목</strong> 기준에 따라
          뇌심혈관질환(과로사) 산재 인정 가능성을 자가진단합니다.
          주간 근로시간, 단기 업무량 변화, 돌발상황 여부, 업무부담 가중요인을 종합하여
          업무 관련성 수준을 "강함 / 증가 / 낮음"으로 평가합니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">만성과로 인정기준 — 주 근로시간</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-3 py-2 text-left font-semibold border border-slate-200">12주 평균 주 근로시간</th>
                <th className="px-3 py-2 text-left font-semibold border border-slate-200">업무 관련성</th>
                <th className="px-3 py-2 text-left font-semibold border border-slate-200">비고</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-3 py-2 border border-slate-200 font-medium text-red-600">60시간 초과 (또는 4주 평균 64시간 초과)</td>
                <td className="px-3 py-2 border border-slate-200 font-bold text-red-600">강함</td>
                <td className="px-3 py-2 border border-slate-200">산재 인정 가능성 매우 높음</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-slate-200 font-medium text-amber-600">52시간 초과 ~ 60시간 이하</td>
                <td className="px-3 py-2 border border-slate-200 font-bold text-amber-600">증가</td>
                <td className="px-3 py-2 border border-slate-200">가중요인 2개 이상 시 "강함"으로 격상</td>
              </tr>
              <tr>
                <td className="px-3 py-2 border border-slate-200">52시간 이하</td>
                <td className="px-3 py-2 border border-slate-200 text-blue-600">낮음</td>
                <td className="px-3 py-2 border border-slate-200">가중요인 3개 이상 시 "증가"로 격상 가능</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-2">* 야간근무(22시~06시) 시간은 30% 가산하여 계산합니다.</p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">단기과로 기준</h2>
        <p>
          발병 전 <strong>1주일 이내</strong> 업무량·시간이 이전 12주 평균보다
          <strong> 30% 이상 증가</strong>한 경우, 단기과로로 인정되어 업무 관련성이 "강함"으로 평가됩니다.
          업무 강도·책임·환경이 적응하기 어려운 정도로 변화한 경우도 해당합니다.
        </p>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">업무부담 가중요인 7가지</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>근무일정 예측 어려움</strong>: 불규칙 스케줄, 호출대기(on-call) 근무</li>
          <li><strong>교대제 업무</strong>: 2교대·3교대·격일제 등</li>
          <li><strong>휴일 부족</strong>: 월 휴일 4일 미만, 연차 미사용 지속</li>
          <li><strong>유해한 작업환경</strong>: 한랭, 급격한 온도변화, 소음 반복 노출</li>
          <li><strong>육체적 강도 높은 업무</strong>: 중량물 취급, 장시간 서서 작업 등</li>
          <li><strong>시차 큰 출장 잦음</strong>: 해외출장, 장거리 이동 빈번</li>
          <li><strong>정신적 긴장 큰 업무</strong>: 고객 응대, 감정노동, 마감·실적 압박 등</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">대상 질병</h2>
        <p>
          이 진단은 다음 5가지 뇌심혈관질환에 적용됩니다 (산재보험법 시행령 별표3):
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>뇌실질내출혈</li>
          <li>지주막하출혈</li>
          <li>뇌경색</li>
          <li>심근경색증</li>
          <li>해리성 대동맥류</li>
        </ul>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#1E293B] mb-3">자주 묻는 질문</h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold text-slate-700">Q. 주 52시간 이하라도 산재 인정이 가능한가요?</dt>
            <dd className="mt-1 text-slate-500">
              가능합니다. 가중요인 3개 이상 복합 노출 시 "증가"로 격상되며, 돌발상황이나 단기과로가 있는 경우 별도 인정 근거가 됩니다.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 야간근무 가산은 어떻게 계산하나요?</dt>
            <dd className="mt-1 text-slate-500">
              야간시간(22시~06시) 동안의 근로시간에 30%를 가산하여 주 총 근로시간에 더합니다.
              예: 야간 10시간/주 → +3시간 가산 → 총 근로시간 3시간 추가 인정.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-700">Q. 근로시간 증빙 자료는 어떻게 준비하나요?</dt>
            <dd className="mt-1 text-slate-500">
              출퇴근 기록(교통카드·GPS), 메신저·이메일 발송 시각, 야근식대 영수증, 업무일지 등이 활용됩니다.
              회사 시스템 접속 로그도 유용한 증빙이 됩니다.
            </dd>
          </div>
        </dl>
      </section>

      <p className="text-xs text-slate-400 border-t border-slate-100 pt-4">
        이 진단은 참고용이며, 실제 산재 인정 여부는 근로복지공단의 종합 심사에 따릅니다.
        정확한 상담은 근로복지공단(☎ 1588-0075) 또는 공인노무사에게 문의하시기 바랍니다.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────
   페이지
───────────────────────────────────── */
export default function OverworkRiskPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E293B] mb-1">과로 위험도 진단</h1>
        <p className="text-slate-500 text-sm">과로사(뇌심혈관질환) 산재 인정 가능성 — 산재보험법 시행령 별표3 기준</p>
      </div>

      <OverworkRiskDiagnosis />
      <SeoContent />
    </div>
  );
}
