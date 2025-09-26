<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="eyebrow -text-primary mb-4">Create Event</h1>

    <form @submit.prevent="saveEvent">
      <div class="field">
        <label for="title">Title</label>
        <input id="title" v-model="form.title" type="text" required />
      </div>

      <div class="field">
        <label for="category">Category</label>
        <select id="category" v-model="form.category" required>
          <option value="health">health</option>
          <option value="education">education</option>
          <option value="music">music</option>
          <option value="tech">tech</option>
          <option value="sports">sports</option>
          <option value="community">community</option>
        </select>
      </div>

      <div class="field">
        <label for="description">Description</label>
        <textarea id="description" v-model="form.description" rows="4" />
      </div>

      <div class="field">
        <label for="location">Location</label>
        <input id="location" v-model="form.location" type="text" />
      </div>

      <div class="field">
        <label for="date">Date</label>
        <input id="date" v-model="form.date" type="date" />
      </div>

      <div class="field">
        <label for="time">Time</label>
        <input id="time" v-model="form.time" type="time" />
      </div>

      <div class="field">
        <label>
          <input type="checkbox" v-model="form.petsAllowed" />
          Allow pets?
        </label>
      </div>

      <div class="field">
        <label for="organizer">Organizer</label>
        <input id="organizer" v-model="form.organizer" type="text" />
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import EventService from '@/services/EventService'
import type { Event } from '@/types'

const router = useRouter()
const error = ref('')
const form = reactive<Event>({
  id: 0,
  title: '',
  category: 'tech',
  description: '',
  location: '',
  date: '',
  time: '',
  petsAllowed: false,
  organizer: '',
})

function saveEvent() {
  error.value = ''
  EventService.saveEvent(form)
    .then((response) => {
      const id = response?.data?.id ?? form.id
      router.push({ name: 'event-detail-view', params: { id } })
    })
    .catch((e: unknown) => {
      if (e && typeof e === 'object' && 'message' in e) {
        const msg = (e as { message?: string }).message
        error.value = msg || 'Failed to create event'
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
