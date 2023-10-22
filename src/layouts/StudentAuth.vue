<script setup>
import { nextTick, onMounted, reactive, ref, watchEffect } from 'vue'
import { api } from 'boot/axios'
import { useStore } from 'vuex'

const searchParam = reactive({})
const selectedItem = ref([])
const studentInfoList = ref([])
const studentInfoColumns = ref([
  { name: 'index', label: '순서', field: 'index', align: 'center' },
  { name: 'studentName', label: '이름', field: 'studentName', align: 'center' },
  { name: 'studentId', label: '학번', field: 'studentId', align: 'center' },
  { name: 'department', label: '학년', field: 'department', align: 'center' },
  { name: 'grade', label: '학년', field: 'grade', align: 'center' },
  { name: 'isStudentInfo', label: '인증여부', field: 'isStudentInfo', align: 'center' }
])
const userStore = useStore()
const clickedRowData = ref({})

const fnClickSearch = () => {
  if (userStore.getters.getLoginData.division === '관리자') {
    const param = searchBuildParam()
    api.get('/ysu/admin/auth/student/list', { params: param })
      .then((res) => {
        studentInfoList.value = res.data.result.map((item, index) => {
          return {
            index: index + 1,
            isStudentInfo: item.isStudent ? '인증' : '미인증',
            ...item
          }
        })
      })
      .catch((err) => {
        alert(err)
      })
  } else {
    alert('권한이 없습니다.')
  }
}

const fnDoAuth = () => {
  if (userStore.getters.getLoginData.division === '관리자') {
    if (selectedItem.value.length === 0) {
      alert('한명 이상 선택해 주세요.')
    } else {
      console.log(buildParam('auth'))
      api.post('/ysu/admin/update/student/statue', buildParam('auth'))
        .then((res) => {
          if (res.data.result > 0) {
            alert('학생인증 처리가 되었습니다.')
            selectedItem.value = []
            fnClickSearch()
          }
        })
        .catch((err) => {
          console.error(err)
          alert('오류가 발생했습니다.')
        })
    }
  } else {
    alert('권한이 없습니다.')
  }
}

const fnCancelAuth = () => {
  if (userStore.getters.getLoginData.division === '관리자') {
    if (selectedItem.value.length === 0) {
      alert('한명 이상 선택해 주세요.')
    } else {
      api.post('/ysu/admin/update/student/statue', buildParam('cancel'))
        .then((res) => {
          if (res.data.result > 0) {
            alert('학생인증을 취소했습니다.')
            selectedItem.value = []
            fnClickSearch()
          }
        })
        .catch((err) => {
          console.error(err)
          alert('오류가 발생했습니다.')
        })
    }
  } else {
    alert('권한이 없습니다.')
  }
}

const searchBuildParam = () => {
  return {
    studentId: searchParam.studentId,
    studentName: searchParam.studentName,
    grade: searchParam.grade
  }
}

const buildParam = (type) => {
  if (type !== 'cancel') {
    return {
      statue: 'S',
      studentIdList: selectedItem.value.map(item => item.studentId)
    }
  } else {
    return {
      statue: 'C',
      studentIdList: selectedItem.value.map(item => item.studentId)
    }
  }
}

const fnClickReset = () => {
  searchParam.studentName = ''
  searchParam.studentId = undefined
  searchParam.grade = undefined

  fnClickSearch()
}

const fnClickRow = (event, param) => {
  if (userStore.getters.getLoginData.division === '관리자') {
    clickedRowData.value = param
    console.log(clickedRowData.value)
    nextTick(() => {
      window.open('/manage/attendance?studentId=' + param.studentId)
    })
  } else {
    alert('권한이 없습니다.')
  }
}

watchEffect(() => {
  if (searchParam.studentId) {
    searchParam.studentId = searchParam.studentId.replace(/[^0-9]/g, '')
  }
  if (searchParam.grade) {
    searchParam.grade = searchParam.grade.replace(/[^0-9]/g, '')
  }
})

onMounted(() => {
  if (userStore.getters.getLoginData.division === '관리자') {
    fnClickSearch()
  } else {
    alert('권한이 없습니다.')
  }
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
                    class="q-ml-sm q-mr-lg"
                    v-model="searchParam.studentName"
                    filled
                    use-input
                    dense
                    outlined
                    style="width: 200px;"
                  />

                  <span class="title flex items-center q-ml-sm">
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

                  <span class="title flex items-center q-ml-sm">
                    학년
                  </span>
                  <q-input
                    class="q-ml-sm"
                    v-model="searchParam.grade"
                    filled
                    use-input
                    dense
                    outlined
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
    <div class="full-width q-ma-lg" style="max-height: 500px; overflow-y: auto;">
      <q-table
        title="검색결과"
        flat
        bordered
        :rows="studentInfoList"
        :columns="studentInfoColumns"
        @row-click="fnClickRow"
        selection="multiple"
        v-model:selected="selectedItem"
        row-key="index"
      >
        <template #top-left>
          <q-item
            style="font-size: 20px;"
            head
          >
            검색결과 : {{ studentInfoList.length }}개
          </q-item>
        </template>

        <template #top-right>
          <q-btn
            class="btn-style"
            style="background-color: #5555ec;"
            dense
            flat
            color="white"
            @click="fnDoAuth"
            label="학생인증"
          />

          <q-btn
            class="q-ml-lg btn-style"
            style="background-color: #ff8800;"
            dense
            flat
            color="white"
            @click="fnCancelAuth"
          >
            학생인증취소
          </q-btn>
        </template>
      </q-table>
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
