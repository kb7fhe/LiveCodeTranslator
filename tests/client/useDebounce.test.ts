import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../../src/client/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    // Change the value
    rerender({ value: 'updated' });

    // Value should still be initial
    expect(result.current).toBe('initial');

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Now value should be updated
    expect(result.current).toBe('updated');
  });

  it('resets timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    );

    // Rapid changes
    rerender({ value: 'change1' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: 'change2' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: 'change3' });

    // Value should still be initial
    expect(result.current).toBe('initial');

    // Fast forward to complete the debounce
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should have the final value
    expect(result.current).toBe('change3');
  });
});
