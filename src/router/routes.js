const routes = [
  {
    path: '/main',
    name: 'Main',
    component: () => import('layouts/MainLayout.vue')
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('pages/IndexPage.vue'),
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('layouts/common/ProfessorLogin.vue'),
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
    component: () => import('layouts/ScheduleManage.vue')
  },
  {
    path: '/manage/attendance',
    name: 'ManageAttendance',
    component: () => import('layouts/AttendanceManage.vue'),
    props: true
  }

  // Always leave this as last one,
  // but you can also remove it
  // {
  //   path: '/:catchAll(.*)*',
  //   component: () => import('pages/ErrorNotFound.vue')
  // }
]

export default routes
