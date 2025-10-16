<script setup lang="ts">
import { onMounted, ref } from 'vue'
import OrganizerService from '@/services/OrganizerService'
import type { Organizer } from '@/types'

const organizers = ref<Organizer[]>([])
const isLoading = ref(false)
const error = ref('')

async function loadOrganizers() {
  isLoading.value = true
  error.value = ''
  try {
    const response = await OrganizerService.getAllOrganizers()
    organizers.value = response
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'message' in e) {
      const msg = (e as { message?: string }).message
      error.value = msg || 'Failed to load organizers'
    } else {
      error.value = 'Failed to load organizers'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(loadOrganizers)
</script>

<template>
  <section class="max-w-5xl mx-auto px-4 py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-800">Organizers</h1>
      <p class="mt-2 text-sm text-slate-500">
        Browse all organizers and open one to view its profile and hosted events.
      </p>
    </div>

    <div v-if="isLoading" class="mt-10 text-center text-slate-600">Loading organizers…</div>
    <div v-else-if="error" class="mt-10 text-center text-red-600">{{ error }}</div>

    <div v-else>
      <p v-if="!organizers.length" class="mt-10 text-center text-slate-500">
        No organizers found.
      </p>
      <div
        v-else
        class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="organizer in organizers"
          :key="organizer.id"
          class="group rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <RouterLink
            :to="{ name: 'organizer-detail-view', params: { id: organizer.id } }"
            class="flex h-full flex-col"
          >
            <div class="relative w-full overflow-hidden rounded-t-xl bg-slate-100">
              <img
                v-if="organizer.image"
                :src="organizer.image"
                :alt="organizer.name"
                class="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div
                v-else
                class="flex h-48 w-full items-center justify-center text-slate-400 text-sm uppercase tracking-wide"
              >
                No image
              </div>
            </div>
            <div class="flex flex-1 flex-col justify-between px-5 py-4">
              <h2 class="text-lg font-semibold text-slate-800 group-hover:text-indigo-600">
                {{ organizer.name }}
              </h2>
              <span class="mt-2 inline-flex items-center text-sm font-semibold text-indigo-600">
                View profile
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="ml-1 h-4 w-4"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 10l-3.293-3.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>
