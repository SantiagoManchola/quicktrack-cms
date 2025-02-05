<template>
  <div class="input-wrapper">
    <label v-if="type !== 'checkbox'" class="input-label">{{ label }}</label>

    <q-select
      v-if="type === 'select'"
      v-model="internalValue"
      :options="options"
      :dense="dense"
      :clearable="clearable"
      :rules="computedRules"
      outlined
      :options-dense="denseOpts"
      class="form-input"
      dropdown-icon="keyboard_arrow_down"
      :label="t('select')"
    />

    <q-input
      v-if="type !== 'checkbox' && type !== 'select'"
      v-model="internalValue"
      :type="computedType"
      :placeholder="placeholder"
      :dense="dense"
      :clearable="clearable"
      :rules="computedRules"
      outlined
      class="form-input"
      :autocomplete="computedAutocomplete"
    >
      <template v-slot:append>
        <q-icon
          v-if="type === 'password'"
          :name="isPwd ? 'o_visibility_off' : 'o_visibility'"
          class="cursor-pointer"
          @click="togglePwdVisibility"
          color="primary"
        />
      </template>
    </q-input>
    <div v-if="type === 'checkbox'" class="checkbox-wrapper">
      <q-checkbox v-model="internalValue" :label="label" :rules="computedRules" />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, watch, computed } from 'vue'

const { t } = useI18n()

const props = defineProps({
  modelValue: [String, Number, Boolean, Array],
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  dense: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  required: Boolean,
  options: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)
const isPwd = ref(props.type === 'password')

const togglePwdVisibility = () => {
  isPwd.value = !isPwd.value
}

const computedType = computed(() => {
  if (props.type === 'password') {
    return isPwd.value ? 'password' : 'text'
  }
  return props.type === 'number' ? 'number' : props.type
})

const computedRules = computed(() => {
  const rules = []

  if (props.required) {
    rules.push((val) => !!val || t('requiredField'))
  }

  switch (props.type) {
    case 'email':
      rules.push((val) => /.+@.+\..+/.test(val) || t('invalidEmail'))
      break
    case 'number':
      rules.push((val) => !isNaN(Number(val)) || t('invalidNumber'))
      break
    case 'nit':
      rules.push((val) => /^[0-9]{7,10}(-[0-9]{1})?$/.test(val) || t('invalidNIT'))
      break
    case 'password':
      rules.push((val) => (val && val.length >= 6) || t('passwordTooShort'))
      break
    default:
      break
  }
  return rules
})

const computedAutocomplete = computed(() => {
  return props.type === 'password' ? 'current-password' : undefined
})

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue
  },
)

watch(
  () => internalValue.value,
  (newValue) => {
    emit('update:modelValue', newValue)
  },
)
</script>

<style lang="scss" scoped>
.input-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  .input-label {
    font-size: 18px;
    font-weight: 700;
    line-height: 24.59px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }
  .input-field {
    width: 100%;
  }
  .checkbox-wrapper {
    font-size: 18px;
    font-weight: 300;
    line-height: 24.59px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }
}
</style>
