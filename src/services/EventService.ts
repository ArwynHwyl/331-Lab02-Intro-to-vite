import type { Event as AppEvent } from '@/types'
import apiClient from '@/services/AxiosClient'

export default {
  getEvents(perPage: number, page: number) {
    return apiClient.get('/events?_limit=' + perPage + '&_page=' + page)
  },
  getEventsByKeyword(keyword: string, perPage: number, page: number) {
    // Query by title with pagination (json-server style)
    return apiClient.get(
      '/events?title=' + encodeURIComponent(keyword) + '&_limit=' + perPage + '&_page=' + page,
    )
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
      images: event.images ?? [],
    }
    return apiClient.post('/events', payload)
  },
  createEvent(data: unknown) {
    return apiClient.post('/events', data)
  },
}
