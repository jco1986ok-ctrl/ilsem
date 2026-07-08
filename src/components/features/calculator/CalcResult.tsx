interface ResultItem {
  label: string;
  value: string;
  highlight?: boolean;
}

interface CalcResultProps {
  title?: string;
  items: ResultItem[];
  note?: string;
}

export default function CalcResult({ title = '계산 결과', items, note }: CalcResultProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-blue-600 px-6 py-4">
        <h3 className="text-white font-bold text-lg">{title}</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between px-6 py-4 ${
              item.highlight ? 'bg-blue-50' : ''
            }`}
          >
            <span className={`text-sm ${item.highlight ? 'font-semibold text-blue-800' : 'text-gray-600'}`}>
              {item.label}
            </span>
            <span className={`font-bold ${item.highlight ? 'text-blue-700 text-lg' : 'text-gray-900'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
      {note && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500">{note}</p>
        </div>
      )}
    </div>
  );
}
