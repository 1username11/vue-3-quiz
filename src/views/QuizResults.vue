<template>
  <div class="quiz-results-view">
    <div class="quiz-results-view__container">
      <PhoneForm @back="handleBack" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/store/quiz.store'

import { routeNames } from '@/router/route-names'

const router = useRouter()
const quizStore = useQuizStore()

const handleBack = () => {
  quizStore.quizCompleted = false
  quizStore.currentQuestionIndex = quizStore.totalQuestions - 1
  router.push({ name: routeNames.quizDemo })
}
</script>

<style lang="scss" scoped>
@use '../assets/styles/layout/quiz-layout.scss';

.quiz-results-view {
  @include quiz-layout.quiz-layout;
}
</style>
