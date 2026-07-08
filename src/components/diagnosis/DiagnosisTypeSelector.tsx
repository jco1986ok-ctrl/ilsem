import type { DiagnosisType } from '@/lib/constants/self-diagnosis-data';

interface DiagnosisTypeSelectorProps {
  onSelect: (type: DiagnosisType) => void;
}

export default function DiagnosisTypeSelector({ onSelect }: DiagnosisTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 text-sm text-blue-800 leading-relaxed">
        <strong>산재는 크게 두 가지 유형</strong>으로 나뉩니다. 본인 상황에 맞는 유형을 선택하세요.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TypeCard
          emoji="🏗️"
          title="업무상 사고"
          subtitle="사고 유형"
          desc="일하다 다치거나 출퇴근 중 사고가 난 경우"
          examples={[
            '작업 중 추락·협착·화상',
            '배달·출장 중 교통사고',
            '회사 시설 결함으로 인한 부상',
          ]}
          questionCount={8}
          color="blue"
          onClick={() => onSelect('accident')}
        />
        <TypeCard
          emoji="🫀"
          title="업무상 질병"
          subtitle="질병 유형"
          desc="업무로 인해 질병이 발생하거나 악화된 경우"
          examples={[
            '과로로 인한 뇌졸중·심근경색',
            '반복 작업으로 인한 허리디스크',
            '직장 내 스트레스로 인한 우울증',
          ]}
          questionCount={11}
          color="violet"
          onClick={() => onSelect('disease')}
        />
      </div>
    </div>
  );
}

interface TypeCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  desc: string;
  examples: string[];
  questionCount: number;
  color: 'blue' | 'violet';
  onClick: () => void;
}

function TypeCard({ emoji, title, subtitle, desc, examples, questionCount, color, onClick }: TypeCardProps) {
  const borderHover =
    color === 'blue'
      ? 'hover:border-[#2563EB]/50 hover:bg-blue-50/50'
      : 'hover:border-violet-400/50 hover:bg-violet-50/50';
  const badgeClass =
    color === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700';
  const btnClass =
    color === 'blue'
      ? 'bg-[#2563EB] hover:bg-[#1D4ED8]'
      : 'bg-violet-600 hover:bg-violet-700';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-2xl border-2 border-slate-200 p-6 transition-all duration-200 cursor-pointer ${borderHover}`}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="text-3xl">{emoji}</span>
        <div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
            {subtitle}
          </span>
          <h3 className="text-lg font-bold text-[#1E293B] mt-1">{title}</h3>
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-4 leading-relaxed">{desc}</p>

      <ul className="space-y-1.5 mb-4">
        {examples.map((ex) => (
          <li key={ex} className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
            {ex}
          </li>
        ))}
      </ul>

      <p className="text-xs text-slate-400 mb-4">총 {questionCount}문항 (약 3분 소요)</p>

      <div className={`w-full text-center text-white text-sm font-semibold py-2.5 rounded-xl transition-colors ${btnClass}`}>
        이 유형으로 시작하기 →
      </div>
    </button>
  );
}
