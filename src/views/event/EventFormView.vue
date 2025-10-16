<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="eyebrow -text-primary mb-4">Create Event</h1>

    <form @submit.prevent="saveEvent">
      <div class="field">
        <BaseInput v-model="form.title" type="text" label="Title" required />
      </div>

      <div class="field">
        <BaseInput v-model="form.category" type="text" label="Category" />
      </div>

      <div class="field">
        <BaseInput v-model="form.description" type="text" label="Description" />
      </div>

      <div class="field">
        <BaseInput v-model="form.location" type="text" label="Location" />
      </div>

      <div class="field">
        <BaseInput v-model="form.date" type="date" label="Date" />
      </div>

      <div class="field">
        <BaseInput v-model="form.time" type="time" label="Time" />
      </div>

      <div class="field">
        <BaseInput type="checkbox" v-model="form.petsAllowed" label="Allow pets?" />
      </div>

      <div class="field">
        <h3>Who is your organizer?</h3>
        <BaseSelect v-model="form.organizer.id" label="Organizer" :options="organizers" />
      </div>

      <div class="field">
        <h3>The image of the Event</h3>
        <ImageUpload v-model="form.images" />
      </div>

      <div>
        <button class="button -fill-gradient" type="submit">Save</button>
        <router-link class="button -fill-gray" :to="{ name: 'event-list-view' }"
          >Cancel</router-link
        >
      </div>
    </form>

    <p v-if="error" class="errorMessage mt-4">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import EventService from '@/services/EventService'
import OrganizerService from '@/services/OrganizerService'
import type { Event, Organizer } from '@/types'
import { useMessageStore } from '@/stores/message'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import ImageUpload from '@/components/ImageUpload.vue'

const router = useRouter()
const error = ref('')
const messageStore = useMessageStore()
const organizers = ref<Organizer[]>([])

const form = reactive<Event>({
  id: 0,
  title: '',
  category: 'tech',
  description: '',
  location: '',
  date: '',
  time: '',
  petsAllowed: false,
  organizer: {
    id: 0,
    name: '',
  },
  images: [],
})

onMounted(() => {
  OrganizerService.getOrganizers()
    .then((response) => {
      // Expect response.data to be an array of { id, name }
      organizers.value = response.data
    })
    .catch(() => {
      router.push({ name: 'network-error-view' })
    })
})

function saveEvent() {
  error.value = ''

  // Ensure organizer.name is set from the selected organizer id
  try {
    const sel = organizers.value.find((o) => o.id === form.organizer.id)
    if (sel) {
      form.organizer.name = sel.name
    } else {
      // if none selected, clear name
      form.organizer.name = ''
    }
  } catch {
    form.organizer.name = ''
  }

  EventService.saveEvent(form)
    .then((response) => {
      const id = response?.data?.id ?? form.id
      messageStore.updateMessages(
        `You are successfully add a new event for ${response?.data?.title ?? form.title}`,
      )
      setTimeout(() => messageStore.resetMessages(), 3000)
      router.push({ name: 'event-detail-view', params: { id } })
    })
    .catch((e: unknown) => {
      if (e && typeof e === 'object' && 'message' in e) {
        const msg = (e as { message?: string }).message
        error.value = msg || 'Failed to create event'
      } else {
        error.value = 'Failed to create event'
      }
      router.push({ name: 'network-error-view' })
    })
}
</script>

<style>
/* pasted styles from the instruction */
button,
label,
input,
optgroup,
select,
textarea {
  display: inline-flex;
  font-family: 'Open sans', sans-serif;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
}
button,
input {
  overflow: visible;
}
button,
select {
  text-transform: none;
}
button,
[type='button'],
[type='reset'],
[type='submit'] {
  appearance: none;
  -webkit-appearance: none;
}
button::-moz-focus-inner,
[type='button']::-moz-focus-inner,
[type='reset']::-moz-focus-inner,
[type='submit']::-moz-focus-inner {
  border-style: none;
  padding: 0;
}
button:-moz-focusring,
[type='button']:-moz-focusring,
[type='reset']:-moz-focusring,
[type='submit']:-moz-focusring {
  outline: 2px solid #39b982;
}
label {
  color: rgba(0, 0, 0, 0.5);
  font-weight: 700;
}
input,
textarea {
  box-sizing: border-box;
  border: solid 1px rgba(0, 0, 0, 0.4);
}
input.error,
select.error {
  margin-bottom: 0;
}
input + p.errorMessage {
  margin-bottom: 24px;
}
textarea {
  width: 100%;
  overflow: auto;
  font-size: 20px;
}
[type='checkbox'],
[type='radio'] {
  box-sizing: border-box;
  padding: 0;
  margin-right: 0.5rem;
}
[type='number']::-webkit-inner-spin-button,
[type='number']::-webkit-outer-spin-button {
  height: auto;
}
[type='search'] {
  appearance: textfield;
  -webkit-appearance: textfield;
  outline-offset: -2px;
}
[type='search']::-webkit-search-decoration {
  -webkit-appearance: none;
}
input,
[type='text'],
[type='number'],
[type='search'],
[type='password'] {
  height: 52px;
  width: 100%;
  padding: 0 10px;
  font-size: 20px;
}
input,
[type='text']:focus,
[type='number']:focus,
[type='search']:focus,
[type='password']:focus {
  border-color: #39b982;
}
::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}
[hidden] {
  display: none;
}
.error {
  border: 1px solid red;
}
select {
  width: 100%;
  height: 52px;
  padding: 0 24px 0 10px;
  vertical-align: middle;
  background: #fff
    url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")
    no-repeat right 12px center;
  background-size: 8px 10px;
  border: solid 1px rgba(0, 0, 0, 0.4);
  border-radius: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
select:focus {
  border-color: #39b982;
  outline: 0;
}
select:focus::ms-value {
  color: #000;
  background: #fff;
}
select::ms-expand {
  opacity: 0;
}
.field {
  margin-bottom: 24px;
}
.errorMessage {
  color: red;
}
.button {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 40px;
  background: transparent;
  border: none;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s linear;
}
.button:hover {
  -webkit-transform: scale(1.02);
  transform: scale(1.02);
  box-shadow:
    0 7px 17px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.button:active {
  -webkit-transform: scale(1);
  transform: scale(1);
  box-shadow: none;
}
.button:focus {
  outline: 0;
}
.button:disabled {
  -webkit-transform: scale(1);
  transform: scale(1);
  box-shadow: none;
}
.button + .button {
  margin-left: 1em;
}
.button.-fill-gradient {
  background: linear-gradient(to right, #16c0b0, #84cf6a);
  color: #ffffff;
}
.button.-fill-gray {
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
}
.button.-size-small {
  height: 32px;
}
.button.-icon-right {
  text-align: left;
  padding: 0 20px;
}
.button.-icon-right > .icon {
  margin-left: 10px;
}
.button.-icon-left {
  text-align: right;
  padding: 0 20px;
}
.button.-icon-left > .icon {
  margin-right: 10px;
}
.button.-icon-center {
  padding: 0 20px;
}
</style>
