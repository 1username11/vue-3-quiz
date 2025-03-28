<template>
  <div class="quiz-confirmation-view">
    <div class="quiz-confirmation-view__container">
      <SuccessMessage />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SuccessMessage from '../components/SuccessMessage.vue'
</script>

<style lang="scss" scoped>
@use '../assets/styles/layout/quiz-layout.scss';

.quiz-confirmation-view {
  @include quiz-layout.quiz-layout;
}
</style>
