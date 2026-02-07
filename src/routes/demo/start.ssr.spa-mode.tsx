import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getPunkSongs } from '@/data/demo.punk-songs'
import { ScrollableContent } from '@/components/ScrollableContent'

export const Route = createFileRoute('/demo/start/ssr/spa-mode')({
  ssr: false,
  component: RouteComponent,
})

function RouteComponent() {
  const [punkSongs, setPunkSongs] = useState<
    Awaited<ReturnType<typeof getPunkSongs>>
  >([])

  useEffect(() => {
    getPunkSongs().then(setPunkSongs)
  }, [])

  return (
    <ScrollableContent>
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-2xl p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/80 dark:ring-slate-700/80 overflow-hidden">
        <h1 className="text-3xl font-bold mb-6 text-green-600 dark:text-green-400">
          SPA Mode - Punk Songs
        </h1>
        <ul className="space-y-3">
          {punkSongs.map((song) => (
            <li
              key={song.id}
              className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-4 py-3"
            >
              <span className="text-lg font-medium text-slate-900 dark:text-white">
                {song.name}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                {' '}
                - {song.artist}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </ScrollableContent>
  )
}
