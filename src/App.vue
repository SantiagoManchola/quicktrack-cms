<template>
  <router-view />
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()

authStore.checkAuth(router, $q, t)
</script>
