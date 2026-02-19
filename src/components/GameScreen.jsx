import { useState, useRef } from 'react'
import BossAvatar from './BossAvatar'
import PixelButton from './PixelButton'
import ProgressBar from './ProgressBar'
import styles from './GameScreen.module.css'

const CHOICE_LABELS = ['A', 'B', 'C', 'D']
const CHOICE_KEYS = ['A', 'B', 'C', 'D']

export default function GameScreen({ question, currentIndex, total, score, onAnswer, lastAnswer }) {
    const [selected, setSelected] = useState(null)
    const containerRef = useRef(null)

    // Reset selection when question changes
    const prevIndex = useRef(currentIndex)
    if (prevIndex.current !== currentIndex) {
        prevIndex.current = currentIndex
        setSelected(null)
    }

    const handleChoice = (key) => {
        if (selected) return // already answered
        setSelected(key)
        onAnswer(key)
    }

    const choices = CHOICE_KEYS.map((k) => ({ key: k, text: question[k] }))

    const flashClass =
        lastAnswer === 'correct' ? styles.correctFlash :
            lastAnswer === 'wrong' ? styles.wrongFlash : ''

    return (
        <div className={`screen ${styles.game} ${flashClass}`} ref={containerRef}>
            {/* Top bar */}
            <div className={styles.topBar}>
                <div className={styles.scoreBox}>
                    <span className={styles.scoreLabel}>SCORE</span>
                    <span className={`${styles.scoreVal} glow-yellow`}>{String(score).padStart(2, '0')}</span>
                </div>
                <ProgressBar current={currentIndex} total={total} />
            </div>

            {/* Main arena */}
            <div className={styles.arena}>
                {/* Boss column */}
                <div className={styles.bossCol}>
                    <BossAvatar bossIndex={currentIndex} />
                    <div className={`${styles.bossHp}`}>
                        <div
                            className={styles.bossHpBar}
                            style={{ width: `${100 - (currentIndex / total) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Question + choices */}
                <div className={styles.questionCol}>
                    <div className={`pixel-box ${styles.questionBox}`}>
                        <div className={styles.qNum}>
                            QUESTION {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                        </div>
                        <p className={styles.qText}>{question.question}</p>
                    </div>

                    <div className={styles.choices}>
                        {choices.map(({ key, text }) => {
                            const isSelected = selected === key
                            const variant =
                                !selected ? 'secondary' :
                                    isSelected && lastAnswer === 'correct' ? 'primary' :
                                        isSelected && lastAnswer === 'wrong' ? 'danger' :
                                            'ghost'
                            return (
                                <button
                                    key={key}
                                    className={`${styles.choiceBtn} ${selected === key ? styles.chosen : ''} ${selected && selected === key && lastAnswer === 'correct' ? styles.correctChoice : ''
                                        } ${selected && selected === key && lastAnswer === 'wrong' ? styles.wrongChoice : ''
                                        }`}
                                    onClick={() => handleChoice(key)}
                                    disabled={!!selected}
                                    data-id={`choice-${key}`}
                                >
                                    <span className={styles.choiceKey}>{key}</span>
                                    <span className={styles.choiceText}>{text}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
