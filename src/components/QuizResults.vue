<template>
  <div class="quiz-results">
    <div v-if="!isSubmitted" class="quiz-results__phone-form">
      <h2 class="title-2">Enter Your Phone Number</h2>
      <p class="subtitle-2 quiz-results__description">We'll send your quiz results to your phone.</p>

      <div class="quiz-results__form-group">
        <label for="phone" class="font-semibold quiz-results__label">Phone Number:</label>
        <div class="quiz-results__input-container">
          <vue-tel-input
            v-model="phoneNumber"
            :defaultCountry="'UA'"
            :enabledCountryCode="true"
            :enabledFlags="true"
            :inputOptions="{
              id: 'phone',
              placeholder: 'Enter your phone number',
              maxlength: 25,
              required: true
            }"
            class="phone-input"
            @validate="onValidate"
            @focus="onPhoneFocus"
            @blur="onPhoneBlur"
          />
          <Transition name="error-slide">
            <p v-if="phoneError" class="quiz-results__error-message">{{ phoneError }}</p>
          </Transition>
        </div>
      </div>

      <div class="quiz-results__form-actions">
        <el-button
          type="info"
          class="quiz-results__back-button app-button"
          @click="emit('back')"
        >
          Back
        </el-button>
        <el-button type="primary" :loading="isSubmitting" @click="submitResults">Submit</el-button>
      </div>
    </div>

    <div v-else class="quiz-results__success-message">
      <el-icon class="quiz-results__success-icon"><CircleCheckFilled /></el-icon>
      <h3 class="title-3">Thank You!</h3>
      <p class="text-base quiz-results__success-text">Your quiz has been submitted successfully.</p>
      <p v-if="phoneNumber" class="text-base quiz-results__phone-number">
        Your results have been sent to: <strong>{{ phoneNumber }}</strong>
      </p>

      <div class="quiz-results__restart-container">
        <el-button
          type="info"
          class="quiz-results__back-button app-button"
          @click="emit('back')"
        >
          Back to Results
        </el-button>
        <el-button type="primary" @click="emit('restart')">Take Another Quiz</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { CircleCheckFilled } from '@element-plus/icons-vue'
import { useQuizStore } from '@/store/quiz.store'

const quizStore = useQuizStore()

const emit = defineEmits<{
  submit: [phoneNumber: string]
  restart: []
  back: []
}>()

const isSubmitted = ref(false)
const isSubmitting = ref(false)
const phoneError = ref('')
const phoneNumber = ref('')
const isValid = ref(false)
const hasBlurred = ref(false)

const onValidate = (validationResult: { valid: boolean; number: string; isValid: boolean; country: any }) => {
  isValid.value = validationResult.valid

  if (hasBlurred.value) {
    if (validationResult.valid) {
      phoneError.value = ''
    } else if (phoneNumber.value && !validationResult.valid) {
      phoneError.value = 'Please enter a valid phone number'
    }
  }
}

const onPhoneBlur = () => {
  hasBlurred.value = true

  if (phoneNumber.value && !isValid.value) {
    phoneError.value = 'Please enter a valid phone number'
  } else if (isValid.value) {
    phoneError.value = ''
  }
}

const onPhoneFocus = () => {
  phoneError.value = ''
}

const validatePhone = () => {
  hasBlurred.value = true

  if (!phoneNumber.value) {
    phoneError.value = 'Please enter your phone number'
    return false
  }

  if (!isValid.value) {
    phoneError.value = 'Please enter a valid phone number'
    return false
  }

  phoneError.value = ''
  return true
}

const submitResults = async () => {
  if (!validatePhone()) return

  isSubmitting.value = true

  try {
    const success = await quizStore.submitResults(phoneNumber.value)

    if (success) {
      isSubmitted.value = true
    }
  } catch (error) {
    console.error('Error submitting phone number:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/styles/components/quiz-results.scss';

.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.5s ease;
}

.error-slide-enter-from,
.error-slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
