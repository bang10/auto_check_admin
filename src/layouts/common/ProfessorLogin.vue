<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const professorId = ref('')
const professorName = ref('')

const router = useRouter()
const fnLogin = () => {
  // 로그인 판별
  console.log('run login ')
  // 페이지 이동
  router.push({ name: 'Main' })
}
</script>

<template>
    <div class="q-pa-md" style="max-width: 400px">

      <q-form
        @submit="fnLogin"
        class="q-gutter-md"
      >
        <q-input
          filled
          v-model="professorId"
          label="교수번호"
          hint="교수 번호를 입력해 주세요."
          lazy-rules
        />

        <q-input
          filled
          v-model="professorName"
          label="이름"
          hint="이름를 입력해 주세요."
          lazy-rules
        />

        <div>
          <q-btn label="로그인" type="submit" color="primary"/>
        </div>
      </q-form>

    </div>
</template>
