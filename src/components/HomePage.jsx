import { useState } from 'react'
import PixelButton from './PixelButton'
import styles from './HomePage.module.css'

const IS_MOCK = !import.meta.env.VITE_GAS_URL

export default function HomePage({ onStart, error }) {
    const [id, setId] = useState('')

    const handleStart = () => {
        const trimmed = id.trim()
        if (!trimmed) return
        onStart(trimmed)
    }

    const handleKey = (e) => {
        if (e.key === 'Enter') handleStart()
    }

    return (
        <div className={`screen ${styles.home}`}>
            {/* Stars bg */}
            <div className={styles.stars} aria-hidden />

            <div className={styles.content}>
                {/* Title */}
                <div className={styles.titleWrap}>
                    <div className={styles.titleSub} aria-hidden>◆ ◆ ◆</div>
                    <h1 className={`${styles.title} glow-yellow`}>QUIZ<br />DUNGEON</h1>
                    <div className={styles.titleSub2}>像素問答闖關</div>
                    <div className={styles.titleSub} aria-hidden>◆ ◆ ◆</div>
                </div>

                {/* ID Entry box */}
                <div className={`pixel-box ${styles.panel}`}>
                    <label className={styles.label} htmlFor="player-id">
                        ENTER YOUR ID
                    </label>
                    <input
                        id="player-id"
                        className={styles.input}
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="your_name_here"
                        maxLength={32}
                        autoFocus
                    />

                    {error && <div className={styles.error}>⚠ {error}</div>}
                    {IS_MOCK && (
                        <div className={styles.mockBadge}>DEMO MODE — no GAS URL set</div>
                    )}

                    <PixelButton onClick={handleStart} disabled={!id.trim()} fullWidth>
                        ▶ PRESS START
                    </PixelButton>
                </div>

                <div className={styles.footer}>
                    <span className="blink">INSERT COIN</span> &nbsp;©2025 QUIZ DUNGEON
                </div>
            </div>
        </div>
    )
}
