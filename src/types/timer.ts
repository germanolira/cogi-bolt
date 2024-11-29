export type TimerMode = 'work' | 'break' | 'long-break';

export interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartTimer: boolean;
}

export interface TimerState {
  timeRemaining: number;
  isActive: boolean;
  mode: TimerMode;
  completedSessions: number;
}