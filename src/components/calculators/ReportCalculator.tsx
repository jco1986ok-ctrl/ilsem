'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import {
  calcInjuryReport,
  calcRetireReport,
  type InjuryInput,
  type RetireInput,
  type InjuryResult,
  type RetireResult,
  type ReportLine,
} from '@/lib/calc/report';

/* ── 포맷 헬퍼 ─────────────────────────────── */
function fmt(n: number): string {
  return n.toLocaleString('ko-KR');
}
function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ── 광고 슬롯 ─────────────────────────────── */
function AdSlot({ id, label }: { id: string; label: string }) {
  return (
    <div id={`ad-slot-${id}`}
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-400 my-6 print:hidden">
      <span className="block text-xs">📢 광고 영역</span>
      <span>{label}</span>
    </div>
  );
}

/* ── 결과 테이블 ────────────────────────────── */
function ResultTable({ lines, grandTotal, title }: {
  lines: ReportLine[]; grandTotal: number; title: string;
}) {
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
                {line.amount > 0 ? `${fmt(line.amount)}원` : '—'}
              </td>
              <td className="py-3 px-4 text-xs text-gray-500 hidden sm:table-cell">{line.note}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-blue-50">
            <td className="py-3 px-4 font-bold">합계</td>
            <td className="py-3 px-4 text-right font-bold text-blue-700 text-lg whitespace-nowrap">{fmt(grandTotal)}원</td>
            <td className="py-3 px-4 hidden sm:table-cell" />
          </tr>
        </tfoot>
      </table>
      {/* 모바일 산정근거 */}
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

/* ── 입력 필드 ─────────────────────────────── */
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function MoneyInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw === '') { onChange(''); return; }
    onChange(Number(raw).toLocaleString('ko-KR'));
  }
  return (
    <input type="text" inputMode="numeric"
      className="w-full border rounded px-3 py-2" placeholder={placeholder ?? '0'}
      value={value} onChange={handle} />
  );
}

function parseNum(s: string): number {
  return parseInt(s.replace(/,/g, ''), 10) || 0;
}

