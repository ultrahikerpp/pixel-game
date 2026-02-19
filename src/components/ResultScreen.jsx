import PixelButton from './PixelButton'
import styles from './ResultScreen.module.css'

export default function ResultScreen({ score, total, passed, passThreshold, playerId, onRetry }) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0

    return (
        <div className={`screen ${styles.result}`}>
            {/* Banner */}
            <div className={`${styles.banner} ${passed ? styles.victory : styles.defeat}`}>
                {passed ? (
                    <>
                        <div className={styles.bannerIcon}>🏆</div>
                        <h1 className={`${styles.bannerText} glow-yellow`}>VICTORY!</h1>
                        <div className={styles.bannerSub}>DUNGEON CLEARED</div>
                    </>
                ) : (
                    <>
                        <div className={styles.bannerIcon}>💀</div>
                        <h1 className={`${styles.bannerText} glow-red`}>GAME OVER</h1>
                        <div className={styles.bannerSub}>TRY AGAIN</div>
                    </>
                )}
            </div>

            {/* Stats panel */}
            <div className={`pixel-box ${styles.stats}`}>
                <div className={styles.statRow}>
                    <span className={styles.statLabel}>PLAYER</span>
                    <span className={styles.statVal}>{playerId}</span>
                </div>
                <div className={styles.divider} />
                <div className={styles.statRow}>
                    <span className={styles.statLabel}>SCORE</span>
                    <span className={`${styles.statVal} ${styles.bigScore} glow-yellow`}>
                        {String(score).padStart(2, '0')} / {String(total).padStart(2, '0')}
                    </span>
                </div>
                <div className={styles.statRow}>
                    <span className={styles.statLabel}>ACCURACY</span>
                    <span className={styles.statVal}>{pct}%</span>
                </div>
                <div className={styles.statRow}>
                    <span className={styles.statLabel}>PASS LINE</span>
                    <span className={styles.statVal}>{passThreshold} / {total}</span>
                </div>
                <div className={styles.divider} />
                <div className={`${styles.verdict} ${passed ? styles.verdictWin : styles.verdictLose}`}>
                    {passed
                        ? '✓ 恭喜通關！成績已記錄。'
                        : `✗ 未達通過門檻 (${passThreshold}題)，加油！`}
                </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <PixelButton onClick={onRetry} variant="primary">
                    ↺ PLAY AGAIN
                </PixelButton>
            </div>

            <div className={styles.notice}>成績已自動提交至伺服器</div>
        </div>
    )
}
