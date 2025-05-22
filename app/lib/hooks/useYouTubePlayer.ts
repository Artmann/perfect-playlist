import { useState, useEffect, useRef, useCallback } from 'react'
import type { YouTubePlayer, YouTubePlayerEvent } from '~/lib/types/youtube'

interface UseYouTubePlayerProps {
  videoId?: string
  startTime?: number
  volume?: number
  onReady?: (player: YouTubePlayer) => void
  onStateChange?: (state: number, player: YouTubePlayer) => void
  onError?: (error: number) => void
  onNearEnd?: () => void
  onTimeUpdate?: (currentTime: number) => void
}

export const useYouTubePlayer = ({
  videoId,
  startTime = 0,
  volume = 100,
  onReady,
  onStateChange,
  onError,
  onNearEnd,
  onTimeUpdate
}: UseYouTubePlayerProps) => {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null)
  const [playerReady, setPlayerReady] = useState(false)
  const [playerState, setPlayerState] = useState(-1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const playerRef = useRef<HTMLDivElement>(null)
  const timeTrackingInterval = useRef<NodeJS.Timeout | null>(null)
  const hasTriggeredNearEnd = useRef(false)

  const startTimeTracking = useCallback((playerInstance: YouTubePlayer) => {
    if (timeTrackingInterval.current) {
      clearInterval(timeTrackingInterval.current)
    }

    setTimeout(() => {
      timeTrackingInterval.current = setInterval(() => {
        if (playerInstance && typeof playerInstance.getCurrentTime === 'function') {
          try {
            const current = playerInstance.getCurrentTime()
            const totalDuration = playerInstance.getDuration()
            
            if (current >= 0 && totalDuration > 0) {
              setCurrentTime(current)
              
              // Notify parent component of time update for saving
              onTimeUpdate?.(current)
              
              // Check if we're within 10 seconds of the end
              const timeRemaining = totalDuration - current
              if (timeRemaining <= 10 && !hasTriggeredNearEnd.current) {
                hasTriggeredNearEnd.current = true
                onNearEnd?.()
              }
              
              // Format and log elapsed time and duration
              const formatTime = (seconds: number) => {
                const mins = Math.floor(seconds / 60)
                const secs = Math.floor(seconds % 60)
                return `${mins}:${secs.toString().padStart(2, '0')}`
              }
              
              const progress = Math.round((current / totalDuration) * 100)
              console.log(`⏱️ Playing: ${formatTime(current)} / ${formatTime(totalDuration)} (${progress}%)`)
            }
          } catch (error) {
            // Error getting time data
          }
        }
      }, 1000)
    }, 200)
  }, [])

  const stopTimeTracking = useCallback(() => {
    if (timeTrackingInterval.current) {
      clearInterval(timeTrackingInterval.current)
      timeTrackingInterval.current = null
    }
  }, [])


  const initializePlayer = useCallback(() => {
    if (!playerRef.current || !window.YT || !videoId) return

    const ytPlayer = new window.YT.Player(playerRef.current, {
      height: '100%',
      width: '100%',
      videoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        disablekb: 0,
        enablejsapi: 1,
        fs: 1,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        start: startTime,
        mute: 0,
        origin: window.location.origin
      },
      events: {
        onReady: (event: YouTubePlayerEvent) => {
          setPlayerReady(true)
          event.target.setVolume(volume)
          
          const videoDuration = event.target.getDuration()
          setDuration(videoDuration)
          
          // Multiple attempts to ensure playback starts
          try {
            event.target.playVideo()
          } catch (error) {
            // Autoplay blocked by browser
          }
          
          // Additional play attempt after a short delay
          setTimeout(() => {
            try {
              event.target.playVideo()
            } catch (error) {
              // Second play attempt failed
            }
          }, 500)
          
          onReady?.(event.target)
        },
        onStateChange: (event: YouTubePlayerEvent) => {
          const state = event.data
          setPlayerState(state)

          switch (state) {
            case window.YT?.PlayerState?.PLAYING:
              setIsPlaying(true)
              startTimeTracking(event.target)
              break
            case window.YT?.PlayerState?.PAUSED:
              setIsPlaying(false)
              stopTimeTracking()
              break
            case window.YT?.PlayerState?.ENDED:
              setIsPlaying(false)
              stopTimeTracking()
              break
            case window.YT?.PlayerState?.BUFFERING:
              break
            case window.YT?.PlayerState?.CUED:
              setTimeout(() => {
                try {
                  ytPlayer.playVideo()
                } catch (error) {
                  // Play attempt failed
                }
              }, 100)
              break
            default:
              setIsPlaying(false)
              stopTimeTracking()
          }
          
          onStateChange?.(state, event.target)
        },
        onError: (event: YouTubePlayerEvent) => {
          onError?.(event.data)
        }
      }
    })

    setPlayer(ytPlayer)
  }, [videoId, startTime, volume, startTimeTracking, stopTimeTracking, onReady, onStateChange, onError])

  const loadYouTubeAPI = useCallback(() => {
    if (typeof window === 'undefined') return

    if (window.YT && window.YT.Player) {
      initializePlayer()
      return
    }

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      document.head.appendChild(script)
    }

    window.onYouTubeIframeAPIReady = initializePlayer
  }, [initializePlayer])

  useEffect(() => {
    loadYouTubeAPI()
  }, [loadYouTubeAPI])

  useEffect(() => {
    return () => {
      stopTimeTracking()
      if (player && typeof player.destroy === 'function') {
        player.destroy()
      }
    }
  }, [player, stopTimeTracking])

  const play = useCallback(() => {
    player?.playVideo()
  }, [player])

  const pause = useCallback(() => {
    player?.pauseVideo()
  }, [player])

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  const seekTo = useCallback((time: number) => {
    player?.seekTo(time, true)
  }, [player])

  const setVolume = useCallback((newVolume: number) => {
    player?.setVolume(newVolume)
  }, [player])

  const loadVideo = useCallback((newVideoId: string, startSeconds = 0) => {
    hasTriggeredNearEnd.current = false // Reset flag when loading new video
    player?.loadVideoById(newVideoId, startSeconds)
    
    // Ensure the video starts playing after loading
    setTimeout(() => {
      try {
        player?.playVideo()
      } catch (error) {
        // Play attempt failed
      }
    }, 1000)
  }, [player])

  return {
    playerRef,
    player,
    playerReady,
    playerState,
    currentTime,
    duration,
    isPlaying,
    play,
    pause,
    togglePlayPause,
    seekTo,
    setVolume,
    loadVideo
  }
}