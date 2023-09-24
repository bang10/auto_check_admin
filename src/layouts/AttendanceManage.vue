<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const selectedStudentId = ref('12')

onMounted(() => {
  const route = useRoute()
  selectedStudentId.value = route.query.studentId
})
</script>

<template>
  <div class="full-width">
    {{ selectedStudentId }}
  </div>
</template>
