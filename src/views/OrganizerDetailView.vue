<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import OrganizerService from '@/services/OrganizerService'
import type { OrganizerDetail, Event } from '@/types'

const props = defineProps<{
  id: string
}>()

const organizer = ref<OrganizerDetail | null>(null)
const isLoading = ref(false)
const error = ref('')

const organizerImage = computed(() => organizer.value?.image ?? '')

const ownEvents = computed<Event[]>(() => organizer.value?.ownEvents ?? [])

async function loadOrganizer(id: string) {
  const parsedId = parseInt(id, 10)
  if (Number.isNaN(parsedId)) {
    error.value = 'Invalid organizer id'
    return
  }

  isLoading.value = true
  error.value = ''
  try {
    const response = await OrganizerService.getOrganizer(parsedId)
    organizer.value = response.data
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'message' in e) {
      const msg = (e as { message?: string }).message
      error.value = msg || 'Failed to load organizer'
    } else {
      error.value = 'Failed to load organizer'
    }
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.id,
  (newId) => {
    if (newId) {
      loadOrganizer(newId)
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="organizer-detail">
    <div v-if="isLoading" class="status">Loading organizer…</div>
    <div v-else-if="error" class="status error">{{ error }}</div>
    <div v-else-if="organizer" class="content">
      <div class="hero">
        <img v-if="organizerImage" :src="organizerImage" :alt="organizer.name" />
        <div class="info">
          <h2>{{ organizer.name }}</h2>
          <p class="sub">Organizer profile</p>
        </div>
      </div>

      <div class="events">
        <h3>Events by {{ organizer.name }}</h3>
        <p v-if="ownEvents.length === 0" class="muted">No events yet.</p>
        <ul v-else>
          <li v-for="event in ownEvents" :key="event.id">
            <RouterLink :to="{ name: 'event-detail-view', params: { id: event.id } }">
              <article>
                <div class="thumb" v-if="event.images && event.images.length > 0">
                  <img :src="event.images[0]" :alt="event.title" loading="lazy" />
                </div>
                <div class="details">
                  <h4>{{ event.title }}</h4>
                  <p>{{ event.date }} @ {{ event.time }}</p>
                  <p class="location">{{ event.location }}</p>
                </div>
              </article>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.organizer-detail {
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.status {
  text-align: center;
  color: rgba(0, 0, 0, 0.7);
}

.status.error {
  color: #c0392b;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}

.hero img {
  max-width: 220px;
  border-radius: 20px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

.sub {
  color: rgba(0, 0, 0, 0.6);
}

.events ul {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: grid;
  gap: 1rem;
}

.events li a {
  text-decoration: none;
  color: inherit;
}

.events article {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  background: #fff;
}

.events article:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.thumb {
  border-radius: 10px;
  overflow: hidden;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.details h4 {
  margin: 0 0 0.5rem;
}

.details p {
  margin: 0.1rem 0;
  color: rgba(0, 0, 0, 0.7);
}

.location {
  font-size: 0.9rem;
}

.muted {
  color: rgba(0, 0, 0, 0.5);
  text-align: center;
}

@media (max-width: 640px) {
  .events article {
    grid-template-columns: 1fr;
  }
}
</style>
