<template>
  <q-form @submit.prevent="handleSubmit">
    <div v-for="(input, index) in inputs" :key="index" class="form-field">
      <SsInput v-bind="input" />
    </div>
    <div class="form-actions">
      <q-btn
        v-for="(action, index) in actions"
        :key="index"
        :label="action.label"
        :color="action.color"
        @click="action.handler"
        class="q-mt-md"
        :flat="action.flat"
      />
    </div>
  </q-form>
</template>

<script setup>
import { QForm, QBtn } from 'quasar'
import SsInput from '../ss-Input/SsInput.vue'

const props = defineProps({
  inputs: Array,
  actions: Array,
})

const handleSubmit = () => {
  console.log('Formulario enviado', props.inputs)
}
</script>
