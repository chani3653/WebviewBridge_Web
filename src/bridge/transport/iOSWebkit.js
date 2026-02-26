export function sendToIOS(handlerName, msg) {
  const handler = window.webkit?.messageHandlers?.[handlerName];
  if (!handler?.postMessage)
    throw new Error("iOS messageHandler not found: " + handlerName);
  handler.postMessage(msg);
}

// Web -> iOS로 "응답" 보낼 때도 동일 채널 사용
export function replyToIOS(handlerName, res) {
  sendToIOS(handlerName, { kind: "response", ...res });
}

// Native -> Web event 수신용 (iOS에서 inject할 예정)
export function isIOS() {
  return !!window.webkit?.messageHandlers;
}
