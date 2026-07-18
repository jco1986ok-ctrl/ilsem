'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  calcInjuryReport,
  calcRetireReport,
  InjuryInput,
  RetireInput,
  InjuryResult,
  RetireResult,
  ReportLine,
} from '@/lib/calc/report';

/* ============================================================
   포맷 헬퍼
   ============================================================ */
function fmt(n: number): string {
  return n.toLocaleString('ko-KR');
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ============================================================
   광고 슬롯 (추후 노무법인/금융사 배너 교체)
   ============================================================ */
function AdSlot({ id, label }: { id: string; label: string }) {
  return (
    <div
      id={`ad-slot-${id}`}
      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-400 my-6 print:hidden"
    >
      <p className="text-sm">📢 광고 영역</p>
      <p className="text-xs mt-1">{label}</p>
    </div>
  );
}

/* ============================================================
   결과 테이블
   ============================================================ */
function ResultTable({ lines, grandTotal, title }: { lines: ReportLine[]; grandTotal: number; title: string }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-3">
        <h3 className="font-bold">{title}</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left py-2 px-4">항목</th>
            <th className="text-right py-2 px-4">금액</th>
            <th className="text-left py-2 px-4 hidden sm:table-cell">산정 근거</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, i) => (
            <tr key={i} className="border-b">
              <td className="py-3 px-4 font-medium">{line.label}</td>
              <td className="py-3 px-4 text-right font-semibold whitespace-nowrap">
                {line.amount > 0 ? `${fmt(line.amount)}원` : '-'}
              </td>
              <td className="py-3 px-4 text-xs text-gray-500 hidden sm:table-cell">{line.note}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-blue-50">
            <td className="py-3 px-4 font-bold">합계</td>
            <td className="py-3 px-4 text-right font-bold text-blue-700 text-lg whitespace-nowrap">{fmt(grandTotal)}원</td>
            <td className="py-3 px-4 hidden sm:table-cell"></td>
          </tr>
        </tfoot>
      </table>
      <div className="sm:hidden px-4 pb-3 space-y-2">
        {lines.map((line, i) => (
          <div key={i} className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">{line.label}:</span> {line.note}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   입력 컴포넌트
   ============================================================ */
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function MoneyInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw === '') { onChange(''); return; }
    onChange(Number(raw).toLocaleString('ko-KR'));
  }
  return (
    <input
      type="text"
      inputMode="numeric"
      className="w-full border rounded px-3 py-2"
      placeholder={placeholder ?? '0'}
      value={value}
      onChange={handle}
    />
  );
}

function parseNum(s: string): number {
  return parseInt(s.replace(/,/g, ''), 10) || 0;
}

/* ============================================================
   메인 페이지
   ============================================================ */
export default function ReportPage() {
  const [mode, setMode] = useState<'injury' | 'retire'>('injury');

  // 공통
  const [wage1, setWage1] = useState('');
  const [wage2, setWage2] = useState('');
  const [wage3, setWage3] = useState('');
  const [bonus, setBonus] = useState('');

  // 산재
  const [birthDate, setBirthDate] = useState('');
  const [injuryDate, setInjuryDate] = useState('');
  const [healStart, setHealStart] = useState('');
  const [healEnd, setHealEnd] = useState('');
  const [disGrade, setDisGrade] = useState<string>('none');
  const [disType, setDisType] = useState<'pension' | 'lump'>('lump');
  const [isDead, setIsDead] = useState(false);
  const [survivorCount, setSurvivorCount] = useState('1');

  // 퇴직
  const [hireDate, setHireDate] = useState('');
  const [quitDate, setQuitDate] = useState('');
  const [leaveAllowance, setLeaveAllowance] = useState('');
  const [dailyOrdinary, setDailyOrdinary] = useState('');
  const [unusedLeave, setUnusedLeave] = useState('');
  const [firedNoNotice, setFiredNoNotice] = useState(false);

  const [calculated, setCalculated] = useState(false);

  // 계산
  const injuryResult = useMemo<InjuryResult | null>(() => {
    if (!calculated || mode !== 'injury') return null;
    if (!wage1 || !injuryDate || !healStart || !healEnd) return null;
    const input: InjuryInput = {
      monthlyWage1: parseNum(wage1),
      monthlyWage2: parseNum(wage2) || parseNum(wage1),
      monthlyWage3: parseNum(wage3) || parseNum(wage1),
      annualBonus: parseNum(bonus),
      birthDate: birthDate || '1970-01-01',
      injuryDate,
      healStartDate: healStart,
      healEndDate: healEnd,
      disabilityGrade: disGrade === 'none' ? null : parseInt(disGrade, 10),
      disabilityType: disGrade === 'none' ? null : disType,
      isDead,
      survivorCount: parseInt(survivorCount, 10) || 0,
    };
    return calcInjuryReport(input);
  }, [calculated, mode, wage1, wage2, wage3, bonus, birthDate, injuryDate, healStart, healEnd, disGrade, disType, isDead, survivorCount]);

  const retireResult = useMemo<RetireResult | null>(() => {
    if (!calculated || mode !== 'retire') return null;
    if (!wage1 || !hireDate || !quitDate) return null;
    const input: RetireInput = {
      hireDate,
      quitDate,
      monthlyWage1: parseNum(wage1),
      monthlyWage2: parseNum(wage2) || parseNum(wage1),
      monthlyWage3: parseNum(wage3) || parseNum(wage1),
      annualBonus: parseNum(bonus),
      annualLeaveAllowance: parseNum(leaveAllowance),
      dailyOrdinaryWage: parseNum(dailyOrdinary),
      unusedLeaveDays: parseInt(unusedLeave, 10) || 0,
      wasFiredWithoutNotice: firedNoNotice,
    };
    return calcRetireReport(input);
  }, [calculated, mode, wage1, wage2, wage3, bonus, hireDate, quitDate, leaveAllowance, dailyOrdinary, unusedLeave, firedNoNotice]);

  const result = mode === 'injury' ? injuryResult : retireResult;

  // 광고 데이터가 있을 때만 렌더링
  const bannerLink = ''; // 나중에 실제 URL 넣으면 그때 노출

  function handleCalc() {
    setCalculated(false);
    setTimeout(() => setCalculated(true), 0);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

      {/* 헤더 */}
      <section className="text-center">
        <h1 className="text-2xl font-bold mb-2">종합 리포트</h1>
        <p className="text-gray-600">
          한 번의 입력으로 예상 보상금을 종합 계산합니다.
        </p>
      </section>

      {/* 모드 선택 */}
      <section className="flex gap-3">
        <button
          onClick={() => { setMode('injury'); setCalculated(false); }}
          className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all ${
            mode === 'injury'
              ? 'bg-red-50 border-red-300 text-red-700'
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}
        >
          🚑 산재 보상
        </button>
        <button
          onClick={() => { setMode('retire'); setCalculated(false); }}
          className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all ${
            mode === 'retire'
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}
        >
          📦 퇴직 정산
        </button>
      </section>

      {/* 입력 폼 */}
      <section className="bg-white border rounded-lg p-6 space-y-5">

        <h2 className="font-bold text-lg">
          {mode === 'injury' ? '🚑 산재 보상 정보 입력' : '📦 퇴직 정산 정보 입력'}
        </h2>

        {/* 공통: 급여 */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <p className="text-sm font-semibold text-gray-700">
            💰 {mode === 'injury' ? '재해일' : '퇴직일'} 이전 3개월 급여
          </p>
          <p className="text-xs text-gray-500">
            매월 동일한 급여라면 첫 번째 달만 입력하세요. 나머지는 자동 적용됩니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="1번째 달 임금">
              <MoneyInput value={wage1} onChange={setWage1} placeholder="3,000,000" />
            </Field>
            <Field label="2번째 달 임금" hint="비워두면 1번째 달과 동일">
              <MoneyInput value={wage2} onChange={setWage2} />
            </Field>
            <Field label="3번째 달 임금" hint="비워두면 1번째 달과 동일">
              <MoneyInput value={wage3} onChange={setWage3} />
            </Field>
          </div>
          <Field label="연간 상여금 총액" hint="없으면 0">
            <MoneyInput value={bonus} onChange={setBonus} />
          </Field>
        </div>

        {/* 산재 전용 */}
        {mode === 'injury' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="생년월일" hint="고령자 감액 판단용">
                <input type="date" className="w-full border rounded px-3 py-2" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
              </Field>
              <Field label="재해일 (사고 발생일)">
                <input type="date" className="w-full border rounded px-3 py-2" value={injuryDate} onChange={e => setInjuryDate(e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="요양 시작일">
                <input type="date" className="w-full border rounded px-3 py-2" value={healStart} onChange={e => setHealStart(e.target.value)} />
              </Field>
              <Field label="요양 종료일 (예상)">
                <input type="date" className="w-full border rounded px-3 py-2" value={healEnd} onChange={e => setHealEnd(e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="장해등급" hint="미정이면 '아직 모름' 선택">
                <select className="w-full border rounded px-3 py-2" value={disGrade} onChange={e => setDisGrade(e.target.value)}>
                  <option value="none">아직 모름</option>
                  {Array.from({ length: 14 }, (_, i) => i + 1).map(g => (
                    <option key={g} value={g}>{g}급</option>
                  ))}
                </select>
              </Field>
              {disGrade !== 'none' && parseInt(disGrade) <= 7 && (
                <Field label="장해급여 수령 방식">
                  <select className="w-full border rounded px-3 py-2" value={disType} onChange={e => setDisType(e.target.value as 'pension' | 'lump')}>
                    <option value="pension">연금</option>
                    <option value="lump">일시금</option>
                  </select>
                </Field>
              )}
            </div>
            <div className="border-t pt-4 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isDead} onChange={e => setIsDead(e.target.checked)} />
                <span className="text-sm font-medium">업무상 재해로 사망한 경우</span>
              </label>
              {isDead && (
                <Field label="유족 수급자격자 수" hint="배우자, 자녀, 부모 등">
                  <select className="w-full border rounded px-3 py-2" value={survivorCount} onChange={e => setSurvivorCount(e.target.value)}>
                    {[1, 2, 3, 4].map(n => (
                      <option key={n} value={n}>{n}인</option>
                    ))}
                  </select>
                </Field>
              )}
            </div>
          </div>
        )}

        {/* 퇴직 전용 */}
        {mode === 'retire' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="입사일">
                <input type="date" className="w-full border rounded px-3 py-2" value={hireDate} onChange={e => setHireDate(e.target.value)} />
              </Field>
              <Field label="퇴직일" hint="마지막 근무일의 다음 날">
                <input type="date" className="w-full border rounded px-3 py-2" value={quitDate} onChange={e => setQuitDate(e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="연간 연차수당 (작년 기준)" hint="없으면 0">
                <MoneyInput value={leaveAllowance} onChange={setLeaveAllowance} />
              </Field>
              <Field label="1일 통상임금" hint="연차수당·해고예고수당 산정 기준">
                <MoneyInput value={dailyOrdinary} onChange={setDailyOrdinary} />
              </Field>
            </div>
            <Field label="미사용 연차일수" hint="퇴직 시 남은 연차">
              <input
                type="number"
                min="0"
                className="w-full border rounded px-3 py-2"
                value={unusedLeave}
                onChange={e => setUnusedLeave(e.target.value)}
                placeholder="0"
              />
            </Field>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={firedNoNotice} onChange={e => setFiredNoNotice(e.target.checked)} />
              <span className="text-sm font-medium">해고예고 없이 즉시 해고됨</span>
            </label>
          </div>
        )}

        {/* 계산 버튼 */}
        <button
          onClick={handleCalc}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-lg"
        >
          📊 종합 계산하기
        </button>
      </section>

      {/* 광고 슬롯 1 */}
      <AdSlot id="1" label="산재 전문 노무법인 · 무료 상담 안내" />

      {/* ── 결과 영역 ── */}
      {result && (
        <section className="space-y-6">

          {/* 리포트 헤더 */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">
                  {mode === 'injury' ? '🚑 산재 보상 종합 리포트' : '📦 퇴직 정산 종합 리포트'}
                </h2>
                <p className="text-blue-100 text-sm mt-1">일셈 · {todayStr()} 산정</p>
              </div>
              <div className="text-right">
                <p className="text-blue-200 text-xs">예상 총액</p>
                <p className="text-3xl font-bold">{fmt(result.grandTotal)}원</p>
              </div>
            </div>
          </div>

          {/* 기본 정보 요약 */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-gray-500">1일 평균임금</span>
              <p className="font-bold">{fmt(result.dailyAvgWage)}원</p>
            </div>
            {mode === 'injury' && injuryResult && (
              <>
                <div>
                  <span className="text-gray-500">총 요양일수</span>
                  <p className="font-bold">{injuryResult.totalHealDays}일</p>
                </div>
                <div>
                  <span className="text-gray-500">재해일</span>
                  <p className="font-bold">{injuryDate}</p>
                </div>
              </>
            )}
            {mode === 'retire' && retireResult && (
              <>
                <div>
                  <span className="text-gray-500">총 재직일수</span>
                  <p className="font-bold">{retireResult.totalServiceDays}일</p>
                </div>
                <div>
                  <span className="text-gray-500">재직기간</span>
                  <p className="font-bold">{hireDate} ~ {quitDate}</p>
                </div>
              </>
            )}
          </div>

          {/* 결과 테이블 */}
          <ResultTable
            lines={result.lines}
            grandTotal={result.grandTotal}
            title={mode === 'injury' ? '산재 보상금 내역' : '퇴직 정산 내역'}
          />

          {/* 참고사항 */}
          {mode === 'injury' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 space-y-2">
              <p className="font-semibold">📌 참고사항</p>
              <p>• 요양급여(치료비)는 전액 별도 지원되므로 이 금액에 포함되지 않습니다.</p>
              <p>• 간병급여, 직업재활급여 등은 개인 상황에 따라 추가 지급될 수 있습니다.</p>
              <p>• 회사의 과실이 있는 경우 민사 손해배상을 별도로 청구할 수 있습니다.</p>
              <p>• 장해급여가 연금인 경우, 표시 금액은 <strong>연간 금액</strong>입니다.</p>
              <p>• 유족보상연금과 유족보상일시금은 선택 관계이며, 동시 수령은 불가합니다.</p>
            </div>
          )}
          {mode === 'retire' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 space-y-2">
              <p className="font-semibold">📌 참고사항</p>
              <p>• 퇴직금은 세전 금액이며, 퇴직소득세 원천징수 후 IRP 계좌로 지급됩니다.</p>
              <p>• 연차사용촉진 절차가 적법하게 이행된 경우, 미사용 연차수당 지급 의무가 면제될 수 있습니다.</p>
              <p>• 퇴직금은 퇴직일로부터 14일 이내에 지급되어야 합니다.</p>
            </div>
          )}

          {/* 저장 안내 (인쇄 기능) */}
          <div className="bg-gray-100 rounded-lg p-4 text-center text-sm text-gray-600 print:hidden">
            <p className="font-semibold mb-1">💡 이 결과를 저장하고 싶다면?</p>
            <p>
              <strong>Ctrl + P</strong> (Mac: <strong>⌘ + P</strong>)를 눌러
              "PDF로 저장"을 선택하세요.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              스크린샷(캡처)으로 저장해도 됩니다.
            </p>
          </div>

          {/* 배너 */}
          {bannerLink && (
            <a
              href={bannerLink}
              className="block rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors px-4 py-3 print:hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-base">💰</span>
                  <span>퇴직금 받았다면? IRP 계좌로 절세하기</span>
                </div>
                <span className="text-gray-300 text-xs">›</span>
              </div>
            </a>
          )}

          {/* 상담 준비 체크리스트 */}
          <div className="bg-white border rounded-lg p-6 print:hidden">
            <h3 className="font-bold mb-3">✅ 노무사 상담 시 함께 준비하면 좋은 서류</h3>
            <div className="space-y-2 text-sm">
              {[
                '근로계약서 (또는 연봉계약서)',
                '최근 3개월 급여명세서',
                mode === 'injury' ? '진단서 / 소견서 (상병명 확인용)' : null,
                mode === 'injury' ? '사고경위서 (작성한 경우)' : null,
                mode === 'retire' ? '퇴직통지서 / 해고통보서 (해고된 경우)' : null,
                mode === 'retire' ? '취업규칙 / 단체협약 (상여금·수당 규정 확인용)' : null,
                '이 리포트 화면 캡처 또는 인쇄본',
              ].filter(Boolean).map((item, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 연락처 */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-3 text-sm print:hidden">
            <h3 className="font-bold">📞 도움이 필요하다면</h3>
            <div className="flex gap-3 items-start">
              <span>🏛️</span>
              <div>
                <p className="font-semibold">근로복지공단 (산재보상)</p>
                <p className="text-gray-600">☎ 1588-0075</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span>📋</span>
              <div>
                <p className="font-semibold">고용노동부 (퇴직금·임금·해고)</p>
                <p className="text-gray-600">☎ 1350</p>
              </div>
            </div>
          </div>

          {/* 광고 슬롯 3 */}
          <AdSlot id="3" label="산재 전문 노무사 · 무료 상담 신청" />
        </section>
      )}

      {/* 면책 */}
      <section className="text-sm text-gray-500 border-t pt-6 text-center">
        <p>
          본 리포트는 2025~2026년 기준 관련 법령을 기반으로 산정된 참고 자료이며,
          법률 자문이 아닙니다. 정확한 판단은 전문 노무사 또는 관련 기관에 상담하세요.
        </p>
      </section>
    </div>
  );
}
