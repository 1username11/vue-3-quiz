import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useQuizStore } from '@/store/quiz.store'
import { routeNames } from './route-names'

export const routeGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (to.meta.requiresQuizCompletion) {
    const quizStore = useQuizStore()

    if (!quizStore.quizCompleted) {
      return next({ name: routeNames.quizDemo })
    }
  }

  next()
}
