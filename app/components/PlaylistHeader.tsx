interface PlaylistHeaderProps {
  songCount: number
  title: string
}

export default function PlaylistHeader({
  songCount,
  title
}: PlaylistHeaderProps) {
  return (
    <div className="bg-black text-white p-4 md:p-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-lg md:text-2xl font-semibold mb-2 text-center">
          {title}
        </h1>
      </div>
    </div>
  )
}
