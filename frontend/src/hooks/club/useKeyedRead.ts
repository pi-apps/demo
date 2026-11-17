import { useCallback, useEffect, useRef, useState } from "react";
import type { Failure, Loadable } from "./plans";

// One read from the chain, tied to a key (the session, the wallet...). Its answer is stored with the key and the
// attempt it answers, so until the newest one lands the caller sees loading: neither a retried read nor a previous
// session's answer is ever shown as the current one. A null key means "nothing to read yet". The request is shared
// per key and attempt, because React runs effects twice in development: one read, and one consent screen.
export const useKeyedRead = <T>(key: string | null, load: () => Promise<T>, toFailure: (err: unknown) => Failure) => {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; value: Loadable<T> } | null>(null);
  const request = useRef<{ key: string; promise: Promise<T> } | null>(null);
  const loaders = useRef({ load, toFailure });
  useEffect(() => {
    loaders.current = { load, toFailure };
  });

  const fullKey = key === null ? null : `${key}#${attempt}`;
  useEffect(() => {
    if (fullKey === null) {
      return;
    }
    if (request.current?.key !== fullKey) {
      request.current = { key: fullKey, promise: loaders.current.load() };
    }
    let current = true;
    request.current.promise.then(
      value => current && setResult({ key: fullKey, value: { status: "ready", value } }),
      err => {
        console.error("Pi Bakery Club read failed:", err);
        if (current) setResult({ key: fullKey, value: loaders.current.toFailure(err) });
      }
    );
    return () => {
      current = false;
    };
  }, [fullKey]);

  const state: Loadable<T> = result && result.key === fullKey ? result.value : { status: "loading" };
  const retry = useCallback(() => setAttempt(n => n + 1), []);
  return { state, retry };
};
