import styles from './PixelButton.module.css'

/**
 * Reusable 8-bit style button.
 * variant: 'primary' | 'secondary' | 'danger' | 'ghost'
 */
export default function PixelButton({ children, onClick, variant = 'primary', disabled = false, fullWidth = false }) {
    return (
        <button
            className={`${styles.btn} ${styles[variant]} ${fullWidth ? styles.full : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
