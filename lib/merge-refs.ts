import { useCallback, type MutableRefObject, type Ref } from "react";

type AnyRef<T> = Ref<T> | MutableRefObject<T | null> | undefined;

function assignRef<T>(target: AnyRef<T>, node: T | null) {
  if (!target) return;
  if (typeof target === "function") {
    target(node);
    return;
  }
  const mutable = target as MutableRefObject<T | null>;
  mutable.current = node;
}

// A plain inline arrow function passed as `ref` gets a new identity on every
// render, forcing React to detach and reattach it each time — which tears
// down anything set up on attach (e.g. an IntersectionObserver) far more
// often than intended. This returns a single stable callback ref that
// forwards the node to both refs. Both refs are expected to have stable
// identities across renders (a ref object, or a memoized callback ref).
export function useMergedRefs<T>(refA: AnyRef<T>, refB: AnyRef<T>) {
  return useCallback(
    (node: T | null) => {
      assignRef(refA, node);
      assignRef(refB, node);
    },
    [refA, refB]
  );
}
