'use client';

import { useState } from 'react';
import {
  diagnoseOverworkRisk,
  WEIGHT_FACTORS,
  OVERWORK_THRESHOLDS,
  type OverworkRiskInput,
  type OverworkRiskResult,
  type WorkRelationLevel,
} from '@/lib/calculators/overwork-risk';

// ── 색상 유틸 ─────────────────────────────────────────────────

const levelStyle: Record<WorkRelationLevel, { bg: string; border: string; text: string; badge: string; label: string }> = {
  strong:    { bg: 'bg-red-50',    border: 'border-red-300',    text: 'text-red-700',    badge: 'bg-red-500 text-white',    label: '강함' },
  increased: { bg: 'bg-amber-50',  border: 'border-amber-300',  text: 'text-amber-700',  badge: 'bg-amber-500 text-white',  label: '증가' },
  low:       { bg: 'bg-blue-50',   border: 'border-blue-300',   text: 'text-blue-700',   badge: 'bg-blue-400 text-white',   label: '낮음' },
};

function LevelBadge({ level }: { level: WorkRelationLevel }) {
  const s = levelStyle[level];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${s.badge}`}>
      {s.label}
    </span>
  );
}

// ── 입력 카드 ─────────────────────────────────────────────────

function HoursInput({ label, value, onChange, hint, max = 168 }: {
  label: string; value: string; onChange: (v: string) => void;
  hint?: string; max?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
      <div className="relative">
        <input type="number" min="0" max={max} step="0.5" value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-right pr-12 text-[#1E293B] font-medium outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100" />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">h/주</span>
      </div>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

// ── 결과 기준 행 ─────────────────────────────────────────────

function CriterionRow({ icon, title, level, detail }: {
  icon: string; title: string; level: WorkRelationLevel; detail: string;
}) {
  const s = levelStyle[level];
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${s.bg} ${s.border}`}>
      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-sm font-semibold ${s.text}`}>{title}</p>
          <LevelBadge level={level} />
        </div>
        <p className={`text-xs mt-0.5 ${s.text} opacity-80`}>{detail}</p>
      </div>
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────────────

export default function OverworkRiskDiagnosis() {
  const [avg12, setAvg12]             = useState('');
  const [avg4,  setAvg4]              = useState('');
  const [last1, setLast1]             = useState('');
  const [night, setNight]             = useState('');
  const [hasAcute, setHasAcute]       = useState<boolean | null>(null);
  const [wFactors, setWFactors]       = useState<boolean[]>(Array(7).fill(false));
  const [result, setResult]           = useState<OverworkRiskResult | null>(null);
  const [errors, setErrors]           = useState<Record<string, string>>({});

  function toggleFactor(i: number) {
    setWFactors(prev => { const next = [...prev]; next[i] = !next[i]; return next; });
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!avg12 || parseFloat(avg12) < 0) errs.avg12 = '12주 평균 근로시간을 입력해 주세요.';
    if (!avg4  || parseFloat(avg4)  < 0) errs.avg4  = '4주 평균 근로시간을 입력해 주세요.';
    if (!last1 || parseFloat(last1) < 0) errs.last1 = '발병 전 1주 근로시간을 입력해 주세요.';
    if (hasAcute === null) errs.acute = '돌발상황 여부를 선택해 주세요.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleDiagnose() {
    if (!validate()) return;
    const input: OverworkRiskInput = {
      avg12WeekHours:    parseFloat(avg12) || 0,
      avg4WeekHours:     parseFloat(avg4)  || 0,
      lastWeekHours:     parseFloat(last1) || 0,
      nightHoursPerWeek: parseFloat(night) || 0,
      hasAcuteStress:    hasAcute!,
      weightFactors:     wFactors,
    };
    const res = diagnoseOverworkRisk(input);
    setResult(res);
    try {
      localStorage.setItem('ilsem-overwork-risk', JSON.stringify({
        input, result: res, timestamp: new Date().toISOString(),
      }));
    } catch { /* ignore */ }
    setTimeout(
      () => document.getElementById('ow-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      50
    );
  }

  function handleReset() {
    setAvg12(''); setAvg4(''); setLast1(''); setNight('');
    setHasAcute(null); setWFactors(Array(7).fill(false));
    setResult(null); setErrors({});
  }

  // 전주 증가율 실시간 미리보기
  const previewRate = avg12 && last1 && parseFloat(avg12) > 0
    ? ((parseFloat(last1) - parseFloat(avg12)) / parseFloat(avg12) * 100).toFixed(1)
    : null;

  return (
    <div className="space-y-8">
      {/* ── 입력 카드 ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-7">
        <h2 className="text-lg font-bold text-[#1E293B]">근로시간 정보 입력</h2>

        {/* 근로시간 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <HoursInput label="발병 전 12주 주평균 근로시간 ★" value={avg12} onChange={setAvg12}
            hint="만성과로 핵심 기준 — 연장근무 포함 총 근로시간" />
          <HoursInput label="발병 전 4주 주평균 근로시간 ★" value={avg4} onChange={setAvg4}
            hint="4주 평균 64h 초과 시 독립 판단 기준" />
          <HoursInput label="발병 전 1주 근로시간 ★" value={last1} onChange={setLast1}
            hint="단기과로 판단 기준 (12주 평균 대비)" />
          <HoursInput label="야간근무 주당 시간 (22~06시)" value={night} onChange={setNight}
            hint="위 근로시간에 포함된 야간 시간 — 30% 가산 적용" max={84} />
        </div>

        {/* 단기과로 미리보기 */}
        {previewRate !== null && (
          <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm ${
            parseFloat(previewRate) >= 30
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <span>{parseFloat(previewRate) >= 30 ? '⚠️' : '📊'}</span>
            <span>
              전주 근로시간이 12주 평균 대비
              <strong className="mx-1">{parseFloat(previewRate) >= 0 ? '+' : ''}{previewRate}%</strong>
              {parseFloat(previewRate) >= 30
                ? '— 단기과로 기준(30%) 초과 해당'
                : '— 단기과로 기준(30%) 미달'}
            </span>
          </div>
        )}
        {errors.avg12 && <p className="text-xs text-red-500 -mt-4">{errors.avg12}</p>}
        {errors.last1 && <p className="text-xs text-red-500 -mt-4">{errors.last1}</p>}

        <hr className="border-slate-100" />

        {/* 돌발상황 */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">
            A. 발병 전 24시간 이내 돌발상황·급성 스트레스 <span className="text-red-500">*</span>
          </p>
          <p className="text-xs text-slate-400 mb-3">
            예) 극심한 긴장·공포·흥분, 심각한 사고 목격, 갑작스러운 인사명령, 급격한 업무환경 변화
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { val: true,  label: '있었다',    sub: '뚜렷한 생리적 변화 유발 수준' },
              { val: false, label: '없었다',    sub: '특이한 사건 없음' },
            ].map(({ val, label, sub }) => (
              <label key={String(val)}
                className={`flex items-center gap-3 cursor-pointer rounded-xl border-2 p-4 transition-colors ${
                  hasAcute === val ? 'border-[#2563EB] bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => setHasAcute(val)}>
                <input type="radio" name="acute" checked={hasAcute === val} onChange={() => {}}
                  className="w-4 h-4 accent-blue-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#1E293B]">{label}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.acute && <p className="text-xs text-red-500 mt-1">{errors.acute}</p>}
        </div>

        <hr className="border-slate-100" />

        {/* 가중요인 */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-1">
            D. 업무부담 가중요인 (해당하는 것 모두 선택)
          </p>
          <p className="text-xs text-slate-400 mb-4">
            52~60h 구간: 2개 이상이면 "강함"으로 격상 / 52h 이하: 3개 이상이면 "증가"로 격상
          </p>
          <div className="space-y-2.5">
            {WEIGHT_FACTORS.map((f, i) => (
              <label key={f.id}
                className={`flex items-start gap-3 cursor-pointer rounded-xl border-2 p-3.5 transition-colors ${
                  wFactors[i] ? 'border-[#2563EB] bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => toggleFactor(i)}>
                <input type="checkbox" checked={wFactors[i]} onChange={() => {}}
                  className="mt-0.5 w-4 h-4 accent-blue-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#1E293B]">
                    <span className="text-slate-400 font-normal mr-1">({i + 1})</span>{f.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{f.desc}</p>
                </div>
              </label>
            ))}
          </div>
          {wFactors.filter(Boolean).length > 0 && (
            <p className="text-xs text-[#2563EB] mt-2 font-medium">
              {wFactors.filter(Boolean).length}개 선택됨
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={handleDiagnose}
            className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
            과로 위험도 진단하기
          </button>
          <button onClick={handleReset}
            className="px-5 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
            초기화
          </button>
        </div>
      </div>

      {/* ── 결과 ── */}
      {result && (
        <div id="ow-result" className="space-y-5 scroll-mt-20">

          {/* 야간 가산 정보 */}
          {result.nightBonus > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
              <span>🌙</span>
              <span>
                야간근무 가산 적용: +{result.nightBonus}h/주
                (12주 평균 {avg12}h → <strong className="text-[#2563EB]">{result.adj12WeekAvg}h</strong> /
                4주 평균 {avg4}h → <strong className="text-[#2563EB]">{result.adj4WeekAvg}h</strong>)
              </span>
            </div>
          )}

          {/* 종합 판정 메인 카드 */}
          <div className={`rounded-2xl border-2 p-6 sm:p-8 ${
            result.overall === 'strong'
              ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-300'
              : result.overall === 'increased'
              ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300'
              : 'bg-gradient-to-br from-blue-50 to-slate-50 border-blue-200'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">
                {result.overall === 'strong' ? '🔴' : result.overall === 'increased' ? '🟡' : '🔵'}
              </span>
              <div>
                <p className="text-xs font-medium text-slate-500 mb-0.5">종합 업무 관련성 평가</p>
                <p className={`text-xl font-bold ${levelStyle[result.overall].text}`}>
                  {result.overallLabel}
                </p>
              </div>
            </div>
            <p className={`text-sm font-medium ${levelStyle[result.overall].text}`}>
              {result.summary}
            </p>

            {/* 인정 근거 */}
            {result.keyFactors.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/60">
                <p className="text-xs font-semibold text-slate-500 mb-2">주요 인정 근거</p>
                <ul className="space-y-1">
                  {result.keyFactors.map((f, i) => (
                    <li key={i} className={`text-xs flex items-start gap-1.5 ${levelStyle[result.overall].text}`}>
                      <span className="shrink-0 mt-0.5">✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 기준별 상세 판정 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-[#1E293B] mb-4">기준별 상세 판정</h3>
            <div className="space-y-3">
              <CriterionRow
                icon="⚡"
                title="A. 돌발상황 (급성 스트레스)"
                level={result.acuteStress.level}
                detail={result.acuteStress.detected
                  ? '발병 전 24시간 내 돌발상황 해당 → 즉각적 인정 근거'
                  : '해당 없음'}
              />
              <CriterionRow
                icon="📈"
                title="B. 단기과로"
                level={result.shortTerm.level}
                detail={result.shortTerm.detected
                  ? `발병 전 1주 근로시간이 12주 평균 대비 +${result.shortTerm.increaseRate}% 증가 (기준: 30% 이상)`
                  : `전주 증가율 ${result.shortTerm.increaseRate}% (기준 30% 미달)`}
              />
              <CriterionRow
                icon="🕐"
                title="C. 만성과로"
                level={result.chronic.level}
                detail={(() => {
                  const t = result.chronic.trigger;
                  if (t === '12w-over60') return `12주 평균 ${result.adj12WeekAvg}h — 60시간 초과`;
                  if (t === '4w-over64')  return `4주 평균 ${result.adj4WeekAvg}h — 64시간 초과`;
                  if (t === '52to60-upgraded') return `12주 평균 ${result.adj12WeekAvg}h (52~60h) + 가중요인 ${result.weightFactorCount}개 → 강함으로 격상`;
                  if (t === '52to60-base')     return `12주 평균 ${result.adj12WeekAvg}h (52~60h 구간)`;
                  if (t === 'below52-upgraded') return `12주 평균 ${result.adj12WeekAvg}h (52h 이하) + 가중요인 ${result.weightFactorCount}개 → 증가로 격상`;
                  return `12주 평균 ${result.adj12WeekAvg}h (52h 이하)`;
                })()}
              />
              <CriterionRow
                icon="⚙️"
                title="D. 업무부담 가중요인"
                level={result.weightFactorCount >= OVERWORK_THRESHOLDS.upgradeToStrongFactors
                  ? 'strong'
                  : result.weightFactorCount >= 1 ? 'increased' : 'low'}
                detail={result.weightFactorCount > 0
                  ? `${result.weightFactorCount}개 해당 — ${wFactors.map((v, i) => v ? WEIGHT_FACTORS[i].label : null).filter(Boolean).join(', ')}`
                  : '해당 없음'}
              />
            </div>
          </div>

          {/* 권고사항 */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-blue-800 mb-2">권고사항</h4>
            <ul className="space-y-1.5">
              {result.advice.map((a, i) => (
                <li key={i} className="text-xs text-blue-700 flex items-start gap-1.5">
                  <span className="shrink-0 mt-0.5">•</span>{a}
                </li>
              ))}
            </ul>
          </div>

          {/* 대상 질병 안내 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500">
            <strong className="text-slate-600">이 진단의 대상 질병 (산재보험법 시행령 별표3 제1호가목):</strong>
            <span className="ml-1">뇌실질내출혈, 지주막하출혈, 뇌경색, 심근경색증, 해리성 대동맥류</span>
          </div>
        </div>
      )}
    </div>
  );
}
