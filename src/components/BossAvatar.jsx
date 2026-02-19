import { useEffect, useState } from 'react'
import { getBossUrl } from '../utils/dicebear'
import styles from './BossAvatar.module.css'

/**
 * Displays a DiceBear pixel-art boss avatar with idle bounce animation.
 * @param {number} bossIndex  0-based level index
 */
export default function BossAvatar({ bossIndex = 0 }) {
    const [loaded, setLoaded] = useState(false)
    const url = getBossUrl(bossIndex, 160)

    useEffect(() => {
        setLoaded(false)
    }, [bossIndex])

    return (
        <div className={styles.wrapper}>
            <div className={styles.pedestal} />
            <img
                className={`${styles.avatar} ${loaded ? styles.bounce : styles.hidden}`}
                src={url}
                alt={`Boss ${bossIndex + 1}`}
                width={128}
                height={128}
                onLoad={() => setLoaded(true)}
            />
            {!loaded && <div className={styles.placeholder}>???</div>}
            <div className={styles.label}>BOSS #{String(bossIndex + 1).padStart(2, '0')}</div>
        </div>
    )
}
