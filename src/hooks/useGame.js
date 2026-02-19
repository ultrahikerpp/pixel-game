import { useState, useCallback, useRef } from 'react'
import { fetchQuestions, submitScore } from '../utils/api'

const PASS_THRESHOLD = parseInt(import.meta.env.VITE_PASS_THRESHOLD || '7', 10)

/**
 * Central game state machine.
 * Phases: idle → loading → playing → submitting → result
 */
export function useGame() {
    const [phase, setPhase] = useState('idle')
    const [playerId, setPlayerId] = useState('')
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState([]) // { questionId, chosen, correct }
    const [score, setScore] = useState(0)
    const [passed, setPassed] = useState(false)
    const [error, setError] = useState(null)
    const [lastAnswer, setLastAnswer] = useState(null) // 'correct' | 'wrong' | null

    const scoreRef = useRef(0)

    const startGame = useCallback(async (id) => {
        setPhase('loading')
        setPlayerId(id)
        setAnswers([])
        setCurrentIndex(0)
        scoreRef.current = 0
        setScore(0)
        setError(null)
        setLastAnswer(null)

        try {
            const qs = await fetchQuestions()
            setQuestions(qs)
            setPhase('playing')
        } catch (err) {
            setError(err.message)
            setPhase('idle')
        }
    }, [])

    const answerQuestion = useCallback(
        async (chosen) => {
            if (phase !== 'playing') return

            const q = questions[currentIndex]
            const isCorrect = chosen === q.answer // 'answer' field from GAS / mock

            setLastAnswer(isCorrect ? 'correct' : 'wrong')

            if (isCorrect) {
                scoreRef.current += 1
                setScore(scoreRef.current)
            }

            setAnswers((prev) => [
                ...prev,
                { questionId: q.id, chosen, correct: isCorrect },
            ])

            // Advance after short delay so flash animation plays
            setTimeout(async () => {
                setLastAnswer(null)
                const nextIndex = currentIndex + 1

                if (nextIndex >= questions.length) {
                    // Game over — submit
                    const finalScore = scoreRef.current
                    const didPass = finalScore >= PASS_THRESHOLD
                    setPassed(didPass)
                    setPhase('submitting')

                    try {
                        await submitScore(playerId, finalScore, questions.length, didPass)
                    } catch (submitErr) {
                        console.error('[submitScore failed]', submitErr)
                    }

                    setPhase('result')
                } else {
                    setCurrentIndex(nextIndex)
                }
            }, 600)
        },
        [phase, questions, currentIndex, playerId],
    )

    const retry = useCallback(() => {
        setPhase('idle')
        setQuestions([])
        setCurrentIndex(0)
        setAnswers([])
        setScore(0)
        setPassed(false)
        setError(null)
        setLastAnswer(null)
        scoreRef.current = 0
    }, [])

    return {
        phase,
        playerId,
        questions,
        currentIndex,
        score,
        total: questions.length,
        passed,
        passThreshold: PASS_THRESHOLD,
        error,
        lastAnswer,
        startGame,
        answerQuestion,
        retry,
    }
}
