import { addBridgeLog } from "../../features/bridgeInspector/store/useBridgeLogStore";

export function attachFakeNativeReceiver() {
  // Web->Native로 postMessage를 보내면, 브라우저에서는 iOS가 없으니 여기로 들어오게끔 흉내
  window.__nativeReceiveFromWeb = function (msg) {
    addBridgeLog({
      type: "web_to_native",
      kind: msg?.kind,
      id: msg?.id,
      eventType: msg?.type,
      ok: msg?.ok,
      data: msg?.data,
      error: msg?.error,
      at: Date.now(),
      platform: "web",
    });
  };
}
