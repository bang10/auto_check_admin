<script setup>
import { nextTick, onMounted, reactive, ref, watchEffect } from 'vue'
import { api } from 'boot/axios'
// import { useStore } from 'vuex'

const searchParam = reactive({})
// const userStore = useStore()
const scheduleList = ref([])
const isAddSubject = ref(false)
const scheduleInfoColumns = ref([
  { name: 'index', label: '순서', field: 'index', align: 'center' },
  { name: 'subjectName', label: '과목명', field: 'subjectName', align: 'center' },
  { name: 'classroom', label: '교실', field: 'classroom', align: 'center' },
  { name: 'tranceDate', label: '강의요일', field: 'tranceDate', align: 'center' },
  { name: 'tranceTime', label: '강의시간', field: 'tranceTime', align: 'center' },
  { name: 'professorName', label: '교수명', field: 'professorName', align: 'center' },
  { name: 'professorId', label: '교수코드', field: 'professorId', align: 'center' }
])

const options = ref({
  day: [
    { label: '월요일', value: 2 },
    { label: '화요일', value: 3 },
    { label: '수요일', value: 4 },
    { label: '목요일', value: 5 },
    { label: '금요일', value: 6 },
    { label: '토요일', value: 7 },
    { label: '일요일', value: 1 }
  ],
  professor: []
})

const clickedRowData = ref({})

const getProfessorList = () => {
  api.get('/ysu/professor/list')
    .then((res) => {
      options.value.professor = res.data.result.map(item => {
        return {
          label: item.name,
          value: item.professorId
        }
      })
    })
    .catch((err) => {
      console.error(err)
    })
}

const fnClickSearch = () => {
  // if (userStore.getters.getLoginData.division === '관리자') {
  //   api.get('/ysu/admin/schedule/manage', { params: searchBuildParam() })
  //     .then((res) => {
  //       scheduleList.value = res.data.result.map((item, index) => {
  //         return {
  //           index: index + 1,
  //           tranceTime: traceTime(item.scheduleTime),
  //           tranceDate: tranceDate(item.scheduleDay),
  //           ...item
  //         }
  //       })
  //     })
  //     .catch((err) => {
  //       alert('오류가 발생했습니다.')
  //       console.error(err)
  //     })
  // } else {
  //   alert('권한이 없습니다.')
  // }
  api.get('/ysu/admin/schedule/manage', { params: searchBuildParam() })
    .then((res) => {
      scheduleList.value = res.data.result.map((item, index) => {
        return {
          index: index + 1,
          tranceTime: traceTime(item.scheduleTime),
          tranceDate: tranceDate(item.scheduleDay),
          ...item
        }
      })
    })
    .catch((err) => {
      alert('오류가 발생했습니다.')
      console.error(err)
    })
}

const tranceDate = (param) => {
  if (param === '1') {
    return '일요일'
  }
  if (param === '2') {
    return '월요일'
  }
  if (param === '3') {
    return '화요일'
  }
  if (param === '4') {
    return '수요일'
  }
  if (param === '5') {
    return '목요일'
  }
  if (param === '6') {
    return '금요일'
  }
  if (param === '7') {
    return '토요일'
  }

  return '잘못된 날짜'
}

const searchBuildParam = () => {
  return {
    subjectName: searchParam.subjectName,
    scheduleDay: searchParam.scheduleDay,
    classroom: searchParam.classroom,
    professorCode: searchParam.professorCode
  }
}
const fnClickReset = () => {
  searchParam.subjectName = undefined
  searchParam.scheduleDay = undefined
  searchParam.classroom = undefined
  searchParam.professorCode = undefined

  fnClickSearch()
}

const fnClickRow = (event, param) => {
  clickedRowData.value = param
  nextTick(() => {
    window.open('/manage/attendance?studentId=' + param.studentId)
  })
}

const traceTime = (param) => {
  const timeParts = param.split(':')
  if (timeParts.length === 3) {
    const hours = timeParts[0].padStart(2, '0')
    const minutes = timeParts[1].padStart(2, '0')
    return `${hours}:${minutes}`
  } else {
    return param
  }
}

watchEffect(() => {
  if (searchParam.classroom) {
    searchParam.classroom = searchParam.classroom.replace(/[^0-9]/g, '')
  }
})

const fnAddSubject = () => {
  isAddSubject.value = !isAddSubject.value
  if (searchParam.subjectName && searchParam.scheduleDay && searchParam.classroom && searchParam.professorCode) {
    window.alert('선택됨')
  } else {
    window.alert('강의 추가는 모든 값이 필수 입니다.')
  }
}

onMounted(() => {
  // if (userStore.getters.getLoginData.division === '관리자') {
  //   fnClickSearch()
  // } else {
  //   alert('권한이 없습니다.')
  // }
  getProfessorList()
  fnClickSearch()
})
</script>

<template>
  <div class="full-width">
    <!-- 컨텐즈 -->
    <div class="q-mt-sm">
      <div class="q-pa-sm row">
        <div class="col-12">
          <div class="q-pa-md">
            <div class="row">
              <q-item class="q-pa-none items-center col-12 flex justify-center">
                  <span class="title flex items-center">
                    강의명
                  </span>
                <q-input
                  class="q-ml-sm q-mr-lg"
                  v-model="searchParam.subjectName"
                  filled
                  use-input
                  dense
                  outlined
                  style="width: 200px;"
                />

                <span class="title flex items-center q-ml-sm">
                    강의요일
                </span>
                <q-select
                  class="q-ml-sm q-mr-lg"
                  v-model="searchParam.scheduleDay"
                  :options="options.day"
                  map-options
                  emit-value
                  filled
                  dense
                  outlined
                  style="width: 200px;"
                />

                <span class="title flex items-center q-ml-sm">
                    강의실
                </span>
                <q-input
                  class="q-ml-sm q-mr-lg"
                  v-model="searchParam.classroom"
                  filled
                  use-input
                  dense
                  outlined
                  style="width: 200px;"
                />

                <span class="title flex items-center q-ml-sm">
                    교수명
                </span>
                <q-select
                  class="q-ml-sm q-mr-lg col-1"
                  v-model="searchParam.professorCode"
                  :options="options.professor"
                  map-options
                  emit-value
                  filled
                  dense
                  outlined
                />
              </q-item>
            </div>
          </div>
        </div>
    </div>

    <div class="justify-center row">
      <q-btn
        label="검색"
        color="blue-6"
        rounded
        @click="fnClickSearch"
      />
      <q-btn
        class="q-ml-sm"
        label="초기화"
        color="orange-6"
        rounded
        @click="fnClickReset"
      />
      <q-btn
        dense
        class="q-ml-lg btn-style bg-orange-2"
        flat
        label="강의추가"
        :onclick="fnAddSubject"
      />
    </div>
    <div class="full-width q-ma-lg" style="max-height: 500px; overflow-y: auto;">
      <q-table
        title="검색결과"
        flat
        bordered
        :rows="scheduleList"
        :columns="scheduleInfoColumns"
        @row-click="fnClickRow"
      >
        <template #top-left>
          <q-item
            style="font-size: 20px;"
            head
          >
            검색결과 : {{ scheduleList.length }}개
          </q-item>
        </template>
      </q-table>
    </div>
  </div>
  </div>
</template>

<style scoped>
.btn-style {
  height: auto;
  width: 100px;
  font-size: 16px;
}
</style>
