<script setup lang="ts">
import EventCard from '@/components/EventCard.vue'
import NewCard from '@/components/NewCard.vue'
import StudentCard from '@/components/StudentCard.vue'
import type { Student } from '@types'
import type { Event } from '@/types'
import { ref, onMounted } from 'vue'
import EventService from '@/services/EventService'
import StudentService from '@/services/StudentService'
const events = ref<Event[]>(null)
const students = ref<Student[]>(null)

onMounted(() => {
  EventService.getEvents()
    .then((response) => {
      console.log(response.data)
      events.value = response.data
    })
    .catch((error) => {
      console.error('Error!', error)
    })
})

onMounted(() => {
  StudentService.getStudent()
    .then((response) => {
      console.log(response.data)
      students.value = response.data
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
    <NewCard v-for="event in events" :key="event.id" :event="event" />
    <StudentCard v-for="student in students" :key="student.id" :student="student" />
  </div>
</template>

<style scoped>
.events {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
