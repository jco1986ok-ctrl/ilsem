'use client';

import { useState, useEffect } from 'react';
import type { Question } from '@/lib/constants/self-diagnosis-data';

interface DiagnosisQuestionProps {
  question: Question;
  /** single이면 길이 1, multiple이면 0~n개, number이면 숫자 문자열 1개 */
  selectedIds: string[];
  /** 선택지 클릭 또는 숫자 입력 (single/multiple/number 구분은 내부 처리) */
  onToggle: (choiceIdOrValue: string) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function DiagnosisQuestion({
  question,
  selectedIds,
  onToggle,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: DiagnosisQuestionProps) {
  const isMultiple = question.type === 'multiple';
  const isNumber = question.type === 'number';

  // number 타입 로컬 상태 (초기값: 이전에 입력한 값 또는 min)
  const cfg = question.numberConfig;
  const [numValue, setNumValue] = useState<number>(() => {
    if (isNumber && cfg) {
      const prev = parseInt(selectedIds[0] ?? '', 10);
      return Number.isNaN(prev) ? cfg.min : prev;
    }
    return 0;
  });

  // 질문이 바뀔 때 numValue를 동기화
  useEffect(() => {
    if (isNumber && cfg) {
      const prev = parseInt(selectedIds[0] ?? '', 10);
      setNumValue(Number.isNaN(prev) ? cfg.min : prev);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const canProceed = isNumber
    ? cfg !== undefined && numValue >= cfg.min && numValue <= cfg.max
    : selectedIds.length > 0;

  // number 타입: 현재 값이 해당하는 점수 구간 찾기
  function getCurrentRange() {
    if (!cfg) return null;
    return cfg.scoreRanges.find((r) => numValue >= r.min && numValue <= r.max) ?? null;
  }

  function handleNumberChange(val: number) {
    if (!cfg) return;
    const clamped = Math.max(cfg.min, Math.min(cfg.max, val));
    setNumValue(clamped);
    onToggle(clamped.toString());
  }

  return (
    <div className="space-y-6">
      {/* 질문 카드 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs font-semibold text-[#2563EB] uppercase tracking-wide">
            질문 {question.step}
          </p>
          {isMultiple && (
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              복수 선택 가능
            </span>
          )}
          {isNumber && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              숫자 입력
            </span>
          )}
        </div>

        <h2 className="text-xl font-bold text-[#1E293B] mb-2 leading-snug">
          {question.title}
        </h2>

        <div className="bg-slate-50 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-slate-500 leading-relaxed">
            💡 {question.subtitle}
          </p>
        </div>

        {/* number 타입 UI */}
        {isNumber && cfg && (
          <div className="space-y-5">
            {/* 슬라이더 + 직접 입력 */}
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={cfg.min}
                max={cfg.max}
                step={1}
                value={numValue}
                onChange={(e) => handleNumberChange(parseInt(e.target.value, 10))}
                className="flex-1 accent-[#2563EB]"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <input
                  type="number"
                  min={cfg.min}
                  max={cfg.max}
                  value={numValue}
                  onChange={(e) => handleNumberChange(parseInt(e.target.value, 10) || cfg.min)}
                  className="w-20 text-center text-lg font-bold border-2 border-[#2563EB] rounded-xl py-2 outline-none focus:ring-2 focus:ring-blue-200"
                />
                <span className="text-sm text-slate-500 whitespace-nowrap">{cfg.unit}</span>
              </div>
            </div>

            {/* 점수 구간 시각화 */}
            <div className="grid grid-cols-1 gap-2">
              {cfg.scoreRanges.map((range) => {
                const active = numValue >= range.min && numValue <= range.max;
                return (
                  <button
                    key={`${range.min}-${range.max}`}
                    type="button"
                    onClick={() => handleNumberChange(range.min)}
                    className={`text-left rounded-xl border-2 px-4 py-3 transition-all duration-150 ${
                      active
                        ? 'border-[#2563EB] bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`text-sm font-medium ${active ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}>
                      {range.max >= 100
                        ? `${range.min}${cfg.unit} 이상`
                        : `${range.min}~${range.max} ${cfg.unit}`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 현재 선택 구간 확인 */}
            {getCurrentRange() && (
              <div className="flex items-center gap-2 text-sm bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-[#2563EB] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[#2563EB] font-medium">
                  입력값 {numValue}{cfg.unit} 반영됨
                </span>
              </div>
            )}
          </div>
        )}

        {/* 선택지 목록 (single / multiple) */}
        {!isNumber && (
          <div className="space-y-2.5">
            {question.choices.map((choice) => {
              const isSelected = selectedIds.includes(choice.id);
              const score = choice.score ?? 0;
              const isNegative = score < 0;
              const isNeutral = score === 0 && (choice.id.endsWith('-1') || choice.id.endsWith('_1'));

              return (
                <button
                  key={choice.id}
                  onClick={() => onToggle(choice.id)}
                  className={`w-full text-left rounded-xl border-2 px-5 py-4 transition-all duration-150 ${
                    isSelected
                      ? isNegative
                        ? 'border-red-400 bg-red-50'
                        : 'border-[#2563EB] bg-blue-50'
                      : isNegative
                      ? 'border-slate-200 bg-white hover:border-red-200 hover:bg-red-50/40'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* 인디케이터 */}
                    {isMultiple ? (
                      <span
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? isNegative
                              ? 'border-red-500 bg-red-500'
                              : 'border-[#2563EB] bg-[#2563EB]'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </span>
                    ) : (
                      <span
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-[#2563EB] bg-[#2563EB]'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </span>
                    )}

                    {/* 텍스트 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className={`text-sm font-medium leading-snug ${
                            isSelected
                              ? isNegative
                                ? 'text-red-700'
                                : 'text-[#2563EB]'
                              : isNegative
                              ? 'text-red-600'
                              : 'text-[#1E293B]'
                          }`}
                        >
                          {choice.label}
                        </p>
                      </div>
                      {choice.description && (
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            isNegative ? 'text-red-400' : 'text-slate-400'
                          }`}
                        >
                          {choice.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 복수 선택 현황 */}
        {isMultiple && selectedIds.length > 0 && (
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
            <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              {selectedIds.length}
            </span>
            {selectedIds.length}개 선택됨
          </div>
        )}
      </div>

      {/* 이전/다음 버튼 */}
      <div className="flex gap-3">
        {!isFirst && (
          <button
            onClick={onPrev}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전
          </button>
        )}
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          {isLast ? '결과 확인하기' : '다음 질문'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
