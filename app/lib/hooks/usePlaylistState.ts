import { useState, useEffect, useCallback } from 'react'
import type { Song } from '~/components/Playlist'
import { savePlaylistState, loadPlaylistState, createStorageKey, removeFromStorage } from '~/lib/utils/storage'

interface UsePlaylistStateProps {
  playlistId: string
  songs: Song[]
}

export const usePlaylistState = ({ playlistId, songs }: UsePlaylistStateProps) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [volume, setVolume] = useState(100)

  // Load initial state from localStorage
  useEffect(() => {
    const savedState = loadPlaylistState(playlistId)
    const validIndex = Math.max(0, Math.min(savedState.currentIndex, songs.length - 1))
    
    setCurrentSongIndex(validIndex)
    setVolume(savedState.volume)
  }, [playlistId, songs.length])

  // Save state when it changes
  const saveCurrentState = useCallback((currentTime: number) => {
    savePlaylistState(playlistId, {
      currentIndex: currentSongIndex,
      currentTime,
      volume
    })
  }, [playlistId, currentSongIndex, volume])

  // Save state on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCurrentState(0) // We don't have access to currentTime here, so save 0
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [saveCurrentState])

  const currentSong = songs[currentSongIndex]

  const goToNextSong = useCallback(() => {
    if (songs.length === 0) return null
    
    const nextIndex = (currentSongIndex + 1) % songs.length
    const nextSong = songs[nextIndex]
    
    if (nextSong?.youtubeId) {
      setCurrentSongIndex(nextIndex)
      // Clear saved time when changing songs
      removeFromStorage(createStorageKey(playlistId, 'currentTime'))
      return { song: nextSong, index: nextIndex }
    }
    
    return null
  }, [songs, currentSongIndex, playlistId])

  const goToPreviousSong = useCallback(() => {
    if (songs.length === 0) return null
    
    const prevIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1
    const prevSong = songs[prevIndex]
    
    if (prevSong?.youtubeId) {
      setCurrentSongIndex(prevIndex)
      // Clear saved time when changing songs
      removeFromStorage(createStorageKey(playlistId, 'currentTime'))
      return { song: prevSong, index: prevIndex }
    }
    
    return null
  }, [songs, currentSongIndex, playlistId])

  const goToSong = useCallback((index: number) => {
    if (index < 0 || index >= songs.length) return null
    
    const song = songs[index]
    
    if (song?.youtubeId) {
      setCurrentSongIndex(index)
      // Clear saved time when changing songs
      removeFromStorage(createStorageKey(playlistId, 'currentTime'))
      return { song, index }
    }
    
    return null
  }, [songs, playlistId])

  const updateVolume = useCallback((newVolume: number) => {
    setVolume(newVolume)
  }, [])

  return {
    currentSongIndex,
    currentSong,
    volume,
    goToNextSong,
    goToPreviousSong,
    goToSong,
    updateVolume,
    saveCurrentState
  }
}