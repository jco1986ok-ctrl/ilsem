interface DiagnosisProgressProps {
  current: number;
  total: number;
  category: string;
}

export default function DiagnosisProgress({
  current,
  total,
  category,
}: DiagnosisProgressProps) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full">
          {category}
        </span>
        <span>
          {current} / {total}
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#2563EB] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
