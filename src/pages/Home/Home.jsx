import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ margin: "8px 0" }}>Hybrid Bridge Inspector</h2>
      <p style={{ margin: "0 0 16px", color: "#444", lineHeight: 1.5 }}>
        iOS WebView ↔ Web 간 브릿지 액션을 구조화하고, Request/Response를 콘솔로
        관찰하는 데모입니다.
      </p>

      <button style={btn} onClick={() => nav("/playground")}>
        Playground
      </button>
      <div style={{ height: 8 }} />
      <button style={btn} onClick={() => nav("/console")}>
        Console
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
