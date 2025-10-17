<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMessageStore } from '@/stores/message'
import InputText from '@/components/InputText.vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiAccountPlus } from '@mdi/js'

const router = useRouter()
const authStore = useAuthStore()
const messageStore = useMessageStore()
const iconAccountPlus = mdiAccountPlus

const validationSchema = yup.object({
  firstname: yup.string().required('First name is required'),
  lastname: yup.string().required('Last name is required'),
  email: yup.string().required('Email is required').email('Email is invalid'),
  password: yup.string().required('Password is required').min(6, 'Minimum 6 characters'),
  confirmPassword: yup
    .string()
    .required('Confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
})

const { errors, handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
})

const { value: firstname } = useField<string>('firstname')
const { value: lastname } = useField<string>('lastname')
const { value: email } = useField<string>('email')
const { value: password } = useField<string>('password')
const { value: confirmPassword } = useField<string>('confirmPassword')

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.register({
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      password: values.password,
    })
    messageStore.updateMessages('Account created successfully. You can now log in.')
    setTimeout(() => messageStore.resetMessages(), 3000)
    router.push({ name: 'login' })
  } catch (error) {
    messageStore.updateMessages('Failed to register. Please try again.')
    setTimeout(() => messageStore.resetMessages(), 3000)
    console.error(error)
  }
})
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
        <SvgIcon type="mdi" :path="iconAccountPlus" class="h-6 w-6 text-indigo-600" />
      </div>
      <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">Create a new account</h2>
      <p class="mt-2 text-sm text-gray-600">
        Already have an account?
        <RouterLink
          :to="{ name: 'login' }"
          class="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Sign in here
        </RouterLink>
      </p>
    </div>

    <div class="mt-12 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white px-6 py-10 shadow-lg rounded-2xl ring-1 ring-gray-200">
        <form class="space-y-6" @submit.prevent="onSubmit">
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="firstname" class="block text-sm font-medium text-gray-900">First name</label>
              <InputText
                id="firstname"
                v-model="firstname"
                type="text"
                placeholder="Taylor"
                :error="errors['firstname']"
              />
            </div>
            <div>
              <label for="lastname" class="block text-sm font-medium text-gray-900">Last name</label>
              <InputText
                id="lastname"
                v-model="lastname"
                type="text"
                placeholder="Swift"
                :error="errors['lastname']"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-900">Email address</label>
            <InputText
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              :error="errors['email']"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-900">Password</label>
            <InputText
              id="password"
              v-model="password"
              type="password"
              placeholder="********"
              :error="errors['password']"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-900">
              Confirm password
            </label>
            <InputText
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="********"
              :error="errors['confirmPassword']"
            />
          </div>

          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
