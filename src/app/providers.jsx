import { useEffect } from "react";
import { attachNativeInbox } from "../bridge/adapters/nativeInbox";

export default function Providers({ children }) {
  useEffect(() => {
    attachNativeInbox({ handlerName: "bridge" });
  }, []);

  return children;
}
