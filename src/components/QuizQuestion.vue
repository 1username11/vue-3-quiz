<template>
  <section class="quiz-question">
    <header class="quiz-question__header">
      <h2 class="title-2">{{ title }}</h2>
      <p class="subtitle-1">{{ question }}</p>
    </header>

    <div class="quiz-question__options">
      <QuizOption
        v-for="(option, index) in options"
        :key="`option-${index}`"
        :text="option"
        :index="index"
        :is-selected="selectedOption === index"
        @select="selectOption"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import QuizOption from './QuizOption.vue'

interface IQuizQuestionProps {
  title: string
  question: string
  options: string[]
  selectedOption?: number
}

const props = defineProps<IQuizQuestionProps>()

const emit = defineEmits<{
  optionSelected: [index: number | null]
}>()

const selectOption = (index: number): void => {
  if (props.selectedOption === index) {
    emit('optionSelected', null)
  } else {
    emit('optionSelected', index)
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/styles/components/quiz-question.scss';
</style>
