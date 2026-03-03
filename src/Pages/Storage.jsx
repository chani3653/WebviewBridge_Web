import React, { useEffect, useMemo, useState } from "react";

const StoragePage = () => {
  const [items, setItems] = useState([]);

  const refresh = () => {
    const arr = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      arr.push({ key, value });
    }
    arr.sort((a, b) => a.key.localeCompare(b.key));
    setItems(arr);
  };

  useEffect(() => {
    refresh();
  }, []);

  const rows = useMemo(() => {
    // 스샷처럼 1줄 JSON으로 표현
    return items.map((it) => {
      // value가 JSON string이면 그대로 쓰고, 아니면 string으로 넣어줌
      let v = it.value;
      try {
        // JSON 가능하면 파싱 후 다시 stringify(정렬된 느낌)
        const parsed = JSON.parse(it.value);
        v = parsed;
      } catch {
        v = it.value;
      }
      return { [it.key]: v };
    });
  }, [items]);

  return (
    <div className="dataList">
      {items.length === 0 ? (
        <div className="dataRow">
          <div className="dataKeyBar">
            <div className="dataKeyText">Key값</div>
          </div>
          <div className="dataValueBox">value 값</div>
        </div>
      ) : (
        items.map((it) => (
          <div key={it.key} className="dataRow">
            <div className="dataKeyBar">
              <div className="dataKeyText">{it.key}</div>
            </div>

            <div className="dataValueBox">
              {(() => {
                // value가 JSON이면 예쁘게, 아니면 문자열 그대로
                try {
                  const parsed = JSON.parse(it.value);
                  return (
                    <pre className="dataValuePre">
                      {JSON.stringify(parsed, null, 2)}
                    </pre>
                  );
                } catch {
                  return (
                    <div className="dataValueText">
                      {String(it.value ?? "")}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StoragePage;
