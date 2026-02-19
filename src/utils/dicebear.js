/**
 * Deterministic DiceBear pixel-art avatar URL generator.
 * Uses 100 pre-defined seeds so each boss level has a stable sprite.
 */

// 100 seeds — random-ish strings that produce interesting pixel-art sprites
const SEEDS = Array.from({ length: 100 }, (_, i) =>
    `boss_${String(i).padStart(3, '0')}_dungeon`
)

/**
 * Get the DiceBear avatar URL for a given boss index.
 * @param {number} index  0-based quest index
 * @param {number} size   pixel size (default 128)
 */
export function getBossUrl(index, size = 128) {
    const seed = SEEDS[index % SEEDS.length]
    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}&size=${size}`
}

/**
 * Preload all 100 boss images as <img> elements into a document fragment
 * so the browser caches them. Call once on app start.
 */
export function preloadBossAvatars() {
    for (let i = 0; i < 100; i++) {
        const img = new Image()
        img.src = getBossUrl(i)
    }
}
