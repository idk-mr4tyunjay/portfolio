import Link from "next/link";
import { WORK_ENTRIES, type WorkEntry } from "@/data/work";
import { ProjectImage } from "@/components/work/ProjectImage";
import styles from "@/components/work/Work.module.css";

function WorkCaption({ entry, featured = false }: { entry: WorkEntry; featured?: boolean }) {
  return (
    <div className={`${styles.caption} ${featured ? styles.featuredCaption : ""}`}>
      <div>
        <p className={styles.captionMeta}>{entry.discipline}</p>
        <h3>{entry.name}<span className={styles.linkArrow} aria-hidden="true">↗</span></h3>
      </div>
      <div className={styles.captionSummary}>
        <p>{entry.summary}</p>
        <span className={styles.readLink}>View project <span aria-hidden="true">↗</span></span>
      </div>
    </div>
  );
}

export function WorkIndex({ preview = false }: { preview?: boolean } = {}) {
  const [featured, ...otherWork] = WORK_ENTRIES.filter((entry) => entry.kind === "work");

  return (
    <section id={preview ? undefined : "index"} tabIndex={preview ? undefined : -1} aria-labelledby={preview ? undefined : "work-heading"} className={styles.workSection}>
      <div className={styles.sectionHeading}>
        <h2 id={preview ? undefined : "work-heading"}>Selected work<span className={styles.headingDot}>.</span></h2>
        <p>From the first build<br />to the things people use.</p>
      </div>
      {featured && (
        <article>
          <Link href={`/work/${featured.slug}`} className={styles.projectLink} aria-label={`View ${featured.name} project`}>
            <div className={`${styles.imageStage} ${styles.featuredStage}`}>
              <div className={styles.stageMeta}><span>Currently building</span><span>{featured.period}</span></div>
              {featured.image && <ProjectImage image={featured.image} />}
            </div>
            <WorkCaption entry={featured} featured />
          </Link>
        </article>
      )}
      <div className={styles.otherWork}>
        {otherWork.map((entry) => (
          <article className={styles.secondary} key={entry.slug}>
            <Link href={`/work/${entry.slug}`} className={styles.projectLink} aria-label={`View ${entry.name} project`}>
              <div className={`${styles.imageStage} ${entry.products ? styles.teamStage : styles.archiveStage}`}>
                <div className={styles.stageMeta}>
                  <span>{entry.products ? `${entry.products.length} products, one team` : "BREX / archived project"}</span>
                  <span>{entry.period}</span>
                </div>
                {entry.image && <ProjectImage image={entry.image} sizes="(min-width: 768px) 55vw, 100vw" />}
                {entry.products && <div className={styles.productNames}>{entry.products.map((product) => <span key={product.name}>{product.name}</span>)}</div>}
              </div>
              <WorkCaption entry={entry} />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
