<template>
  <q-form @submit.prevent="validateForm">
    <div v-for="(input, index) in inputs" :key="index">
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
        :class="action.class"
        :flat="action.flat"
        :disabled="action.disable.value"
        :loading="action.loading.value"
        :type="action.type"
      />
    </div>
  </q-form>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import SsInput from '../ss-Input/SsInput.vue'

const props = defineProps({
  inputs: Array,
  actions: Array,
  onSubmit: {
    type: Function,
    required: true,
  },
})

const formValid = ref(false)

const validateForm = () => {
  formValid.value = true
  props.inputs.forEach((input) => {
    if (input.required && !input.modelValue) {
      formValid.value = false
    }
  })

  if (formValid.value) {
    submitForm()
  }
}

const submitForm = () => {
  const formData = props.inputs.reduce((acc, input) => {
    acc[input.label] = input.modelValue
    return acc
  }, {})
  if (props.onSubmit) {
    props.onSubmit(formData)
  }
}
</script>

<style lang="scss">
.q-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
  button {
    margin: 0;
    width: 100%;
    border-radius: 8px;
    color: white;
    font-size: 16px;
    font-weight: 500;
    line-height: 21.86px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    text-transform: none;
    padding: 16px;
    &.sm {
      width: 30%;
      @media (max-width: 768px) {
        width: 100%;
      }
    }
    &.justify-end {
      display: flex !important;
      justify-self: flex-end;
    }
  }
}
</style>
