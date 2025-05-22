import { useState } from 'react'
import { useNavigate } from 'react-router'

import type { Route } from './+types/home'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
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

export default function Home() {
  const [description, setDescription] = useState(
    "early 2000's R&B songs that's perfect when spending the day in Barcelona"
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-8">
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-base md:text-lg font-medium text-gray-900"
                >
                  What do you want to listen to?
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your perfect playlist..."
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
                  disabled={isSubmitting}
                  className="min-h-[100px] md:min-h-[120px] text-base md:text-lg resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="w-full text-base md:text-lg py-4 md:py-6"
              >
                {isSubmitting ? 'Generating Playlist...' : 'Generate Playlist'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
