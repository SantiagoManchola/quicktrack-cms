<template>
  <q-layout view="lHh Lpr lFf">
    <div class="container">
      <SsAuthCard>
        <router-view />
      </SsAuthCard>
    </div>
  </q-layout>
</template>

<script setup>
import SsAuthCard from 'src/components/auth/ss-authCard/SsAuthCard.vue'
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
