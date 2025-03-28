import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElNotification } from 'element-plus'
import type { IQuiz, IQuizQuestion, IQuizSubmission, IQuestionAnswer } from '@/types/quiz'
import { quizService } from '@/services/quiz.service'

const showNotification = (title: string, message: string, type: 'success' | 'warning' | 'error' = 'error') => {
  ElNotification({
    title,
    message,
    type,
    duration: 0, // Set to 0 to make notifications persist until manually closed
    showClose: true // Ensure the close button is visible
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

  const isLastQuestion = computed<boolean>(() => {
    if (!quiz.value) return false
    return currentQuestionIndex.value === quiz.value.questions.length - 1
  })

  const totalQuestions = computed<number>(() => {
    if (!quiz.value) return 0
    return quiz.value.questions.length
  })

  const filteredAnswers = computed(() => {
    return userAnswers.value.filter((answer): answer is number => answer !== undefined)
  })

  const hasAllQuestionsAnswered = computed(() => {
    if (!quiz.value) return false
    return filteredAnswers.value.length === quiz.value.questions.length
  })

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

  const loadQuiz = async () => {
    try {
      isInitialLoading.value = true
      const quizzes = await quizService.getQuizzes()

      if (quizzes.length === 0) {
        showNotification('Error', 'No quizzes available')
        return
      }

      quiz.value = quizzes[0]
      resetQuizState()
    } catch (error) {
      console.error('Error loading quiz:', error)
      showNotification('Error', 'Failed to load quiz')
    } finally {
      isInitialLoading.value = false
    }
  }

  const handleOptionSelected = (index: number | null) => {
    userAnswers.value[currentQuestionIndex.value] = index ?? undefined
  }

  const goToNextQuestion = (): boolean => {
    if (userAnswers.value[currentQuestionIndex.value] === undefined) {
      return false
    }

    if (isLastQuestion.value) {
      calculateFinalScore()
      quizCompleted.value = true
      return true
    }

    currentQuestionIndex.value++
    return true
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--
    }
  }

  const calculateFinalScore = () => {
    if (!quiz.value) return

    let correctAnswers = 0
    quiz.value.questions.forEach((question, index) => {
      if (userAnswers.value[index] === question.correctOptionIndex) {
        correctAnswers++
      }
    })

    score.value = correctAnswers
  }

  const restartQuiz = () => {
    resetQuizState()
  }

  const validateQuizSubmission = (): boolean => {
    validationErrors.value = []

    if (!quiz.value) {
      addValidationError('No quiz loaded')
      return false
    }

    if (!hasAllQuestionsAnswered.value) {
      addValidationError('Please answer all questions before submitting')
      return false
    }

    return validationErrors.value.length === 0
  }

  const submitResults = async (submittedPhoneNumber: string): Promise<boolean> => {
    if (!validateQuizSubmission()) {
      return false
    }

    if (!quiz.value) {
      showNotification('Error', 'No quiz loaded')
      return false
    }

    try {
      isLoading.value = true

      if (!quiz.value) {
        throw new Error('Quiz is undefined')
      }

      const quizValue = quiz.value as IQuiz // Type assertion to satisfy TypeScript

      const answers: IQuestionAnswer[] = userAnswers.value.map((answer, index) => {
        if (answer === undefined) {
          throw new Error(`Answer for question ${index + 1} is undefined`)
        }

        // Using a default value of 0 if quiz or questions are undefined
        const questionId = quiz.value?.questions?.[index]?.id ?? 0

        return {
          questionId,
          answer
        }
      })

      // Using a default value of 0 if quiz is undefined
      const quizId = quiz.value?.id ?? 0

      const submission: IQuizSubmission = {
        quizId,
        phoneNumber: submittedPhoneNumber,
        answers
      }

      const result = await quizService.submitResults(submission)

      if (result.success) {
        showNotification('Success', 'Quiz results submitted successfully', 'success')
      } else {
        showNotification('Error', 'Failed to submit quiz results')
      }

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
    quiz,
    currentQuestionIndex,
    userAnswers,
    quizCompleted,
    score,
    isLoading,
    isInitialLoading,
    validationErrors,

    currentQuestion,
    isLastQuestion,
    totalQuestions,
    filteredAnswers,
    hasAllQuestionsAnswered,

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
