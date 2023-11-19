<script setup>
import { onMounted, reactive, ref, watchEffect } from 'vue'
import { api } from 'boot/axios'

const options = ref({
  professor: [],
  subject: [],
  selectDateType: [
    { label: '일', value: 'day' },
    { label: '월', value: 'month' },
    { label: '년', value: 'year' }
  ]
})
const statisticsRateList = ref([])
const searchParam = reactive({})
const convertDate = ref('')
let preventDateStatus = ''
const fnClickSearch = () => {
  api.get('/ysu/admin/total/statistics', { params: searchParam })
    .then((res) => {
      statisticsRateList.value = reSetting(reDataSetting(res.data.result)).map((item, index) => {
        return {
          index: index + 1,
          date: item.date,
          subjectName: item.subjectName,
          attendance: item.attendance,
          attendanceRate: item.attendanceRate,
          perceptual: item.perceptual,
          perceptualRate: item.perceptualRate,
          absent: item.absent,
          absentRate: item.absentRate,
          total: item.attendance + item.perceptual + item.absent
        }
      })
    })
    .catch((err) => {
      console.error(err)
    })
}

const reSetting = (data) => {
  return data.map(item => {
    const attendance = item.attDetails.find(detail => detail.attendanceAbsenceId === 'A01')
    const perceptual = item.attDetails.find(detail => detail.attendanceAbsenceId === 'A02')
    const absent = item.attDetails.find(detail => detail.attendanceAbsenceId === 'A03')

    const formatRate = (rate) => {
      if (typeof rate === 'number') {
        return Math.round(rate * 100 * 100) / 100 // 100을 곱하고 소수 둘째 자리에서 반올림
      }
      return '-'
    }

    return {
      date: item.date,
      subjectName: item.subjectName,
      attendance: attendance ? attendance.cntAttendance : 0,
      attendanceRate: formatRate(attendance ? attendance.ratio : 0),
      perceptual: perceptual ? perceptual.cntAttendance : 0,
      perceptualRate: formatRate(perceptual ? perceptual.ratio : 0),
      absent: absent ? absent.cntAttendance : 0,
      absentRate: formatRate(absent ? absent.ratio : 0)

    }
  })
}

const reDataSetting = (param) => {
  const groupedData = param.reduce((acc, item) => {
    const key = `${item.date}_${item.subjectName}`

    acc[key] = acc[key] || { items: [], total: 0 }

    acc[key].items.push({ attendanceAbsenceId: item.attendanceAbsenceId, cntAttendance: parseInt(item.cntAttendance, 10) })
    acc[key].total += parseInt(item.cntAttendance, 10)

    return acc
  }, {})

  const result = Object.entries(groupedData).map(([key, { items, total }]) => {
    const ratio = items.reduce((acc, { attendanceAbsenceId, cntAttendance }) => {
      acc[attendanceAbsenceId] = cntAttendance / total
      return acc
    }, {})

    const [date, subjectName] = key.split('_')
    return { date, subjectName, ratio }
  })

  const mergedResult = result.map(resItem => {
    const existingData = param.filter(item => item.date === resItem.date && item.subjectName === resItem.subjectName)

    const attDetails = existingData.map(item => ({
      attendanceAbsenceId: item.attendanceAbsenceId,
      cntAttendance: parseInt(item.cntAttendance, 10),
      ratio: resItem.ratio[item.attendanceAbsenceId] || 0
    }))

    return { date: resItem.date, subjectName: resItem.subjectName, attDetails }
  })

  return mergedResult
}

const fnClickReset = () => {
  searchParam.professorCode = undefined
  searchParam.subjectCode = undefined
}
const statisticsColumns = ref([
  { name: 'index', label: '순서', field: 'index', align: 'center' },
  { name: 'date', label: '날짜', field: 'date', align: 'center' },
  { name: 'subjectName', label: '교과명', field: 'subjectName', align: 'center' },
  { name: 'attendance', label: '출석횟수', field: 'attendance', align: 'center' },
  { name: 'attendanceRate', label: '출석율(%)', field: 'attendanceRate', align: 'center' },
  { name: 'perceptual', label: '지각횟수', field: 'perceptual', align: 'center' },
  { name: 'perceptualRate', label: '지각율(%)', field: 'perceptualRate', align: 'center' },
  { name: 'absent', label: '결석횟수', field: 'absent', align: 'center' },
  { name: 'absentRate', label: '결석율(%)', field: 'absentRate', align: 'center' },
  { name: 'total', label: '총합', field: 'total', align: 'center' }
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

onMounted(() => {
  searchParam.dateType = 'day'
  preventDateStatus = searchParam.dateType
  getSubjectList()
  getProfessorList()
})

watchEffect(() => {
  if (searchParam.date) {
    searchParam.date = searchParam.date.replaceAll('/', '-')
    if (searchParam.dateType === 'month') {
      searchParam.date = searchParam.date.substring(0, 7)
    }
    if (searchParam.dateType === 'year') {
      searchParam.date = searchParam.date.substring(0, 4)
    }
    convertDate.value = searchParam.date
  }

  if (searchParam.dateType) {
    if (searchParam.dateType !== preventDateStatus) {
      searchParam.date = undefined
      convertDate.value = undefined
    }
    preventDateStatus = searchParam.dateType
  }
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
                  v-model="searchParam.professorCode"
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
                  v-model="searchParam.subjectCode"
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
        :rows="statisticsRateList"
        row-key="index"
      >
        <template #top-right>
          <span class="text-red">소수 셋째 자리에서 반올림하여 비율합이 100%가 아닐 수 있습니다.</span>
        </template>
        <template #top-left>
          <q-select
            class="q-ml-sm q-mr-lg col-1"
            v-model="searchParam.dateType"
            :options="options.selectDateType"
            map-options
            emit-value
            filled
            dense
            outlined
          />
          <q-input
            class="q-ml-sm q-mr-lg"
            v-model="convertDate"
            readonl
            filled
            use-input
            dense
            outlined
            >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="searchParam.date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="확인" color="primary" flat/>
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
