export const createStorageKey = (playlistId: string, suffix: string) => 
  `playlist_${playlistId}_${suffix}`

export const saveToStorage = (key: string, value: string | number) => {
  try {
    localStorage.setItem(key, value.toString())
  } catch (error) {
    // Failed to save to localStorage
  }
}

export const loadFromStorage = (key: string, defaultValue?: string): string | null => {
  try {
    return localStorage.getItem(key) ?? defaultValue ?? null
  } catch (error) {
    // Failed to load from localStorage
    return defaultValue ?? null
  }
}

export const removeFromStorage = (key: string) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    // Failed to remove from localStorage
  }
}

export const savePlaylistState = (playlistId: string, state: {
  currentIndex: number
  currentTime: number
  volume: number
}) => {
  const baseKey = (suffix: string) => createStorageKey(playlistId, suffix)
  
  saveToStorage(baseKey('currentIndex'), state.currentIndex)
  saveToStorage(baseKey('currentTime'), Math.floor(state.currentTime))
  saveToStorage(baseKey('volume'), state.volume)
}

export const loadPlaylistState = (playlistId: string) => {
  const baseKey = (suffix: string) => createStorageKey(playlistId, suffix)
  
  const currentIndex = parseInt(loadFromStorage(baseKey('currentIndex')) ?? '0', 10)
  const currentTime = parseInt(loadFromStorage(baseKey('currentTime')) ?? '0', 10)
  const volume = parseInt(loadFromStorage(baseKey('volume')) ?? '100', 10)
  
  return { currentIndex, currentTime, volume }
}