import { useState, useEffect, useCallback, useRef } from 'react'
import { TimerMode, TimerSettings, TimerState } from '../types/timer'
import { PomodoroSession } from '../types/pomodoroSession'

const STORAGE_KEY = 'cogi_timer_settings'
const SESSIONS_KEY = 'cogi_sessions'

const getStoredSettings = (): TimerSettings => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return {
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    sessionsBeforeLongBreak: 4,
    autoStartTimer: false,
  }
}

const getStoredSessions = (): PomodoroSession[] => {
  const stored = localStorage.getItem(SESSIONS_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return []
}

const addSession = (session: PomodoroSession) => {
  const sessions = getStoredSessions()
  sessions.push(session)
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

const AUDIO_SOURCES = [
  '/assets/bells-notification.mp3',
  '/assets/bells-notification.wav',
  '/assets/bells-notification.ogg',
]

export const useTimer = () => {
  const [settings, setSettings] = useState<TimerSettings>(getStoredSettings())
  const [state, setState] = useState<TimerState>({
    timeRemaining: getStoredSettings().workDuration,
    isActive: false,
    mode: 'work',
    completedSessions: 0,
  })

  const workerRef = useRef<Worker | null>(null)

  // Salvar settings quando mudarem
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  const handleTimerComplete = useCallback(() => {
    let nextMode: TimerMode = 'work'
    let nextDuration = settings.workDuration

    setState((prev) => {
      const newCompletedSessions =
        prev.mode === 'work'
          ? prev.completedSessions + 1
          : prev.completedSessions

      if (prev.mode === 'work') {
        if (
          newCompletedSessions > 0 &&
          newCompletedSessions % settings.sessionsBeforeLongBreak === 0
        ) {
          nextMode = 'long-break'
          nextDuration = settings.longBreakDuration
        } else {
          nextMode = 'break'
          nextDuration = settings.breakDuration
        }
      } else if (prev.mode === 'break' || prev.mode === 'long-break') {
        nextMode = 'work'
        nextDuration = settings.workDuration
      }

      return {
        ...prev,
        mode: nextMode,
        timeRemaining: nextDuration,
        isActive: settings.autoStartTimer,
        completedSessions:
          prev.mode === 'long-break' ? 0 : newCompletedSessions,
      }
    })

    if (settings.autoStartTimer) {
      setTimeout(() => {
        workerRef.current?.postMessage({
          type: 'START',
          duration: nextDuration,
        })
      }, 0)
    }

    playSound()
  }, [settings])

  const startTimer = useCallback(() => {
    setState((prev) => ({ ...prev, isActive: true }))
    workerRef.current?.postMessage({
      type: 'START',
      duration: state.timeRemaining,
    })

    const newSession: PomodoroSession = {
      startTime: new Date().toISOString(),
      workDuration: settings.workDuration,
      breakDuration: settings.breakDuration,
      longBreakDuration: settings.longBreakDuration,
      sessionsBeforeLongBreak: settings.sessionsBeforeLongBreak,
    }
    addSession(newSession)
  }, [settings, state.timeRemaining])

  const pauseTimer = useCallback(() => {
    setState((prev) => ({ ...prev, isActive: false }))
    workerRef.current?.postMessage({ type: 'PAUSE' })
  }, [])

  const switchMode = useCallback(
    (mode: TimerMode) => {
      const duration =
        mode === 'work'
          ? settings.workDuration
          : mode === 'break'
          ? settings.breakDuration
          : settings.longBreakDuration

      setState((prev) => ({
        ...prev,
        mode,
        timeRemaining: duration,
        isActive: false,
      }))

      workerRef.current?.postMessage({
        type: 'RESET',
        duration,
      })
    },
    [settings],
  )

  const resetTimer = useCallback(() => {
    const duration =
      state.mode === 'work'
        ? settings.workDuration
        : state.mode === 'break'
        ? settings.breakDuration
        : settings.longBreakDuration

    setState((prev) => ({
      ...prev,
      timeRemaining: duration,
      isActive: false,
    }))

    workerRef.current?.postMessage({
      type: 'RESET',
      duration,
    })
  }, [state.mode, settings])

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/timerWorker.ts', import.meta.url),
      { type: 'module' },
    )

    workerRef.current.onmessage = (e) => {
      const { type, timeRemaining } = e.data

      switch (type) {
        case 'TICK':
          setState((prev) => ({ ...prev, timeRemaining }))
          break
        case 'COMPLETE':
          handleTimerComplete()
          break
      }
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [handleTimerComplete])

  useEffect(() => {
    const currentMode = state.mode
    const newDuration =
      currentMode === 'work'
        ? settings.workDuration
        : currentMode === 'break'
        ? settings.breakDuration
        : settings.longBreakDuration

    setState((prev) => ({
      ...prev,
      timeRemaining: newDuration,
    }))

    workerRef.current?.postMessage({
      type: 'RESET',
      duration: newDuration,
    })
  }, [settings, state.mode])

  useEffect(() => {
    const minutes = Math.floor(state.timeRemaining / 60)
    const seconds = state.timeRemaining % 60
    const timeString = `${String(minutes).padStart(2, '0')}:${String(
      seconds,
    ).padStart(2, '0')}`

    if (state.isActive) {
      document.title = `(${timeString}) ${state.mode}`
    } else {
      document.title = 'Cogi: Deep Work'
    }

    return () => {
      document.title = 'Cogi: Deep Work'
    }
  }, [state.timeRemaining, state.isActive, state.mode])

  const playSound = async () => {
    try {
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: AudioContext })
          .webkitAudioContext)()

      for (const audioSource of AUDIO_SOURCES) {
        try {
          const response = await fetch(audioSource)
          if (!response.ok) continue

          const arrayBuffer = await response.arrayBuffer()
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

          const source = audioContext.createBufferSource()
          source.buffer = audioBuffer
          source.connect(audioContext.destination)
          source.start(0)
          return
        } catch (e) {
          console.warn(`Failed to load audio from ${audioSource}:`, e)
          continue
        }
      }

      console.error('No compatible audio format found')
    } catch (error) {
      console.error('Error playing sound:', error)
    }
  }

  return {
    ...state,
    settings,
    setSettings,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
  }
}
