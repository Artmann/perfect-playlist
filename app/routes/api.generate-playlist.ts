import { anthropic } from '@ai-sdk/anthropic'
import { generateObject } from 'ai'
import striptags from 'striptags'
import { z } from 'zod'
import { log } from 'tiny-typescript-logger'

import { Playlist } from '~/lib/models/playlist'
import { searchMultipleSongs } from '~/lib/utils/youtube-scraper'
import type { Route } from './+types/api.generate-playlist'

const PlaylistSchema = z.object({
  title: z.string().describe('A catchy title for the playlist'),
  songs: z
    .array(
      z.object({
        title: z.string().describe('The song title'),
        artist: z.string().describe('The artist name')
      })
    )
    .describe('A list of 12 songs that match the description')
})

export async function action({ request }: Route.ActionArgs) {
  const startTime = Date.now()
  try {
    const { description } = await request.json()
    log.info(`Starting playlist generation for description: "${description?.slice(0, 50)}..."`)

    if (!description) {
      log.error('Playlist generation failed: Description is required')
      return Response.json(
        { error: 'Description is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      log.error('Playlist generation failed: ANTHROPIC_API_KEY environment variable is not set')
      return Response.json(
        { error: 'ANTHROPIC_API_KEY environment variable is not set' },
        { status: 500 }
      )
    }

    const sanitizedDescription = striptags(
      description.toString().trim().slice(0, 1000)
    )
    
    log.info('Generating playlist with Claude API...')

    const result = await generateObject({
      model: anthropic('claude-3-5-haiku-latest'),
      schema: PlaylistSchema,
      prompt: `You are an AI music curator tasked with generating personalized playlists
      based on users' vibes. Your goal is to create a playlist that captures the essence
      of the user's described mood, atmosphere, or feelings.

The user has provided the following description of their current vibes:

<user_vibes>
  ${sanitizedDescription}
</user_vibes>

Carefully analyze the user's description, paying attention to:
- Emotional states (e.g., happy, melancholic, energetic)
- Atmosphere or setting (e.g., rainy day, beach party, quiet night)
- Activities or contexts (e.g., workout, studying, road trip)
- Any specific genre preferences or musical elements mentioned

Based on your analysis, generate a playlist of 12 songs that best match the user's vibes. Consider
the following when selecting songs:
- Choose a variety of artists and songs to create a diverse yet cohesive playlist
- Include both popular and lesser-known tracks to provide a mix of familiar and discovery experiences
- Ensure the overall mood and energy of the playlist aligns with the user's described vibes
- If specific genres or musical elements were mentioned, prioritize songs that fit those criteria
`
    })
    
    log.info(`Claude API generated playlist "${result.object.title}" with ${result.object.songs.length} songs`)

    // Search for YouTube video IDs for each song
    const songsWithVideoIds = await searchMultipleSongs(result.object.songs)

    // Create and save playlist to database
    log.info('Saving playlist to database...')
    const playlist = await Playlist.create({
      title: result.object.title,
      description: description,
      songs: songsWithVideoIds,
      prompt: sanitizedDescription
    })
    
    const endTime = Date.now()
    log.info(`Playlist generation completed successfully in ${endTime - startTime}ms. Playlist ID: ${playlist.id}`)

    return Response.json({
      id: playlist.id,
      title: playlist.title,
      description: playlist.description,
      songs: playlist.songs,
      prompt: playlist.prompt
    })
  } catch (error) {
    const endTime = Date.now()
    log.error(`Playlist generation failed after ${endTime - startTime}ms:`, error)
    return Response.json(
      { error: 'Failed to generate playlist' },
      { status: 500 }
    )
  }
}
