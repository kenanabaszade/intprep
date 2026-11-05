"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { initialState } from "@/lib/learning";
import { loadState, saveState } from "@/lib/storage";
import type { State, Localized } from "@/lib/types";
type Context = {
  state: State;
  setState: Dispatch<SetStateAction<State>>;
  ready: boolean;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  t: (value: Localized) => string;
};
const Context = createContext<Context | null>(null);
export function Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [storageHealthy, setStorageHealthy] = useState(false);
  useEffect(() => {
    loadState()
      .then((value) => {
        setState(value);
        setStorageHealthy(true);
      })
      .catch(() =>
        setError(
          "Local storage could not be loaded. Existing data has not been overwritten. Export your current session before leaving. / Lokal yaddaş oxunmadı. Mövcud məlumat əvəz edilmədi.",
        ),
      )
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (ready && storageHealthy)
      saveState(state).catch(() =>
        setError(
          "Saving failed. Export a backup in Settings before leaving. / Saxlama alınmadı. Settings-dən backup çıxar.",
        ),
      );
  }, [state, ready, storageHealthy]);
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
    document.documentElement.lang = state.locale;
  }, [state.theme, state.locale]);
  return (
    <Context.Provider
      value={{
        state,
        setState,
        ready,
        error,
        setError,
        t: (value) => value[state.locale],
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAcademy() {
  const c = useContext(Context);
  if (!c) throw new Error("Provider missing");
  return c;
}
