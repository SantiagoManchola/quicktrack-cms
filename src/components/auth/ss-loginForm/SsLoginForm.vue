<template>
  <div class="login-container">
    <img class="blue-separator" src="~/assets/separator/blue-separator.svg" alt="Blue Separator" />

    <div v-if="isInactive" class="inactive-message">
      <p>
        <b>{{ $t('profileDisabled') }} </b> {{ $t('notPossibleToLogin') }}
        <b>{{ $t('contactAdminToReactivate') }}</b>
      </p>
      <button class="go-back-button" @click="goBackToLogin">{{ $t('goBack') }}</button>
    </div>

    <span v-if="!isInactive" class="welcome-message">{{ $t('welcomeMessage') }}</span>
    <div v-if="!isInactive" class="login-form">
      <SsForm
        :inputs="formInputs"
        @onSubmit="handleLogin"
        noCancel
        confirmText="login"
        :loading="isLoading"
        :disableConfirm="isLoading"
      />
      <router-link class="link" :to="{ name: 'forgotPassword' }">{{
        $t('forgotPassword')
      }}</router-link>
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
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const { t } = useI18n()
const isLoading = ref(false)
const username = ref('')
const password = ref('')
const keepSession = ref(false)
const isInactive = ref(false)
const authService = useAuthService()
const router = useRouter()
const authStore = useAuthStore()

const formInputs = [
  {
    modelValue: username,
    label: t('identifyLabel'),
    type: 'text',
    placeholder: t('identifyPlaceholder'),
    required: true,
  },
  {
    modelValue: password,
    label: t('password'),
    type: 'password',
    placeholder: '··········',
    required: true,
  },
  {
    modelValue: keepSession,
    label: t('keepSession'),
    type: 'checkbox',
  },
]

const handleLogin = async () => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const response = await authService.login({
      username: username.value,
      password: password.value,
    })

    if (response && response.status === 200) {
      const { token, expires_in } = response.data.data
      if (response.data.isInactive) {
        isInactive.value = true
      } else {
        authStore.login(token, keepSession.value, expires_in, router, $q, t)

        if (authStore.userRole) {
          router.push({ name: 'dashboard' })
        }
      }
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

const goBackToLogin = () => {
  isInactive.value = false
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  flex-direction: column;
  gap: 48px;
  align-items: center;
  justify-content: center;
  width: 450px;
  @media (max-width: 768px) {
    width: 100%;
  }
  .welcome-message {
    width: 70%;
    font-size: 24px;
    font-weight: 700;
    line-height: 32.78px;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    .link {
      font-size: 14px;
      font-weight: 300;
      line-height: 19.12px;
      text-align: center;
      text-decoration-line: underline;
      text-decoration-style: solid;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      color: #360d04;
    }
  }
  .inactive-message {
    display: flex;
    flex-direction: column;
    gap: 48px;
    align-items: center;
    justify-content: center;
    p {
      font-size: 24px;
      font-weight: 500;
      line-height: 32.78px;
      text-align: center;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
    }
    .go-back-button {
      padding: 16px 24px;
      font-size: 16px;
      font-weight: 500;
      line-height: 21.86px;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      color: white;
      background-color: #50b5d7;
      border-radius: 8px;
      display: flex;
      align-self: flex-end;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
  }
}
</style>
