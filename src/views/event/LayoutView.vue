<script setup lang="ts">
import { useEventStore } from '@/stores/event'
import { storeToRefs } from 'pinia'

const store = useEventStore()
const { event } = storeToRefs(store)
</script>

<template>
  <div v-if="event">
    <h1>{{ event.title }}</h1>
    <RouterView :event="event" />
    <nav class="event-nav">
      <RouterLink :to="{ name: 'event-detail-view' }">Details</RouterLink>
      <span>|</span>
      <RouterLink :to="{ name: 'event-register-view' }">Register</RouterLink>
      <span>|</span>
      <RouterLink :to="{ name: 'event-edit-view' }">Edit</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.event-nav {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
}
</style>
