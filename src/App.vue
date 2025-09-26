<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
import { SpeedInsights } from '@vercel/speed-insights/vue'
const store = useMessageStore()
const { messages } = storeToRefs(store)
</script>

<template>
  <SpeedInsights />
  <div class="text-center font-sans text-gray-700 antialiased min-h-screen bg-white">
    <header>
      <div id="flashMessage" class="animate-fade" v-if="messages">
        <h4 class="text-lg font-semibold text-green-600">{{ messages }}</h4>
      </div>
      <div class="wrapper">
        <nav class="py-6 flex justify-center space-x-8">
          <RouterLink
            class="font-bold text-gray-700 hover:text-green-500 transition-colors"
            exact-active-class="text-green-500"
            :to="{ name: 'event-list-view' }"
            >Event</RouterLink
          >
          <RouterLink
            class="font-bold text-gray-700 hover:text-green-500 transition-colors"
            exact-active-class="text-green-500"
            :to="{ name: 'about' }"
            >About</RouterLink
          >
          <RouterLink
            class="font-bold text-gray-700 hover:text-green-500 transition-colors"
            exact-active-class="text-green-500"
            :to="{ name: 'add-event' }"
            >New Event</RouterLink
          >
          <RouterLink
            class="font-bold text-gray-700 hover:text-green-500 transition-colors"
            exact-active-class="text-green-500"
            :to="{ name: 'add-organizer' }"
            >New Organizer</RouterLink
          >
          <RouterLink
            class="font-bold text-gray-700 hover:text-green-500 transition-colors"
            exact-active-class="text-green-500"
            :to="{ name: 'students' }"
            >Students</RouterLink
          >
        </nav>
      </div>
    </header>
    <RouterView />
  </div>
</template>
