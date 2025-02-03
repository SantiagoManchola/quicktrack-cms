<template>
  <q-form @submit.prevent="validateForm">
    <div v-for="(input, index) in inputs" :key="index">
      <SsInput v-bind="input" />
    </div>
    <div :class="['form-actions', actionsClass]">
      <q-btn
        v-for="(action, index) in actions"
        :key="index"
        :label="action.label"
        :color="action.color"
        @click="action.handler"
        class="q-mt-md"
        :class="action.class"
        :flat="action.flat"
        :disabled="action.disable?.value"
        :loading="action.loading?.value"
        :type="action.type"
      />
      <q-btn
        v-if="!noCancel"
        :label="$t('cancel')"
        color="white"
        flat
        @click="emit('onCancel')"
        class="q-mt-md"
        :class="confirmText === 'next' ? ['sm', 'justify-end'] : ''"
        style="background: #a83d1a"
        :disabled="loading"
      />
      <q-btn
        :label="$t(confirmText ? confirmText : 'add')"
        class="q-mt-md"
        color="white"
        flat
        type="submit"
        :class="confirmButtonClass"
        style="background: #50b5d7"
        :disabled="loading || disableConfirm"
        :loading="loading"
      />
    </div>
  </q-form>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import SsInput from '../ss-Input/SsInput.vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const $q = useQuasar()

const props = defineProps({
  inputs: Array,
  actions: Array,
  actionsClass: String,
  noCancel: Boolean,
  confirmText: String,
  confirmButtonClass: String,
  loading: Boolean,
  disableConfirm: Boolean,
  onSubmit: {
    type: Function,
    required: true,
  },
  isPasswordResetFlow: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['onSubmit', 'onCancel'])

const formValid = ref(false)

const validateForm = () => {
  formValid.value = true
  props.inputs.forEach((input) => {
    if (input.required && !input.modelValue) {
      console.log('input is required', input)
      formValid.value = false
    }
  })

  if (props.isPasswordResetFlow) {
    const passwordInput = props.inputs.find((input) => input.label === t('password'))
    const confirmPasswordInput = props.inputs.find((input) => input.label === t('confirmPassword'))

    if (
      passwordInput &&
      confirmPasswordInput &&
      passwordInput.modelValue?.value !== confirmPasswordInput.modelValue?.value
    ) {
      formValid.value = false
      $q.notify({
        type: 'negative',
        message: t('passwordsDoNotMatch'),
        position: 'top',
        timeout: 5000,
      })
    }
  }

  if (formValid.value) {
    submitForm()
  }
}

const submitForm = () => {
  const formData = props.inputs.reduce((acc, input) => {
    acc[input.key] = input.modelValue.value
    return acc
  }, {})

  emit('onSubmit', formData)
}
</script>

<style lang="scss">
.q-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
  .form-actions {
    display: flex;
    gap: 24px;
    &.ss-flex-end {
      justify-content: flex-end;
    }
    &.ss-sm {
      button {
        width: fit-content;
        padding: 8px 16px;
      }
    }
    &.ss-sm-btn {
      button {
        width: 30%;
      }
    }
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
    }
  }
}
</style>
