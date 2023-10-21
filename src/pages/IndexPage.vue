<script setup>
import { onBeforeMount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'

let getData = reactive(null)
const leftDrawerOpen = ref(false)

const linksList = [
  {
    title: '학생인증',
    link: '/auth/student'
  },
  {
    title: '시간표 관리',
    link: '/manage/schedule'
  },
  {
    title: '학생관리',
    link: '/manage/student'
  },
  {
    title: '출석관리',
    link: '/manage/attendance'
  }
]

const toggleLeftDrawer = () => {
  console.log('click')
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const fnLogout = () => {
  console.log('Clicked logout button')
}

onBeforeMount(() => {
  const router = useRouter()
  getData = router.currentRoute.value.query

  console.log(getData)
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

        <q-toolbar-title>
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

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>
  </q-layout>
</template>
