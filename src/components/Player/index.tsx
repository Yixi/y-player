import React, { useState, useRef, useEffect } from 'react'
import styles from './style.module.less'

interface Track {
  id: string
  name: string
  url: string
  duration?: number
}

const Player: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(0.7)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => handleNext()

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentTrackIndex, tracks])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newTracks: Track[] = Array.from(files).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      name: file.name,
      url: URL.createObjectURL(file),
    }))

    setTracks((prev) => [...prev, ...newTracks])
    if (tracks.length === 0 && newTracks.length > 0) {
      setCurrentTrackIndex(0)
    }
  }

  const handlePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    if (tracks.length === 0) return
    setCurrentTrackIndex((prev) => (prev > 0 ? prev - 1 : tracks.length - 1))
    setIsPlaying(false)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }, 100)
  }

  const handleNext = () => {
    if (tracks.length === 0) return
    setCurrentTrackIndex((prev) => (prev < tracks.length - 1 ? prev + 1 : 0))
    setIsPlaying(false)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }, 100)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value))
  }

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index)
    setIsPlaying(false)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }, 100)
  }

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const currentTrack = tracks[currentTrackIndex]

  return (
    <div className={styles.player}>
      <div className={styles.playerContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Y-Player</h1>
          <p className={styles.subtitle}>支持多种音频格式的音乐播放器</p>
        </div>

        <div className={styles.uploadSection}>
          <label htmlFor="file-upload" className={styles.uploadButton}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 4V16M4 10H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            添加音乐文件
          </label>
          <input
            id="file-upload"
            type="file"
            accept="audio/*,.flac,.ape"
            multiple
            onChange={handleFileUpload}
            className={styles.fileInput}
          />
          <p className={styles.formatInfo}>
            支持格式: MP3, WAV, FLAC, APE, OGG, M4A, AAC, OPUS
          </p>
        </div>

        {tracks.length > 0 && currentTrack && (
          <>
            <div className={styles.nowPlaying}>
              <div className={styles.trackInfo}>
                <div className={styles.albumArt}>
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="30" cy="30" r="28" fill="#667eea" />
                    <circle cx="30" cy="30" r="10" fill="white" />
                    <circle cx="30" cy="30" r="4" fill="#667eea" />
                  </svg>
                </div>
                <div className={styles.trackDetails}>
                  <h2 className={styles.trackName}>{currentTrack.name}</h2>
                  <p className={styles.trackMeta}>
                    Track {currentTrackIndex + 1} of {tracks.length}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.controls}>
              <div className={styles.progressSection}>
                <span className={styles.time}>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className={styles.progressBar}
                />
                <span className={styles.time}>{formatTime(duration)}</span>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  onClick={handlePrevious}
                  className={styles.controlButton}
                  disabled={tracks.length === 0}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 5L7 12L19 19V5Z" fill="currentColor" />
                    <path
                      d="M7 5V19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <button
                  onClick={handlePlayPause}
                  className={`${styles.controlButton} ${styles.playButton}`}
                  disabled={tracks.length === 0}
                >
                  {isPlaying ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="6"
                        y="4"
                        width="4"
                        height="16"
                        fill="currentColor"
                      />
                      <rect
                        x="14"
                        y="4"
                        width="4"
                        height="16"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                    </svg>
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className={styles.controlButton}
                  disabled={tracks.length === 0}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 5L17 12L5 19V5Z" fill="currentColor" />
                    <path
                      d="M17 5V19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className={styles.volumeSection}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.volumeIcon}
                >
                  <path d="M10 4L6 8H2V12H6L10 16V4Z" fill="currentColor" />
                  <path
                    d="M14 7C15 8 15 12 14 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className={styles.volumeBar}
                />
                <span className={styles.volumeValue}>
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>

            <div className={styles.playlist}>
              <h3 className={styles.playlistTitle}>播放列表</h3>
              <div className={styles.playlistItems}>
                {tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className={`${styles.playlistItem} ${
                      index === currentTrackIndex ? styles.active : ''
                    }`}
                    onClick={() => handleTrackSelect(index)}
                  >
                    <span className={styles.trackNumber}>{index + 1}</span>
                    <span className={styles.trackTitle}>{track.name}</span>
                    {index === currentTrackIndex && isPlaying && (
                      <span className={styles.playingIndicator}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="2"
                            y="3"
                            width="3"
                            height="10"
                            fill="currentColor"
                          >
                            <animate
                              attributeName="height"
                              values="10;5;10"
                              dur="0.8s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="y"
                              values="3;5.5;3"
                              dur="0.8s"
                              repeatCount="indefinite"
                            />
                          </rect>
                          <rect
                            x="6.5"
                            y="3"
                            width="3"
                            height="10"
                            fill="currentColor"
                          >
                            <animate
                              attributeName="height"
                              values="10;5;10"
                              dur="0.8s"
                              begin="0.2s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="y"
                              values="3;5.5;3"
                              dur="0.8s"
                              begin="0.2s"
                              repeatCount="indefinite"
                            />
                          </rect>
                          <rect
                            x="11"
                            y="3"
                            width="3"
                            height="10"
                            fill="currentColor"
                          >
                            <animate
                              attributeName="height"
                              values="10;5;10"
                              dur="0.8s"
                              begin="0.4s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="y"
                              values="3;5.5;3"
                              dur="0.8s"
                              begin="0.4s"
                              repeatCount="indefinite"
                            />
                          </rect>
                        </svg>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <audio ref={audioRef} src={currentTrack?.url} />
      </div>
    </div>
  )
}

export default React.memo(Player)
