import React from 'react';
import { Settings as SettingsIcon, X } from 'lucide-react';
import { TimerSettings } from '../types/timer';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  if (!isOpen) return null;

  const handleChange = (field: keyof TimerSettings, value: number | boolean) => {
    onSettingsChange({
      ...settings,
      [field]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-200">Timer Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Work Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.workDuration / 60}
                onChange={(e) =>
                  handleChange('workDuration', parseInt(e.target.value) * 60)
                }
                className="w-full bg-gray-800 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Break Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.breakDuration / 60}
                onChange={(e) =>
                  handleChange('breakDuration', parseInt(e.target.value) * 60)
                }
                className="w-full bg-gray-800 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Long Break Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.longBreakDuration / 60}
                onChange={(e) =>
                  handleChange('longBreakDuration', parseInt(e.target.value) * 60)
                }
                className="w-full bg-gray-800 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Sessions Before Long Break
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.sessionsBeforeLongBreak}
                onChange={(e) =>
                  handleChange(
                    'sessionsBeforeLongBreak',
                    parseInt(e.target.value),
                  )
                }
                className="w-full bg-gray-800 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Auto-start Timer</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoStartTimer}
                  onChange={(e) =>
                    handleChange('autoStartTimer', e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SettingsButton: React.FC<{ onClick: () => void }> = () => (
  <SettingsIcon className="w-6 h-6" />
);