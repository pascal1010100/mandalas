import Image from "next/image"

import styles from "./home-intro.module.css"

/** Local-only editorial opening for the home hero. */
export function HomeIntro() {
  return (
    <div
      className={styles.root}
      data-testid="home-intro-motion"
      aria-hidden="true"
    >
      <div className={styles.surface}>
        <span className={`${styles.field} ${styles.fieldMandalas}`}>
          <Image
            src="/images/mandalas/hostelworld/pueblo-courtyard-hammock.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className={styles.fieldImage}
          />
          <span className={styles.fieldShade} />
        </span>
        <span className={`${styles.field} ${styles.fieldHideout}`}>
          <Image
            src="/images/mandalas/hostelworld/hideout-exterior-volcano.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className={styles.fieldImage}
          />
          <span className={styles.fieldShade} />
        </span>
      </div>

      <header className={styles.folioHeader}>
        <span>Mandalas Hostels</span>
        <span>San Pedro La Laguna · Lake Atitlán</span>
      </header>

      <div className={styles.display} data-testid="home-intro-thesis">
        <div className={styles.displayLine}>
          <span className={`${styles.displayWord} ${styles.wordTwo}`}>Two</span>
          <span className={`${styles.displayWord} ${styles.wordHostels}`}>
            hostels.
          </span>
        </div>
        <span className={styles.displaySubline}>Two rhythms</span>
      </div>

      <div className={styles.propertyIndex}>
        <div className={`${styles.property} ${styles.propertyMandalas}`}>
          <span>Mandalas Hostal</span>
          <strong>In town · Rooftop · Social</strong>
        </div>

        <span className={styles.indexRule} />

        <div className={`${styles.property} ${styles.propertyHideout}`}>
          <span>Mandalas Hideout</span>
          <strong>Near the lake · Calm</strong>
        </div>
      </div>
    </div>
  )
}
