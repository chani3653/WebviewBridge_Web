export function sendToIOS(handlerName, msg) {
  const handler = window.webkit?.messageHandlers?.[handlerName];
  if (!handler?.postMessage) return false; // 브라우저면 false
  handler.postMessage(msg);
  return true;
}

export function replyToIOS(handlerName, res) {
  return sendToIOS(handlerName, { kind: "response", ...res });
}

export function emitToIOS(handlerName, evt) {
  return sendToIOS(handlerName, { kind: "event", ...evt });
}

export function hasIOSBridge(handlerName = "bridge") {
  return !!window.webkit?.messageHandlers?.[handlerName]?.postMessage;
}
