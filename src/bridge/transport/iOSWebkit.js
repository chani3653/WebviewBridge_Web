export function sendToIOS(handlerName, req) {
  const handler = window.webkit?.messageHandlers?.[handlerName];
  if (!handler?.postMessage)
    throw new Error("iOS messageHandler not found: " + handlerName);
  handler.postMessage(req);
}
