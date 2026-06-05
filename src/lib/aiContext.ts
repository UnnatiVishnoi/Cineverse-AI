import { useSyncExternalStore, useEffect } from "react";
import type { Title } from "./data";

export type AIFilters = {
  q?: string;
  type?: string;
  genre?: string;
  ott?: string;
  language?: string;
  mood?: string;
  yearFrom?: number;
  yearTo?: number;
  sort?: string;
};

type State = { title: Title | null; filters: AIFilters };
let state: State = { title: null, filters: {} };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

export function setAIContext(title: Title | null) {
  state = { ...state, title };
  emit();
}
export function setAIFilters(filters: AIFilters) {
  state = { ...state, filters };
  emit();
}

export function useAIContext() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
    () => state,
  );
}

export function useProvideAIContext(title: Title | null) {
  useEffect(() => { setAIContext(title); return () => setAIContext(null); }, [title?.id]);
}
export function useProvideAIFilters(filters: AIFilters) {
  useEffect(() => {
    setAIFilters(filters);
    return () => setAIFilters({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);
}
