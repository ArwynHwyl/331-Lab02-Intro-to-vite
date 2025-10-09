<script setup lang="ts">
const modelValue = defineModel()
interface BaseInputProps {
  label: string
}

const props = withDefaults(defineProps<BaseInputProps>(), {
  label: '',
})
</script>

<template>
  <label v-if="props.label">
    {{ props.label }}
  </label>
  <input class="mb-6" v-bind="$attrs" v-model="modelValue" :placeholder="props.label" />
</template>
