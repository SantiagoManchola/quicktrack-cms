<template>
  <q-page class="col overflow-hidden">
    <transition name="slide">
      <router-view />
    </transition>
  </q-page>
</template>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>
