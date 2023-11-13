<script setup>
import { onMounted, reactive, ref } from 'vue'
import { api } from 'boot/axios'

const options = ref({
  professor: [],
  subject: []
})
const dailyRateList = ref([])
const monthRateList = ref([])
const yearRateList = ref([])
const searchParam = reactive({})
const selectedYear = ref(new Date().getFullYear())
const fnClickSearch = () => {
  console.log('subject', searchParam.subjectName, 'professor', searchParam.professorName)
}

const fnClickReset = () => {
  searchParam.professorName = undefined
  searchParam.subjectName = undefined
}
const statisticsColumns = ref([
  { name: 'index', label: '순서', field: 'index', align: 'center' },
  { name: 'day', label: '날짜', field: 'day', align: 'center' },
  { name: 'subjectName', label: '교과명', field: 'subjectName', align: 'center' },
  { name: 'attendance', label: '출석횟수', field: 'attendance', align: 'center' },
  { name: 'attendanceRate', label: '출석율(%)', field: 'attendanceRate', align: 'center' },
  { name: 'perceptual', label: '지각횟수', field: 'perceptual', align: 'center' },
  { name: 'perceptualRate', label: '지각율(%)', field: 'perceptualRate', align: 'center' },
  { name: 'absent', label: '결석횟수', field: 'absent', align: 'center' },
  { name: 'absentRate', label: '결석율(%)', field: 'absentRate', align: 'center' }
])

const getSubjectList = () => {
  api.get('/ysu/user/subject/list')
    .then((res) => {
      options.value.subject = res.data.result.map(item => {
        return {
          label: item.name,
          value: item.subjectId
        }
      })
    })
    .catch((err) => {
      console.error(err)
    })
}

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

// TODO Test data. You have to change below code and get only through API
onMounted(() => {
  dailyRateList.value = [
    { index: 1, day: '2023-12-12', subjectName: '테스트', attendance: '1', attendanceRate: '15', perceptual: '3', perceptualRate: '24', absent: '12', absentRate: '14' },
    { index: 2, day: '2023-12-12', subjectName: '테스트', attendance: '1', attendanceRate: '15', perceptual: '3', perceptualRate: '24', absent: '12', absentRate: '14' }
  ]
  monthRateList.value = [
    { index: 1, day: '2023-12', subjectName: '테스트', attendance: '1', attendanceRate: '15', perceptual: '3', perceptualRate: '24', absent: '12', absentRate: '14' },
    { index: 2, day: '2023-12', subjectName: '테스트', attendance: '1', attendanceRate: '15', perceptual: '3', perceptualRate: '24', absent: '12', absentRate: '14' }
  ]
  yearRateList.value = [
    { index: 1, day: '2023', subjectName: '테스트', attendance: '1', attendanceRate: '15', perceptual: '3', perceptualRate: '24', absent: '12', absentRate: '14' },
    { index: 2, day: '2024', subjectName: '테스트', attendance: '1', attendanceRate: '15', perceptual: '3', perceptualRate: '24', absent: '12', absentRate: '14' }
  ]
  getSubjectList()
  getProfessorList()
})
</script>

<template>
  <div class="full-width">
    <div class="q-mt-sm">
      <div class="q-pa-sm row">
        <div class="col-12">
          <div class="q-pa-md">
            <div class="row">
              <q-item class="q-pa-none items-center col-12 flex justify-center">
              <span class="title flex items-center">
                교수
              </span>
                <q-select
                  class="q-ml-sm q-mr-lg col-1"
                  v-model="searchParam.professorName"
                  :options="options.professor"
                  map-options
                  emit-value
                  filled
                  dense
                  outlined
                />
              <span class="title flex items-center">
                교과
              </span>
                <q-select
                  class="q-ml-sm q-mr-lg col-1"
                  v-model="searchParam.subjectName"
                  :options="options.subject"
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
    </div>

    <div class="full-width q-ma-lg">
      <q-table
        title="일별통계"
        flat
        bordered
        :columns="statisticsColumns"
        :rows="dailyRateList"
        row-key="index"
      >
        <template #top-left>
          <span class="title flex items-center q-ml-sm">
              일별통계
          </span>
          <q-input
            class="q-ml-sm q-mr-lg"
            v-model="searchParam.day"
            readonl
            filled
            use-input
            dense
            outlined
            mask="date"
            >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="searchParam.day">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="확인" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
    <div class="full-width q-ma-lg">
      <q-table
        title="월별통계"
        flat
        bordered
        :columns="statisticsColumns"
        :rows="monthRateList"
        row-key="index"
      >
        <template #top-left>
          <span class="title flex items-center q-ml-sm">
              월별통계
          </span>
          <q-input
            class="q-ml-sm q-mr-lg"
            v-model="searchParam.month"
            readonl
            filled
            use-input
            dense
            outlined
            mask="date"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="searchParam.month">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="확인" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
    <div class="full-width q-ma-lg">
      <q-table
        title="년별통계"
        flat
        bordered
        :rows="yearRateList"
        :columns="statisticsColumns"
        row-key="index"
      >
        <template #top-left>
          <span class="title flex items-center q-ml-sm">
              년별통계
          </span>
          <q-input
            class="q-ml-sm q-mr-lg"
            v-model="searchParam.year"
            mask="date"
            :default-year-month="[selectedYear, 1]"
            :range="[1900, new Date().getFullYear()]"
            :navigation="false"
            readonl
            filled
            use-input
            dense
            outlined
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="searchParam.year">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="확인" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </template>
      </q-table>
    </div>
  </div>
</template>
