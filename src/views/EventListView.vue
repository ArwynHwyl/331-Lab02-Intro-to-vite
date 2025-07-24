<script setup lang="ts">
import EventCard from '@/components/EventCard.vue'
import { type Event } from '@/types'
import { ref, onMounted, computed, watchEffect, watch, inject } from 'vue'
import EventService from '@/services/EventService'
import { useRoute } from 'vue-router'

const events = ref<Event[] | null>(null)
const totalEvents = ref(0)
const route = useRoute()

const globalPageSize = inject<number>('pageSize', 6)

const pageSize = computed(() => {
  const queryPageSize = route.query.pageSize
  if (queryPageSize && !isNaN(Number(queryPageSize))) {
    return Number(queryPageSize)
  }
  return globalPageSize
})

const hasNextPage = computed(()=> {
 const totalPages = Math.ceil(totalEvents.value / pageSize.value)
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
    events.value = null
   EventService.getEvents(pageSize.value, page.value)
      .then(response => {
        events.value = response.data
        totalEvents.value = response.headers['x-total-count']
      })
      .catch(error => {
        console.error('There was an error!', error)
      })
  })
})

const getRouteQuery = (newPage: number) => {
  const query: any = { page: newPage }
  if (route.query.pageSize) {
    query.pageSize = route.query.pageSize
  }
  return query
}
</script>

<template>
  <h1>Event For Good</h1>
    <!-- new element-->
  <div class="page-size-selector">
    <label for="page-size">Events per page:</label>
    <select
      id="page-size"
      :value="pageSize"
      @change="$router.push({
        name: 'event-list-view',
        query: {
          page: 1,
          pageSize: ($event.target as HTMLSelectElement).value
        }
      })"
    >
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
  </div>
  <div class="events">
    <EventCard v-for="event in events" :key="event.id" :event="event" />
  </div class="pagination">
  <RouterLink
    id="page-prev"
    :to="{ name: 'event-list-view', query: getRouteQuery(page - 1) }"
    rel="prev"
    v-if="page != 1"
    > &#60; Prev page </RouterLink
  >
  <RouterLink
    id="page-next"
    :to="{ name: 'event-list-view', query: getRouteQuery(page + 1) }"
    rel="next"
    v-if="hasNextPage"
    > Next page &#62; </RouterLink
  >
</template>

<style scoped>
.events {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-size-selector {
  margin: 20px 0;
}

.page-size-selector label {
  margin-right: 10px;
  font-weight: bold;
}

.page-size-selector select {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
}

.pagination {
  display: flex;
  width: 290px;
}
.pagination a {
  flex: 1;
  text-decoration: none;
  color: #2c3e50;
}

#page-prev {
 text-align: left;
}

#page-next {
 text-align: right;
}
</style>
