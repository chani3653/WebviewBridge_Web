import { useSyncExternalStore } from "react";

const state = {
  logs: [],
};

const listeners = new Set();

function emit() {
  listeners.forEach((l) => l());
}

export function addBridgeLog(log) {
  state.logs = [log, ...state.logs].slice(0, 200); // 최근 200개
  emit();
}

export function clearBridgeLogs() {
  state.logs = [];
  emit();
}

export function useBridgeLogs() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state.logs,
  );
}
