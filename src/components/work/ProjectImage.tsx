import Image from "next/image";
import type { CaseStudyImage } from "@/types";
import styles from "./Work.module.css";

export function ProjectImage({
  image,
  sizes = "(min-width: 1440px) 1200px, (min-width: 768px) 90vw, 100vw",
  priority = false,
}: {
  image: CaseStudyImage;
  sizes?: string;
  priority?: boolean;
}) {
  if (!image.src) return null;

  return (
    <div className={styles.imageWrap}>
      <Image
        src={image.src}
        alt={image.placeholder}
        fill
        sizes={sizes}
        priority={priority}
        className={styles.image}
      />
    </div>
  );
}
