<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiLogin, mdiAccountPlus, mdiAccount, mdiLogout } from '@mdi/js'
import { useAuthStore } from '@/stores/auth'

const store = useMessageStore()
const { messages } = storeToRefs(store)
const router = useRouter()
const hasRegister = router.hasRoute('register')
const authStore = useAuthStore()

const iconLogin = mdiLogin
const iconAccountPlus = mdiAccountPlus
const iconAccount = mdiAccount
const iconLogout = mdiLogout

const token = localStorage.getItem('access_token')
const storedUser = localStorage.getItem('user')
let parsedUser: unknown = null

if (storedUser) {
  try {
    parsedUser = JSON.parse(storedUser)
  } catch (error) {
    parsedUser = null
  }
}

if (token && parsedUser) {
  authStore.reload(token, parsedUser as any)
} else {
  authStore.logout()
}

function logout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <SpeedInsights />
  <div class="text-center font-sans text-gray-700 antialiased min-h-screen bg-white">
    <header>
      <div id="flashMessage" class="animate-fade" v-if="messages">
        <h4 class="text-lg font-semibold text-green-600">{{ messages }}</h4>
      </div>
      <div class="wrapper">
        <nav class="py-6 flex items-center gap-8">
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
          <!-- Right-side auth actions -->
          <ul class="flex items-center gap-6 ml-auto" v-if="!authStore.currentUserName">
            <li class="nav-item" v-if="hasRegister">
              <RouterLink
                to="/register"
                class="nav-link flex items-center gap-2 text-gray-700 hover:text-green-500"
              >
                <SvgIcon type="mdi" :path="iconAccountPlus" />
                <span>Sign Up</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink
                to="/login"
                class="nav-link flex items-center gap-2 text-gray-700 hover:text-green-500"
              >
                <SvgIcon type="mdi" :path="iconLogin" />
                <span>Login</span>
              </RouterLink>
            </li>
          </ul>
          <ul class="flex items-center gap-6 ml-auto" v-else>
            <li class="nav-item">
              <RouterLink
                to="/profile"
                class="nav-link flex items-center gap-2 text-gray-700 hover:text-green-500"
              >
                <SvgIcon type="mdi" :path="iconAccount" />
                <span class="ml-3">{{ authStore.currentUserName }}</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <a class="nav-link flex items-center gap-2 text-gray-700 hover:text-green-500" @click="logout">
                <SvgIcon type="mdi" :path="iconLogout" />
                <span class="ml-3">LogOut</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <RouterView />
  </div>
</template>
