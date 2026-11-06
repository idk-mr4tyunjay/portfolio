import Link from "next/link";
import type { WorkEntry } from "@/data/work";
import { ProjectImage } from "./ProjectImage";
import styles from "./Work.module.css";

export function ProjectDetail({ entry, next }: { entry: WorkEntry; next: WorkEntry }) {
  const heroImage = entry.images[0] ?? entry.products?.[0]?.image ?? entry.image;

  return (
    <article className={styles.detail}>
      <Link href={`/#${entry.kind === "work" ? "index" : "selected"}`} className={styles.backLink}>
        <span aria-hidden="true">←</span> Back to {entry.kind === "work" ? "selected work" : "side projects"}
      </Link>

      <header className={styles.detailIntro}>
        <div>
          <p className={styles.detailCategory}>{entry.kind === "work" ? "Selected work" : "A personal project"}</p>
          <h1 className={styles.detailTitle}>{entry.name}</h1>
        </div>
        <p className={styles.detailSummary}>{entry.summary}</p>
      </header>

      <dl className={styles.detailFacts}>
        <div><dt>When</dt><dd>{entry.period}</dd></div>
        <div><dt>{entry.kind === "work" ? "Work" : "Built with"}</dt><dd>{entry.discipline}</dd></div>
        {entry.kind === "work" && <div><dt>Role</dt><dd>Engineer</dd></div>}
        {entry.archived && <div><dt>Status</dt><dd>BREX is no longer live</dd></div>}
      </dl>

      {heroImage && (
        <figure>
          <div className={styles.detailImage} data-slug={entry.slug}>
            <ProjectImage image={heroImage} priority />
          </div>
          <figcaption className={styles.imageCaption}>{heroImage.placeholder}</figcaption>
        </figure>
      )}

      {entry.brief && (
        <div className={styles.detailBody}>
          <section aria-labelledby="project-brief">
            <h2 id="project-brief">The brief</h2>
            <p className={styles.brief}>{entry.brief}</p>
          </section>
          <section aria-labelledby="project-work">
            <h2 id="project-work">{entry.products ? "The products" : "What I built"}</h2>
            {entry.contributions && (
              <ul className={styles.contributionList}>
                {entry.contributions.map((contribution) => <li key={contribution}>{contribution}</li>)}
              </ul>
            )}
            {entry.products?.map((product) => (
              <div className={styles.productDetail} key={product.name}>
                <div className={styles.productDetailHeader}>
                  <h3>{product.name}</h3><span>{product.year}</span>
                </div>
                <p>{product.description}</p>
                {product.image && product.image.src !== heroImage?.src && <ProjectImage image={product.image} sizes="(min-width: 768px) 50vw, 100vw" />}
              </div>
            ))}
          </section>
        </div>
      )}

      <section aria-labelledby="project-links" className={`${styles.linkSection} ${entry.brief ? "" : styles.simpleProjectLinks}`}>
        <h2 id="project-links">{entry.archived ? "Project links" : "Explore the project"}</h2>
        <div className={styles.detailLinks}>
          {entry.links.map((link) => (
            <a key={link.url} href={link.url} className={styles.detailLink} target="_blank" rel="noreferrer">
              {link.label}<span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <Link href={`/work/${next.slug}`} className={styles.nextProject}>
        <div><small>Next project</small><strong>{next.name}</strong></div>
        <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
