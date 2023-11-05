// import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/main',
    name: 'Main',
    component: () => import('layouts/MainLayout.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('layouts/common/ProfessorLogin.vue'),
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('pages/ErrorNotFound.vue')
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('pages/IndexPage.vue'),
    props: true,
    children: [
      {
        path: '/auth/student',
        name: 'AuthStudent',
        component: () => import('layouts/StudentAuth.vue'),
        props: true
      },
      {
        path: '/manage/student',
        name: 'ManageStudent',
        component: () => import('layouts/StudentManage.vue'),
        props: true
      },
      {
        path: '/manage/schedule',
        name: 'ManageSchedule',
        component: () => import('layouts/ScheduleManage.vue'),
        props: true
      },
      {
        path: '/manage/attendance',
        name: 'ManageAttendance',
        component: () => import('layouts/AttendanceManage.vue'),
        props: true
      },
      {
        path: '/total/statistics',
        name: 'TotalStatistics',
        component: () => import('layouts/TotalStatistics.vue'),
        props: true
      }
    ]
  }

  // Always leave this as last one,
  // but you can also remove it
  // {
  //   path: '/:catchAll(.*)*',
  //   component: () => import('pages/ErrorNotFound.vue')
  // }
]

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })

export default routes
