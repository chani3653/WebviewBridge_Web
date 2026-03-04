import { logWebToNative, logNativeToWeb } from "./ConsoleAction";

const uid = () => `req-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const pending = new Map(); // id -> { resolve, reject, timeoutId }

export const SendToNative = (data) => {
  try {
    logWebToNative(data);
  } catch (e) {
    // ignore logging errors
  }

  const bridge = window.webkit?.messageHandlers?.bridge;
  if (!bridge) {
    console.warn("[Bridge] iOS bridge not available", data);
    // also add a failure log as if native responded with an error
    try {
      logNativeToWeb({ id: data?.id, kind: "response", ok: false, error: "No native bridge found", original: data });
    } catch (e) {
      // ignore
    }
    return false;
  }
  bridge.postMessage(data);
  return true;
};

// ✅ Native -> Web 응답 수신 함수(네이티브가 이걸 호출하게 만들 것)
window.onNativeMessage = (msg) => {
  try {
    try {
      logNativeToWeb(msg);
    } catch (e) {
      // ignore logging errors
    }
    const { id, kind, ok, result, error } = msg || {};
    if (!id) return;

    const entry = pending.get(id);
    if (!entry) return;

    clearTimeout(entry.timeoutId);
    pending.delete(id);

    // kind가 response일 때 처리
    if (kind === "response") {
      if (ok) entry.resolve(result);
      else entry.reject(error ?? "Unknown error");
    }
  } catch (e) {
    console.error("[Bridge] onNativeMessage error", e);
  }
};

// ✅ Web -> Native 요청 (Promise)
export const requestNative = ({ action, payload = {}, timeoutMs = 8000 }) => {
  const id = uid();

  const msg = {
    kind: "request",
    id,
    from: "Web",
    to: "Native",
    action,
    payload,
  };

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      pending.delete(id);
      try {
        logNativeToWeb({ id, kind: "response", ok: false, error: `Native timeout: ${action}`, payload: { action, payload } });
      } catch (e) {
        // ignore logging errors
      }
      reject(new Error(`Native timeout: ${action}`));
    }, timeoutMs);

    pending.set(id, { resolve, reject, timeoutId });

    const ok = SendToNative(msg);
    if (!ok) {
      clearTimeout(timeoutId);
      pending.delete(id);
      reject(new Error("iOS bridge not available"));
    }
  });
};
