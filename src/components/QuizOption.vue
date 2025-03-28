<template>
  <button
    class="quiz-option"
    :class="getOptionClasses"
    :aria-pressed="isSelected"
    :aria-label="`Option ${index + 1}: ${text}`"
    type="button"
    @click="$emit('select', index)"
  >
    <span class="text-base quiz-option__text">{{ text }}</span>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface IQuizOptionProps {
  text: string
  index: number
  isSelected: boolean
}

const props = defineProps<IQuizOptionProps>()

defineEmits<{
  select: [index: number]
}>()

const getOptionClasses = computed(() => {
  const selectedClass = props.isSelected ? 'quiz-option--selected' : ''
  const colorClass = `quiz-option--color-${props.index % 3}`
  return `${selectedClass} ${colorClass}`
})
</script>

<style lang="scss" scoped>
@use '../assets/styles/components/quiz-option.scss';
</style>
