import { useEffect, useState } from 'react'
import PixelButton from './PixelButton'
import styles from './ResultScreen.module.css'

function useAnimatedCounter(target, duration = 1000) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let start = 0
        const end = parseInt(target)
        if (start === end) return

        const totalFrames = Math.max(end, 1)
        const frameDuration = duration / totalFrames

        let current = 0
        const timer = setInterval(() => {
            current += 1
            setCount(current)
            if (current >= end) clearInterval(timer)
        }, frameDuration)

        return () => clearInterval(timer)
    }, [target, duration])

    return count
}

export default function ResultScreen({
    score,
    total,
    passed,
    passThreshold,
    playerId,
    onRetry,
    questions = [],
    answers = []
}) {
    const animatedScore = useAnimatedCounter(score)
    const pct = total > 0 ? Math.round((score / total) * 100) : 0
    const animatedPct = useAnimatedCounter(pct)

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

            <div className={styles.mainLayout}>
                {/* Stats panel */}
                <div className={`pixel-box ${styles.stats}`}>
                    <div className={styles.statRow}>
                        <span className={styles.statLabel}>PLAYER</span>
                        <span className={styles.statVal}>{playerId || 'GUEST'}</span>
                    </div>
                    <div className={styles.divider} />
                    <div className={styles.statRow}>
                        <span className={styles.statLabel}>SCORE</span>
                        <span className={`${styles.statVal} ${styles.bigScore} glow-yellow`}>
                            {String(animatedScore).padStart(2, '0')} / {String(total).padStart(2, '0')}
                        </span>
                    </div>
                    <div className={styles.statRow}>
                        <span className={styles.statLabel}>ACCURACY</span>
                        <span className={styles.statVal}>{animatedPct}%</span>
                    </div>
                    <div className={styles.statRow}>
                        <span className={styles.statLabel}>PASS LINE</span>
                        <span className={styles.statVal}>{passThreshold} / {total}</span>
                    </div>
                    <div className={styles.divider} />
                    <div className={`${styles.verdict} ${passed ? styles.verdictWin : styles.verdictLose}`}>
                        {passed
                            ? '✓ 恭喜通關！成績已記錄。'
                            : `✗ 未達門檻 (需${passThreshold}題)`}
                    </div>
                </div>

                {/* Question Breakdown */}
                {questions.length > 0 && (
                    <div className={`pixel-box ${styles.breakdown}`}>
                        <h2 className={styles.breakdownTitle}>BATTLE LOG</h2>
                        <div className={styles.logList}>
                            {questions.map((q, idx) => {
                                const ans = answers.find(a => a.questionId === q.id)
                                const isCorrect = ans?.correct
                                return (
                                    <div key={q.id} className={styles.logItem}>
                                        <span className={styles.logIdx}>{String(idx + 1).padStart(2, '0')}</span>
                                        <span className={styles.logText}>{q.question}</span>
                                        <span className={`${styles.logStatus} ${isCorrect ? styles.statusCorrect : styles.statusWrong}`}>
                                            {isCorrect ? '✓' : '✗'}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <PixelButton onClick={onRetry} variant="primary">
                    ↺ PLAY AGAIN
                </PixelButton>
            </div>

            <div className={styles.notice}>成績已自動提交至雲端資料庫</div>
        </div>
    )
}

