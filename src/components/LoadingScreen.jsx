import { useEffect, useState } from 'react'
import styles from './LoadingScreen.module.css'

const MESSAGES = [
    'INITIALIZING DUNGEON...',
    'LOADING BOSS DATA...',
    'SHUFFLING QUESTIONS...',
    'PREPARING ARENA...',
    'ALMOST READY...',
]

export default function LoadingScreen() {
    const [msgIdx, setMsgIdx] = useState(0)
    const [dots, setDots] = useState('')

    useEffect(() => {
        const msgInterval = setInterval(() => {
            setMsgIdx((i) => (i + 1) % MESSAGES.length)
        }, 600)
        const dotInterval = setInterval(() => {
            setDots((d) => (d.length >= 3 ? '' : d + '.'))
        }, 300)
        return () => {
            clearInterval(msgInterval)
            clearInterval(dotInterval)
        }
    }, [])

    return (
        <div className={`screen ${styles.loading}`}>
            <div className={styles.box}>
                <div className={styles.logo}>⚔</div>
                <div className={styles.msg}>
                    {MESSAGES[msgIdx]}
                    <span className={styles.dots}>{dots}</span>
                </div>
                <div className={styles.track}>
                    <div className={styles.bar} />
                </div>
                <div className={styles.hint}>PLEASE WAIT</div>
            </div>
        </div>
    )
}
