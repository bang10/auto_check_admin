<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'

const searchParam = reactive({})
// 서버로부터 받아온 학생 데이터
// 아래 샘플 데이터 있습니다.
const studentInfoList = ref([])
const studentInfoColumns = ref([
  { name: 'index', label: '순서', field: 'index', align: 'center' },
  { name: 'name', label: '이름', field: 'name', align: 'center' },
  { name: 'studentId', label: '학번', field: 'studentId', align: 'center' },
  { name: 'grade', label: '학년', field: 'grade', align: 'center' }
])

const clickedRowData = ref({})
const fnClickSearch = () => {
  if (validation()) {
    console.log(buildParam())
  }
}

const validation = () => {
  if (searchParam.studentId) {
    if (!/^[0-9]+$/.test(searchParam.studentId)) {
      alert('학번은 숫자만 입력해 주세요.')
      return false
    }
  }
  if (searchParam.grade) {
    if (!/^[1-6]+$/.test(searchParam.grade)) {
      alert('학년은 숫자만 입력해 주세요.')
      return false
    }
  }
  return true
}

const buildParam = () => {
  return {
    studentId: searchParam.studentId,
    name: searchParam.studentName,
    grade: searchParam.grade
  }
}
const fnClickReset = () => {
  searchParam.studentName = ''
  searchParam.studentId = ''
  searchParam.grade = 1
}

const fnClickRow = (event, param) => {
  clickedRowData.value = param
  console.log(clickedRowData.value)
  nextTick(() => {
    window.open('/manage/attendance?studentId=' + param.studentId)
  })
}

onMounted(() => {
  studentInfoList.value = [
    { index: 1, name: 'name', studentId: '12345', grade: 1 },
    { index: 2, name: 'name', studentId: '12345', grade: 1 },
    { index: 3, name: 'name', studentId: '12345', grade: 1 },
    { index: 4, name: 'name', studentId: '12345', grade: 1 },
    { index: 5, name: 'name', studentId: '12345', grade: 1 },
    { index: 6, name: 'name', studentId: '12345', grade: 1 }
  ]
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
                    학생명
                  </span>
                  <q-input
                    class="q-ml-sm"
                    v-model="searchParam.studentName"
                    dense
                    outlined
                    rounded
                    style="width: 200px;"
                  />

                  <span class="title flex items-center q-ml-sm">
                    학번
                  </span>
                  <q-input
                    class="q-ml-sm"
                    v-model="searchParam.studentId"
                    dense
                    outlined
                    rounded
                    style="width: 200px;"
                  />

                  <span class="title flex items-center q-ml-sm">
                    학년
                  </span>
                  <q-input
                    class="q-ml-sm"
                    v-model="searchParam.grade"
                    dense
                    outlined
                    rounded
                    style="width: 200px;"
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
        title="검색결과"
        flat
        bordered
        :rows="studentInfoList"
        :columns="studentInfoColumns"
        @row-click="fnClickRow"
        row-key="index"
      />
    </div>
  </div>
</template>
