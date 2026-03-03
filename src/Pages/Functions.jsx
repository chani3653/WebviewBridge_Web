import { useMemo, useState } from "react";
import { SendToNative, requestNative } from "../Bridge/BridgeAction";

const uid = () => `req-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const Functions = () => {
  const [pressed, setPressed] = useState(null);
  const [keyValue, setKeyValue] = useState("");
  const [valueValue, setValueValue] = useState("");

  const pulse = (key) => {
    setPressed(key);
    window.setTimeout(() => setPressed(null), 180);
  };

  const onGetToken = async () => {
    try {
      const token = await requestNative({
        action: "native.token.get",
        payload: {},
      });
      console.log("✅ token:", token);
    } catch (e) {
      console.error("❌ token error:", e);
    }
  };

  const items = useMemo(
    () => [
      {
        key: "vibrate",
        title: "진동",
        message: () => ({
          kind: "request",
          id: uid(),
          from: "Web",
          to: "Native",
          action: "native.haptic.vibrate",
          payload: { style: "medium" },
        }),
      },
      {
        key: "pushPermission",
        title: "푸시 알림(권한 포함)",
        message: () => ({
          kind: "request",
          id: uid(),
          from: "Web",
          to: "Native",
          action: "native.push.requestPermission",
          payload: {},
        }),
      },

      {
        key: "tokenGet",
        title: "토큰값 가져오기",
        message: () => ({
          kind: "request",
          id: uid(),
          from: "Web",
          to: "Native",
          action: "native.token.get",
          payload: {},
        }),
      },
      {
        key: "toast",
        title: "토스트 메시지",
        message: () => ({
          kind: "request",
          id: uid(),
          from: "Web",
          to: "Native",
          action: "native.ui.toast",
          payload: { message: "HELLO FROM WEB" },
        }),
      },
      {
        key: "openExternal",
        title: "외부앱 열기(example.com)",
        message: () => ({
          kind: "request",
          id: uid(),
          from: "Web",
          to: "Native",
          action: "native.app.openExternal",
          payload: { url: "https://example.com" },
        }),
      },
    ],
    [],
  );

  return (
    <div className="functionList">
      {items.map((it) => (
        <button
          key={it.key}
          type="button"
          className={`funcBtn ${pressed === it.key ? "pressed" : ""}`}
          onClick={async () => {
            pulse(it.key);

            if (it.key === "tokenGet") {
              await onGetToken();
              return;
            }

            const msg = it.message();
            console.log("[Web -> Native]", msg);

            const ok = SendToNative(msg);
            if (!ok) {
              // 웹브라우저에서 테스트할 때만 경고용
              alert("iOS bridge가 연결되어 있지 않습니다.");
            }
          }}
        >
          {it.title}
        </button>
      ))}
      {/* <div className="nativeStorageCard">
        <div className="storageTitle">네이티브 스토리지</div>

        <div className="storageField">
          <div className="storageLabel">Key</div>
          <input
            className="storageInput"
            value={keyValue}
            onChange={(e) => setKeyValue(e.target.value)}
            placeholder="키 값을 입력하세요"
          />
        </div>

        <div className="storageField">
          <div className="storageLabel">Value</div>
          <input
            className="storageInput"
            value={valueValue}
            onChange={(e) => setValueValue(e.target.value)}
            placeholder="벨류 값을 입력하세요"
          />
        </div>

        <button
          className={`storageSaveBtn ${pressed ? "pressed" : ""}`}
          onClick={handleSave}
          type="button"
        >
          저장
        </button>
      </div> */}
    </div>
  );
};

export default Functions;
