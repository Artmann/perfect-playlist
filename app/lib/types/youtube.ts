export interface YouTubePlayerState {
  UNSTARTED: -1
  ENDED: 0
  PLAYING: 1
  PAUSED: 2
  BUFFERING: 3
  CUED: 5
}

export interface YouTubePlayerEvent {
  target: YouTubePlayer
  data: number
}

export interface YouTubePlayer {
  playVideo(): void
  pauseVideo(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  loadVideoById(videoId: string, startSeconds?: number): void
  setVolume(volume: number): void
  getVolume(): number
  getCurrentTime(): number
  getDuration(): number
  destroy(): void
}

export interface YouTubePlayerConfig {
  height: string | number
  width: string | number
  videoId: string
  playerVars: {
    autoplay?: 0 | 1
    controls?: 0 | 1
    disablekb?: 0 | 1
    enablejsapi?: 0 | 1
    fs?: 0 | 1
    iv_load_policy?: 1 | 3
    modestbranding?: 0 | 1
    playsinline?: 0 | 1
    rel?: 0 | 1
    start?: number
    mute?: 0 | 1
    origin?: string
  }
  events: {
    onReady?: (event: YouTubePlayerEvent) => void
    onStateChange?: (event: YouTubePlayerEvent) => void
    onError?: (event: YouTubePlayerEvent) => void
  }
}

declare global {
  interface Window {
    YT: {
      Player: new (element: HTMLElement | string, config: YouTubePlayerConfig) => YouTubePlayer
      PlayerState: YouTubePlayerState
    }
    onYouTubeIframeAPIReady: () => void
  }
}