<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

const getData = ref(null)

onBeforeMount(() => {
  const router = useRouter()
  getData.value = router.currentRoute.value.query

  console.log(getData.value)
})
</script>
