<script setup>
import { ref } from 'vue'
// import { useStore } from 'vuex'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'

const professorId = ref('')
const professorName = ref('')
const loginData = ref()

const router = useRouter()

const validate = {
  id: [val => !!val || '빈칸일 수 없습니다.'],
  password: [val => !!val || '빈칸일 수 없습니다.']
}
const fnLogin = async () => {
  api.post('/ysu/admin/login', buildParam())
    .then((res) => {
      loginData.value = res.data.result
      if (loginData.value) {
        // const store = useStore()
        // store.commit('updateData', loginData.value)
        alert(loginData.value.division + ' 권한으로 로그인합니다.')
        router.push({ name: 'Index', query: { division: loginData.value.division, name: loginData.value.name, id: loginData.value.professorId } })
      } else {
        alert('일치하는 정보가 없습니다.')
      }
    })
    .catch(() => {
      alert('일치하는 정보가 없습니다.')
    })
}

const buildParam = () => {
  return {
    professorId: professorId.value,
    password: professorName.value
  }
}
</script>

<template>
    <div class="q-pa-md justify-center content" style="height: 50%; width: 20%">

      <q-form
        @submit="fnLogin"
        class="q-gutter-md vertical-middle"
      >
        <q-input
          filled
          v-model="professorId"
          label="교수번호"
          hint="교수 번호를 입력해 주세요."
          lazy-rules
          :role="validate.id"
        />

        <q-input
          filled
          v-model="professorName"
          label="이름"
          hint="이름를 입력해 주세요."
          lazy-rules
          :role="validate.password"
        />

        <div>
          <q-btn label="로그인" type="submit" color="primary"/>
        </div>
      </q-form>

    </div>
</template>

<style scoped>
.content {
  position: absolute;
  left: 50%;
  height: 50%;
  margin-left: -150px;
  margin-top: 20%;
}

</style>
