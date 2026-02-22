import { useEffect } from 'react'
import { useGame } from './hooks/useGame'
import { preloadBossAvatars } from './utils/dicebear'
import HomePage from './components/HomePage'
import LoadingScreen from './components/LoadingScreen'
import GameScreen from './components/GameScreen'
import ResultScreen from './components/ResultScreen'

// Kick off avatar pre-fetching as soon as the app loads
preloadBossAvatars()

export default function App() {
  const {
    phase,
    playerId,
    questions,
    currentIndex,
    score,
    total,
    passed,
    passThreshold,
    error,
    lastAnswer,
    answers,
    startGame,
    answerQuestion,
    retry,
  } = useGame()

  // Prevent accidental back-navigation while playing
  useEffect(() => {
    const handler = (e) => {
      if (phase === 'playing') {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [phase])

  if (phase === 'idle') {
    return <HomePage onStart={startGame} error={error} />
  }

  if (phase === 'loading') {
    return <LoadingScreen />
  }

  if (phase === 'playing' || phase === 'submitting') {
    const q = questions[currentIndex]
    return (
      <GameScreen
        question={q}
        currentIndex={currentIndex}
        total={total}
        score={score}
        onAnswer={answerQuestion}
        lastAnswer={lastAnswer}
      />
    )
  }

  if (phase === 'result') {
    return (
      <ResultScreen
        score={score}
        total={total}
        passed={passed}
        passThreshold={passThreshold}
        playerId={playerId}
        onRetry={retry}
        questions={questions}
        answers={answers}
      />
    )
  }

  return null
}
