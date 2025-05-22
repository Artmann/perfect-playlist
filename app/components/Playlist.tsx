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
  artist: string
  title: string
  youtubeId?: string
}

export interface PlaylistDto {
  description: string
  id: string
  prompt?: string
  songs: Song[]
  title: string
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
    onError,
    onNearEnd,
    onStateChange,
    onTimeUpdate,
    startTime: savedState.currentTime,
    videoId: playlistState.currentSong?.youtubeId,
    volume: playlistState.volume
  })

  const handleSongClick = (song: Song, index: number) => {
    const result = playlistState.goToSong(index)
    if (result) {
      player.loadVideo(song.youtubeId!, 0)
    }
  }

  return (
    <ErrorBoundary>
      <div className="h-screen bg-white overflow-hidden flex flex-col max-w-4xl mx-auto">
        <PlaylistHeader
          songCount={playlist.songs.length}
          title={playlist.title}
        />

        <section className="px-4 md:px-6 py-12">
          <YouTubePlayer
            ref={player.playerRef}
            isPlaying={player.isPlaying}
            playerReady={player.playerReady}
            playerState={player.playerState}
            onTogglePlay={player.togglePlayPause}
          />
        </section>

        <SongList
          currentSongIndex={playlistState.currentSongIndex}
          isPlaying={player.isPlaying}
          songs={playlist.songs}
          onSongClick={handleSongClick}
        />
      </div>
    </ErrorBoundary>
  )
}
