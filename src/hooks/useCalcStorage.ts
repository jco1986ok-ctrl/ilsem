'use client';

import { useState, useEffect, useCallback } from 'react';
import { saveCalcResult, loadCalcResult, removeCalcResult } from '@/lib/storage';

interface CalcStorageState<T> {
  data: T | null;
  savedAt: string | null;
  isSaved: boolean;
}

export function useCalcStorage<T>(calcKey: string) {
  const [state, setState] = useState<CalcStorageState<T>>({
    data: null,
    savedAt: null,
    isSaved: false,
  });

  useEffect(() => {
    const loaded = loadCalcResult<T>(calcKey);
    if (loaded) {
      setState({ data: loaded.data, savedAt: loaded.savedAt, isSaved: true });
    }
  }, [calcKey]);

  const save = useCallback(
    (data: T) => {
      saveCalcResult(calcKey, data);
      setState({ data, savedAt: new Date().toISOString(), isSaved: true });
    },
    [calcKey]
  );

  const remove = useCallback(() => {
    removeCalcResult(calcKey);
    setState({ data: null, savedAt: null, isSaved: false });
  }, [calcKey]);

  return { ...state, save, remove };
}
