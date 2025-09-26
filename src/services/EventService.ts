import axios from 'axios'

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
    return apiClient.get('/events?_limit=' + perPage + '&_page=' + page)
  },
  getEvent(id: number) {
    return apiClient.get(`/events/${id}`)
  },
  createEvent(data: unknown) {
    return apiClient.post('/events', data)
  },
}
