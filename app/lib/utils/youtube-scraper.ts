/**
 * YouTube scraper utility to extract video IDs from search results
 */

import Bluebird from 'bluebird'
import { log } from 'tiny-typescript-logger'

export interface YouTubeSearchResult {
  videoId: string
  title: string
  channel: string
}

/**
 * Scrapes YouTube search results to find video IDs
 * @param query Search query (e.g., "title artist")
 * @returns First video ID found or null
 */
export async function searchYouTubeVideoId(
  query: string
): Promise<string | null> {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    if (!response.ok) {
      log.error('Failed to fetch YouTube search results:', response.status)
      return null
    }

    const html = await response.text()

    // Extract video IDs using regex pattern matching the results.html structure
    const videoIdMatches = html.match(/"videoId":"([^"]+)"/g)

    if (!videoIdMatches || videoIdMatches.length === 0) {
      log.error('No video IDs found in search results for:', query)
      return null
    }

    // Extract the first video ID (most relevant result)
    const firstMatch = videoIdMatches[0]
    const videoId = firstMatch.match(/"videoId":"([^"]+)"/)?.[1]

    if (!videoId) {
      log.error('Failed to extract video ID from match:', firstMatch)
      return null
    }

    log.info(`Found video ID for "${query}": ${videoId}`)
    return videoId
  } catch (error) {
    log.error('Error searching YouTube for:', query, error)
    return null
  }
}

/**
 * Searches for multiple songs and returns their video IDs
 * Uses bluebird to process 5 songs concurrently
 * @param songs Array of songs with title and artist
 * @returns Array of songs with video IDs added
 */
export async function searchMultipleSongs(
  songs: Array<{ title: string; artist: string }>
): Promise<Array<{ title: string; artist: string; youtubeId?: string }>> {
  log.info(`Starting YouTube search for ${songs.length} songs with concurrency 6`)
  
  const startTime = Date.now()
  const results = await Bluebird.map(
    songs,
    async (song: { title: string; artist: string }) => {
      const query = `${song.title} ${song.artist}`
      const youtubeId = await searchYouTubeVideoId(query)

      return {
        ...song,
        youtubeId: youtubeId || undefined
      }
    },
    { concurrency: 6 }
  )
  
  const endTime = Date.now()
  const successCount = results.filter(song => song.youtubeId).length
  log.info(`YouTube search completed: ${successCount}/${songs.length} songs found in ${endTime - startTime}ms`)
  
  return results
}
