<template>
  <div v-loading.fullscreen.lock="quizStore.isLoading || quizStore.isInitialLoading" class="quiz-demo">
    <div class="quiz-demo__container">
      <div>
        <QuizQuestion
          v-if="quizStore.currentQuestion"
          :title="quizStore.currentQuestion.title"
          :question="quizStore.currentQuestion.question"
          :options="quizStore.currentQuestion.options"
          :selectedOption="quizStore.userAnswers[quizStore.currentQuestionIndex]"
          @optionSelected="quizStore.handleOptionSelected"
        />

        <NavigationControls
          :current-question-index="quizStore.currentQuestionIndex"
          :total-questions="quizStore.totalQuestions"
          :is-last-question="quizStore.isLastQuestion"
          @next="handleNext"
          @back="quizStore.goToPreviousQuestion"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import QuizQuestion from '@/components/QuizQuestion.vue'
import NavigationControls from '@/components/NavigationControls.vue'
import { useQuizStore } from '@/store/quiz.store'
import { routeNames } from '@/router/route-names'

const router = useRouter()
const quizStore = useQuizStore()

const handleNext = () => {
  if (quizStore.userAnswers[quizStore.currentQuestionIndex] === undefined) {
    ElMessage.warning('Please select an option before proceeding')
    return
  }

  quizStore.isLoading = true

  setTimeout(() => {
    const success = quizStore.goToNextQuestion()
    if (!success) {
      ElMessage.warning('Please select an option before proceeding')
    } else if (quizStore.quizCompleted) {
      router.push({ name: routeNames.quizResults })
    }
    quizStore.isLoading = false
  }, 500)
}

onMounted(async () => {
  await quizStore.loadQuiz()
})
</script>

<style lang="scss" scoped>
@use '../assets/styles/layout/quiz-layout.scss';

.quiz-demo {
  @include quiz-layout.quiz-layout;
}
</style>
