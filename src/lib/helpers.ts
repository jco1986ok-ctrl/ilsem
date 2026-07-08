/**
 * 숫자에 천 단위 콤마 포맷 적용
 * @example formatNumber(1234567) → "1,234,567"
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('ko-KR');
}

/**
 * 원화 포맷 (콤마 + "원" 단위 추가)
 * @example formatWon(1234567) → "1,234,567원"
 */
export function formatWon(value: number): string {
  return `${formatNumber(Math.round(value))}원`;
}

/**
 * 콤마가 포함된 문자열을 숫자로 변환
 * @example parseFormattedNumber("1,234,567") → 1234567
 */
export function parseFormattedNumber(value: string): number {
  return parseFloat(value.replace(/,/g, '')) || 0;
}

/**
 * 두 날짜 사이의 일수 계산 (시작일 포함)
 */
export function getDaysBetween(startDate: Date, endDate: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.floor((end.getTime() - start.getTime()) / msPerDay) + 1;
}

/**
 * 두 날짜 사이의 개월 수 계산 (소수점 포함)
 */
export function getMonthsBetween(startDate: Date, endDate: Date): number {
  const years = endDate.getFullYear() - startDate.getFullYear();
  const months = endDate.getMonth() - startDate.getMonth();
  const days = endDate.getDate() - startDate.getDate();
  return years * 12 + months + days / 30;
}

/**
 * 날짜를 YYYY-MM-DD 형식 문자열로 변환
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * YYYY-MM-DD 문자열을 Date 객체로 변환
 */
export function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

/**
 * 퍼센트 포맷
 * @example formatPercent(12.5) → "12.5%"
 */
export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

/**
 * 소수점 자리수 반올림
 */
export function roundTo(value: number, digits = 0): number {
  const factor = Math.pow(10, digits);
  return Math.round(value * factor) / factor;
}

/**
 * 숫자 범위 클램프
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
