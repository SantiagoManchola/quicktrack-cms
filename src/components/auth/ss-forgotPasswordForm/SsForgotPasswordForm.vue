<template>
  <div class="recover-password-container">
    <div class="left">
      <img class="logo" src="~/assets/brand/qt.svg" alt="QT Logo" />
      <span class="title">
        <b>{{ $t('enterYourEmail') }}</b> {{ $t('toReceiveALink') }}
      </span>
    </div>
    <img
      class="vertical-blue-separator"
      src="~/assets/separator/vertical-blue-separator.svg"
      alt="Blue Separator"
    />
    <img
      class="horizontal-blue-separator"
      src="~/assets/separator/blue-separator.svg"
      alt="Blue Separator"
    />
    <div class="right">
      <SsForm
        v-if="!isSubmitted"
        :inputs="formInputs"
        :actions="formActions"
        :onSubmit="handleRecoverPassword"
      />

      <div v-else class="confirmation-message">
        <p>{{ $t('emailSentMessage') }}</p>
        <b>{{ email }}</b>
        <router-link class="link" :to="{ name: 'login' }">{{ $t('login') }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SsForm from 'src/components/ss-form/SsForm.vue'
import { useAuthService } from 'src/services/auth/useAuthService'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const { t } = useI18n()
const email = ref('')
const isLoading = ref(false)
const isSubmitted = ref(false)
const authService = useAuthService()

const formInputs = [
  {
    modelValue: email,
    label: t('email'),
    type: 'email',
    placeholder: t('emailPlaceholder') + '@gmail.com',
    required: true,
  },
]

const formActions = [
  {
    label: t('next'),
    color: 'secondary',
    flat: false,
    disable: isLoading,
    loading: isLoading,
    type: 'submit',
    class: 'sm justify-end',
  },
]

const handleRecoverPassword = async () => {
  isLoading.value = true

  try {
    const response = await authService.recoverPassword({
      email: email.value,
    })

    if (response && response.status === 200) {
      isSubmitted.value = true
    }
  } catch (error) {
    isSubmitted.value = true
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
.recover-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 40px;
  width: 100%;
  max-width: 1000px;
  padding: 16px 0;
  @media (max-width: 768px) {
    flex-direction: column;
  }
  .left {
    display: flex;
    flex-direction: column;
    gap: 24px;
    .logo {
      max-width: 62px;
      height: auto;
      width: 100%;
    }
    .title {
      font-family: 'Nunito' !important;
      font-size: 32px;
      font-weight: 400;
      line-height: 43.65px;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
    }
  }

  .left,
  .right {
    width: 50%;
    @media (max-width: 768px) {
      width: 100%;
    }
  }
  .vertical-blue-separator {
    @media (max-width: 768px) {
      display: none;
    }
  }

  .horizontal-blue-separator {
    display: none;
    @media (max-width: 768px) {
      display: flex;
    }
  }

  .right {
    .confirmation-message {
      display: flex;
      flex-direction: column;
      gap: 24px;
      font-size: 16px;
      font-weight: 400;
      line-height: 21.86px;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      p {
        width: 80% !important;
      }
      b {
        font-size: 20px;
        font-weight: 700;
        line-height: 27.32px;
      }
      .link {
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
        width: 50%;
        display: flex;
        align-self: flex-end;
        align-items: center;
        justify-content: center;
        @media (max-width: 768px) {
          width: 100%;
        }
      }
    }
  }
}
</style>
