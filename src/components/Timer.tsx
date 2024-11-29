import React from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { TimerMode } from '../types/timer'
import { useSound } from '../hooks/useSound'

interface TimerProps {
  timeRemaining: number
  isActive: boolean
  mode: TimerMode
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export const Timer: React.FC<TimerProps> = ({
  timeRemaining,
  isActive,
  onStart,
  onPause,
  onReset,
}) => {
  const { playSound } = useSound()
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  const handleReset = () => {
    playSound('buttonClick')
    onReset()
  }

  const handleStartPause = () => {
    if (isActive) {
      playSound('off')
      onPause()
    } else {
      playSound('on')
      onStart()
    }
  }

  return (
    <div
      className="flex flex-col items-center space-y-8"
      aria-label="Timer"
      aria-live="polite"
      aria-atomic
    >
      <div className="time-display w-full py-8 rounded-2xl flex justify-center items-center">
        <h2
          className="text-7xl sm:text-7xl font-mono font-bold text-gray-200 tracking-wider"
          aria-label="Time remaining"
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </h2>
      </div>

      <div className="flex gap-4 w-full">
        <button
          aria-label="Reset"
          aria-live="polite"
          aria-atomic
          onClick={handleReset}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 text-gray-200 hover:bg-surface/90 font-medium border border-gray-800 transform active:scale-95 transition-transform duration-100"
        >
          <RotateCcw className="w-5 h-5" aria-label="Reset" />
          <span>Reset</span>
        </button>

        <button
          aria-label={isActive ? 'Pause' : 'Start'}
          aria-live="polite"
          aria-atomic
          onClick={handleStartPause}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 text-gray-200 hover:bg-gray-800/90 transition-colors font-medium border border-gray-800 transform active:scale-95 transition-transform duration-100"
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5" aria-label="Pause" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" aria-label="Start" />
              <span>Start</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
