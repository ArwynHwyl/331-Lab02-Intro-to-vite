<script setup lang="ts">
import StudentCard from '@/components/StudentCard.vue'
import type { Student } from '@types'
import { ref, onMounted } from 'vue'
import StudentService from '@/services/StudentService'
const students = ref<Student[]>(null)

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
  <h1>Student List</h1>
  <!-- new element-->
  <div class="students">
    <StudentCard v-for="student in students" :key="student.id" :student="student" />
  </div>
</template>

<style scoped>
.students {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
