import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode, TimerSettings, TimerState } from '../types/timer';

const DEFAULT_SETTINGS: TimerSettings = {
  workDuration: 25 * 60,
  breakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  sessionsBeforeLongBreak: 4,
  autoStartTimer: false,
};

export const useTimer = () => {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [state, setState] = useState<TimerState>({
    timeRemaining: DEFAULT_SETTINGS.workDuration,
    isActive: false,
    mode: 'work',
    completedSessions: 0,
  });

  const workerRef = useRef<Worker | null>(null);

  // Update timer when settings change
  useEffect(() => {
    const currentMode = state.mode;
    const newDuration = 
      currentMode === 'work'
        ? settings.workDuration
        : currentMode === 'break'
        ? settings.breakDuration
        : settings.longBreakDuration;

    setState(prev => ({
      ...prev,
      timeRemaining: newDuration
    }));

    workerRef.current?.postMessage({
      type: 'RESET',
      duration: newDuration,
    });
  }, [settings]);

  useEffect(() => {
    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = state.timeRemaining % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(
      seconds,
    ).padStart(2, '0')}`;

    if (state.isActive) {
      document.title = `(${timeString}) ${state.mode} - Pomodoro`;
    } else {
      document.title = 'Pomodoro Timer';
    }

    return () => {
      document.title = 'Pomodoro Timer';
    };
  }, [state.timeRemaining, state.isActive, state.mode]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/timerWorker.ts', import.meta.url),
      { type: 'module' },
    );

    workerRef.current.onmessage = (e) => {
      const { type, timeRemaining } = e.data;

      switch (type) {
        case 'TICK':
          setState((prev) => ({ ...prev, timeRemaining }));
          break;
        case 'COMPLETE':
          handleTimerComplete();
          break;
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleTimerComplete = useCallback(() => {
    setState((prev) => {
      const newCompletedSessions =
        prev.mode === 'work' ? prev.completedSessions + 1 : prev.completedSessions;

      let nextMode: TimerMode = 'work';
      let nextDuration = settings.workDuration;

      if (prev.mode === 'work') {
        if (
          newCompletedSessions > 0 &&
          newCompletedSessions % settings.sessionsBeforeLongBreak === 0
        ) {
          nextMode = 'long-break';
          nextDuration = settings.longBreakDuration;
        } else {
          nextMode = 'break';
          nextDuration = settings.breakDuration;
        }
      }

      return {
        ...prev,
        mode: nextMode,
        timeRemaining: nextDuration,
        isActive: settings.autoStartTimer,
        completedSessions: newCompletedSessions,
      };
    });

    new Audio('/notification.mp3').play().catch(() => {});

    if (Notification.permission === 'granted') {
      new Notification(`Timer Complete!`, {
        body: `Time for your next session!`,
        icon: '/favicon.ico',
      });
    }
  }, [settings]);

  const startTimer = useCallback(() => {
    setState((prev) => ({ ...prev, isActive: true }));
    workerRef.current?.postMessage({
      type: 'START',
      duration: state.timeRemaining,
    });

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [state.timeRemaining]);

  const pauseTimer = useCallback(() => {
    setState((prev) => ({ ...prev, isActive: false }));
    workerRef.current?.postMessage({ type: 'PAUSE' });
  }, []);

  const switchMode = useCallback(
    (mode: TimerMode) => {
      const duration =
        mode === 'work'
          ? settings.workDuration
          : mode === 'break'
          ? settings.breakDuration
          : settings.longBreakDuration;

      setState((prev) => ({
        ...prev,
        mode,
        timeRemaining: duration,
        isActive: false,
      }));

      workerRef.current?.postMessage({
        type: 'RESET',
        duration,
      });
    },
    [settings],
  );

  const resetTimer = useCallback(() => {
    const duration =
      state.mode === 'work'
        ? settings.workDuration
        : state.mode === 'break'
        ? settings.breakDuration
        : settings.longBreakDuration;

    setState((prev) => ({
      ...prev,
      timeRemaining: duration,
      isActive: false,
    }));

    workerRef.current?.postMessage({
      type: 'RESET',
      duration,
    });
  }, [state.mode, settings]);

  return {
    ...state,
    settings,
    setSettings,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
  };
};