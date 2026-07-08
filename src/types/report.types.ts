import type { CalcType } from './calculator.types';

/** 개별 계산 결과 항목 */
export interface ReportItem {
  calcType: CalcType;
  title: string;
  amount: number;
  savedAt: string;
  summary: string;
}

/** 종합 리포트 데이터 */
export interface ReportData {
  /** 리포트 생성 일시 */
  generatedAt: string;
  /** 이름 (선택) */
  name?: string;
  /** 계산 결과 목록 */
  items: ReportItem[];
  /** 총 합계 */
  totalAmount: number;
}

/** 리포트 섹션 */
export interface ReportSection {
  title: string;
  items: ReportItem[];
}
