<script setup>
import { onBeforeMount, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import EssentialLink from 'components/EssentialLink.vue'
import { useRouter } from 'vue-router'

let getData = reactive(null)
const leftDrawerOpen = ref(false)
const userStore = useStore()
const router = useRouter()

const linksList = [
  {
    title: '시간표 관리(관리자)',
    link: '/manage/schedule'
  },
  {
    title: '학생관리',
    link: '/auth/student'
  },
  {
    title: '출석관리',
    link: '/manage/attendance'
  },
  {
    title: '통계(개발중)',
    link: '/total/statistics'
  }
]

const selectTitle = ref('')
const selectMenu = (param) => {
  selectTitle.value = param
}

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const fnLogout = () => {
  router.push({ name: 'Login' })
}

onBeforeMount(() => {
  getData = userStore.getters.getLoginData
})
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title v-if="selectTitle">
          연성대학교 [{{ selectTitle }}]
        </q-toolbar-title>
        <q-toolbar-title v-if="!selectTitle">
          연성대학교
        </q-toolbar-title>
        <div>
          {{ getData.name }}({{ getData.division }})님
        </div>
        <div>
          <q-btn
            class="q-ml-md"
            flat
            dense
            color="black"
            @click="fnLogout"
          >
            로그아웃
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      >
      <q-list>
        <q-item-label
          header
        >

        </q-item-label>

        <router-link
          v-for="link in linksList"
          :key="link.title"
          :to="link.link"
          @click="selectMenu(link.title)"
        >
          <EssentialLink :link="link.link" :title="link.title" />
        </router-link>
      </q-list>
    </q-drawer>
    <div class="router-content">
      <div class="row justify-end">
        <router-view class="q-mt-md" v-if="leftDrawerOpen" style="max-width: 85%;"></router-view>
        <router-view class="q-mt-md" v-if="!leftDrawerOpen"></router-view>
      </div>
    </div>
  </q-layout>
</template>

<style scoped>
.router-content {
  padding: 16px;
}
</style>