/* ── 메인 컴포넌트 ───────────────────────────── */
export default function ReportCalculator() {
  const [mode, setMode]     = useState<'injury' | 'retire'>('injury');
  const [calculated, setCal] = useState(false);

  // 공통 임금
  const [wage1, setWage1] = useState('');
  const [wage2, setWage2] = useState('');
  const [wage3, setWage3] = useState('');
  const [bonus, setBonus] = useState('');

  // 산재 전용
  const [birthDate, setBirthDate]         = useState('');
  const [injuryDate, setInjuryDate]       = useState('');
  const [healStart, setHealStart]         = useState('');
  const [healEnd, setHealEnd]             = useState('');
  const [disGrade, setDisGrade]           = useState('none');
  const [disType, setDisType]             = useState<'pension' | 'lump'>('lump');
  const [isDead, setIsDead]               = useState(false);
  const [survivorCount, setSurvivorCount] = useState('1');

  // 퇴직 전용
  const [hireDate, setHireDate]             = useState('');
  const [quitDate, setQuitDate]             = useState('');
  const [leaveAllowance, setLeaveAllowance] = useState('');
  const [dailyOrdinary, setDailyOrdinary]   = useState('');
  const [unusedLeave, setUnusedLeave]       = useState('');
  const [firedNoNotice, setFiredNoNotice]   = useState(false);

  // 결과
  const injuryResult = useMemo<InjuryResult | null>(() => {
    if (!calculated || mode !== 'injury') return null;
    if (!wage1 || !injuryDate || !healStart || !healEnd) return null;
    const input: InjuryInput = {
      monthlyWage1:    parseNum(wage1),
      monthlyWage2:    parseNum(wage2) || parseNum(wage1),
      monthlyWage3:    parseNum(wage3) || parseNum(wage1),
      annualBonus:     parseNum(bonus),
      birthDate:       birthDate || '1970-01-01',
      injuryDate, healStartDate: healStart, healEndDate: healEnd,
      disabilityGrade: disGrade === 'none' ? null : parseInt(disGrade, 10),
      disabilityType:  disGrade === 'none' ? null : disType,
      isDead,
      survivorCount:   parseInt(survivorCount, 10) || 0,
    };
    return calcInjuryReport(input);
  }, [calculated, mode, wage1, wage2, wage3, bonus, birthDate,
      injuryDate, healStart, healEnd, disGrade, disType, isDead, survivorCount]);

  const retireResult = useMemo<RetireResult | null>(() => {
    if (!calculated || mode !== 'retire') return null;
    if (!wage1 || !hireDate || !quitDate) return null;
    const input: RetireInput = {
      hireDate, quitDate,
      monthlyWage1:         parseNum(wage1),
      monthlyWage2:         parseNum(wage2) || parseNum(wage1),
      monthlyWage3:         parseNum(wage3) || parseNum(wage1),
      annualBonus:          parseNum(bonus),
      annualLeaveAllowance: parseNum(leaveAllowance),
      dailyOrdinaryWage:    parseNum(dailyOrdinary),
      unusedLeaveDays:      parseInt(unusedLeave, 10) || 0,
      wasFiredWithoutNotice: firedNoNotice,
    };
    return calcRetireReport(input);
  }, [calculated, mode, wage1, wage2, wage3, bonus, hireDate, quitDate,
      leaveAllowance, dailyOrdinary, unusedLeave, firedNoNotice]);

  const result = mode === 'injury' ? injuryResult : retireResult;

  // PDF 저장 (수정된 버전)
  const reportRef = useRef<HTMLDivElement>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const handlePDF = useCallback(async () => {
    if (!reportRef.current) return;
    if (isPdfLoading) return;

    setIsPdfLoading(true);

    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const jspdfModule = await import('jspdf');
      const jsPDF = jspdfModule.jsPDF;

      const element = reportRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      if (imgHeight <= pdfPageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        let position = 0;
        let page = 0;

        while (heightLeft > 0) {
          if (page > 0) pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfPageHeight;
          position   -= pdfPageHeight;
          page++;
        }
      }

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const fileName = mode === 'injury'
        ? `일셈_산재보상_종합리포트_${dateStr}.pdf`
        : `일셈_퇴직정산_종합리포트_${dateStr}.pdf`;

      pdf.save(fileName);
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert('PDF 생성 중 오류가 발생했습니다. 브라우저를 새로고침 후 다시 시도해 주세요.');
    } finally {
      setIsPdfLoading(false);
    }
  }, [mode, isPdfLoading]);

  function handleCalc() {
    setCal(false);
    setTimeout(() => setCal(true), 0);
  }

  const dateCls = 'w-full border rounded px-3 py-2';
  const selCls  = 'w-full border rounded px-3 py-2 bg-white';

  return (
    <div className="space-y-8">

      {/* 모드 선택 */}
      <div className="flex gap-3">
        {(['injury', 'retire'] as const).map(m => (
          <button key={m} type="button"
            onClick={() => { setMode(m); setCal(false); }}
            className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-all ${
              mode === m
                ? m === 'injury' ? 'bg-red-50 border-red-300 text-red-700' : 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}>
            {m === 'injury' ? '🚑 산재 보상' : '📦 퇴직 정산'}
          </button>
        ))}
      </div>

      {/* 입력 폼 */}
      <div className="bg-white border rounded-lg p-6 space-y-5">
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
                <input type="date" className={dateCls} value={birthDate} onChange={e => setBirthDate(e.target.value)} />
              </Field>
              <Field label="재해일 (사고 발생일)">
                <input type="date" className={dateCls} value={injuryDate} onChange={e => setInjuryDate(e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="요양 시작일">
                <input type="date" className={dateCls} value={healStart} onChange={e => setHealStart(e.target.value)} />
              </Field>
              <Field label="요양 종료일 (예상)">
                <input type="date" className={dateCls} value={healEnd} onChange={e => setHealEnd(e.target.value)} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="장해등급" hint="미정이면 '아직 모름' 선택">
                <select className={selCls} value={disGrade} onChange={e => setDisGrade(e.target.value)}>
                  <option value="none">아직 모름</option>
                  {Array.from({ length: 14 }, (_, i) => i + 1).map(g => (
                    <option key={g} value={g}>{g}급</option>
                  ))}
                </select>
              </Field>
              {disGrade !== 'none' && parseInt(disGrade) <= 7 && (
                <Field label="장해급여 수령 방식">
                  <select className={selCls} value={disType}
                    onChange={e => setDisType(e.target.value as 'pension' | 'lump')}>
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
                  <select className={selCls} value={survivorCount} onChange={e => setSurvivorCount(e.target.value)}>
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
                <input type="date" className={dateCls} value={hireDate} onChange={e => setHireDate(e.target.value)} />
              </Field>
              <Field label="퇴직일" hint="마지막 근무일의 다음 날">
                <input type="date" className={dateCls} value={quitDate} onChange={e => setQuitDate(e.target.value)} />
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
              <input type="number" min="0" className="w-full border rounded px-3 py-2"
                value={unusedLeave} onChange={e => setUnusedLeave(e.target.value)} placeholder="0" />
            </Field>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={firedNoNotice} onChange={e => setFiredNoNotice(e.target.checked)} />
              <span className="text-sm font-medium">해고예고 없이 즉시 해고됨</span>
            </label>
          </div>
        )}

        <button onClick={handleCalc}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-lg">
          📊 종합 계산하기
        </button>
      </div>

      {/* 광고 슬롯 1 */}
      <AdSlot id="1" label="산재 전문 노무법인 · 무료 상담 안내" />

      {/* 결과 영역 */}
      {result && (
        <div ref={reportRef}>
          <div className="space-y-6">

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
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 space-y-1.5">
                <p className="font-semibold">📌 참고사항</p>
                <p>• 요양급여(치료비)는 전액 별도 지원되며 이 금액에 포함되지 않습니다.</p>
                <p>• 간병급여, 직업재활급여 등은 개인 상황에 따라 추가 지급될 수 있습니다.</p>
                <p>• 회사의 과실이 있는 경우 민사 손해배상을 별도로 청구할 수 있습니다.</p>
                <p>• 장해급여가 연금인 경우, 표시 금액은 <strong>연간 금액</strong>입니다.</p>
                <p>• 유족보상연금과 유족보상일시금은 선택 관계이며, 동시 수령은 불가합니다.</p>
              </div>
            )}
            {mode === 'retire' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 space-y-1.5">
                <p className="font-semibold">📌 참고사항</p>
                <p>• 퇴직금은 세전 금액이며, 퇴직소득세 원천징수 후 IRP 계좌로 지급됩니다.</p>
                <p>• 연차사용촉진 절차가 적법하게 이행된 경우, 미사용 연차수당 지급 의무가 면제될 수 있습니다.</p>
                <p>• 퇴직금은 퇴직일로부터 14일 이내에 지급되어야 합니다.</p>
              </div>
            )}

            {/* 면책 */}
            <div className="text-xs text-gray-400 text-center py-2">
              본 리포트는 일셈(ilsem.vercel.app)에서 {todayStr()} 기준으로 산정한 참고 자료이며, 법적 효력이 없습니다.
              정확한 보상금 산정은 근로복지공단(☎ 1588-0075) 또는 전문 노무사와 상담하세요.
            </div>
          </div>
        </div>
      )}

      {/* PDF 저장 + 상담 안내 */}
      {result && (
        <div className="space-y-4 print:hidden">
          <button onClick={handlePDF} disabled={isPdfLoading}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors text-lg disabled:opacity-60 disabled:cursor-not-allowed">
            {isPdfLoading ? '⏳ PDF 생성 중...' : '📄 PDF로 저장하기'}
          </button>

          <AdSlot id="2" label="IRP 계좌 개설 · 퇴직연금 비교" />

          {/* 상담 준비 체크리스트 */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-bold mb-3">✅ 노무사 상담 시 함께 준비하면 좋은 서류</h3>
            <div className="space-y-2 text-sm">
              {[
                '근로계약서 (또는 연봉계약서)',
                '최근 3개월 급여명세서',
                mode === 'injury' ? '진단서 / 소견서 (상병명 확인용)' : null,
                mode === 'injury' ? '사고경위서 (작성한 경우)' : null,
                mode === 'retire' ? '퇴직통지서 / 해고통보서 (해고된 경우)' : null,
                mode === 'retire' ? '취업규칙 / 단체협약 (상여금·수당 규정 확인용)' : null,
                '이 종합 리포트 PDF',
              ].filter(Boolean).map((item, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 연락처 */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-3 text-sm">
            <h3 className="font-bold">📞 도움이 필요하다면</h3>
            {[
              { icon: '🏛️', title: '근로복지공단 (산재보상)',  tel: '1588-0075' },
              { icon: '📋', title: '고용노동부 (퇴직금·임금·해고)', tel: '1350' },
            ].map(({ icon, title, tel }) => (
              <div key={title} className="flex gap-3 items-start">
                <span>{icon}</span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-gray-600">☎ {tel}</p>
                </div>
              </div>
            ))}
          </div>

          <AdSlot id="3" label="산재 전문 노무사 · 무료 상담 신청" />
        </div>
      )}

      {/* SEO 해설 */}
      <article className="text-sm leading-7 text-slate-600 space-y-5 mt-8 border-t pt-8">
        <section>
          <h2 className="text-base font-bold text-[#1E293B] mb-2">종합 리포트란?</h2>
          <p>
            일셈 종합 리포트는 산재 보상금 또는 퇴직 정산금을 한 페이지에서 종합 계산하여
            노무사 상담용 PDF로 저장할 수 있는 서비스입니다.
            모든 계산은 브라우저에서 처리되며, 입력한 정보는 서버로 전송되지 않습니다.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-[#1E293B] mb-2">산재 보상 리포트에 포함되는 항목</h2>
          <p>
            휴업급여(평균임금의 70% × 요양일수), 장해급여(등급별 연금 또는 일시금),
            사망 시 유족보상연금(또는 일시금)과 장의비가 포함됩니다.
            요양급여(치료비)는 전액 별도 지원되므로 포함하지 않으며,
            간병급여·직업재활급여·민사 손해배상 등은 개별 상황에 따라 추가됩니다.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-[#1E293B] mb-2">퇴직 정산 리포트에 포함되는 항목</h2>
          <p>
            퇴직금(1일 평균임금 × 30일 × 재직년수), 미사용 연차수당(1일 통상임금 × 잔여 연차일수),
            해고예고수당(즉시해고 시 30일분 통상임금)이 포함됩니다.
            퇴직금은 세전 금액이며, 실제 수령액은 퇴직소득세 공제 후 달라집니다.
          </p>
        </section>
        <section>
          <h2 className="text-base font-bold text-[#1E293B] mb-2">이 리포트의 활용 방법</h2>
          <p>
            계산 결과를 PDF로 저장한 뒤, 노무사 또는 근로복지공단 상담 시 제출하면
            상담 시간을 절약하고 더 정확한 조언을 받을 수 있습니다.
          </p>
        </section>
      </article>

      <div className="text-sm text-gray-500 border-t pt-6 text-center">
        <p>
          본 리포트는 2025~2026년 기준 관련 법령을 기반으로 산정된 참고 자료이며,
          법률 자문이 아닙니다. 정확한 판단은 전문 노무사 또는 관련 기관에 상담하세요.
        </p>
      </div>
    </div>
  );
}
