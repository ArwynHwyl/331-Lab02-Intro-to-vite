<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="eyebrow -text-primary mb-4">Create Organizer</h1>
    <form @submit.prevent="onSubmit">
      <div class="field">
        <label for="name">Name</label>
        <input id="name" v-model="form.name" required />
      </div>
      <div class="field">
        <label for="address">Address</label>
        <input id="address" v-model="form.address" />
      </div>
      <div>
        <button class="button -fill-gradient" type="submit">Save</button>
        <router-link class="button -fill-gray" :to="{ name: 'event-list-view' }"
          >Cancel</router-link
        >
      </div>
      <p v-if="error" class="errorMessage mt-4">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import OrganizationService from '@/services/OrganizationService'
import { useMessageStore } from '@/stores/message'

const router = useRouter()
const store = useMessageStore()
const error = ref('')
const form = reactive({ name: '', address: '' })

async function onSubmit() {
  error.value = ''
  try {
    const res = await OrganizationService.createOrganization(form)
    store.updateMessages(`Organizer created: ${res?.data?.name ?? form.name}`)
    setTimeout(() => store.resetMessages(), 3000)
    router.push({ name: 'event-list-view' })
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'message' in e) {
      const msg = (e as { message?: string }).message
      error.value = msg || 'Failed to create organizer'
    } else {
      error.value = 'Failed to create organizer'
    }
  }
}
</script>
