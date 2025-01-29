<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <SsAside />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="sessionExpired" persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <q-avatar icon="warning" color="red" text-color="white" />
          <span class="q-ml-sm">{{ $t('Sesión Expirada') }}</span>
        </q-card-section>

        <q-card-section>
          <p>{{ $t('Tu sesión ha expirado. Serás desconectado.') }}</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('Aceptar')" color="primary" @click="handleSessionExpired" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import SsAside from '../components/ss-aside/SsAside.vue'

defineOptions({
  name: 'MainLayout',
})

const leftDrawerOpen = ref(false)
const sessionExpired = ref(false)
</script>
