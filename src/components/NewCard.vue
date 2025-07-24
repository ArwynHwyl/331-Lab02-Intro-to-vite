<script setup lang="ts">
import { ref } from 'vue'
import type { Event } from '@/types'
defineProps<{
  event: Event
}>()
// const event = ref({
//   id: 5928101,
//   category: 'animal welfare',
//   title: 'Cat Adoption Day',
//   description: 'Find your new feline friend at this event.',
//   location: 'Meow Town',
//   date: 'January 28, 2022',
//   time: '12:00',
//   petsAllowed: true,
//   organizer: 'Kat Laydee',
// })
</script>

<template>
  <div class="info">
    <p>{{ event.category }}</p>
    <span>@{{ event.organizer }}</span>
  </div>
</template>
<style scoped>
.info {
  text-align: right;
  font-size: 14px;
}
</style>
