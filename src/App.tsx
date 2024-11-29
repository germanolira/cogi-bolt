import React, { useState } from 'react';
import { Timer } from './components/Timer';
import { SettingsButton, SettingsModal } from './components/Settings';
import { useTimer } from './hooks/useTimer';
import { TimerMode } from './types/timer';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
  } = useTimer();

  const Header = () => {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="bg-white/80 items-center rounded-lg p-1 px-3 mx-2">
            <p className="text-gray-800 text-2xl font-bold">C</p>
          </div>
          <div className="text-gray-200 text-2xl font-bold">
            <p>Cogi</p>
          </div>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="bg-gray-800 p-2 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
        >
          <SettingsButton onClick={() => setIsSettingsOpen(true)} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-background pt-2 px-8 md:px-16">
      <div className="w-full max-w-md bg-backgroundh-full">
        <Header />
        <div className="timer-container rounded-3xl p-8 mb-8 mt-8">
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'work'
                  ? 'bg-gray-800 text-gray-200'
                  : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
              }`}
              onClick={() => switchMode('work')}
            >
              Work
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'break'
                  ? 'bg-gray-800 text-gray-200'
                  : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
              }`}
              onClick={() => switchMode('break')}
            >
              Break
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                mode === 'long-break'
                  ? 'bg-gray-800 text-gray-200'
                  : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
              }`}
              onClick={() => switchMode('long-break')}
            >
              Long Break
            </button>
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
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
}

export default App;