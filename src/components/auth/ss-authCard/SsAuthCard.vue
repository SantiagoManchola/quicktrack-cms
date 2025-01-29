<template>
  <q-card class="auth-card">
    <slot />
  </q-card>
</template>

<script setup></script>

<style scoped>
.auth-card {
  width: fit-content;
  height: auto;
  padding: 40px 56px;
  border-radius: 20px;
  background-color: #ffffffcc;
  backdrop-filter: blur(30px);
  box-shadow: 5px 5px 9.5px 0px #501a091f;
}
</style>
