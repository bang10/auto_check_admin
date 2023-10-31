<script setup>
import { ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router'

const professorId = ref('')
const professorName = ref('')
const tellNumber = ref('')
const authNumber = ref(Math.random())
const checkAuthNumber = ref('')
const loginData = ref()
const loginWay = ref('professor')
const isLogin = ref(false)
const isSend = ref(false)

const router = useRouter()
const store = useStore()

const validate = {
  id: [val => !!val || '빈칸일 수 없습니다.'],
  password: [val => !!val || '빈칸일 수 없습니다.']
}
const fnLogin = () => {
  api.post('/ysu/admin/login', buildParam())
    .then((res) => {
      loginData.value = res.data.result
      if (loginWay.value === 'professor') {
        store.commit('updateData', loginData.value)
        alert(loginData.value.division + ' 권한으로 로그인합니다.')
        router.push({ name: 'Index' })
      } else {
        if (loginData.value) {
          isLogin.value = true
          alert('관리자 인증을 해주세요.')
        } else {
          alert('일치하는 정보가 없습니다.')
        }
      }
    })
    .catch((err) => {
      console.error(err)
      alert('일치하는 정보가 없습니다.')
    })
}

const fnGetAuthNumber = () => {
  api.get('/ysu/auth/sms/admin', { params: { to: tellNumber.value, adminId: professorId.value } })
    .then((res) => {
      if (res.data) {
        authNumber.value = res.data
        alert('인증번호를 전송했습니다.')
        isSend.value = true
      } else {
        alert('등록된 번호와 다릅니다. 인증을 진행할 수 없습니다.')
        tellNumber.value = ''
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

const fnSendAuthNumber = () => {
  fnGetAuthNumber()
}

const fnCheckAuthNumber = () => {
  console.log(authNumber.value, checkAuthNumber.value)
  if (authNumber.value.toString() === checkAuthNumber.value) {
    store.commit('updateData', loginData.value)
    alert(loginData.value.division + ' 권한으로 로그인합니다.')
    router.push({ name: 'Index' })
  } else {
    alert('인증번호가 일치하지 않습니다.')
    checkAuthNumber.value = ''
  }
}

const reset = () => {
  professorId.value = ''
  professorName.value = ''
}

const buildParam = () => {
  return {
    professorId: professorId.value,
    password: professorName.value,
    division: loginWay.value
  }
}

watchEffect(() => {
  tellNumber.value = tellNumber.value.replace(/[^0-9]/g, '')
})
</script>

<template>
    <div class="q-pa-md justify-center content" style="bottom: 20%; width: 20%;">

      <q-form
        @submit="fnLogin"
        class="q-gutter-md vertical-middle"
      >
        <div class="q-gutter-sm">
          <q-radio
            left-label
            dense
            v-model="loginWay"
            val="professor"
            label="교수"
            @update:model-value="reset"
          />
          <q-radio
            left-label
            dense
            v-model="loginWay"
            val="admin"
            label="관리자"
            @update:model-value="reset"
          />
        </div>
        <div v-if="loginWay === 'professor'">
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
        </div>

        <div v-if="loginWay === 'admin'">
          <q-input
            filled
            v-model="professorId"
            label="관리자 코드"
            hint="관리자 코드를 입력해 주세요."
            lazy-rules
            :role="validate.id"
          />

          <q-input
            filled
            type="password"
            v-model="professorName"
            label="관리자 구분 번호"
            hint="관리자 구분 번호를 입력해 주세요."
            lazy-rules
            :role="validate.password"
          />
        </div>

        <div>
          <q-btn style="width: 350px; font-size: 15px;" label="로그인" type="submit" color="primary"/>
        </div>

        <div v-if="isLogin && loginWay === 'admin'">
          <q-input
            filled
            type="tel"
            v-model="tellNumber"
            label="전화번호"
            hint="전화번호를 입력해 주세요."
            lazy-rules
          />
          <q-btn style="width: 350px; font-size: 15px;" class="q-mt-sm" color="primary" label="인증번호 전송" :onclick="fnSendAuthNumber"/>
          <div class="q-mt-lg" v-if="isSend">
            <q-input
              filled
              type="tel"
              v-model="checkAuthNumber"
              label="인증번호"
              hint="인증번호를 입력해 주세요."
              lazy-rules
            />
            <q-btn style="width: 350px; font-size: 15px;" class="q-mt-sm" color="primary" label="인증번호 확인" :onclick="fnCheckAuthNumber"/>
          </div>
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
