export interface Event {
  id: number
  category: string
  title: string
  description: string
  location: string
  date: string
  time: string
  petsAllowed: boolean
  organizer: Organizer
  images: string[]
}

export interface Organizer {
  id: number
  name: string
  image?: string
  roles?: string[]
}

export interface OrganizerDetail extends Organizer {
  image: string
  ownEvents: Event[]
}

export interface StudentInfo {
  id: number
  studentId: string
  name: string
  surname: string
  gpa: number
  image: string
  penAmount: number
  description: string
}

export interface MessageState {
  messages: string
}
export interface EventState {
  event: Event | null
}
