<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :style="{ backgroundColor: '#701E0C' }">
      <q-toolbar class="q-pa-md">
        <q-btn size="lg" flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title :style="{ padding: '0 18px' }"> {{ $t('superAdmin') }} </q-toolbar-title>

        <q-avatar style="cursor: pointer; background-color: #d9d9d9">
          <!-- <img src="htts://cdn.quasar.dev/img/avatar.png" /> -->
          <q-menu>
            <q-list class="q-pa-md" style="min-width: 200px">
              <q-btn
                :label="$t('logout')"
                icon="logout"
                noCaps
                class="full-width"
                @click="closeSession"
              />
            </q-list>
          </q-menu>
        </q-avatar>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above class="bg-aside">
      <SsAside />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import SsAside from '../components/ss-aside/SsAside.vue'

const leftDrawerOpen = ref(false)

const authStore = useAuthStore()
const router = useRouter()

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const closeSession = () => {
  authStore.logout(router, null)
  router.push({ name: 'login' })
}
</script>
