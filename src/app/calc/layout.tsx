import CalcSidebar from '@/components/layout/CalcSidebar';

export default function CalcLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <CalcSidebar />
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
