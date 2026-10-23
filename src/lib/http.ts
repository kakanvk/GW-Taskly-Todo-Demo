const baseUrl = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001').replace(/\/$/, '')
export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000)
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    })
    if (!response.ok) throw new Error(`API trả về lỗi ${response.status}. Vui lòng thử lại.`)
    return (await response.json()) as T
  } catch (error) {
    if (
      error instanceof TypeError ||
      (error instanceof DOMException && error.name === 'AbortError')
    )
      throw new Error(
        'Không kết nối được API. Kiểm tra JSON Server đang chạy ở cổng 3001 rồi thử lại.',
      )
    throw error
  } finally {
    clearTimeout(timeout)
  }
}
