import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElNotification } from 'element-plus'
import type { IQuiz, IQuizQuestion, IQuizSubmission, IQuestionAnswer } from '@/types/quiz'
import { quizService } from '@/services/quiz.service'

const showNotification = (title: string, message: string, type: 'success' | 'warning' | 'error' = 'error') => {
  ElNotification({
    title,
    message,
    type
  })
}

export const useQuizStore = defineStore('quiz', () => {
  const quiz = ref<IQuiz | undefined>(undefined)
  const currentQuestionIndex = ref(0)
  const userAnswers = ref<(number | undefined)[]>([])
  const quizCompleted = ref(false)
  const score = ref(0)
  const isLoading = ref(false)
  const isInitialLoading = ref(true)
  const validationErrors = ref<string[]>([])

  const currentQuestion = computed<IQuizQuestion | undefined>(() => {
    if (!quiz.value) return undefined
    return quiz.value.questions[currentQuestionIndex.value]
  })

  const isLastQuestion = computed(() => {
    if (!quiz.value) return false
    return currentQuestionIndex.value === quiz.value.questions.length - 1
  })

  const totalQuestions = computed(() => quiz.value?.questions.length || 0)

  const filteredAnswers = computed(() => {
    return userAnswers.value.filter((answer) => answer !== undefined) as number[]
  })

  const hasAllQuestionsAnswered = computed(() => {
    if (!quiz.value) return false
    return filteredAnswers.value.length === quiz.value.questions.length
  })

  // Helper functions
  const resetQuizState = () => {
    if (!quiz.value) return
    userAnswers.value = new Array(quiz.value.questions.length).fill(undefined)
    currentQuestionIndex.value = 0
    quizCompleted.value = false
    score.value = 0
    validationErrors.value = []
  }

  const addValidationError = (message: string): void => {
    validationErrors.value.push(message)
    showNotification('Validation Error', message)
  }

  // Actions
  async function loadQuiz () {
    isInitialLoading.value = true
    try {
      const quizzes = await quizService.getQuizzes()
      if (quizzes.length > 0) {
        quiz.value = quizzes[0]
        resetQuizState()
      }
    } catch (error) {
      console.error('Failed to load quiz:', error)
      showNotification('Error', 'Failed to load quiz. Please try again.')
    } finally {
      isInitialLoading.value = false
    }
  }

  function handleOptionSelected (index: number | null) {
    userAnswers.value[currentQuestionIndex.value] = index === null ? undefined : index
  }

  function goToNextQuestion (): boolean {
    if (userAnswers.value[currentQuestionIndex.value] === undefined) {
      return false
    }

    if (isLastQuestion.value) {
      quizCompleted.value = true
      calculateFinalScore()
    } else {
      currentQuestionIndex.value++
    }

    return true
  }

  function goToPreviousQuestion () {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--
    }
  }

  function calculateFinalScore () {
    if (!quiz.value) return

    const correctAnswers = quiz.value.questions.reduce((count, question, index) => {
      const userAnswer = userAnswers.value[index]
      return (userAnswer !== undefined && userAnswer === question.correctOptionIndex)
        ? count + 1
        : count
    }, 0)

    score.value = Math.round((correctAnswers / quiz.value.questions.length) * 100)
  }

  function restartQuiz () {
    resetQuizState()
  }

  function validateQuizSubmission (): boolean {
    validationErrors.value = []

    if (!quiz.value) {
      addValidationError('Quiz data not loaded')
      return false
    }

    if (!hasAllQuestionsAnswered.value) {
      const unansweredCount = quiz.value.questions.length - filteredAnswers.value.length
      addValidationError(`You have ${unansweredCount} unanswered question(s)`)
      return false
    }

    return true
  }

  async function submitResults (submittedPhoneNumber: string): Promise<boolean> {
    if (!validateQuizSubmission()) {
      return false
    }

    if (!submittedPhoneNumber || submittedPhoneNumber.trim() === '') {
      addValidationError('Phone number is required')
      return false
    }

    isLoading.value = true

    try {
      if (!quiz.value) {
        throw new Error('Quiz not loaded')
      }

      const answers: IQuestionAnswer[] = quiz.value.questions
        .map((question, index) => {
          const answer = userAnswers.value[index]
          return answer !== undefined ? {
            questionId: question.id,
            answer
          } : null
        })
        .filter((item): item is IQuestionAnswer => item !== null)

      const submission: IQuizSubmission = {
        quizId: quiz.value.id,
        phoneNumber: submittedPhoneNumber.trim(),
        answers
      }

      const result = await quizService.submitResults(submission)
      return result.success
    } catch (error) {
      console.error('Error submitting quiz results:', error)
      showNotification('Error', 'Failed to submit quiz results. Please try again.')
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    quiz,
    currentQuestionIndex,
    userAnswers,
    quizCompleted,
    score,
    isLoading,
    isInitialLoading,
    validationErrors,

    // Getters
    currentQuestion,
    isLastQuestion,
    totalQuestions,
    filteredAnswers,
    hasAllQuestionsAnswered,

    // Actions
    loadQuiz,
    handleOptionSelected,
    goToNextQuestion,
    goToPreviousQuestion,
    calculateFinalScore,
    restartQuiz,
    validateQuizSubmission,
    submitResults
  }
})
