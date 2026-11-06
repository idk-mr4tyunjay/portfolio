import Link from "next/link";
import { SITE } from "@/data/site";
import styles from "./LowerSections.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} ${styles.footerInner}`}>
        <Link href="/" className={styles.signature}>{SITE.name}<span aria-hidden="true">.</span></Link>
        <p>© {new Date().getFullYear()} · Built with care. <a href="/studio/ATTRIBUTION.txt" target="_blank" rel="noreferrer">Scene credits</a></p>
        <a href="#top" className={styles.backToTop}>Back to top <span aria-hidden="true">↑</span></a>
      </div>
    </footer>
  );
}
