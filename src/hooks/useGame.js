import { useReducer, useCallback, useRef } from 'react'
import { fetchQuestions, submitScore } from '../utils/api'

const PASS_THRESHOLD = parseInt(import.meta.env.VITE_PASS_THRESHOLD || '7', 10)
const ADVANCE_DELAY = 600

const initialState = {
    phase: 'idle',
    playerId: '',
    questions: [],
    currentIndex: 0,
    answers: [], // { questionId, chosen, correct }
    error: null,
    lastAnswer: null, // 'correct' | 'wrong' | null
}

function gameReducer(state, action) {
    switch (action.type) {
        case 'START_GAME':
            return {
                ...initialState,
                phase: 'loading',
                playerId: action.payload,
            }
        case 'LOAD_QUESTIONS':
            return {
                ...state,
                phase: 'playing',
                questions: action.payload,
            }
        case 'ANSWER': {
            const { chosen, isCorrect } = action.payload
            const q = state.questions[state.currentIndex]
            return {
                ...state,
                lastAnswer: isCorrect ? 'correct' : 'wrong',
                answers: [
                    ...state.answers,
                    { questionId: q.id, chosen, correct: isCorrect },
                ],
            }
        }
        case 'NEXT_QUESTION':
            return {
                ...state,
                lastAnswer: null,
                currentIndex: state.currentIndex + 1,
            }
        case 'SUBMITTING':
            return {
                ...state,
                phase: 'submitting',
                lastAnswer: null,
            }
        case 'SET_RESULT':
            return {
                ...state,
                phase: 'result',
            }
        case 'ERROR':
            return {
                ...state,
                phase: 'idle',
                error: action.payload,
            }
        case 'RETRY':
            return initialState
        default:
            return state
    }
}

/**
 * Central game state machine.
 */
export function useGame() {
    const [state, dispatch] = useReducer(gameReducer, initialState)
    const scoreRef = useRef(0)

    // Derived values
    const score = state.answers.filter((a) => a.correct).length
    const total = state.questions.length
    const passed = score >= PASS_THRESHOLD

    const startGame = useCallback(async (id) => {
        dispatch({ type: 'START_GAME', payload: id })
        scoreRef.current = 0

        try {
            const qs = await fetchQuestions()
            dispatch({ type: 'LOAD_QUESTIONS', payload: qs })
        } catch (err) {
            dispatch({ type: 'ERROR', payload: err.message })
        }
    }, [])

    const answerQuestion = useCallback(
        async (chosen) => {
            if (state.phase !== 'playing') return

            const q = state.questions[state.currentIndex]
            const isCorrect = chosen === q.answer

            dispatch({ type: 'ANSWER', payload: { chosen, isCorrect } })

            setTimeout(async () => {
                const isGameOver = state.currentIndex + 1 >= state.questions.length

                if (isGameOver) {
                    dispatch({ type: 'SUBMITTING' })
                    try {
                        await submitScore(state.playerId, score + (isCorrect ? 1 : 0), total, score + (isCorrect ? 1 : 0) >= PASS_THRESHOLD)
                    } catch (submitErr) {
                        console.error('[useGame] submitScore failed:', submitErr)
                    }
                    dispatch({ type: 'SET_RESULT' })
                } else {
                    dispatch({ type: 'NEXT_QUESTION' })
                }
            }, ADVANCE_DELAY)
        },
        [state.phase, state.questions, state.currentIndex, state.playerId, score, total],
    )

    const retry = useCallback(() => {
        dispatch({ type: 'RETRY' })
    }, [])

    return {
        ...state,
        score,
        total,
        passed,
        passThreshold: PASS_THRESHOLD,
        startGame,
        answerQuestion,
        retry,
        answers: state.answers,
    }
}

