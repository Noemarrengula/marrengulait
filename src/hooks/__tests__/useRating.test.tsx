import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRating } from '../useRating';

describe('useRating', () => {
  it('should return correct rating data', () => {
    const { result } = renderHook(() => useRating(4));
    
    expect(result.current.rating).toBe(4);
    expect(result.current.maxRating).toBe(5);
    expect(result.current.percentage).toBe(80);
  });

  it('should normalize rating within bounds', () => {
    const { result: resultHigh } = renderHook(() => useRating(10));
    expect(resultHigh.current.rating).toBe(5);

    const { result: resultLow } = renderHook(() => useRating(-1));
    expect(resultLow.current.rating).toBe(0);
  });

  it('should render correct number of stars', () => {
    const { result } = renderHook(() => useRating(3));
    const stars = result.current.renderStars();
    
    expect(stars).toHaveLength(5);
  });

  it('should use custom maxRating', () => {
    const { result } = renderHook(() => useRating(8, { maxRating: 10 }));
    
    expect(result.current.maxRating).toBe(10);
    expect(result.current.percentage).toBe(80);
  });

  it('should calculate percentage correctly', () => {
    const { result } = renderHook(() => useRating(2.5, { maxRating: 5 }));
    expect(result.current.percentage).toBe(50);
  });
});
