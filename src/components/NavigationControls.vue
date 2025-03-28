<template>
  <div class="navigation-controls">
    <el-button
      type="info"
      class="navigation-controls__back-button app-button"
      @click="$emit('back')"
    >
      Back
    </el-button>

    <div class="font-medium navigation-controls__question-counter">
      {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
    </div>

    <el-button
      type="primary"
      class="navigation-controls__next-button app-button"
      @click="$emit('next')"
    >
      {{ isLastQuestion ? 'See Results' : 'Next' }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, withDefaults } from 'vue'

interface IProps {
  currentQuestionIndex: number
  totalQuestions: number
  isLastQuestion?: boolean
}

withDefaults(defineProps<IProps>(), {
  isLastQuestion: false
})

defineEmits<{
  back: []
  next: []
}>()
</script>

<style lang="scss" scoped>
@use '../assets/styles/components/navigation-controls.scss';
</style>
