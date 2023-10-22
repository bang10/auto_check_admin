<script setup>
import { onMounted, reactive, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'boot/axios'

const selectedStudentId = ref('')
const searchParam = reactive({})
const attendanceList = ref([])
const attendanceStudentList = ref([])
const selectStudentList = ref([])

const attendanceStudentColumns = ref([
  { name: 'cnt', label: '순서', field: 'cnt', align: 'center' },
  { name: 'studentId', label: '학번', field: 'studentId', align: 'center' },
  { name: 'studentName', label: '이름', field: 'studentName', align: 'center' },
  { name: 'grade', label: '학년', field: 'grade', align: 'center' },
  { name: 'subjectName', label: '교과명', field: 'subjectName', align: 'center' },
  { name: 'tranceScheduleDay', label: '강의요일', field: 'tranceScheduleDay', align: 'center' },
  { name: 'tranceTime', label: '출석시간', field: 'tranceTime', align: 'center' },
  { name: 'tranceAttendance', label: '출석여부', field: 'tranceAttendance', align: 'center' }
])

// 출석
const fnAttendance = (param) => {
  if (selectStudentList.value.length === 0) {
    alert('한명이상 선택해 주세요.')
  } else {
    api.post('/ysu/admin/update/attendance', buildParam(param))
      .then((res) => {
        alert(res.data.result + '건 변경에 성공했습니다.')
        selectStudentList.value = []
        fnSearch()
      })
      .catch((err) => {
        console.error(err)
      })
  }
}

const buildParam = (type) => {
  return {
    code: type,
    attendanceDivisionId: selectStudentList.value.map(item => ({
      studentId: item.studentId,
      subjectName: item.subjectName,
      scheduleDay: item.scheduleDay
    }))
  }
}

const searchBuildParam = () => {
  return {
    studentId: searchParam.studentId,
    subjectName: searchParam.subjectName,
    grade: searchParam.grade,
    studentName: searchParam.studentName,
    scheduleDay: searchParam.scheduleDay,
    attendance: searchParam.attendance
  }
}

const fnSearch = () => {
  api.get('/ysu/admin/attendance/list', { params: searchBuildParam() })
    .then((res) => {
      attendanceStudentList.value = res.data.result.map((item, index) => {
        return {
          cnt: index + 1,
          tranceScheduleDay: tranceDate(item.scheduleDay),
          tranceAttendance: attendanceAbsence(item.isAttendance),
          tranceTime: fnTranceTime(item.attendanceTime),
          ...item
        }
      })
    })
    .catch((err) => {
      console.error(err)
    })
}

const fnClickReset = () => {
  searchParam.studentId = undefined
  searchParam.subjectName = undefined
  searchParam.grade = undefined
  searchParam.studentName = undefined
  searchParam.scheduleDay = undefined
  searchParam.attendance = undefined

  fnSearch()
}

const getAttendance = async () => {
  await api.get('/ysu/attendance/list', {})
    .then((res) => {
      attendanceList.value = res.data.map(item => {
        return {
          label: item.attendance,
          value: item.attendanceAbsenceId
        }
      })
    })

    .catch((err) => {
      console.error(err)
    })
}

const fnTranceTime = (param) => {
  const date = new Date(param)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// TODO Map으로 변경
const attendanceAbsence = (param) => {
  if (param === 'A01') {
    return '출석'
  }
  if (param === 'A02') {
    return '지각'
  }
  if (param === 'A03') {
    return '결석'
  }
  return '*'
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

watchEffect(() => {
  if (searchParam.studentId) {
    searchParam.studentId = searchParam.studentId.replace(/[^0-9]/g, '')
  }
  if (searchParam.grade) {
    searchParam.grade = searchParam.grade.replace(/[^0-9]/g, '')
  }
})
onMounted(async () => {
  const route = useRoute()
  await getAttendance()
  fnSearch()
  selectedStudentId.value = route.query.studentId
})
</script>

<template>
  <div class="full-width">
    <div class="q-mt-sm">
      <div class="col-12">
        <div class="q-pa-md">
          <div class="row">
            <q-item class="q-pa-none items-center col-12 flex justify-center">
              <span class="title flex items-center">
                이름
              </span>
              <q-input
                class="q-ml-sm q-mr-lg"
                v-model="searchParam.studentName"
                filled
                use-input
                dense
                outlined
                style="width: 200px;"
              />
              <span class="title flex items-center">
                학번
              </span>
              <q-input
                class="q-ml-sm q-mr-lg"
                v-model="searchParam.studentId"
                filled
                use-input
                dense
                outlined
                style="width: 200px;"
              />

              <span class="title flex items-center">
                교과명
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

              <span class="title flex items-center">
                학년
              </span>
              <q-input
                class="q-ml-sm q-mr-lg"
                v-model="searchParam.grade"
                filled
                use-input
                dense
                outlined
                style="width: 200px;"
              />

              <span class="title flex items-center">
                강의날짜
              </span>
              <q-input
                class="q-ml-sm q-mr-lg"
                v-model="searchParam.scheduleDay"
                readonly
                filled
                use-input
                dense
                outlined
                mask="date"
                style="width: 200px;"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="searchParam.scheduleDay">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="확인" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <span class="title flex items-center">
                출석
              </span>
              <q-select
                class="q-ml-sm q-mr-lg"
                v-model="searchParam.attendance"
                :options="attendanceList"
                map-options
                emit-value
                filled
                dense
                outlined
                style="width: 200px;"
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
        @click="fnSearch"
      />
      <q-btn
        class="q-ml-sm"
        label="초기화"
        color="orange-6"
        rounded
        @click="fnClickReset"
      />
    </div>
    <div class="full-width q-ma-lg" style="max-height: 500px; overflow-y: auto;">
      <q-table
        title="검색결과"
        flat
        bordered
        :rows="attendanceStudentList"
        :columns="attendanceStudentColumns"
        selection="multiple"
        row-key="cnt"
        v-model:selected="selectStudentList"
      >
        <template #top-left>
          <q-item
            style="font-size: 20px;"
            head
          >
            검색결과 : {{ attendanceStudentList.length }}개
          </q-item>
        </template>

        <template #top-right>
          <q-btn
            class="btn-style"
            style="background-color: #5555ec;"
            dense
            flat
            color="white"
            @click="fnAttendance('A01')"
            label="출석처리"
          />

          <q-btn
            class="q-ml-lg btn-style"
            style="background-color: #ff8800;"
            dense
            flat
            color="white"
            @click="fnAttendance('A02')"
            label="지각처리"
          />

          <q-btn
            class="q-ml-lg btn-style"
            style="background-color: #e73f3f;"
            dense
            flat
            color="white"
            @click="fnAttendance('A03')"
            label="결석처리"
          />
        </template>
      </q-table>
    </div>
  </div>

</template>

<style scoped>
.btn-style {
  height: auto;
  width: 70px;
  font-size: 16px;
}
</style>
