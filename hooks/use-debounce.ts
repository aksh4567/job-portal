import { useEffect, useState } from "react";

export const useDebounce = <T>({
  value,
  delay = 500,
}: {
  value: T;
  delay?: number;
}): T => {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    //update the debounce value after the delay
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    //clean up to clear timeout
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounceValue;
};
