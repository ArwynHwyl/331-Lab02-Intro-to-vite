<script setup lang="ts">
import EventCard from '@/components/EventCard.vue'
import BaseInput from '@/components/BaseInput.vue'
import { type Event } from '@/types'
import { ref, onMounted, computed, watchEffect } from 'vue'
import EventService from '@/services/EventService'
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
    updateKeyword()
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
      events.value = response.data
      console.log('events', events.value)
      totalEvents.value = response.headers['x-total-count']
      console.log('totalEvent', totalEvents.value)
    })
    .catch(() => {
      router.push({ name: 'network-error-view' })
    })
}
</script>

<template>
  <h1 class="text-3xl font-bold mb-6 text-center">Event For Good</h1>
  <main class="flex flex-col items-center">
    <div class="w-64">
      <BaseInput
        v-model="keyword"
        type="text"
        label="Search..."
        @input="updateKeyword"
        class="w-full"
      />
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
  </main>
</template>
