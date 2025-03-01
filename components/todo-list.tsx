'use client'

import { useState } from 'react'
import { Todo } from '@/types/todo'
import { Toaster, toast } from 'sonner'
import axios from 'axios'
import {
  PlusCircle,
  Loader2,
  CheckCircle,
  Trash2,
  ClipboardList,
  CalendarClock,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

interface TodoListProps {
  initialTodos: Todo[]
  id: string
}

export default function TodoList({ initialTodos, id }: TodoListProps) {
  const router = useRouter()
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const handleCreateTodo = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post(`/api/todos?id=${id}`, {
        title: values.title,
        description: values.description || '',
      })

      // Add the new todo to the state
      setTodos((prevTodos) => [...prevTodos, response.data])
      form.reset()
      toast.success('Task created successfully')
      router.refresh()
    } catch (error) {
      toast.error('Failed to create task')
      console.error('Error creating todo:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleComplete = async (id: number, currentStatus: boolean) => {
    try {
      // Optimistically update the UI
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, is_completed: !currentStatus } : todo
        )
      )

      await axios.put(`/api/todos/${id}?id=${id}`, {
        is_completed: !currentStatus,
      })
      toast.success(
        currentStatus ? 'Task marked as incomplete' : 'Task completed'
      )
      router.refresh()
    } catch (error) {
      // Revert the optimistic update on error
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, is_completed: currentStatus } : todo
        )
      )
      toast.error('Failed to update task')
      console.error('Error updating todo:', error)
    }
  }

  const handleDeleteTodo = async (id: number) => {
    try {
      // Optimistically update the UI
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))

      await axios.delete(`/api/todos/${id}?id=${id}`)
      toast.success('Task deleted')
      router.refresh()
    } catch (error) {
      // Fetch the todos again on error to ensure consistency
      refreshTodos()
      toast.error('Failed to delete task')
      console.error('Error deleting todo:', error)
    }
  }

  const handleClearCompleted = async () => {
    const completedIds = todos.filter((t) => t.is_completed).map((t) => t.id)
    if (completedIds.length === 0) return

    if (confirm(`Delete ${completedIds.length} completed task(s)?`)) {
      try {
        // Optimistically update the UI
        setTodos((prevTodos) => prevTodos.filter((todo) => !todo.is_completed))

        // Delete each completed todo
        await Promise.all(
          completedIds.map((id) => axios.delete(`/api/todos/${id}?id=${id}`))
        )
        toast.success('Completed tasks deleted')
        router.refresh()
      } catch (error) {
        // Fetch the todos again on error to ensure consistency
        refreshTodos()
        toast.error('Failed to delete completed tasks')
        console.error('Error deleting completed todos:', error)
      }
    }
  }

  // Function to refresh todos from the API
  const refreshTodos = async () => {
    try {
      const response = await axios.get(`/api/todos?id=${id}`)
      setTodos(response.data)
    } catch (error) {
      console.error('Error refreshing todos:', error)
    }
  }

  // Filter todos based on selected filter
  const filteredTodos = todos?.filter((todo) => {
    if (filter === 'active') return !todo.is_completed
    if (filter === 'completed') return todo.is_completed
    return true
  })

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <>
      <Toaster position="top-center" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Add New Task
            </CardTitle>
            <CardDescription>
              Create a new task to keep track of your work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateTodo)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What needs to be done?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add details about this task"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Task
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Your Tasks
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                  className="text-xs h-8"
                >
                  All
                </Button>
                <Button
                  variant={filter === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('active')}
                  className="text-xs h-8"
                >
                  Active
                </Button>
                <Button
                  variant={filter === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('completed')}
                  className="text-xs h-8"
                >
                  Completed
                </Button>
              </div>
            </div>
            <CardDescription>Manage and track your tasks</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {!filteredTodos || filteredTodos.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">
                  {filter === 'all'
                    ? 'No tasks yet. Add your first task above!'
                    : filter === 'active'
                    ? 'No active tasks. All tasks are completed!'
                    : 'No completed tasks yet.'}
                </p>
              </div>
            ) : (
              <div>
                {filteredTodos.map((todo, index) => (
                  <div key={todo.id}>
                    {index > 0 && <Separator />}
                    <div className="p-4 flex items-start gap-4">
                      <div className="pt-1">
                        <Checkbox
                          id={`todo-${todo.id}`}
                          checked={todo.is_completed}
                          onCheckedChange={() =>
                            handleToggleComplete(todo.id, todo.is_completed)
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-medium ${
                            todo.is_completed
                              ? 'line-through text-muted-foreground'
                              : ''
                          }`}
                        >
                          {todo.title}
                        </div>
                        {todo.description && (
                          <p
                            className={`text-sm mt-1 ${
                              todo.is_completed
                                ? 'text-muted-foreground/70 line-through'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {todo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <CalendarClock className="h-3 w-3" />
                          <span>Created: {formatDate(todo.created_at)}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {todos && todos.length > 0 && (
            <CardFooter className="border-t bg-muted/50 px-6 py-3 flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                {todos.filter((t) => t.is_completed).length} of {todos.length}{' '}
                tasks completed
              </p>
              {todos.some((t) => t.is_completed) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleClearCompleted}
                >
                  Clear completed
                </Button>
              )}
            </CardFooter>
          )}
        </Card>
      </div>
    </>
  )
}
