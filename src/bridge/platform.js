export function detectPlatform() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod"))
    return "ios";
  if (ua.includes("android")) return "android";
  return "web";
}
