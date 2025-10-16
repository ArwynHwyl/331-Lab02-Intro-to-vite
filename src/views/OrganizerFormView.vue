<template>
  <div class="max-w-xl mx-auto p-6">
    <h1 class="eyebrow -text-primary mb-4">Create Organizer</h1>
    <form @submit.prevent="onSubmit">
      <div class="field">
        <label for="name">Name</label>
        <input id="name" v-model="name" required />
      </div>

      <div class="field">
        <label for="image">Image</label>
        <input
          id="image"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif"
          @change="onFileChange"
        />
        <p v-if="fileError" class="errorMessage mt-2">{{ fileError }}</p>
        <div v-if="previewUrl" class="preview-wrapper">
          <img :src="previewUrl" alt="Organizer preview" />
        </div>
      </div>

      <div class="actions">
        <button class="button -fill-gradient" type="submit" :disabled="isSubmitting">
          <span v-if="isSubmitting">Saving…</span>
          <span v-else>Save</span>
        </button>
        <router-link class="button -fill-gray" :to="{ name: 'event-list-view' }">
          Cancel
        </router-link>
      </div>
      <p v-if="error" class="errorMessage mt-4">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import OrganizerService from '@/services/OrganizerService'
import { useMessageStore } from '@/stores/message'

const router = useRouter()
const store = useMessageStore()
const error = ref('')
const name = ref('')
const selectedFile = ref<File | null>(null)
const previewUrl = ref('')
const fileError = ref('')
const isSubmitting = ref(false)

async function onSubmit() {
  if (isSubmitting.value) return
  error.value = ''
  fileError.value = ''

  if (!name.value.trim()) {
    error.value = 'Name is required'
    return
  }

  if (!selectedFile.value) {
    fileError.value = 'Please select an image'
    return
  }

  isSubmitting.value = true
  try {
    const uploadResponse = await OrganizerService.uploadImage(selectedFile.value)
    const imageKey = uploadResponse?.data?.name
    if (!imageKey) {
      throw new Error('Upload failed: missing image key')
    }
    const createResponse = await OrganizerService.createOrganizer({
      name: name.value.trim(),
      image: imageKey,
    })
    const createdName = createResponse?.data?.name ?? name.value
    store.updateMessages(`Organizer created: ${createdName}`)
    setTimeout(() => store.resetMessages(), 3000)
    const organizerId = createResponse?.data?.id
    if (organizerId) {
      router.push({ name: 'organizer-detail-view', params: { id: organizerId } })
    } else {
      router.push({ name: 'event-list-view' })
    }
    name.value = ''
    selectedFile.value = null
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = ''
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'message' in e) {
      const msg = (e as { message?: string }).message
      error.value = msg || 'Failed to create organizer'
    } else {
      error.value = 'Failed to create organizer'
    }
  } finally {
    isSubmitting.value = false
  }
}

function onFileChange(event: Event) {
  fileError.value = ''
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0]
  if (!file) {
    selectedFile.value = null
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = ''
    return
  }

  const validExtensions = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
  if (!validExtensions.includes(file.type)) {
    selectedFile.value = null
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = ''
    fileError.value = 'Only jpg, jpeg, png or gif files are allowed'
    return
  }

  selectedFile.value = file
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = URL.createObjectURL(file)
}
</script>

<style scoped>
.preview-wrapper {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-start;
}

.preview-wrapper img {
  max-width: 200px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
