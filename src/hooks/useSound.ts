import { useCallback, useRef } from 'react'

const AUDIO_SOURCES = {
  on: '/assets/on.mp3',
  off: '/assets/off.mp3',
  buttonClick: '/assets/button-click.wav',
} as const

export const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioBuffersRef = useRef<Record<string, AudioBuffer>>({})

  const initializeAudio = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: AudioContext })
          .webkitAudioContext)()

      // Pre-load all audio files
      for (const [key, source] of Object.entries(AUDIO_SOURCES)) {
        try {
          const response = await fetch(source)
          const arrayBuffer = await response.arrayBuffer()
          const audioBuffer = await audioContextRef.current.decodeAudioData(
            arrayBuffer,
          )
          audioBuffersRef.current[key] = audioBuffer
        } catch (error) {
          console.error(`Failed to load audio ${key}:`, error)
        }
      }
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume()
    }
  }, [])

  const playSound = useCallback(
    async (soundType: keyof typeof AUDIO_SOURCES) => {
      try {
        await initializeAudio()

        if (!audioContextRef.current || !audioBuffersRef.current[soundType]) {
          return
        }

        const source = audioContextRef.current.createBufferSource()
        source.buffer = audioBuffersRef.current[soundType]
        source.connect(audioContextRef.current.destination)
        source.start(0)
      } catch (error) {
        console.error('Error playing sound:', error)
      }
    },
    [initializeAudio],
  )

  return { playSound }
}
