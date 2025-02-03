<template>
  <q-layout view="lHh Lpr lFf">
    <div :class="['container', backgroundClass]">
      <SsAuthCard>
        <router-view />
      </SsAuthCard>
    </div>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import SsAuthCard from 'src/components/auth/ss-authCard/SsAuthCard.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const backgroundClass = computed(() => {
  return route.meta.background || ''
})
</script>

<style scoped>
.container {
  background-size: cover;
  background-position:
    center,
    top left;
  background-repeat: no-repeat, no-repeat;
  background-image: url('src/assets/backgrounds/auth.webp');
  backdrop-filter: blur(1px);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  height: 100%;
}

.reset-password-bg {
  background-image: url('src/assets/backgrounds/reset.webp');
  background-color: #f5f5f5;
}
</style>
