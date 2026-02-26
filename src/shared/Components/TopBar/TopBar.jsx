import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./TopBar.module.scss";

export default function TopBar() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const canGoBack = useMemo(() => pathname !== "/", [pathname]);

  //   const goBack = () => {
  //     // 웹뷰에서 history가 없을 수도 있어서 안전하게 처리
  //     if (window.history.length > 1) nav(-1);
  //     else nav("/");
  //   };

  const isPlayground = pathname.startsWith("/playground");
  const isConsole = pathname.startsWith("/console");

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.title}>Bridge Inspector</div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${isPlayground ? styles.active : ""}`}
            onClick={() => nav("/playground")}
          >
            Playground
          </button>
          <button
            className={`${styles.tabBtn} ${isConsole ? styles.active : ""}`}
            onClick={() => nav("/console")}
          >
            Console
          </button>
        </div>
      </div>
    </div>
  );
}
