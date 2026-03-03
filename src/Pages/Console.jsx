import React, { useEffect, useMemo, useState } from "react";
// import { clearLogs, getLogsState, subscribeLogs } from "../bridge/logStore";

const ConsolePage = ({ onClearVisible }) => {
  // const [logs, setLogs] = useState(getLogsState().logs);
  const [logs, setLogs] = useState("");

  // useEffect(() => {
  //   const unsub = subscribeLogs((s) => setLogs(s.logs));
  //   return () => unsub();
  // }, []);

  const view = useMemo(() => logs, [logs]);

  const levelToClass = (level) => {
    if (level === "success") return "success";
    if (level === "error" || level === "fail") return "fail";
    return "neutral";
  };

  const directionToPillClass = (label) => {
    // "Web -> Native" or "Native -> Web" or custom
    if (
      label?.toLowerCase().includes("web") &&
      label?.toLowerCase().includes("native")
    ) {
      if (
        label.toLowerCase().includes("web") &&
        label.toLowerCase().includes("to native")
      )
        return "webToNative";
    }
    if (
      label?.toLowerCase().includes("native") &&
      label?.toLowerCase().includes("web")
    ) {
      if (
        label.toLowerCase().includes("native") &&
        label.toLowerCase().includes("to web")
      )
        return "nativeToWeb";
    }

    // fallback: "Web -> Native" / "Native -> Web"
    if (label === "Web -> Native") return "webToNative";
    if (label === "Native -> Web") return "nativeToWeb";

    // 기본값: webToNative
    return "webToNative";
  };

  const directionLabelNormalize = (label) => {
    // 스샷 표기: "Web to Native", "Native to Web"
    if (label === "Web -> Native") return "Web to Native";
    if (label === "Native -> Web") return "Native to Web";
    return label || "Native to Web";
  };

  const statusLabel = (level) => {
    if (level === "success") return "Success";
    if (level === "error" || level === "fail") return "Fail";
    return "Neutral";
  };

  return (
    <div className="consoleList">
      {view.map((l) => {
        const cardClass = levelToClass(l.level);
        const dirText = directionLabelNormalize(l.directionLabel);
        const dirClass =
          dirText === "Web to Native"
            ? "webToNative"
            : dirText === "Native to Web"
              ? "nativeToWeb"
              : directionToPillClass(dirText);

        return (
          <div key={l.id} className={`logCard ${cardClass}`}>
            <div className="logTopRow">
              <div className="leftPills">
                <span className={`statusPill ${cardClass}`}>
                  {statusLabel(l.level)}
                </span>
                <span className={`dirPill ${dirClass}`}>{dirText}</span>
              </div>

              <div className="msText">
                {typeof l.elapsedMs === "number" ? `${l.elapsedMs}ms` : ""}
              </div>
            </div>

            <div className="logBody">
              <pre className="logPre">{JSON.stringify(l.payload, null, 2)}</pre>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConsolePage;
