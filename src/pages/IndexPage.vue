<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const getData = ref(null)

onMounted(() => {
  const route = useRoute()
  getData.value = {
    division: route.query.division,
    name: route.query.name,
    id: route.query.id
  }

  console.log(getData.value)
})
</script>
