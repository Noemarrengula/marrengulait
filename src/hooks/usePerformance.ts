import { useState, useEffect, useCallback, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [RefObject<HTMLDivElement | null>, boolean] {
  const { threshold = 0.1, rootMargin = '0px', freezeOnceVisible = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [elementRef, setElementRef] = useState<RefObject<HTMLDivElement | null>>({ current: null });

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (freezeOnceVisible) {
            observer.unobserve(currentElement);
          }
        } else if (!freezeOnceVisible) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentElement);

    return () => {
      observer.unobserve(currentElement);
    };
  }, [elementRef, threshold, rootMargin, freezeOnceVisible]);

  return [elementRef as RefObject<HTMLDivElement | null>, isVisible];
}

export function useParallax(speed: number = 0.5) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setOffset(window.scrollY * speed);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
}

export function usePerformance() {
  const [isLowPerf, setIsLowPerf] = useState(false);

  useEffect(() => {
    const checkPerformance = () => {
      const nav = navigator as NavigatorWithConnection;
      if (nav.connection?.effectiveType) {
        const isSlow = ['slow-2g', '2g'].includes(nav.connection.effectiveType);
        setIsLowPerf(isSlow);
      }
      if ('getDeviceMemory' in navigator) {
        const memory = (navigator as NavigatorWithMemory).deviceMemory;
        if (memory && memory < 4) {
          setIsLowPerf(true);
        }
      }
    };

    checkPerformance();
    
    const nav = navigator as NavigatorWithConnection;
    if (nav.connection) {
      nav.connection.addEventListener('change', checkPerformance);
      return () => nav.connection.removeEventListener('change', checkPerformance);
    }
  }, []);

  return isLowPerf;
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useCallback(() => Date.now(), []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan() >= limit) {
        setThrottledValue(value);
      }
    }, limit - (Date.now() - lastRan()));

    return () => clearTimeout(handler);
  }, [value, limit, lastRan]);

  return throttledValue;
}

interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string;
    addEventListener: (type: string, listener: () => void) => void;
    removeEventListener: (type: string, listener: () => void) => void;
  };
}

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}
