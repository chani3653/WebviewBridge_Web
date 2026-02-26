import {
  useBridgeLogs,
  clearBridgeLogs,
} from "../../features/bridgeInspector/store/useBridgeLogStore";
import styles from "./Console.module.scss";

function isNativeLogType(type) {
  return String(type).startsWith("native_");
}

export default function Console() {
  const logs = useBridgeLogs();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 style={{ margin: "8px 0" }}>Console</h3>
        <button className={styles.clearBtn} onClick={clearBridgeLogs}>
          Clear
        </button>
      </div>

      <div className={styles.meta}>logs: {logs.length}</div>

      <div className={styles.list}>
        {logs.map((l) => {
          const native = isNativeLogType(l.type);
          const okValue = typeof l.ok === "boolean" ? l.ok : null;

          return (
            <div
              key={`${l.type}-${l.id || l.eventType}-${l.at}`}
              className={styles.card}
            >
              <div className={styles.topRow}>
                <div className={styles.badges}>
                  <span
                    className={`${styles.badge} ${native ? styles.badgeNative : styles.badgeWeb}`}
                  >
                    {native ? "NATIVE" : "WEB"}
                  </span>

                  <span className={styles.badge}>
                    {String(l.type).toUpperCase()}
                  </span>

                  {okValue !== null ? (
                    <span
                      className={`${styles.badge} ${okValue ? styles.badgeOk : styles.badgeErr}`}
                    >
                      {okValue ? "OK" : "ERROR"}
                    </span>
                  ) : null}
                </div>

                <span style={{ color: "#666", fontSize: 12 }}>
                  {l.durationMs != null ? `${l.durationMs}ms` : ""}
                </span>
              </div>

              <div className={styles.kv}>
                {l.action ? (
                  <div>
                    <b>action:</b> {l.action}
                  </div>
                ) : null}
                {l.id ? (
                  <div>
                    <b>id:</b> {l.id}
                  </div>
                ) : null}
                {l.eventType ? (
                  <div>
                    <b>event:</b> {l.eventType}
                  </div>
                ) : null}
              </div>

              <pre className={styles.pre}>
                {JSON.stringify(
                  {
                    payload: l.payload,
                    data: l.data,
                    error: l.error,
                    eventPayload: l.payload, // event에서도 payload를 사용
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
