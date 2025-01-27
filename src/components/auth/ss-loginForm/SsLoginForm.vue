<template>
  <SsForm :inputs="formInputs" :actions="formActions" />
</template>

<script setup>
import SsForm from 'src/components/ss-form/SsForm.vue'

const formInputs = [
  {
    modelValue: '',
    label: 'Identificate',
    type: 'text',
    placeholder: 'Correo, usuario o cédula',
  },
  {
    modelValue: '',
    label: 'Contraseña',
    type: 'password',
    placeholder: '',
  },
]

const formActions = [
  {
    label: 'Enviar',
    color: 'primary',
    handler: () => {
      console.log('Formulario enviado')
    },
    flat: false,
  },
  {
    label: 'Cancelar',
    color: 'secondary',
    handler: () => {
      console.log('Formulario cancelado')
    },
    flat: true,
  },
]
</script>
