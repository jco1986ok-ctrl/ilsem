'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { calculatorList } from '@/lib/constants/calculatorList';

export { calculatorList };

const GROUP_LABELS = {
  injury: '산재보상 계산기',
  worker: '근로자 필수 계산기',
} as const;

export default function CalcSidebar() {
  const pathname = usePathname();

  const injuryItems = calculatorList.filter((i) => i.group === 'injury');
  const workerItems = calculatorList.filter((i) => i.group === 'worker');

  const renderItem = (item: (typeof calculatorList)[number]) => (
    <Link
      key={item.href}
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
        pathname === item.href
          ? 'bg-blue-600 text-white font-medium shadow-sm'
          : 'text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm'
      }`}
    >
      <span className="text-base leading-none">{item.emoji}</span>
      <span className="leading-tight">{item.label}</span>
    </Link>
  );

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <nav className="flex flex-col gap-1">
          {/* 산재보상 계산기 */}
          <p className="text-xs font-semibold text-slate-400 tracking-wider px-3 pb-1">
            {GROUP_LABELS.injury}
          </p>
          {injuryItems.map(renderItem)}

          {/* 근로자 필수 계산기 */}
          <p className="text-xs font-semibold text-slate-400 tracking-wider px-3 pt-4 pb-1">
            {GROUP_LABELS.worker}
          </p>
          {workerItems.map(renderItem)}
        </nav>
      </div>
    </aside>
  );
}
