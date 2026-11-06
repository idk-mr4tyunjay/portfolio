import Link from "next/link";
import { WORK_ENTRIES } from "@/data/work";
import { ProjectImage } from "@/components/work/ProjectImage";
import styles from "@/components/work/Work.module.css";

export function SideProjects() {
  return (
    <section id="selected" aria-labelledby="side-projects-heading" className={styles.sideSection}>
      <div className={styles.sideHeading}>
        <div>
          <p className={styles.sectionNote}>After hours</p>
          <h2 id="side-projects-heading">A little curiosity.<br />A lot of tabs.</h2>
        </div>
        <p>Personal tools and browser experiments.<br />Made because I wanted to.</p>
      </div>
      <div className={styles.sideProjects}>
        {WORK_ENTRIES.filter((entry) => entry.kind === "project").map((entry) => (
          <article key={entry.slug} className={styles.sideProject}>
            <Link href={`/work/${entry.slug}`} className={styles.sideImageLink} aria-label={`View ${entry.name} project`}>
              {entry.image && <ProjectImage image={entry.image} sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw" />}
              <span className={styles.imageOpen} aria-hidden="true">↗</span>
            </Link>
            <div className={styles.sideProjectTitle}>
              <h3><Link href={`/work/${entry.slug}`}>{entry.name}</Link></h3>
              <span>{entry.period}</span>
            </div>
            <p className={styles.sideSummary}>{entry.summary}</p>
            <div className={styles.sideProjectFooter}>
              <span>{entry.discipline}</span>
              {entry.links[0] && <a href={entry.links[0].url} target="_blank" rel="noreferrer" aria-label={`Open ${entry.name} in a new tab`}>Open <span aria-hidden="true">↗</span></a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
