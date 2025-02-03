<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card class="q-dialog-plugin">
      <div class="popup-overlay">
        <div class="popup-content">
          <div class="header">
            <span v-if="popUpTitle">{{ popUpTitle }}</span>
            <q-btn @click="onDialogHide" color="white" flat icon="close" class="close-btn" />
          </div>
          <SsForm
            class="content"
            :inputs="props.inputs"
            actionsClass="ss-flex-end ss-sm"
            :actions="props.actions"
            @onSubmit="onOKClick"
            @onCancel="onCancelClick"
            :loading="loading"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import SsForm from '../ss-form/SsForm.vue'

const props = defineProps({
  popUpTitle: String,
  inputs: Array,
  actions: Array,
  onSubmit: Function,
})

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const loading = ref(false)

function onCancelClick() {
  if (!loading.value) {
    onDialogCancel()
  }
}

async function onOKClick(formData) {
  if (!props.onSubmit) {
    return
  }

  loading.value = true

  try {
    const response = await props.onSubmit(formData)

    if (response && response.status === 200) {
      onDialogOK()
      props.inputs.forEach((input) => (input.modelValue = ''))
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000 !important;

  .popup-content {
    width: 600px;
    border-radius: 8px;
    position: relative;
    display: flex;
    flex-direction: column;
    max-height: 95vh;
    .header {
      padding: 24px;
      background-color: #a83d1a;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 10px 10px 0 0;
      span {
        font-size: 24px;
        font-weight: 500;
        line-height: 32.78px;
        letter-spacing: 0.02em;
        text-align: left;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        color: white;
      }
    }
    .content {
      padding: 24px;
      background-color: white;
      border-radius: 0 0 10px 10px;
      overflow-y: auto;
    }
  }
}
</style>
