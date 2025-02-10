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
      @popup-show="onPopupShow ? onPopupShow : () => {}"
    />

    <template v-else-if="type === 'date'">
      <q-input
        v-model="internalValue"
        :dense="dense"
        :clearable="clearable"
        :rules="computedRules"
        outlined
        :placeholder="placeholder"
        class="form-input"
        @click="showDatePicker = true"
      >
        <template v-slot:append>
          <q-icon
            name="event"
            class="cursor-pointer"
            color="primary"
            @click="showDatePicker = true"
          />
        </template>
      </q-input>

      <q-dialog v-model="showDatePicker">
        <q-card>
          <q-date
            v-model="internalValue"
            minimal
            mask="YYYY-MM-DD"
            @update:model-value="closeDatePicker"
          />
        </q-card>
      </q-dialog>
    </template>

    <q-input
      v-else-if="type !== 'checkbox' && type !== 'select'"
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
  onPopupShow: Function,
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)
const showDatePicker = ref(false)
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
    case 'date':
      rules.push((val) => /^\d{4}-\d{2}-\d{2}$/.test(val) || t('invalidDate'))
      break
    case 'license_plate':
      rules.push(
        (val) => /^[A-Z]{3}(-?[0-9]{3}|[0-9]{2}[A-Z])$/.test(val) || t('invalidLicensePlate'),
      )
      break
    case 'vin':
      rules.push((val) => /^[A-HJ-NPR-Z0-9]{17}$/.test(val) || t('invalidVIN'))
      break
    case 'year':
      rules.push((val) => /^[0-9]{4}$/.test(val) || t('invalidYear'))
      break
    default:
      break
  }
  return rules
})

const computedAutocomplete = computed(() => {
  return props.type === 'password' ? 'current-password' : undefined
})

const closeDatePicker = (newDate) => {
  internalValue.value = newDate
  showDatePicker.value = false
}

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue
  },
)

watch(
  () => internalValue.value,
  (newValue) => {
    if (props.type === 'license_plate' && typeof newValue === 'string') {
      internalValue.value = newValue.toUpperCase()
    }
    emit('update:modelValue', internalValue.value)
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
