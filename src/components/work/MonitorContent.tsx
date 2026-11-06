import { WorkIndex } from "@/components/home/WorkIndex";
import styles from "./Work.module.css";

/** Same section markup as the destination, clipped to the Blender screen. */
export function MonitorContent() {
  return (
    <div className={styles.monitorSurface} aria-hidden="true" inert data-monitor-content>
      <WorkIndex preview />
    </div>
  );
}

export const SelectedWorkPreview = MonitorContent;
