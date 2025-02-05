<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card>
      <q-bar style="background-color: #a83d1a" class="text-white">
        <q-space />
        <q-btn dense flat icon="close" @click="onDialogCancel" />
      </q-bar>
      <q-card-section align="center" class="q-pa-lg container">
        <div class="title" v-html="title"></div>
        <p class="subtitle" v-if="message" v-html="message"></p>
      </q-card-section>
      <q-card-actions align="center">
        <div class="actions">
          <q-btn no-caps flat color="white" style="background: #a83d1a" @click="onDialogCancel">
            {{ cancelLabel }}
          </q-btn>
          <q-btn no-caps flat color="white" style="background: #50b5d7" @click="onDialogOK">
            {{ confirmLabel }}
          </q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { defineProps } from 'vue'
import { useDialogPluginComponent } from 'quasar'

defineProps({
  title: String,
  message: String,
  confirmLabel: String,
  cancelLabel: String,
})

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 400;
  line-height: 32.78px;
  text-align: center;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: #360d04;
  .title {
    font-weight: 700;
  }
}
.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  button {
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 18px;
    line-height: 24.59px;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }
}
</style>
