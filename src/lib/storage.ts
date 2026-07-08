const STORAGE_KEY_PREFIX = 'ilsem_';

/** 로컬스토리지에 계산 결과 저장 */
export function saveCalcResult<T>(calcKey: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    const key = `${STORAGE_KEY_PREFIX}${calcKey}`;
    localStorage.setItem(key, JSON.stringify({ data, savedAt: new Date().toISOString() }));
  } catch {
    // 스토리지 용량 초과 등 오류 무시
  }
}

/** 로컬스토리지에서 계산 결과 불러오기 */
export function loadCalcResult<T>(calcKey: string): { data: T; savedAt: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = `${STORAGE_KEY_PREFIX}${calcKey}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** 특정 계산 결과 삭제 */
export function removeCalcResult(calcKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${calcKey}`);
  } catch {
    // 무시
  }
}

/** 모든 일셈 계산 결과 삭제 */
export function clearAllCalcResults(): void {
  if (typeof window === 'undefined') return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // 무시
  }
}

/** 저장된 모든 계산 결과 키 목록 반환 */
export function getAllCalcKeys(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEY_PREFIX)) {
        keys.push(key.replace(STORAGE_KEY_PREFIX, ''));
      }
    }
    return keys;
  } catch {
    return [];
  }
}
