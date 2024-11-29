import { useEffect, useState, useCallback, useRef } from 'react'
import { Timer } from '../components/Timer'
import { SettingsButton, SettingsModal } from '../components/Settings'
import { useTimer } from '../hooks/useTimer'
import { BarChart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const {
    timeRemaining,
    isActive,
    mode,
    completedSessions,
    settings,
    setSettings,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
  } = useTimer()

  const audioContextRef = useRef<AudioContext | null>(null)
  const audioBufferRef = useRef<AudioBuffer | null>(null)

  const navigate = useNavigate()

  const handleAnalyticsClick = () => {
    navigate('/analytics')
  }

  const Header = () => {
    return (
      <header className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="px-2">
            <img
              src="/assets/logo.svg"
              alt="Cogi"
              className="w-8 h-8"
              onError={(e) => {
                const img = e.target as HTMLImageElement
                img.onerror = null
                img.src = '/assets/logo-fallback.png'
              }}
            />
          </div>
          <h1 className="text-gray-200 text-2xl font-bold">Cogi</h1>
        </div>
        <nav className="flex justify-center items-center gap-2">
          <button
            onClick={handleAnalyticsClick}
            className="bg-gray-800 p-2 rounded-lg text-gray-200 hover:bg-gray-700 transition transform active:scale-95 duration-100"
            aria-label="Open Analytics"
          >
            <nav className="flex justify-center items-center gap-2">
              <p className="text-gray-400 text-base">Analytics</p>
              <BarChart className="w-6 h-6 text-gray-200" />
            </nav>
          </button>
          <div className="bg-gray-800 p-2 rounded-lg text-gray-200 hover:bg-gray-700 transition transform active:scale-95 duration-100">
            <SettingsButton onClick={() => setIsSettingsOpen(true)} />
          </div>
        </nav>
      </header>
    )
  }

  const handleUserInteraction = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: AudioContext })
            .webkitAudioContext)()

        const response = await fetch('/assets/bells-notification.wav')
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await audioContextRef.current.decodeAudioData(
          arrayBuffer,
        )
        audioBufferRef.current = audioBuffer
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }
    } catch (error) {
      console.error('Error initializing audio:', error)
    }
  }, [])

  useEffect(() => {
    const handleFirstInteraction = () => {
      handleUserInteraction()
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('keydown', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [handleUserInteraction])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault()
        if (
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement
        ) {
          return
        }
        if (isActive) {
          pauseTimer()
        } else {
          startTimer()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [isActive, pauseTimer, startTimer])

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      onClick={handleUserInteraction}
    >
      <div className="w-full px-8 md:px-16 pt-6">
        <div className="max-w-md mx-auto">
          <Header />
        </div>
      </div>

      <main
        role="main"
        aria-label="Main content"
        aria-live="polite"
        aria-atomic
        className="flex-1 flex items-start justify-center px-8 md:px-16 mt-16"
      >
        <div className="w-full max-w-md">
          <section
            className="timer-container rounded-3xl p-8"
            aria-label="Timer Controls"
            aria-live="polite"
            aria-atomic
          >
            <div className="flex items-center justify-center gap-4 sm:gap-4 mb-6 md:mb-8">
              <h3 className="flex-shrink-0">
                <button
                  className={`text-m sm:text-sm md:text-lg px-2 sm:px-4 py-2 rounded-lg transform active:scale-95 transition-transform duration-100 ${
                    mode === 'work'
                      ? 'bg-gray-800 text-gray-200'
                      : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
                  }`}
                  onClick={() => switchMode('work')}
                >
                  Work
                </button>
              </h3>
              <h3 className="flex-shrink-0">
                <button
                  className={`text-md sm:text-sm md:text-lg px-2 sm:px-4 py-2 rounded-lg transform active:scale-95 transition-transform duration-100 ${
                    mode === 'break'
                      ? 'bg-gray-800 text-gray-200'
                      : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
                  }`}
                  onClick={() => switchMode('break')}
                >
                  Break
                </button>
              </h3>
              <h3 className="flex-shrink-0">
                <button
                  className={`text-md sm:text-sm md:text-lg px-2 sm:px-4 py-2 rounded-lg transform active:scale-95 transition-transform duration-100 whitespace-nowrap ${
                    mode === 'long-break'
                      ? 'bg-gray-800 text-gray-200'
                      : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
                  }`}
                  onClick={() => switchMode('long-break')}
                >
                  Long Break
                </button>
              </h3>
            </div>

            <Timer
              timeRemaining={timeRemaining}
              isActive={isActive}
              mode={mode}
              onStart={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
            />

            <div className="mt-6 text-center text-gray-400">
              <p>Sessions completed: {completedSessions}</p>
            </div>
          </section>
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  )
}

export default Home
