<template>
  <div class="phone-form">
    <h2 class="title-2">Enter Your Phone Number</h2>
    <p class="subtitle-2 phone-form__description">We'll send your quiz results to your phone.</p>

    <div class="phone-form__form-group">
      <label for="phone" class="font-semibold phone-form__label">Phone Number:</label>
      <div class="phone-form__input-container">
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
          <p v-if="phoneError" class="phone-form__error-message">{{ phoneError }}</p>
        </Transition>
      </div>
    </div>

    <div class="phone-form__form-actions">
      <el-button
        type="info"
        class="phone-form__back-button app-button"
        @click="emit('back')"
      >
        Back
      </el-button>
      <el-button type="primary" :loading="isSubmitting" @click="submitResults">Submit</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '@/store/quiz.store'
import { routeNames } from '@/router/route-names'

const router = useRouter()
const quizStore = useQuizStore()

const emit = defineEmits<{
  back: []
}>()

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
      router.push({
        name: routeNames.quizConfirmation,
        query: { phone: phoneNumber.value }
      })
    }
  } catch (error) {
    console.error('Error submitting phone number:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/styles/components/phone-form.scss';

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
