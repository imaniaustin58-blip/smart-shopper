import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

interface StoreState {
  list: string[];
  tracked: string[];
}

const EMPTY: StoreState = { list: [], tracked: [] };
const KEY = "shopscout.state.v1";

interface StoreCtx extends StoreState {
  toggleList: (id: string) => void;
  toggleTracked: (id: string) => void;
  inList: (id: string) => boolean;
  isTracked: (id: string) => boolean;
  clearList: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function ShoppingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(EMPTY);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const toggle = useCallback((key: keyof StoreState, id: string) => {
    setState((s) => ({
      ...s,
      [key]: s[key].includes(id) ? s[key].filter((x) => x !== id) : [...s[key], id],
    }));
  }, []);

  const value: StoreCtx = {
    ...state,
    toggleList: (id) => toggle("list", id),
    toggleTracked: (id) => toggle("tracked", id),
    inList: (id) => state.list.includes(id),
    isTracked: (id) => state.tracked.includes(id),
    clearList: () => setState((s) => ({ ...s, list: [] })),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShopping() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShopping must be used within ShoppingProvider");
  return ctx;
}
