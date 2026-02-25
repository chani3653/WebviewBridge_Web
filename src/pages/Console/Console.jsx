import {
  useBridgeLogs,
  clearBridgeLogs,
} from "../../features/bridgeInspector/store/useBridgeLogStore";

export default function Console() {
  const logs = useBridgeLogs();

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3 style={{ margin: "8px 0" }}>Console</h3>
        <button style={smallBtn} onClick={clearBridgeLogs}>
          Clear
        </button>
      </div>

      <div style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>
        logs: {logs.length}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {logs.map((l) => (
          <div key={`${l.type}-${l.id}-${l.at}`} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <b>{l.type.toUpperCase()}</b>
              <span style={{ color: "#666" }}>
                {l.durationMs != null ? `${l.durationMs}ms` : ""}
              </span>
            </div>
            <div style={{ marginTop: 4, fontSize: 12 }}>
              <div>
                <b>action:</b> {l.action}
              </div>
              <div>
                <b>id:</b> {l.id}
              </div>
              {"ok" in l ? (
                <div>
                  <b>ok:</b> {String(l.ok)}
                </div>
              ) : null}
            </div>
            <pre style={pre}>
              {JSON.stringify(
                { payload: l.payload, data: l.data, error: l.error },
                null,
                2,
              )}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

const smallBtn = {
  height: 32,
  padding: "0 10px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "#fff",
  fontWeight: 700,
};

const card = {
  border: "1px solid #eee",
  borderRadius: 12,
  padding: 12,
};

const pre = {
  margin: "8px 0 0",
  padding: 10,
  background: "#f7f7f7",
  borderRadius: 10,
  overflowX: "auto",
  fontSize: 12,
};
