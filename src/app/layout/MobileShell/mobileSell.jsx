import styles from "./MobileShell.module.scss";

export default function MobileShell({ children }) {
  return (
    <div className={styles.shell}>
      <div className={styles.frame}>{children}</div>
    </div>
  );
}
