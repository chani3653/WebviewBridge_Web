import styles from "./MobileShell.module.scss";
import TopBar from "../../../shared/Components/TopBar/TopBar";

export default function MobileShell({ children }) {
  return (
    <div className={styles.shell}>
      <div className={styles.frame}>
        <TopBar />
        {children}
      </div>
    </div>
  );
}
