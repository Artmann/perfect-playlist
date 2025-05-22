import { forwardRef } from 'react'

interface YouTubePlayerProps {
  playerReady: boolean
  isPlaying: boolean
  playerState: number
  onTogglePlay: () => void
}

const YouTubePlayer = forwardRef<HTMLDivElement, YouTubePlayerProps>(
  ({ playerReady, isPlaying, playerState, onTogglePlay }, ref) => {
    const showPlayOverlay = playerReady && 
      !isPlaying && 
      playerState !== window.YT?.PlayerState?.BUFFERING

    return (
      <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
        <div ref={ref} className="w-full h-full" />
        
        {/* Loading overlay */}
        {!playerReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-white text-lg">Loading player...</div>
          </div>
        )}
        
        {/* Click to play overlay */}
        {showPlayOverlay && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer hover:bg-opacity-30 transition-all"
            onClick={onTogglePlay}
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-l-8 border-l-black border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1"></div>
            </div>
          </div>
        )}
      </div>
    )
  }
)

YouTubePlayer.displayName = 'YouTubePlayer'

export default YouTubePlayer