<template>
  <div class="text-center">
    <p>Tu perfil de entidad está desactivado y no es posible iniciar sesión.</p>
    <p>Por favor, contacta al administrador para reactivar tu acceso. 🚫</p>
    <q-btn label="Iniciar sesión" color="primary" push @click="onRetry" />
  </div>
</template>

<script setup>
const onRetry = () => {
  console.log('Intentar nuevamente')
}
</script>
