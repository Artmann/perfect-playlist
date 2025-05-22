import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { GithubIcon } from 'lucide-react'

import type { Route } from './+types/home'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Perfect Playlist' },
    {
      name: 'description',
      content: 'Create the perfect playlist for any moment'
    }
  ]
}

const examplePrompts = [
  // Mood & Atmosphere
  'Create a playlist for a cozy rainy Sunday morning with coffee',
  'I need music for feeling like the main character walking through a neon-lit city at night',
  'Give me songs that feel like golden hour drives through the countryside',

  // Activities & Scenarios
  'Perfect background music for a dinner party with friends who have great taste',
  "Songs for when I'm deep cleaning my apartment and need to stay motivated",
  'Music for a road trip through the desert with my best friend',

  // Nostalgic & Temporal
  "Make me feel like I'm in a 90s coming-of-age movie",
  'Songs that sound like summer camp in 2003',
  "Music for pretending I'm in a French café in the 1960s",

  // Genre Fusion
  'Indie folk meets electronic beats for studying',
  'Jazz-influenced hip hop for late night creative sessions',
  'Punk energy but make it danceable',

  // Emotional Journey
  'Take me from heartbreak to healing in 12 songs',
  'Music that starts contemplative and builds to euphoric',
  "Songs for when you're sad but trying to be optimistic about it"
]

export default function Home() {
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/generate-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description })
      })

      if (!response.ok) {
        throw new Error('Failed to generate playlist')
      }

      const playlist = await response.json()

      // Navigate to the playlist route with the ID
      navigate(`/playlist/${playlist.id}`)
    } catch (error) {
      console.error('Error generating playlist:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExampleClick = (prompt: string) => {
    setDescription(prompt)
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto pt-8 md:pt-16">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-black mb-2 md:mb-4">
            Perfect Playlist
          </h1>
          <p className="text-base md:text-xl text-gray-600">
            Describe your vibe and we'll create the perfect playlist for you
          </p>
        </div>

        <form
          className="mb-8"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4 md:space-y-6">
            <Textarea
              className="text-sm h-32"
              disabled={isSubmitting}
              id="description"
              placeholder="What do you want to listen to?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (!isSubmitting && description.trim()) {
                    handleSubmit(e as any)
                  }
                }
              }}
            />

            <Button
              className="w-full text-base md:text-lg py-4 md:py-6"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Generating Playlist...' : 'Generate Playlist'}
            </Button>
          </div>
        </form>

        {/* Example Prompts */}
        <div>
          <div className="grid grid-cols-2 gap-2">
            {examplePrompts.map((prompt, index) => (
              <div
                key={index}
                className={`
                  px-2 py-3
                  max-w-xs
                  border border-gray-200 hover:border-gray-300
                  rounded-lg
                  text-center text-xs text-gray-700 hover:text-gray-900
                  cursor-pointer
                  transition  
                `}
                onClick={() => handleExampleClick(prompt)}
              >
                {prompt}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 pb-8 text-center space-y-3">
        <div className="mb-8">
          <a
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
            href="https://github.com/artmann/perfect-playlist"
            target="_blank"
          >
            <GithubIcon size={16} />
            View on GitHub
          </a>
        </div>

        <div>
          <Link
            className="text-gray-500 text-sm"
            to="https://www.artmann.co/"
            target="_blank"
          >
            Made with ❤️ in Barcelona
          </Link>
        </div>
      </footer>
    </div>
  )
}
