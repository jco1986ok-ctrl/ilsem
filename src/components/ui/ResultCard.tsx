interface ResultCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  highlight?: boolean;
  icon?: string;
}

export default function ResultCard({ label, value, subValue, highlight = false, icon }: ResultCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        highlight
          ? 'bg-blue-600 border-blue-600 text-white'
          : 'bg-white border-gray-200 text-gray-900'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-medium mb-1 ${highlight ? 'text-blue-100' : 'text-gray-500'}`}>
            {label}
          </p>
          <p className={`text-xl font-bold truncate ${highlight ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          {subValue && (
            <p className={`text-xs mt-1 ${highlight ? 'text-blue-200' : 'text-gray-400'}`}>
              {subValue}
            </p>
          )}
        </div>
        {icon && <span className="text-2xl shrink-0">{icon}</span>}
      </div>
    </div>
  );
}
