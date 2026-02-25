import { uuid } from "../shared/utils/uuid";
import { detectPlatform } from "./platform";
import { sendToIOS } from "./transport/iOSWebkit";
import { sendToWebMock } from "./transport/webMock";
import { addBridgeLog } from "../features/bridgeInspector/store/useBridgeLogStore";

class Bridge {
  constructor() {
    this.platform = detectPlatform();
    this.handlerName = "bridge";
    this.pending = new Map();

    // iOS가 webView.evaluateJavaScript("window.postMessage(...)") 같은 방식으로 응답을 보낸다고 가정
    window.addEventListener("message", (e) => {
      const msg = e.data;
      if (msg?.id && typeof msg.ok === "boolean") {
        this._handleResponse(msg);
      }
    });
  }

  request(action, payload, { timeoutMs = 8000 } = {}) {
    const id = uuid();
    const startedAt = Date.now();

    const req = { id, action, payload };

    addBridgeLog({
      type: "request",
      id,
      action,
      payload,
      at: startedAt,
      platform: this.platform,
    });

    return new Promise(async (resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        this.pending.delete(id);
        addBridgeLog({
          type: "timeout",
          id,
          action,
          at: Date.now(),
          durationMs: Date.now() - startedAt,
        });
        reject(new Error(`Bridge timeout: ${action}`));
      }, timeoutMs);

      this.pending.set(id, { resolve, reject, timeoutId, action, startedAt });

      try {
        if (this.platform === "ios") {
          sendToIOS(this.handlerName, req);
        } else {
          // 웹/안드로이드(지금은 mock)
          const res = await sendToWebMock(req);
          this._handleResponse(res);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        this.pending.delete(id);
        addBridgeLog({
          type: "error",
          id,
          action,
          at: Date.now(),
          durationMs: Date.now() - startedAt,
          error: { message: err?.message || String(err) },
        });
        reject(err);
      }
    });
  }

  _handleResponse(res) {
    const p = this.pending.get(res.id);

    addBridgeLog({
      type: "response",
      id: res.id,
      action: p?.action,
      ok: res.ok,
      data: res.data,
      error: res.error,
      at: Date.now(),
      durationMs: p ? Date.now() - p.startedAt : undefined,
    });

    if (!p) return;

    clearTimeout(p.timeoutId);
    this.pending.delete(res.id);
    p.resolve(res);
  }
}

export const bridge = new Bridge();
