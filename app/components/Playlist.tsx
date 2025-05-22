import { useEffect, useMemo, useCallback } from 'react'
import { Button } from '~/components/ui/button'
import { useYouTubePlayer } from '~/lib/hooks/useYouTubePlayer'
import { usePlaylistState } from '~/lib/hooks/usePlaylistState'
import { loadPlaylistState } from '~/lib/utils/storage'
import PlaylistHeader from '~/components/PlaylistHeader'
import YouTubePlayer from '~/components/YouTubePlayer'
import SongList from '~/components/SongList'
import ErrorBoundary from '~/components/ErrorBoundary'

export interface Song {
  title: string
  artist: string
  youtubeId?: string
}

export interface PlaylistDto {
  id: string
  title: string
  description: string
  songs: Song[]
  prompt?: string
}

interface PlaylistProps {
  playlist: PlaylistDto
}

export default function Playlist({ playlist }: PlaylistProps) {
  const playlistState = usePlaylistState({
    playlistId: playlist.id,
    songs: playlist.songs
  })

  const savedState = useMemo(
    () => loadPlaylistState(playlist.id),
    [playlist.id]
  )

  const onStateChange = useCallback(
    (state: number) => {
      if (state === window.YT?.PlayerState?.ENDED) {
        const nextSong = playlistState.goToNextSong()
        if (nextSong) {
          player.loadVideo(nextSong.song.youtubeId!, 0)
        }
      }
    },
    [playlistState.goToNextSong]
  )

  const onError = useCallback(() => {
    const nextSong = playlistState.goToNextSong()
    if (nextSong) {
      player.loadVideo(nextSong.song.youtubeId!, 0)
    }
  }, [playlistState.goToNextSong])

  const onNearEnd = useCallback(() => {
    const nextSong = playlistState.goToNextSong()
    if (nextSong) {
      player.loadVideo(nextSong.song.youtubeId!, 0)
    }
  }, [playlistState.goToNextSong])

  const onTimeUpdate = useCallback(
    (currentTime: number) => {
      playlistState.saveCurrentState(currentTime)
    },
    [playlistState.saveCurrentState]
  )

  const player = useYouTubePlayer({
    videoId: playlistState.currentSong?.youtubeId,
    startTime: savedState.currentTime,
    volume: playlistState.volume,
    onStateChange,
    onError,
    onNearEnd,
    onTimeUpdate
  })

  const handleSongClick = (song: Song, index: number) => {
    const result = playlistState.goToSong(index)
    if (result) {
      player.loadVideo(song.youtubeId!, 0)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    playlistState.updateVolume(newVolume)
    player.setVolume(newVolume)
  }

  return (
    <ErrorBoundary>
      <div className="h-screen bg-white overflow-hidden flex flex-col max-w-4xl mx-auto">
        <PlaylistHeader
          title={playlist.title}
          songCount={playlist.songs.length}
        />

        <section className="px-4 md:px-6 py-12">
          <YouTubePlayer
            ref={player.playerRef}
            playerReady={player.playerReady}
            isPlaying={player.isPlaying}
            playerState={player.playerState}
            onTogglePlay={player.togglePlayPause}
          />
        </section>

        <SongList
          songs={playlist.songs}
          currentSongIndex={playlistState.currentSongIndex}
          isPlaying={player.isPlaying}
          onSongClick={handleSongClick}
        />
      </div>
    </ErrorBoundary>
  )
}
