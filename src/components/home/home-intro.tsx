import Image from "next/image"

import styles from "./home-intro.module.css"

function MapBalloon({ x, y, scale, label, variant }: { x: number; y: number; scale: number; label: string; variant: "mandalas" | "hideout" }) {
  return (
    <g
      className={`${styles.mapMarker} ${variant === "mandalas" ? styles.mapMarkerMandalas : styles.mapMarkerHideout}`}
      transform={`translate(${x} ${y})`}
    >
      <g className={styles.mapBalloonGlyph} transform={`scale(${scale})`}>
        <path
          className={styles.mapBalloon}
          d="M0 0C-4-7-18-12-18-27a18 18 0 1 1 36 0C18-12 4-7 0 0Z"
        />
        <circle className={styles.mapBalloonInset} cy="-27" r="11" />
        <text className={styles.mapBalloonMonogram} x="0" y="-22.5" textAnchor="middle">
          {label}
        </text>
        <circle className={styles.mapBalloonAnchor} r="2.2" />
      </g>
    </g>
  )
}

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

      <div className={styles.mapOverlay} aria-hidden="true">
        <div className={styles.mapStage}>
          <svg className={`${styles.mapCanvas} ${styles.mapCanvasDesktop}`} viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid slice" role="presentation">
            <image className={styles.mapImageLayer} href="/images/mandalas/san-pedro-map-overlay.webp" width="1536" height="1024" preserveAspectRatio="none" />
            <MapBalloon x={600} y={233} scale={1.4} label="M" variant="mandalas" />
            <MapBalloon x={1230} y={778} scale={1.4} label="H" variant="hideout" />
          </svg>
          <svg className={`${styles.mapCanvas} ${styles.mapCanvasTablet}`} viewBox="0 0 1122 1402" preserveAspectRatio="xMaxYMid slice" role="presentation">
            <image className={styles.mapImageLayer} href="/images/mandalas/san-pedro-map-overlay-mobile.webp" width="1122" height="1402" preserveAspectRatio="none" />
            <MapBalloon x={520} y={450} scale={1.6} label="M" variant="mandalas" />
            <MapBalloon x={900} y={1018} scale={1.6} label="H" variant="hideout" />
          </svg>
          <svg className={`${styles.mapCanvas} ${styles.mapCanvasMobile}`} viewBox="0 0 1122 1402" preserveAspectRatio="xMaxYMid slice" role="presentation">
            <image className={styles.mapImageLayer} href="/images/mandalas/san-pedro-map-overlay-mobile.webp" width="1122" height="1402" preserveAspectRatio="none" />
            <MapBalloon x={520} y={450} scale={2.2} label="M" variant="mandalas" />
            <MapBalloon x={900} y={1018} scale={2.2} label="H" variant="hideout" />
          </svg>
        </div>
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
          <strong>In town · Walkable · Social</strong>
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
