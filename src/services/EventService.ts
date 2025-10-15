import axios from 'axios'
import type { Event as AppEvent } from '@/types'

const apiClient = axios.create({
  // Use backend URL from Vite env (set in .env.development / .env)
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getEvents(perPage: number, page: number) {
    // Spring backend expects perSize and page
    const params = new URLSearchParams({ perSize: String(perPage), page: String(page) })
    return apiClient.get('/events?' + params.toString())
  },
  getEventsByKeyword(keyword: string, perPage: number, page: number) {
    // Spring backend search: try multiple param names for compatibility
    const params = new URLSearchParams({
      keyword,
      title: keyword,
      name: keyword,
      q: keyword,
      perSize: String(perPage),
      page: String(page),
    })
    return apiClient.get('/events?' + params.toString())
  },
  getEvent(id: number) {
    return apiClient.get(`/events/${id}`)
  },
  saveEvent(event: AppEvent) {
    // Transform to backend payload: use petAllowed and omit id
    const payload = {
      category: event.category,
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date,
      time: event.time,
      petAllowed: event.petsAllowed,
      organizer: event.organizer,
    }
    return apiClient.post('/events', payload)
  },
  createEvent(data: unknown) {
    return apiClient.post('/events', data)
  },
}
