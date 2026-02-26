import { useEffect } from "react";
import { attachNativeInbox } from "../bridge/adapters/nativeInbox";
import { attachFakeNativeReceiver } from "../bridge/adapters/fakeNativeReceiver";

export default function Providers({ children }) {
  useEffect(() => {
    attachNativeInbox({ handlerName: "bridge" });
    attachFakeNativeReceiver(); // 브라우저 개발용
  }, []);

  return children;
}
