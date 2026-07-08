'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { calculatorList } from '@/lib/constants/calculatorList';

export { calculatorList };

export default function CalcSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <h2 className="text-sm font-bold text-gray-700 mb-3 px-2">전체 계산기</h2>
        <nav className="flex flex-col gap-1">
          {calculatorList.map((item) => (
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
          ))}
        </nav>
      </div>
    </aside>
  );
}
