<template>
  <div class="reset-container">
    <img class="blue-separator" src="~/assets/separator/blue-separator.svg" alt="Blue Separator" />

    <span class="message">{{ $t('resetPasswordMessage') }}</span>
    <div class="reset-form">
      <SsForm
        :inputs="formInputs"
        @onSubmit="handleResetPassword"
        noCancel
        confirmText="set"
        :loading="isLoading"
        :disableConfirm="isLoading"
        :isPasswordResetFlow="true"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SsForm from 'src/components/ss-form/SsForm.vue'
import { useAuthService } from 'src/services/auth/useAuthService'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const { t } = useI18n()
const isLoading = ref(false)
const password = ref('')
const confirmPassword = ref('')
const authService = useAuthService()
const router = useRouter()

const formInputs = [
  {
    modelValue: password,
    label: t('password'),
    type: 'password',
    placeholder: '··········',
    required: true,
  },
  {
    modelValue: confirmPassword,
    label: t('confirmPassword'),
    type: 'password',
    placeholder: '··········',
    required: true,
  },
]

const handleResetPassword = async () => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const response = await authService.resetPassword({
      password: confirmPassword.value,
    })

    if (response && response.status === 200) {
      $q.notify({
        type: 'positive',
        message: t('resetPasswordSuccess'),
        position: 'top',
        timeout: 5000,
      })
      router.push({ name: 'login' })
    }
  } catch (error) {
    console.error(t('errorMessage'), error)
    $q.notify({
      type: 'negative',
      message: error,
      position: 'top',
      timeout: 5000,
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.reset-container {
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-items: center;
  justify-content: center;
  width: 450px;
  @media (max-width: 768px) {
    width: 100%;
  }
  .message {
    width: 70%;
    font-size: 24px;
    font-weight: 700;
    line-height: 32.78px;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }
  .reset-form {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}
</style>
