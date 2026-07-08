'use client';

import type { Question } from '@/lib/constants/self-diagnosis-data';
import type { DiagnosisType } from '@/lib/constants/self-diagnosis-data';
import DiagnosisProgress from './DiagnosisProgress';
import DiagnosisQuestion from './DiagnosisQuestion';

type AnswerValue = string | string[] | number;

interface DiagnosisStepProps {
  question: Question;
  diagnosisType: DiagnosisType;
  currentStep: number;
  totalSteps: number;
  answer: AnswerValue | undefined;
  onAnswer: (value: AnswerValue) => void;
  onNext: () => void;
  onPrev: () => void;
  isLast: boolean;
  onSubmit: () => void;
  onChangeType: () => void;
}

/** answer 값을 DiagnosisQuestion에 전달할 string[] 로 정규화 */
function toSelectedIds(answer: AnswerValue | undefined): string[] {
  if (answer === undefined) return [];
  if (typeof answer === 'number') return [answer.toString()];
  if (typeof answer === 'string') return [answer];
  return answer;
}

export default function DiagnosisStep({
  question,
  diagnosisType,
  currentStep,
  totalSteps,
  answer,
  onAnswer,
  onNext,
  onPrev,
  isLast,
  onSubmit,
  onChangeType,
}: DiagnosisStepProps) {
  const selectedIds = toSelectedIds(answer);

  /** toggle → onAnswer 변환 */
  const handleToggle = (choiceIdOrValue: string) => {
    if (question.type === 'number') {
      const num = parseInt(choiceIdOrValue, 10);
      onAnswer(Number.isNaN(num) ? 0 : num);
      return;
    }

    if (question.type === 'single') {
      onAnswer(choiceIdOrValue);
      return;
    }

    // multiple
    const NONE_ID = question.choices.find(
      (c) =>
        (c.score === 0 || c.score === undefined) &&
        (c.id.endsWith('-1') ||
          c.id.endsWith('_1') ||
          c.label === '해당 없음' ||
          c.label === '없음')
    )?.id;

    if (choiceIdOrValue === NONE_ID) {
      onAnswer([choiceIdOrValue]);
      return;
    }

    const withoutNone = NONE_ID
      ? selectedIds.filter((id) => id !== NONE_ID)
      : selectedIds;

    const next = withoutNone.includes(choiceIdOrValue)
      ? withoutNone.filter((id) => id !== choiceIdOrValue)
      : [...withoutNone, choiceIdOrValue];

    onAnswer(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          {diagnosisType === 'accident' ? '🏗️ 업무상 사고' : '🫀 업무상 질병'}
        </span>
        <button
          onClick={onChangeType}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          유형 변경
        </button>
      </div>

      <DiagnosisProgress
        current={currentStep + 1}
        total={totalSteps}
        category={question.category}
      />

      <DiagnosisQuestion
        question={question}
        selectedIds={selectedIds}
        onToggle={handleToggle}
        onNext={isLast ? onSubmit : onNext}
        onPrev={onPrev}
        isFirst={currentStep === 0}
        isLast={isLast}
      />
    </div>
  );
}
