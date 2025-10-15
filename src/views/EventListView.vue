<script setup lang="ts">
import EventCard from '@/components/EventCard.vue'
import { type Event, type PageResponse } from '@/types'
import { ref, onMounted, computed, watchEffect } from 'vue'
import EventService from '@/services/EventService'
import BaseInput from '@/components/BaseInput.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const events = ref<Event[] | null>(null)
const totalEvents = ref(0)
const keyword = ref('')
const hasNextPage = computed(() => {
  const totalPages = Math.ceil(totalEvents.value / 3)
  return page.value < totalPages
})

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
})

const page = computed(() => props.page)
onMounted(() => {
  watchEffect(() => {
    EventService.getEvents(3, page.value)
      .then((response) => {
        const data = response.data as Event[] | PageResponse<Event>
        if (Array.isArray(data)) {
          events.value = data
          totalEvents.value = Number(response.headers['x-total-count'] ?? data.length)
        } else if (data && Array.isArray(data.content)) {
          events.value = data.content
          totalEvents.value = Number(data.totalElements ?? 0)
        } else {
          events.value = []
          totalEvents.value = 0
        }
      })
      .catch(() => {
        router.push({ name: 'network-error-view' })
      })
  })
})

function updateKeyword() {
  let queryFunction
  if (keyword.value === '') {
    queryFunction = EventService.getEvents(3, page.value)
  } else {
    queryFunction = EventService.getEventsByKeyword(keyword.value, 3, page.value)
  }
  queryFunction
    .then((response) => {
      const data = response.data as Event[] | PageResponse<Event>
      if (Array.isArray(data)) {
        events.value = data
        totalEvents.value = Number(response.headers['x-total-count'] ?? data.length)
      } else if (data && Array.isArray(data.content)) {
        events.value = data.content
        totalEvents.value = Number(data.totalElements ?? 0)
      } else {
        events.value = []
        totalEvents.value = 0
      }
      console.log('events', events.value)
      console.log('totalEvent', totalEvents.value)
    })
    .catch(() => {
      router.push({ name: 'network-error-view' })
    })
}
</script>

<template>
  <h1 class="text-3xl font-bold mb-6 text-center">Event For Good</h1>
  <div class="w-full max-w-md mx-auto mb-6">
    <BaseInput v-model="keyword" type="text" label="Search..." @input="updateKeyword" />
  </div>
  <div class="flex flex-col items-center gap-4">
    <EventCard v-for="event in events" :key="event.id" :event="event" />
  </div>
  <div class="flex w-72 mx-auto mt-8 space-x-4">
    <RouterLink
      id="page-prev"
      :to="{ name: 'event-list-view', query: { page: page - 1 } }"
      rel="prev"
      v-if="page != 1"
      class="flex-1 text-left text-blue-600 hover:underline"
    >
      &#60; Prev page
    </RouterLink>
    <RouterLink
      id="page-next"
      :to="{ name: 'event-list-view', query: { page: page + 1 } }"
      rel="next"
      v-if="hasNextPage"
      class="flex-1 text-right text-blue-600 hover:underline"
    >
      Next page &#62;
    </RouterLink>
  </div>
</template>
