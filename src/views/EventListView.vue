<script setup lang="ts">
import EventCard from '@/components/EventCard.vue'
import NewCard from '@/components/NewCard.vue'
import type { Event } from '@/types'
import { ref, onMounted } from 'vue'
import axios from 'axios'
const events = ref<Event[]>(null)

onMounted(() => {
  axios
    .get('https://my-json-server.typicode.com/ArwynHwyl/331-Lab02-Intro-to-vite/db')
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.error('Error!', error)
    })
})
</script>

<template>
  <h1>Events For Good</h1>
  <!-- new element-->
  <dive class="events">
    <EventCard v-for="event in events" :key="event.id" :event="event" />
    <NewCard v-for="event in events" :key="event.id" :event="event" />
  </dive>
</template>

<style scoped>
.events {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
