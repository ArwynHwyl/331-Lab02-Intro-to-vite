import axios from 'axios'
import type { Organizer } from '@/types'

const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8082'

const apiClient = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

interface OrganizerCreatePayload {
  name: string
  image: string
}

interface OrganizerQuery {
  page?: number
  limit?: number
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 50

function buildQuery(params: OrganizerQuery = {}) {
  const searchParams = new URLSearchParams()
  const page = params.page ?? DEFAULT_PAGE
  const limit = params.limit ?? DEFAULT_LIMIT

  if (page) searchParams.append('_page', page.toString())
  if (limit) searchParams.append('_limit', limit.toString())

  const query = searchParams.toString()
  return query ? `/organizers?${query}` : '/organizers'
}

async function fetchOrganizers(params: OrganizerQuery = {}) {
  const endpoint = buildQuery(params)
  return apiClient.get(endpoint)
}

async function fetchAllOrganizers(): Promise<Organizer[]> {
  const response = await apiClient.get('/organizers')
  const payload = response.data
  if (Array.isArray(payload)) {
    return payload as Organizer[]
  }
  if (Array.isArray(payload?.data)) {
    return payload.data as Organizer[]
  }
  if (Array.isArray(payload?.content)) {
    return payload.content as Organizer[]
  }
  return []
}

export default {
  getOrganizers: fetchOrganizers,
  getAllOrganizers: fetchAllOrganizers,
  getOrganizer(id: number) {
    return apiClient.get(`/organizers/${id}`)
  },
  createOrganizer(payload: OrganizerCreatePayload) {
    return apiClient.post('/organizers', payload)
  },
  uploadImage(file: File) {
    const formData = new FormData()
    formData.append('image', file)
    return apiClient.post('/uploadImage', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
