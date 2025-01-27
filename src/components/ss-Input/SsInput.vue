<template>
  <div class="input-wrapper">
    <label class="input-label">{{ label }}</label>
    <q-input
      v-model="internalValue"
      :type="computedType"
      :placeholder="placeholder"
      :dense="dense"
      :clearable="clearable"
      :rules="computedRules"
      outlined
      class="form-input"
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
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
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
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)
const isPwd = ref(props.type === 'password')

const togglePwdVisibility = () => {
  isPwd.value = !isPwd.value
}

const computedType = computed(() => {
  return isPwd.value ? 'password' : 'text'
})

const computedRules = computed(() => {
  const rules = []
  switch (props.type) {
    case 'text':
      rules.push((val) => !!val || 'Completa este campo')
      break
    case 'email':
      rules.push(
        (val) => !!val || 'Este campo es requerido',
        (val) => /.+@.+\..+/.test(val) || 'Debe ser un correo válido',
      )
      break
    case 'number':
      rules.push(
        (val) => !!val || 'Este campo es requerido',
        (val) => !isNaN(Number(val)) || 'Debe ser un número válido',
      )
      break
    case 'password':
      rules.push((val) => !!val || 'Completa este campo')
      break
    // Agrega más casos según sea necesario
    default:
      break
  }
  return rules
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
  margin-bottom: 16px;
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
}
</style>
