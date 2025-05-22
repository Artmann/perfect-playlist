interface PlaylistHeaderProps {
  title: string
  songCount: number
}

export default function PlaylistHeader({ title, songCount }: PlaylistHeaderProps) {
  return (
    <div className="bg-black text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold mb-2">{title}</h1>
        <p className="text-gray-300">{songCount} songs</p>
      </div>
    </div>
  )
}