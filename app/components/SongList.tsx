import type { Song } from '~/components/Playlist'

interface SongListProps {
  songs: Song[]
  currentSongIndex: number
  isPlaying: boolean
  onSongClick: (song: Song, index: number) => void
}

export default function SongList({ 
  songs, 
  currentSongIndex, 
  isPlaying, 
  onSongClick 
}: SongListProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Songs</h2>
      <div className="max-h-96 md:max-h-[500px] overflow-y-auto border border-gray-200 rounded-lg bg-white">
        {songs.map((song, index) => (
          <div
            key={index}
            onClick={() => onSongClick(song, index)}
            className={`flex items-center p-3 md:p-4 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
              index === currentSongIndex 
                ? 'bg-black text-white' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold mr-3 md:mr-4 ${
              index === currentSongIndex ? 'bg-white text-black' : 'bg-black text-white'
            }`}>
              {isPlaying && index === currentSongIndex ? '▶' : index + 1}
            </div>
            <div className="flex-grow min-w-0">
              <h3 className={`font-semibold text-sm md:text-base truncate ${
                index === currentSongIndex ? 'text-white' : 'text-gray-900'
              }`}>
                {song.title}
              </h3>
              <p className={`text-xs md:text-sm truncate ${
                index === currentSongIndex ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {song.artist}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}