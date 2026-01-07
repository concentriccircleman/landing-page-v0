import * as React from "react";

export const useLazyRef = <T,>(getValue: () => T): React.RefObject<T> => {
  const valueRef = React.useRef<T | null>(null);

  if (valueRef.current === null) {
    valueRef.current = getValue();
  }

  return valueRef as React.RefObject<T>;
};


