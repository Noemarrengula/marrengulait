import { useEffect, useRef } from "react";

const originalOverflow = new Map<string, string>();

export function useLockedBody(locked: boolean, key = "default") {
  const keyRef = useRef(key);

  useEffect(() => {
    if (locked) {
      const original = document.body.style.overflow;
      originalOverflow.set(keyRef.current, original);
      document.body.style.overflow = "hidden";
    } else {
      const prev = originalOverflow.get(keyRef.current);
      if (prev !== undefined) {
        document.body.style.overflow = prev;
        originalOverflow.delete(keyRef.current);
      }
    }

    return () => {
      const prev = originalOverflow.get(keyRef.current);
      if (prev !== undefined) {
        document.body.style.overflow = prev;
        originalOverflow.delete(keyRef.current);
      }
    };
  }, [locked]);
}
