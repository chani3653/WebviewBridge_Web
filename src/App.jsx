import React, { useEffect, useMemo, useState } from "react";
import Tabs from "./Components/Tabs";
import Functions from "./Pages/Functions";
import ConsolePage from "./Pages/Console";
import StoragePage from "./Pages/Storage";
// import { initBridgeReceiver } from "./bridge/bridge";
// import { clearLogs } from "./bridge/logStore";

const App = () => {
  const [tab, setTab] = useState("function");

  const tabs = useMemo(
    () => [
      { key: "function", label: "기능" },
      { key: "console", label: "콘솔" },
      { key: "data", label: "데이터" },
    ],
    [],
  );

  return (
    <div className="page">
      <div className="frame">
        <div className="topHeader">
          <div className="headerRow">
            <div className="title">WebView</div>
            {tab === "console" ? (
              // <button className="clearLink" type="button" onClick={clearLogs}>
              <button className="clearLink" type="button">
                clear
              </button>
            ) : (
              <div style={{ width: 48 }} />
            )}
          </div>

          <Tabs tabs={tabs} value={tab} onChange={setTab} />
        </div>

        <div className="content">
          {tab === "function" && <Functions />}
          {tab === "console" && <ConsolePage />}
          {tab === "data" && <StoragePage />}
        </div>
      </div>
    </div>
  );
};

export default App;
