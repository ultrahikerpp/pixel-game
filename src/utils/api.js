// ── Mock questions for local dev (when VITE_GAS_URL is empty) ──
const MOCK_QUESTIONS = [
    { id: 1, question: '台灣最高的山是哪一座？', A: '玉山', B: '雪山', C: '合歡山', D: '秀姑巒山', answer: 'A' },
    { id: 2, question: '下列哪個不是程式語言？', A: 'Python', B: 'Cobra', C: 'Ruby', D: 'Swift', answer: 'B' },
    { id: 3, question: 'HTTP 狀態碼 404 代表？', A: '伺服器錯誤', B: '授權失敗', C: '找不到資源', D: '請求超時', answer: 'C' },
    { id: 4, question: 'React 的核心概念是？', A: '雙向繫結', B: '組件化 + 虛擬 DOM', C: '類別繼承', D: '直接操作 DOM', answer: 'B' },
    { id: 5, question: 'CSS Flexbox 中，讓主軸排列方向變為縱向的屬性值是？', A: 'flex-direction: row', B: 'flex-direction: column', C: 'align-items: center', D: 'justify-content: flex-end', answer: 'B' },
    { id: 6, question: 'Git 中，回退到上一次 commit 的指令是？', A: 'git revert', B: 'git reset HEAD~1', C: 'git undo', D: 'git pop', answer: 'B' },
    { id: 7, question: 'JSON 全名是？', A: 'Java Script Object Notation', B: 'JavaScript Standard Object Notation', C: 'Java Serialized Object Notation', D: 'JavaScript Online Notation', answer: 'A' },
    { id: 8, question: 'SQL 中，刪除資料表的指令是？', A: 'DELETE TABLE', B: 'REMOVE TABLE', C: 'DROP TABLE', D: 'CLEAR TABLE', answer: 'C' },
    { id: 9, question: '下列哪個是非同步 JS 的解法？', A: 'Callback Hell', B: 'Promise', C: 'async/await', D: '以上皆是', answer: 'D' },
    { id: 10, question: 'Big O(n²) 最常見於哪種演算法？', A: '二分搜尋', B: '氣泡排序', C: '合併排序', D: '快速查找表', answer: 'B' },
]

const GAS_URL = import.meta.env.VITE_GAS_URL
const QUESTION_COUNT = parseInt(import.meta.env.VITE_QUESTION_COUNT || '10', 10)

/**
 * Fetch N random questions from GAS (no 解答 column returned).
 * Falls back to mock data when VITE_GAS_URL is not configured.
 */
export async function fetchQuestions() {
    if (!GAS_URL) {
        // Mock mode — shuffle and pick
        const shuffled = [...MOCK_QUESTIONS].sort(() => Math.random() - 0.5)
        return shuffled.slice(0, QUESTION_COUNT)
    }

    const url = new URL(GAS_URL)
    url.searchParams.set('action', 'getQuestions')
    url.searchParams.set('count', QUESTION_COUNT)

    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`GAS error: ${res.status}`)
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data.questions
}

/**
 * Submit the player's result to GAS.
 * @param {string} playerId
 * @param {number} score
 * @param {number} total
 * @param {boolean} passed
 */
export async function submitScore(playerId, score, total, passed) {
    if (!GAS_URL) {
        console.info('[mock] submitScore', { playerId, score, total, passed })
        return { success: true }
    }

    // Use GET + query params — GAS doesn't support CORS preflight (triggered by
    // POST with Content-Type: application/json), so POST never actually reaches doPost.
    const url = new URL(GAS_URL)
    url.searchParams.set('action', 'submitScore')
    url.searchParams.set('playerId', playerId)
    url.searchParams.set('score', score)
    url.searchParams.set('total', total)
    url.searchParams.set('passed', passed ? '1' : '0')

    // Plain GET — GAS sets Access-Control-Allow-Origin: * on doGet responses,
    // so we don't need no-cors and can actually read errors.
    const res = await fetch(url.toString())
    const data = await res.json().catch(() => ({}))
    if (data.error) console.error('[GAS submitScore error]', data.error)
    return { success: true }
}
