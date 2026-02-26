import { addBridgeLog } from "../../features/bridgeInspector/store/useBridgeLogStore";
import { sendToWebMock } from "../transport/webMock";
import { replyToIOS } from "../transport/iOSWebkit";

export function attachNativeInbox({ handlerName = "bridge" } = {}) {
  // iOS에서 웹으로 request를 보내면,
  // 웹은 그걸 처리하고 iOS로 response를 돌려준다.
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
      const res = await sendToWebMock(req); // 일단 동일 mock 로직으로 처리
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

      replyToIOS(handlerName, response);
      return response;
    } catch (e) {
      const response = {
        id: req.id,
        ok: false,
        error: { code: "WEB_HANDLER_ERROR", message: e?.message || String(e) },
        meta: { ts: Date.now(), durationMs: Date.now() - startedAt },
      };

      addBridgeLog({
        type: "native_response",
        id: req.id,
        action: req.action,
        ok: false,
        error: response.error,
        at: Date.now(),
        durationMs: response.meta.durationMs,
      });

      replyToIOS(handlerName, response);
      return response;
    }
  };
}
