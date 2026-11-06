import { SITE } from "@/data/site";
import { STACK } from "@/data/stack";
import { CASE_STUDIES } from "@/data/experience";
import styles from "./LowerSections.module.css";

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className={styles.about}>
      <div className={styles.inner}>
        <div className={styles.aboutIntro}>
          <div>
            <p className={styles.eyebrow}>A little about me</p>
            <h2 id="about-heading" className={styles.aboutHeading}>
              I like knowing<br />how it all works.
            </h2>
            <div className={styles.now}>
              <span aria-hidden="true" className={styles.statusDot} />
              <div>
                <span className={styles.nowLabel}>Currently</span>
                <p>{SITE.now}</p>
              </div>
            </div>
          </div>
          <div className={styles.bio}>
            {SITE.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
        <div className={styles.aboutDetails}>
          <div>
            <h3 className={styles.detailHeading}>The path so far</h3>
            <ol className={styles.careerList}>
              {CASE_STUDIES.map((entry, index) => (
                <li key={entry.name}>
                  <span aria-hidden="true" className={index === 0 ? styles.currentMarker : styles.careerMarker} />
                  <div>
                    <span className={styles.company}>{entry.name}</span>
                    <span className={styles.role}>{entry.tagsLine.split(" · ")[0]}</span>
                  </div>
                  <span className={styles.period}>{entry.period}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className={styles.detailHeading}>Tools I work with</h3>
            <dl className={styles.stack}>
              {STACK.map((group) => (
                <div key={group.group}>
                  <dt>{group.group}</dt>
                  <dd>{group.items.map((item) => item.name).join(" / ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
