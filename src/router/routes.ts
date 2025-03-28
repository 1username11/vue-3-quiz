import type { RouteRecordRaw } from 'vue-router'
import { routeNames } from './route-names'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/demo-quiz'
  },
  {
    path: '/',
    redirect: '/demo-quiz'
  },
  {
    path: '/demo-quiz',
    name: routeNames.quizDemo,
    component: () => import('@/views/QuizDemo.vue')
  },
  {
    path: '/quiz-results',
    name: routeNames.quizResults,
    component: () => import('@/views/QuizResults.vue'),
    meta: {
      requiresQuizCompletion: true
    }
  },
  {
    path: '/quiz-confirmation',
    name: routeNames.quizConfirmation,
    component: () => import('@/views/QuizConfirmation.vue'),
    meta: {
      requiresQuizCompletion: true
    }
  }
]

export {
  routes
}
