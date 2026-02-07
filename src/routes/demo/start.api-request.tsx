import { useQuery } from '@tanstack/react-query'

import { createFileRoute } from '@tanstack/react-router'
import { ScrollableContent } from '../../components/ScrollableContent'

function getNames() {
  return fetch('/demo/api/names').then((res) => res.json() as Promise<string[]>)
}

export const Route = createFileRoute('/demo/start/api-request')({
  component: Home,
})

function Home() {
  const { data: names = [] } = useQuery({
    queryKey: ['names'],
    queryFn: getNames,
  })

  return (
    <ScrollableContent>
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-2xl p-8 rounded-2xl bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/80 dark:ring-slate-700/80 overflow-hidden">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white mb-4">
          Start API Request Demo - Names List
        </h1>
        <ul className="mb-4 space-y-2">
          {names.map((name) => (
            <li
              key={name}
              className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-4 py-3"
            >
              <span className="text-lg text-slate-900 dark:text-white">
                {name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </ScrollableContent>
  )
}
