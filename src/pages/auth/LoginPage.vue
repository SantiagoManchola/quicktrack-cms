<template>
  <q-layout view="lHh Lpr lFf">
    <div class="container">
      <SsAuthCard>
        <transition name="fade">
          <component :is="currentView" @change-view="changeView" />
        </transition>
      </SsAuthCard>
    </div>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import SsAuthCard from 'src/components/auth/ss-authCard/SsAuthCard.vue'
import SsLoginForm from 'src/components/auth/ss-loginForm/SsLoginForm.vue'
import SsForgotPasswordForm from 'src/components/auth/ss-forgotPasswordForm/SsForgotPasswordForm.vue'
import SsAccountDisabled from 'src/components/auth/ss-accountDisabled/SsAccountDisabled.vue'

const views = {
  login: SsLoginForm,
  forgotPassword: SsForgotPasswordForm,
  accountDisabled: SsAccountDisabled,
}

const currentView = ref(views.login)

const changeView = (view) => {
  currentView.value = views[view]
}
</script>

<style scoped>
.container {
  background-size: cover;
  background-position:
    center,
    top left;
  background-repeat: no-repeat, no-repeat;
  background-image: url('src/assets/backgrounds/orange-pattern.png'),
    url('src/assets/backgrounds/auth.webp');
  backdrop-filter: blur(1px);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  height: 100%;
}
</style>
