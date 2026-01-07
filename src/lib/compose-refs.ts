import * as React from "react";

interface RefObject<T> {
  current: T | null;
}

const setRef = <T,>(ref: React.Ref<T> | undefined, value: T | null) => {
  if (typeof ref === "function") {
    return ref(value);
  }

  if (ref !== null && ref !== undefined) {
    (ref as RefObject<T>).current = value;
  }
};

export const composeRefs = <T,>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> => {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });

    if (hasCleanup) {
      return () => {
        for (let index = 0; index < cleanups.length; index += 1) {
          const cleanup = cleanups[index];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[index], null);
          }
        }
      };
    }

    return undefined;
  };
};

export const useComposedRefs = <T,>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> => {
  return composeRefs(...refs);
};


