import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { todoApi } from '../api'
import type { Todo } from '../types'
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const locked = useRef(false)
  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setTodos(await todoApi.list())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không tải được dữ liệu.')
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    void load()
  }, [load])
  async function mutate(
    operation: () => Promise<Todo | object>,
    message: string,
    deletedId?: string,
  ) {
    if (locked.current) return false
    locked.current = true
    setBusy(true)
    try {
      const result = await operation()
      setTodos((current) =>
        deletedId
          ? current.filter((t) => t.id !== deletedId)
          : current.some((t) => t.id === (result as Todo).id)
            ? current.map((t) => (t.id === (result as Todo).id ? (result as Todo) : t))
            : [result as Todo, ...current],
      )
      toast.success(message)
      return true
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Thao tác thất bại.')
      return false
    } finally {
      locked.current = false
      setBusy(false)
    }
  }
  return { todos, loading, error, busy, load, mutate }
}
