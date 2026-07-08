'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { DiagnosisResult } from '@/lib/calculators/selfDiagnosis';
import { GRADE_BG, getNextSteps } from '@/lib/calculators/selfDiagnosis';
import type { DiagnosisType } from '@/lib/constants/self-diagnosis-data';

interface DiagnosisResultProps {
  result: DiagnosisResult;
  type: DiagnosisType;
  onReset: () => void;
}

const GRADE_EMOJI: Record<string, string> = {
  'very-high': '✅',
  high: '🟢',
  medium: '🟡',
  low: '🔴',
  'very-low': '🔴',
};

export default function DiagnosisResultView({ result, type, onReset }: DiagnosisResultProps) {
  const {
    percentage,
    grade,
    gradeLabel,
    gradeColor,
    categoryScores,
    weakPoints,
    advice,
  } = result;

  const gradeBg = GRADE_BG[grade];
  const nextSteps = getNextSteps(grade);

  // 카운트업 애니메이션 (0 → percentage, 1.5초 easeOutExpo)
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    const target = percentage;
    const duration = 1500;
    const startTime = Date.now();

    const counter = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayPercentage(Math.round(eased * target));

      if (elapsed >= duration) {
        setDisplayPercentage(target);
        clearInterval(counter);
      }
    }, 16);

    return () => clearInterval(counter);
  }, [percentage]);

  // SVG 원형 게이지 (애니메이션 값 기준)
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (displayPercentage / 100) * circumference;

  // 분석 완료 시각 (최초 렌더 시점)
  const [analyzedAt] = useState(() => {
    const now = new Date();
    return now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  return (
    <div className="space-y-6">
      {/* ── AI 분석 완료 배너 ── */}
      <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 flex items-start gap-3">
        <span className="text-xl shrink-0 mt-0.5">✅</span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-green-800">AI 분석 완료</p>
          <p className="text-xs text-green-700 mt-0.5">
            산업재해보상보험법 및 유사 판례 기반 분석 결과입니다
          </p>
          <p className="text-xs text-green-600 mt-1">분석 일시: {analyzedAt}</p>
        </div>
      </div>

      {/* ── 메인 결과 카드 ── */}
      <div
        className="rounded-2xl border p-6 sm:p-8"
        style={{ background: gradeBg, borderColor: gradeColor + '40' }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* 원형 점수 게이지 */}
          <div className="relative flex-shrink-0">
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="10" />
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke={gradeColor}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 65 65)"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tabular-nums" style={{ color: gradeColor }}>
                {displayPercentage}
              </span>
              <span className="text-xs text-slate-400 mt-0.5">%</span>
            </div>
          </div>

          {/* 등급 텍스트 */}
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
              <span className="text-2xl">{GRADE_EMOJI[grade]}</span>
              <span className="text-xl font-bold" style={{ color: gradeColor }}>
                {gradeLabel}
              </span>
            </div>
            <p className="text-lg font-bold mb-1 tabular-nums" style={{ color: gradeColor }}>
              승인 가능성 {displayPercentage}%
            </p>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              {type === 'accident' ? '업무상 사고' : '업무상 질병'} 자가진단 결과입니다.
              이 결과는 참고용이며, 실제 승인 여부는 근로복지공단이 결정합니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 카테고리별 점수 ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-base font-bold text-[#1E293B] mb-5">항목별 분석</h3>
        <div className="space-y-4">
          {categoryScores.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-700">{cat.category}</span>
                <span className="font-semibold text-slate-700 tabular-nums">{cat.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor:
                      cat.percentage >= 70
                        ? '#16A34A'
                        : cat.percentage >= 50
                        ? '#2563EB'
                        : cat.percentage >= 30
                        ? '#F97316'
                        : '#DC2626',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 약점 분석 ── */}
      {weakPoints.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-1.5">
            <span>⚠️</span> 보완이 필요한 부분 ({weakPoints.length}개 항목 50% 미만)
          </h3>
          <ul className="space-y-2.5">
            {weakPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-red-700 leading-relaxed">
                <span className="shrink-0 w-4 h-4 rounded-full bg-red-200 text-red-700 flex items-center justify-center text-[10px] font-bold mt-0.5">
                  {i + 1}
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── 맞춤 조언 ── */}
      {advice.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-base font-bold text-blue-900 mb-4">💡 맞춤 조언</h3>
          <ul className="space-y-2.5">
            {advice.map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-blue-800 leading-relaxed">
                <span className="shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── 권장 다음 단계 ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-base font-bold text-[#1E293B] mb-4">📋 권장 다음 단계</h3>
        <ol className="space-y-3">
          {nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
              <span className="shrink-0 w-6 h-6 rounded-full border-2 border-[#2563EB] text-[#2563EB] text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* ── 관련 계산기 연결 ── */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-[#1E293B]">보상금 규모도 계산해 보세요</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href="/calc/average-wage"
            className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-[#2563EB]/50 hover:shadow-sm transition-all text-sm"
          >
            <span className="text-xl">💰</span>
            <div>
              <p className="font-semibold text-slate-800">평균임금 계산기</p>
              <p className="text-xs text-slate-400">모든 보상금의 기준</p>
            </div>
          </Link>
          <Link
            href="/calc/injury-leave-pay"
            className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-[#2563EB]/50 hover:shadow-sm transition-all text-sm"
          >
            <span className="text-xl">🏥</span>
            <div>
              <p className="font-semibold text-slate-800">휴업급여 계산기</p>
              <p className="text-xs text-slate-400">평균임금의 70%</p>
            </div>
          </Link>
          <Link
            href="/calc/disability-pay"
            className="flex-1 flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-[#2563EB]/50 hover:shadow-sm transition-all text-sm"
          >
            <span className="text-xl">📋</span>
            <div>
              <p className="font-semibold text-slate-800">장해급여 계산기</p>
              <p className="text-xs text-slate-400">등급별 보상일수</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── 하단 버튼 ── */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 py-3 rounded-xl border-2 border-slate-300 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-colors"
        >
          다시 진단하기
        </button>
        <Link
          href="/report"
          className="flex-1 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm transition-colors text-center"
        >
          종합 리포트 보기
        </Link>
      </div>

      <p className="text-xs text-slate-400 text-center leading-relaxed px-4">
        ※ 본 진단은 참고용이며 법적 효력이 없습니다. 정확한 판단은 근로복지공단 또는 전문 노무사와 상담하세요.
      </p>
    </div>
  );
}
