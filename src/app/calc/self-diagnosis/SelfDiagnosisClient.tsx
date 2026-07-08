'use client';

import { useState, useRef, useMemo } from 'react';
import {
  getQuestions,
  type DiagnosisType,
} from '@/lib/constants/self-diagnosis-data';
import {
  calculateDiagnosisScore,
  buildAnswers,
  getVisibleQuestions,
  type DiagnosisResult,
} from '@/lib/calculators/selfDiagnosis';
import DiagnosisTypeSelector from '@/components/diagnosis/DiagnosisTypeSelector';
import DiagnosisStep from '@/components/diagnosis/DiagnosisStep';
import DiagnosisAnalyzing from '@/components/diagnosis/DiagnosisAnalyzing';
import DiagnosisResultView from '@/components/diagnosis/DiagnosisResult';

type Phase = 'select' | 'questions' | 'analyzing' | 'result';
type AnswerValue = string | string[] | number;

function toStringArray(value: AnswerValue | undefined): string[] {
  if (value === undefined) return [];
  if (typeof value === 'number') return [value.toString()];
  if (typeof value === 'string') return [value];
  return value;
}

function toStringArrayMap(answers: Record<string, AnswerValue>): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(answers).map(([k, v]) => [k, toStringArray(v)])
  );
}

export default function SelfDiagnosisClient() {
  const [phase, setPhase] = useState<Phase>('select');
  const [diagnosisType, setDiagnosisType] = useState<DiagnosisType>('accident');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const topRef = useRef<HTMLDivElement>(null);

  const allQuestions = getQuestions(diagnosisType);
  const strAnswers = useMemo(() => toStringArrayMap(answers), [answers]);
  const activeQuestions = useMemo(
    () => getVisibleQuestions(allQuestions, strAnswers),
    [allQuestions, strAnswers]
  );

  const scrollTop = () =>
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);

  /* ── 유형 선택 ── */
  const handleTypeSelect = (type: DiagnosisType) => {
    setDiagnosisType(type);
    setAnswers({});
    setCurrentStep(0);
    setPhase('questions');
    scrollTop();
  };

  /* ── 현재 질문 답변 업데이트 ── */
  const handleAnswer = (value: AnswerValue) => {
    const qId = activeQuestions[currentStep]?.id;
    if (!qId) return;
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  /* ── 다음 질문 ── */
  const handleNext = () => {
    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep((s) => s + 1);
      scrollTop();
    }
  };

  /* ── 이전 질문 ── */
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      scrollTop();
    }
  };

  /* ── 마지막 질문 제출 → 분석 단계 ── */
  const handleSubmit = () => {
    const latest = getVisibleQuestions(allQuestions, strAnswers);
    const answerRecords = buildAnswers(strAnswers, latest);
    const res = calculateDiagnosisScore(answerRecords, diagnosisType);
    setResult(res);
    setPhase('analyzing');
    scrollTop();

    try {
      localStorage.setItem(
        'ilsem-diagnosis',
        JSON.stringify({ type: diagnosisType, result: res, timestamp: new Date().toISOString() })
      );
    } catch {
      // localStorage 사용 불가 환경에서 무시
    }
  };

  /* ── 분석 완료 ── */
  const handleAnalysisComplete = () => {
    setPhase('result');
    scrollTop();
  };

  /* ── 초기화 ── */
  const handleReset = () => {
    setPhase('select');
    setAnswers({});
    setCurrentStep(0);
    setResult(null);
    scrollTop();
  };

  /* ═══════════════════════════════ */
  return (
    <div ref={topRef} className="scroll-mt-20 space-y-6">
      {/* 헤더 */}
      <div className="flex items-start gap-4">
        <span className="text-4xl">🩺</span>
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">산재 승인 자가진단</h1>
          <p className="text-slate-500 mt-1 text-sm">
            산재보험법 제37조 기준 · 내 상황이 산재로 인정될 가능성을 진단합니다
          </p>
        </div>
      </div>

      {phase === 'select' && (
        <DiagnosisTypeSelector onSelect={handleTypeSelect} />
      )}

      {phase === 'questions' && activeQuestions[currentStep] && (
        <DiagnosisStep
          question={activeQuestions[currentStep]}
          diagnosisType={diagnosisType}
          currentStep={currentStep}
          totalSteps={activeQuestions.length}
          answer={answers[activeQuestions[currentStep].id]}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrev={handlePrev}
          isLast={currentStep === activeQuestions.length - 1}
          onSubmit={handleSubmit}
          onChangeType={handleReset}
        />
      )}

      {phase === 'analyzing' && (
        <DiagnosisAnalyzing onComplete={handleAnalysisComplete} />
      )}

      {phase === 'result' && result && (
        <DiagnosisResultView
          result={result}
          type={diagnosisType}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
