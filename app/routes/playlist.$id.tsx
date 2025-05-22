import type { Route } from './+types/playlist.$id'
import { Playlist } from '~/lib/models/playlist'
import PlaylistComponent from '~/components/Playlist'

interface Song {
  title: string
  artist: string
  youtubeId?: string
}

interface PlaylistDto {
  id: string
  title: string
  description: string
  songs: Song[]
  prompt?: string
}

async function searchYouTubeVideo(query: string): Promise<string | null> {
  try {
    const apiKey = process.env.RAPID_API_KEY
    if (!apiKey) {
      console.error('RAPID_API_KEY not found')
      return null
    }

    const url = `https://youtube-v31.p.rapidapi.com/search?q=${encodeURIComponent(query)}&part=snippet%2Cid&regionCode=US&maxResults=1`
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'youtube-v31.p.rapidapi.com'
      }
    }

    const response = await fetch(url, options)
    const result = await response.json()
    
    if (result.items && result.items.length > 0 && result.items[0].id?.videoId) {
      return result.items[0].id.videoId
    }
    
    return null
  } catch (error) {
    console.error('Error searching YouTube:', error)
    return null
  }
}

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const playlist = await Playlist.find(params.id)

    if (!playlist) {
      throw new Response('Playlist not found', { status: 404 })
    }

    // Search for YouTube video IDs for each song
    const songsWithYouTube = await Promise.all(
      playlist.songs.map(async (song) => {
        if (song.youtubeId) {
          // Already has YouTube ID
          return song
        }
        
        // Search for YouTube video
        const query = `${song.title} ${song.artist}`
        const youtubeId = await searchYouTubeVideo(query)
        
        return {
          ...song,
          youtubeId: youtubeId || undefined
        }
      })
    )

    // Update playlist with YouTube IDs if any were found
    const hasNewYouTubeIds = songsWithYouTube.some((song, index) => 
      song.youtubeId && !playlist.songs[index].youtubeId
    )
    
    if (hasNewYouTubeIds) {
      playlist.songs = songsWithYouTube
      await playlist.save()
    }

    return {
      playlist: {
        id: playlist.id,
        title: playlist.title,
        description: playlist.description,
        songs: songsWithYouTube,
        prompt: playlist.prompt
      }
    }
  } catch (error) {
    console.error('Error loading playlist:', error)
    throw new Response('Failed to load playlist', { status: 500 })
  }
}

export function meta({ data }: Route.MetaArgs) {
  if (data && 'playlist' in data && data.playlist?.title) {
    return [
      { title: `${data.playlist.title} - Perfect Playlist` },
      { name: 'description', content: `Listen to ${data.playlist.title}` }
    ]
  }

  return [
    { title: 'Playlist - Perfect Playlist' },
    { name: 'description', content: 'Your perfect playlist' }
  ]
}

export default function PlaylistPage({ loaderData }: Route.ComponentProps) {
  const { playlist } = loaderData

  console.log('Playlist loaded:', playlist)

  return <PlaylistComponent playlist={playlist} />
}