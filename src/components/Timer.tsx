import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { TimerMode } from '../types/timer';

interface TimerProps {
  timeRemaining: number;
  isActive: boolean;
  mode: TimerMode;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const Timer: React.FC<TimerProps> = ({
  timeRemaining,
  isActive,
  mode,
  onStart,
  onPause,
  onReset,
}) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const randomPhrases = [
    'Deep work',
    'Stay focused on one task',
    'Focus on your task',
  ];

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="time-display w-full py-8 rounded-2xl flex justify-center items-center">
        <div className="text-7xl font-mono font-bold text-gray-200 tracking-wider">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      <div>
        <p className="text-gray-200">
          {randomPhrases[Math.floor(Math.random() * randomPhrases.length)]}
        </p>
      </div>

      <div className="flex gap-4 w-full">
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 text-gray-200 hover:bg-surface/90 transition-colors font-medium border border-gray-800"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </button>

        <button
          onClick={isActive ? onPause : onStart}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 text-gray-200 hover:bg-gray-800/90 transition-colors font-medium border border-gray-800"
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Start</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};