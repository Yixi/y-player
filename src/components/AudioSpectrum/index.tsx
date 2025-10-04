import React, { useRef, useEffect } from 'react'
import styles from './style.module.less'

// Type declaration for webkit vendor prefix
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

interface AudioSpectrumProps {
  audioElement: HTMLAudioElement | null
  isPlaying: boolean
}

const AudioSpectrum: React.FC<AudioSpectrumProps> = ({
  audioElement,
  isPlaying,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const animationIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!audioElement || !canvasRef.current) return

    // Initialize audio context and analyser
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!AudioContextClass) {
        // AudioContext not available (e.g., in test environment)
        return
      }
      audioContextRef.current = new AudioContextClass()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256

      // Create source and connect
      try {
        sourceRef.current =
          audioContextRef.current.createMediaElementSource(audioElement)
        sourceRef.current.connect(analyserRef.current)
        analyserRef.current.connect(audioContextRef.current.destination)
      } catch {
        // Handle error (e.g., MediaElement already connected)
        return
      }
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx || !analyserRef.current) return

    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!isPlaying) {
        // Clear canvas when not playing
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        return
      }

      animationIdRef.current = requestAnimationFrame(draw)

      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barWidth = canvas.width / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height

        // Create gradient for bars
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0)
        gradient.addColorStop(0, '#3b82f6')
        gradient.addColorStop(0.5, '#8b5cf6')
        gradient.addColorStop(1, '#ec4899')

        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height - barHeight, barWidth * 0.8, barHeight)

        x += barWidth
      }
    }

    if (isPlaying) {
      draw()
    } else {
      // Clear canvas when not playing
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [audioElement, isPlaying])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return (
    <div className={styles.spectrumContainer}>
      <canvas ref={canvasRef} className={styles.spectrumCanvas} />
    </div>
  )
}

export default React.memo(AudioSpectrum)
