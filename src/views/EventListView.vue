<script setup lang="ts">
import EventCard from '@/components/EventCard.vue'
import type { Event } from '@/types'
import { ref, onMounted, computed, watchEffect } from 'vue'
import EventService from '@/services/EventService'
const events = ref<Event[] | null>(null)
const totalEvents = ref(0)
const hasNextPage = computed(() => {
  const totalPages = Math.ceil(totalEvents.value / 2)
  return page.value < totalPages
})
const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
})
const page = computed(() => props.page)
watchEffect(() => {
  EventService.getEvents(2, page.value)
    .then((response) => {
      console.log(response.data)
      events.value = response.data
      totalEvents.value = response.headers['x-total-count']
    })
    .catch((error) => {
      console.error('Error', error)
    })
})
</script>

<template>
  <h1>Events For Good</h1>
  <!-- new element-->
  <div class="events">
    <EventCard v-for="event in events" :key="event.id" :event="event" />
  </div>

  <RouterLink
    :to="{ name: 'event-list-view', query: { page: page - 1 } }"
    rel="next"
    v-if="page !== 1"
  >
    Previous page
  </RouterLink>

  <RouterLink
    :to="{ name: 'event-list-view', query: { page: page + 1 } }"
    rel="next"
    v-if="hasNextPage"
  >
    Next page
  </RouterLink>
</template>

<style scoped>
.events {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pagination {
  display: flex;
  width: 290px;
}
.pagination a {
  text-decoration: none;
  flex: 1;
  color: #2c3e50;
}
#page-prev {
  text-align: left;
}
#page-next {
  text-align: right;
}
</style>
