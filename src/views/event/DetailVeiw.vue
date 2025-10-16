<script setup lang="ts">
import { computed, toRefs } from 'vue'
import type { Event } from '@/types'

const props = defineProps<{
  event: Event
}>()

const { event } = toRefs(props)

const mediaRoot = (import.meta.env.VITE_MEDIA_ROOT_URL as string | undefined) || ''
const imageUrls = computed(() => {
  const images = event.value?.images ?? []
  const base = mediaRoot.replace(/\/$/, '')

  return images
    .filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
    .map((img) => {
      if (/^https?:\/\//i.test(img)) {
        return img
      }
      const cleanImg = img.replace(/^\//, '')
      return base ? `${base}/${cleanImg}` : cleanImg
    })
})

const hasImages = computed(() => imageUrls.value.length > 0)
const petsLabel = computed(() => (event.value?.petsAllowed ? 'Allowed' : 'Not allowed'))
</script>

<template>
  <section class="event-details">
    <div class="event-summary">
      <h2>Event Information</h2>
      <ul>
        <li>
          <span class="label">Location:</span>
          <span>{{ event.location || 'TBA' }}</span>
        </li>
        <li>
          <span class="label">Date:</span>
          <span>{{ event.date || 'TBA' }}</span>
        </li>
        <li>
          <span class="label">Time:</span>
          <span>{{ event.time || 'TBA' }}</span>
        </li>
        <li>
          <span class="label">Category:</span>
          <span>{{ event.category || 'General' }}</span>
        </li>
        <li>
          <span class="label">Organizer:</span>
          <span>{{ event.organizer?.name || 'Unassigned' }}</span>
        </li>
        <li>
          <span class="label">Pets:</span>
          <span>{{ petsLabel }}</span>
        </li>
      </ul>

      <div class="description">
        <h3>Description</h3>
        <p>{{ event.description || 'No description provided for this event.' }}</p>
      </div>
    </div>

    <div class="event-images">
      <h2>Event Images</h2>
      <div v-if="hasImages" class="image-grid">
        <figure v-for="image in imageUrls" :key="image">
          <img :src="image" :alt="`${event.title} image`" loading="lazy" />
        </figure>
      </div>
      <p v-else class="no-images">No images uploaded for this event yet.</p>
    </div>
  </section>
</template>

<style scoped>
.event-details {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  text-align: center;
}

.event-summary ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
  display: grid;
  gap: 0.75rem;
}

.event-summary .label {
  font-weight: 600;
  margin-right: 0.5rem;
}

.description h3 {
  margin-bottom: 0.5rem;
}

.description p {
  margin: 0;
  line-height: 1.6;
}

.event-images {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.image-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.image-grid figure {
  margin: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  background: #f8f8f8;
  width: 220px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-grid img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.no-images {
  color: rgba(0, 0, 0, 0.6);
  font-style: italic;
}
</style>
