'use client';

import { useState, useEffect } from 'react';

interface Props {
  onComplete: () => void;
}

const ANALYZING_STEPS = [
  { icon: '📋', text: '입력하신 정보를 정리하고 있습니다...' },
  { icon: '⚖️', text: '산업재해보상보험법 관련 조항을 검토하고 있습니다...' },
  { icon: '📊', text: '근로복지공단 승인 기준과 대조하고 있습니다...' },
  { icon: '🔍', text: '유사 판례 데이터를 분석하고 있습니다...' },
  { icon: '✅', text: '종합 분석 결과를 생성하고 있습니다...' },
];

const TOTAL_DURATION = 5000; // ms

export default function DiagnosisAnalyzing({ onComplete }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 텍스트 전환: 1초마다
    const textInterval = setInterval(() => {
      setCurrentStepIndex((prev) =>
        prev < ANALYZING_STEPS.length - 1 ? prev + 1 : prev
      );
    }, 1000);

    // 프로그레스 바: 50ms마다 easeInOutCubic 진행
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const linear = Math.min(elapsed / TOTAL_DURATION, 1);
      const eased =
        linear < 0.5
          ? 4 * linear * linear * linear
          : 1 - Math.pow(-2 * linear + 2, 3) / 2;
      setProgress(Math.round(eased * 100));

      if (elapsed >= TOTAL_DURATION) {
        clearInterval(progressInterval);
        clearInterval(textInterval);
        setTimeout(onComplete, 500);
      }
    }, 50);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  // onComplete는 부모 렌더마다 새 참조가 생기므로 의존성에서 제외
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = ANALYZING_STEPS[currentStepIndex];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* 상단 프로그레스 바 */}
      <div className="h-1 bg-slate-100">
        <div
          className="h-full bg-[#2563EB] transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-8 sm:p-12 flex flex-col items-center text-center gap-8">
        {/* 원형 스피너 + 궤도 점 + 아이콘 */}
        <div className="relative w-24 h-24">
          {/* 느린 회전 링 */}
          <svg
            className="absolute inset-0 animate-spin-slow"
            viewBox="0 0 96 96"
            fill="none"
          >
            <circle cx="48" cy="48" r="42" stroke="#E2E8F0" strokeWidth="5" />
            <path
              d="M48 6 A42 42 0 0 1 90 48"
              stroke="#2563EB"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
          {/* 궤도 점 3개 */}
          <span
            className="absolute w-2.5 h-2.5 rounded-full bg-[#2563EB] opacity-80 animate-orbit-1"
            style={{ top: '50%', left: '50%', marginTop: '-5px', marginLeft: '-5px' }}
          />
          <span
            className="absolute w-2 h-2 rounded-full bg-[#60A5FA] opacity-60 animate-orbit-2"
            style={{ top: '50%', left: '50%', marginTop: '-4px', marginLeft: '-4px', animationDelay: '-1.2s' }}
          />
          <span
            className="absolute w-1.5 h-1.5 rounded-full bg-[#93C5FD] opacity-50 animate-orbit-3"
            style={{ top: '50%', left: '50%', marginTop: '-3px', marginLeft: '-3px', animationDelay: '-2s' }}
          />
          {/* 중앙 아이콘 */}
          <span className="absolute inset-0 flex items-center justify-center text-3xl">
            {current.icon}
          </span>
        </div>

        {/* 현재 단계 텍스트 */}
        <div className="space-y-1.5 min-h-[3rem] flex flex-col items-center justify-center">
          <p
            key={currentStepIndex}
            className="text-base font-semibold text-[#1E293B] animate-fade-text"
          >
            {current.text}
          </p>
          <p className="text-xs text-slate-400">
            AI가 판례·고시 기준을 분석 중입니다
          </p>
        </div>

        {/* 퍼센티지 + 진행 바 */}
        <div className="w-full max-w-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>분석 중</span>
            <span className="font-semibold text-[#2563EB]">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-full transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 단계 점 */}
        <div className="flex gap-2">
          {ANALYZING_STEPS.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i <= currentStepIndex ? 'bg-[#2563EB] scale-110' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
