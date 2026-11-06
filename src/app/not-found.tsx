import Link from "next/link";
import { Nav } from "@/components/home/Nav";
import { Footer } from "@/components/home/Footer";
import styles from "@/components/notes/Notes.module.css";

export default function NotFound() {
  return (
    <div id="top">
      <Nav />
      <main id="main-content" className={styles.notFound}>
        <span className={styles.errorCode}>404</span>
        <h1>A little off the map.</h1>
        <p>This page doesn&apos;t exist. The link may have changed, or there may be a typo in the address.</p>
        <div>
          <Link href="/">Back to the portfolio <span aria-hidden="true">↗</span></Link>
          <Link href="/notes">Browse the notes <span aria-hidden="true">↗</span></Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
