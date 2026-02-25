import { auth, device, navigation, storage, ui } from "../../bridge/actions";

export default function Playground() {
  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: "8px 0" }}>Playground</h3>

      <button style={btn} onClick={() => auth.getToken()}>
        auth.getToken
      </button>
      <div style={{ height: 8 }} />

      <button style={btn} onClick={() => device.haptic("light")}>
        device.haptic(light)
      </button>
      <div style={{ height: 8 }} />

      <button
        style={btn}
        onClick={() => navigation.openExternal("https://example.com")}
      >
        navigation.openExternal
      </button>
      <div style={{ height: 8 }} />

      <button
        style={btn}
        onClick={() => storage.set("demo", { a: 1, t: Date.now() })}
      >
        storage.set(demo)
      </button>
      <div style={{ height: 8 }} />

      <button style={btn} onClick={() => storage.get("demo")}>
        storage.get(demo)
      </button>
      <div style={{ height: 8 }} />

      <button style={btn} onClick={() => ui.toast("Hello from web")}>
        ui.toast
      </button>
    </div>
  );
}

const btn = {
  width: "100%",
  height: 44,
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "#fff",
  fontWeight: 700,
};
