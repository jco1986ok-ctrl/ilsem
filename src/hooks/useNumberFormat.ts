'use client';

import { useState, useCallback, ChangeEvent } from 'react';
import { formatNumber, parseFormattedNumber } from '@/lib/helpers';

interface UseNumberFormatReturn {
  displayValue: string;
  numericValue: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setValue: (value: number) => void;
  reset: () => void;
}

export function useNumberFormat(initialValue = 0): UseNumberFormatReturn {
  const [displayValue, setDisplayValue] = useState(
    initialValue > 0 ? formatNumber(initialValue) : ''
  );
  const [numericValue, setNumericValue] = useState(initialValue);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(raw, 10) || 0;
    setNumericValue(num);
    setDisplayValue(num > 0 ? formatNumber(num) : '');
  }, []);

  const setValue = useCallback((value: number) => {
    setNumericValue(value);
    setDisplayValue(value > 0 ? formatNumber(value) : '');
  }, []);

  const reset = useCallback(() => {
    setNumericValue(0);
    setDisplayValue('');
  }, []);

  return { displayValue, numericValue, onChange, setValue, reset };
}

/** 콤마 포맷 입력값 파싱 유틸 */
export function useFormattedInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(raw, 10) || 0;
    setValue(num > 0 ? formatNumber(num) : '');
  }, []);

  return {
    value,
    numericValue: parseFormattedNumber(value),
    onChange: handleChange,
    reset: () => setValue(''),
  };
}
