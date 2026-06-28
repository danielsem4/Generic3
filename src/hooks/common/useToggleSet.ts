import { useState } from "react";

/**
 * Manage a set of string keys that are "on" (present). Generic show/hide state,
 * e.g. tracking which chart series are currently hidden.
 */
export function useToggleSet() {
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const isHidden = (key: string) => hidden.has(key);

  return { isHidden, toggle };
}
