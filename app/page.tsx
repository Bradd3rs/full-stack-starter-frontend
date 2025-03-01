import TodoList from '@/components/todo-list'
import { ThemeToggle } from '@/components/theme-toggle'
import axios from 'axios'

// Get the absolute URL for API calls
function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home({ params }: { params: { id: string } }) {
  // Fetch todos on the server directly from the API route
  const todos = await axios
    .get(`${getBaseUrl()}/api/todos?id=${params.id}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching todos:', error)
      return []
    })

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <header className="mb-8 flex flex-col items-center">
        <div className="absolute right-4 top-4 md:right-8 md:top-8">
          <ThemeToggle />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Task Master</h1>
        <p className="text-muted-foreground mt-2">
          Manage your tasks efficiently
        </p>
      </header>
      <main>
        <TodoList initialTodos={todos} id={params.id} />
      </main>
      <footer className="mt-10 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Task Master. All rights reserved.</p>
      </footer>
    </div>
  )
}
