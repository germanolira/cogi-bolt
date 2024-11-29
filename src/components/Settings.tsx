import React, { useState, useEffect, useCallback, ChangeEvent, FC } from 'react'
import { Settings as SettingsIcon, X } from 'lucide-react'
import { TimerSettings as TimerSettingsType } from '../types/timer'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: TimerSettingsType
  onSettingsChange: (settings: TimerSettingsType) => void
}

// Reusable component for duration adjustment
interface DurationSettingProps {
  label: string
  value: number // value in seconds
  min: number
  max: number
  onChange: (value: number) => void
}

const DurationSetting: FC<DurationSettingProps> = ({
  label,
  value,
  min,
  max,
  onChange,
}) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(e.target.value) || 0
    onChange(inputValue * 60)
  }

  const increment = () => {
    const currentMinutes = value / 60
    if (currentMinutes < max) {
      onChange((currentMinutes + 1) * 60)
    }
  }

  const decrement = () => {
    const currentMinutes = value / 60
    if (currentMinutes > min) {
      onChange((currentMinutes - 1) * 60)
    }
  }

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2" htmlFor={label}>
        {label}
      </label>
      <div className="relative">
        <input
          id={label}
          type="number"
          min={min}
          max={max}
          value={value / 60}
          onChange={handleInputChange}
          className="w-full bg-gray-800 text-gray-200 rounded-lg px-3 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-gray-700 text-center"
          aria-label={`${label} duration in minutes`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-5 flex flex-col gap-1">
          <button
            type="button"
            aria-label={`Increase ${label.toLowerCase()} duration`}
            className="h-4 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-gray-400 hover:text-gray-200 text-[10px]"
            onClick={increment}
          >
            ▲
          </button>
          <button
            type="button"
            aria-label={`Decrease ${label.toLowerCase()} duration`}
            className="h-4 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center text-gray-400 hover:text-gray-200 text-[10px]"
            onClick={decrement}
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  )
}

export const SettingsModal: FC<SettingsModalProps> = React.memo(
  ({ isOpen, onClose, settings, onSettingsChange }) => {
    const [localSettings, setLocalSettings] =
      useState<TimerSettingsType>(settings)

    // Update local settings when props change
    useEffect(() => {
      setLocalSettings(settings)
    }, [settings])

    // Generic handler for local changes
    const handleLocalChange = useCallback(
      (field: keyof TimerSettingsType, value: number | boolean) => {
        setLocalSettings((prevSettings) => ({
          ...prevSettings,
          [field]: value,
        }))
      },
      [],
    )

    // Save changes and close modal
    const handleSave = useCallback(() => {
      onSettingsChange(localSettings)
      onClose()
    }, [localSettings, onSettingsChange, onClose])

    if (!isOpen) return null

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h2
              id="settings-modal-title"
              className="text-xl font-semibold text-gray-200"
            >
              Settings
            </h2>
            <button
              type="button"
              aria-label="Close settings"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="space-y-6" aria-labelledby="timer-settings">
            <div>
              <h3
                id="timer-settings"
                className="text-base font-semibold text-gray-200"
              >
                Timer Settings
              </h3>
            </div>

            {/* Duration Settings */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              aria-label="Duration settings"
            >
              <DurationSetting
                label="Work"
                value={localSettings.workDuration}
                min={1}
                max={60}
                onChange={(value) => handleLocalChange('workDuration', value)}
              />
              <DurationSetting
                label="Break"
                value={localSettings.breakDuration}
                min={1}
                max={30}
                onChange={(value) => handleLocalChange('breakDuration', value)}
              />
              <DurationSetting
                label="Long Break"
                value={localSettings.longBreakDuration}
                min={1}
                max={60}
                onChange={(value) =>
                  handleLocalChange('longBreakDuration', value)
                }
              />
            </div>

            {/* Auto-start Timer */}
            <div className="flex items-center justify-between">
              <label htmlFor="auto-start" className="text-sm text-gray-400">
                Auto-start Timer
              </label>
              <label
                htmlFor="auto-start"
                className="relative inline-flex items-center cursor-pointer"
              >
                <input
                  id="auto-start"
                  type="checkbox"
                  checked={localSettings.autoStartTimer}
                  onChange={(e) =>
                    handleLocalChange('autoStartTimer', e.target.checked)
                  }
                  className="sr-only peer"
                  aria-checked={localSettings.autoStartTimer}
                />
                <div
                  className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full 
                  peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                  peer-checked:after:border-white after:content-[''] after:absolute 
                  after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 
                  after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                  peer-checked:bg-blue-600 hover:bg-gray-600 peer-checked:hover:bg-blue-700"
                ></div>
              </label>
            </div>

            {/* Sessions Before Long Break */}
            <div>
              <label
                htmlFor="sessions-before-long-break"
                className="block text-sm text-gray-400 mb-2"
              >
                Sessions Before Long Break
              </label>
              <input
                id="sessions-before-long-break"
                type="number"
                min={1}
                max={10}
                value={localSettings.sessionsBeforeLongBreak}
                onChange={(e) =>
                  handleLocalChange(
                    'sessionsBeforeLongBreak',
                    parseInt(e.target.value) || 1,
                  )
                }
                className="w-full bg-gray-800 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700 
                [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:h-full 
                [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:cursor-pointer 
                [&::-webkit-inner-spin-button]:hover:bg-gray-700"
                aria-label="Number of sessions before long break"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

export const SettingsButton: FC<{ onClick: () => void }> = ({ onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-2 cursor-pointer"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
  >
    <p className="text-gray-400 text-base">Settings</p>
    <SettingsIcon className="w-6 h-6 text-gray-200" />
  </div>
)
