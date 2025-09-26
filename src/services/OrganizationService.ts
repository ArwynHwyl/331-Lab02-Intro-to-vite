import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  createOrganization(data: { name: string; address?: string }) {
    return apiClient.post('/organizers', data)
  },
}
