const logs = [];
const listeners = new Set();
const requests = new Map(); // id -> timestamp

const notify = () => {
  const snapshot = { logs: [...logs] };
  listeners.forEach((cb) => {
    try {
      cb(snapshot);
    } catch (e) {
      // ignore listener errors
    }
  });
};

export const getLogsState = () => ({ logs: [...logs] });

export const subscribeLogs = (cb) => {
  // call immediately with current state
  cb(getLogsState());
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const clearLogs = () => {
  logs.length = 0;
  requests.clear();
  notify();
};

const pushLog = (entry) => {
  // newest first
  logs.unshift(entry);
  // keep a reasonable cap
  if (logs.length > 200) logs.length = 200;
  notify();
};

export const logWebToNative = (msg) => {
  const id = msg?.id || `req-${Date.now()}`;
  const entry = {
    id,
    directionLabel: "Web -> Native",
    level: "neutral",
    payload: msg,
    elapsedMs: null,
    createdAt: Date.now(),
  };
  requests.set(id, Date.now());
  pushLog(entry);
};

export const logNativeToWeb = (msg) => {
  const id = msg?.id;
  const started = id ? requests.get(id) : null;
  const elapsed = started ? Date.now() - started : null;
  const ok = msg?.ok ?? (msg && msg.error ? false : true);

  const entry = {
    id: id || `res-${Date.now()}`,
    directionLabel: "Native -> Web",
    level: ok ? "success" : "fail",
    payload: msg,
    elapsedMs: elapsed,
    createdAt: Date.now(),
  };

  if (id) requests.delete(id);
  pushLog(entry);
};

export const logGeneric = (label, payload, opts = {}) => {
  const entry = {
    id: opts.id || `log-${Date.now()}`,
    directionLabel: label,
    level: opts.level || "neutral",
    payload,
    elapsedMs: opts.elapsedMs ?? null,
    createdAt: Date.now(),
  };
  pushLog(entry);
};

export default {
  getLogsState,
  subscribeLogs,
  clearLogs,
  logWebToNative,
  logNativeToWeb,
  logGeneric,
};
