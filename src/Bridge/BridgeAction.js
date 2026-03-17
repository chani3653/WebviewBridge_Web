import { logWebToNative, logNativeToWeb } from "./ConsoleAction";

const uid = () => `req-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const pending = new Map(); // id -> { resolve, reject, timeoutId }

// ─── Mock Native Bridge ────────────────────────────────────────────────────
// iOS bridge가 없는 브라우저 환경에서 action별 샘플 응답을 자동 반환합니다.

const MOCK_RESPONSES = {
  "native.haptic.vibrate": { ok: true, result: {} },
  "native.push.requestPermission": { ok: true, result: { status: "granted" } },
  "native.token.get": { ok: true, result: { token: "mock-token-abc123" } },
  "native.ui.toast": { ok: true, result: {} },
  "native.app.openExternal": { ok: true, result: {} },
};

const simulateMockResponse = (msg) => {
  const mock = MOCK_RESPONSES[msg.action];
  if (!mock) return;

  const delay = 300 + Math.random() * 200; // 300~500ms
  setTimeout(() => {
    window.onNativeMessage({
      kind: "response",
      id: msg.id,
      ...mock,
    });
  }, delay);
};

// ─── Send ──────────────────────────────────────────────────────────────────

export const SendToNative = (data) => {
  try {
    logWebToNative(data);
  } catch (e) {
    // ignore logging errors
  }

  const bridge = window.webkit?.messageHandlers?.bridge;
  if (!bridge) {
    console.warn("[Bridge] iOS bridge not available, using mock", data);
    simulateMockResponse(data);
    return true; // mock이 대신 처리
  }
  bridge.postMessage(data);
  return true;
};

// ─── Receive ───────────────────────────────────────────────────────────────
// 네이티브가 이 함수를 호출합니다.
// 처리하는 메시지 종류:
//   kind="push"     → native가 Web에 데이터를 밀어 넣음 (응답 불필요)
//   kind="request"  → native가 Web에 데이터를 요청함 (Web이 응답 전송)
//   kind="response" → native가 requestNative() Promise를 resolve/reject

window.onNativeMessage = (msg) => {
  try {
    const { id, kind, action, ok, result, error, payload } = msg || {};

    // ── Push: native → web (응답 불필요) ──────────────────────────────────
    if (kind === "push") {
      try {
        logNativeToWeb(msg);
      } catch (e) {
        // ignore
      }

      if (action === "native.storage.set") {
        const { key, value } = payload || {};
        if (key !== undefined) {
          localStorage.setItem(
            key,
            typeof value === "string" ? value : JSON.stringify(value),
          );
          window.dispatchEvent(new CustomEvent("webviewbridge.storage.updated"));
        }
      } else if (action === "native.storage.sync") {
        const { data } = payload || {};
        if (data && typeof data === "object") {
          Object.entries(data).forEach(([k, v]) => {
            localStorage.setItem(
              k,
              typeof v === "string" ? v : JSON.stringify(v),
            );
          });
          window.dispatchEvent(new CustomEvent("webviewbridge.storage.updated"));
        }
      }
      return;
    }

    // ── Request: native → web (Web이 응답 전송) ───────────────────────────
    if (kind === "request") {
      try {
        logNativeToWeb(msg);
      } catch (e) {
        // ignore
      }

      if (action === "web.token.get") {
        const token = localStorage.getItem("token") ?? null;
        const response = {
          kind: "response",
          id,
          from: "Web",
          to: "Native",
          ok: true,
          result: { token },
        };
        const bridge = window.webkit?.messageHandlers?.bridge;
        if (bridge) {
          bridge.postMessage(response);
        }
        try {
          logWebToNative(response);
        } catch (e) {
          // ignore
        }
      }
      return;
    }

    // ── Response: native → web (requestNative Promise 처리) ──────────────
    try {
      logNativeToWeb(msg);
    } catch (e) {
      // ignore
    }

    if (!id) return;
    const entry = pending.get(id);
    if (!entry) return;

    clearTimeout(entry.timeoutId);
    pending.delete(id);

    if (kind === "response") {
      if (ok) entry.resolve(result);
      else entry.reject(error ?? "Unknown error");
    }
  } catch (e) {
    console.error("[Bridge] onNativeMessage error", e);
  }
};

// ─── requestNative ─────────────────────────────────────────────────────────
// Promise 기반 Web → Native 요청

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
        logNativeToWeb({
          id,
          kind: "response",
          ok: false,
          error: `Native timeout: ${action}`,
          payload: { action, payload },
        });
      } catch (e) {
        // ignore
      }
      reject(new Error(`Native timeout: ${action}`));
    }, timeoutMs);

    pending.set(id, { resolve, reject, timeoutId });
    SendToNative(msg);
  });
};
