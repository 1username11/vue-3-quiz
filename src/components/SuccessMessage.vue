<template>
  <div class="success-message">
    <el-icon class="success-message__icon"><CircleCheckFilled /></el-icon>
    <h3 class="title-3">Thank You!</h3>
    <p class="text-base success-message__text">Your quiz has been submitted successfully.</p>
    <p v-if="phoneNumber" class="text-base success-message__phone-number">
      Your results have been sent to: <strong>{{ phoneNumber }}</strong>
    </p>

    <div class="success-message__action-container">
      <el-button
        type="info"
        class="success-message__back-button app-button"
        @click="goBack"
      >
        Back to Results
      </el-button>
      <el-button type="primary" @click="restart">Take Another Quiz</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CircleCheckFilled } from '@element-plus/icons-vue'
import { useQuizStore } from '@/store/quiz.store'
import { routeNames } from '@/router/route-names'

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()

const phoneNumber = ref('')

onMounted(() => {
  if (route.query.phone) {
    phoneNumber.value = route.query.phone as string
  }
})

const goBack = () => {
  router.push({ name: routeNames.quizResults })
}

const restart = () => {
  quizStore.restartQuiz()
  router.push({ name: routeNames.quizDemo })
}
</script>

<style lang="scss" scoped>
@use '../assets/styles/components/success-message.scss';
</style>
