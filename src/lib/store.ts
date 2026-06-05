import { useCallback, useEffect, useState } from "react";

export function useLocalList(key: string) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
  }, [key]);

  const persist = useCallback((next: string[]) => {
    setIds(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  }, [key]);

  const toggle = useCallback((id: string) => {
    setIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [id, ...prev];
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const push = useCallback((id: string) => {
    setIds(prev => {
      const next = [id, ...prev.filter(x => x !== id)].slice(0, 30);
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);

  return { ids, toggle, has, push, set: persist };
}
