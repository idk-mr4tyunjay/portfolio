import { SITE } from "@/data/site";
import styles from "./LowerSections.module.css";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className={styles.contact}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Have something in mind?</p>
        <a href={`mailto:${SITE.email}`} className={styles.contactHeadingLink}>
          <h2 id="contact-heading">Let&apos;s make<br />something useful.</h2>
          <span className={styles.contactArrow} aria-hidden="true">↗</span>
          <span className="sr-only">Send {SITE.name} an email</span>
        </a>
        <div className={styles.contactBottom}>
          <div>
            <p>A project, a question, or a good rabbit hole.<br />I&apos;d like to hear it.</p>
            <a href={`mailto:${SITE.email}`} className={styles.email}>{SITE.email}</a>
          </div>
          <nav className={styles.socials} aria-label="Elsewhere on the web">
            <a href={SITE.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            <a href={SITE.linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
            <a href={SITE.producthunt} target="_blank" rel="noreferrer">Product Hunt <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
      </div>
    </section>
  );
}
