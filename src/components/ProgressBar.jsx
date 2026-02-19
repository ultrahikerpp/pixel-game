import styles from './ProgressBar.module.css'

/**
 * Pixel-art segmented progress bar.
 * @param {number} current  answered so far
 * @param {number} total    total questions
 */
export default function ProgressBar({ current, total }) {
    if (!total) return null
    const pct = current / total

    const colorClass =
        pct >= 0.7 ? styles.red : pct >= 0.4 ? styles.yellow : styles.green

    return (
        <div className={styles.wrapper}>
            <span className={styles.label}>Q {current}/{total}</span>
            <div className={styles.track}>
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className={`${styles.segment} ${i < current ? `${styles.filled} ${colorClass}` : ''}`}
                    />
                ))}
            </div>
        </div>
    )
}
