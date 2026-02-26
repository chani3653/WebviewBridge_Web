import { addBridgeLog } from "../../features/bridgeInspector/store/useBridgeLogStore";
import { sendToWebMock } from "../transport/webMock";
import { replyToIOS } from "../transport/iOSWebkit";

export function attachNativeInbox({ handlerName = "bridge" } = {}) {
  // Native -> Web request 진입점
  window.__bridgeReceiveFromNative = async function (req) {
    const startedAt = Date.now();

    addBridgeLog({
      type: "native_request",
      id: req?.id,
      action: req?.action,
      payload: req?.payload,
      at: startedAt,
      platform: "ios",
    });

    try {
      // 웹에서는 동일 mock 로직으로 처리(= 나중에 실제 웹 로직으로 바꿔도 됨)
      const res = await sendToWebMock(req);

      const response = {
        id: req.id,
        ok: res.ok,
        data: res.data,
        error: res.error,
        meta: { ts: Date.now(), durationMs: Date.now() - startedAt },
      };

      addBridgeLog({
        type: "native_response",
        id: req.id,
        action: req.action,
        ok: response.ok,
        data: response.data,
        error: response.error,
        at: Date.now(),
        durationMs: response.meta.durationMs,
      });

      // 성공 케이스 내부
      const ok = replyToIOS(handlerName, response);

      if (!ok) {
        // 브라우저 모드: 실제 iOS로는 못 보내므로 조용히 종료
        return response;
      }

      return response;
    } catch (e) {
      const response = {
        id: req?.id,
        ok: false,
        error: { code: "WEB_HANDLER_ERROR", message: e?.message || String(e) },
        meta: { ts: Date.now(), durationMs: Date.now() - startedAt },
      };

      addBridgeLog({
        type: "native_response",
        id: req?.id,
        action: req?.action,
        ok: false,
        error: response.error,
        at: Date.now(),
        durationMs: response.meta.durationMs,
      });

      const ok = replyToIOS(handlerName, response);

      if (!ok) {
        // 브라우저 모드: 실제 iOS로는 못 보내므로 조용히 종료
        return response;
      }

      return response;
    }
  };

  // Native -> Web event 진입점 (푸시/딥링크/네트워크상태 등)
  window.__bridgeEmitEventFromNative = function (evt) {
    addBridgeLog({
      type: "native_event",
      eventType: evt?.type,
      payload: evt?.payload,
      at: Date.now(),
      platform: "ios",
    });
  };
}
