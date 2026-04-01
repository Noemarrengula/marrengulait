import { useCallback, useEffect } from 'react';

export const useScrollToTop = (trigger?: unknown) => {
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    if (trigger !== undefined) {
      scrollToTop();
    }
  }, [trigger, scrollToTop]);

  return scrollToTop;
};

export const scrollToTopInstant = () => {
  window.scrollTo({
    top: 0,
    behavior: 'instant'
  });
};

export default useScrollToTop;
