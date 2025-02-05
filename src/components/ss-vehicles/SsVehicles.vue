<template>
  <div
    v-if="loading"
    style="min-height: 100vh; display: flex; justify-content: center; align-items: center"
  >
    <q-spinner color="primary" size="3em" :thickness="2" />
  </div>
  <SsTable
    v-else
    :rows="rows"
    :columns="columns"
    :loading="loading"
    :filters="filters"
    :showUpload="true"
    :showDownload="true"
    :tableName="$t('vehicleTypes')"
    :rowActions="rowActions"
    :additionalActions="additionalActions"
    :pagination="pagination"
    :rowsPerPageLabel="$t('vehicleTypesPerPage')"
    :rowsPerPageOptions="[0]"
  />
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import SsTable from '../ss-table/SsTable.vue'
import { useVehicleTypeService } from 'src/services/vehicleType/useVehicleTypeService'
import { Dialog, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import SsPopUpForm from '../ss-popUpForm/SsPopUpForm.vue'
import SsConfirmDialog from '../ss-confirmDialog/SsConfirmDialog.vue'

// --------------------------------
// 1. Initialization of dependencies
// --------------------------------
const { t } = useI18n()
const $q = useQuasar()
const vehicleService = useVehicleTypeService()

// --------------------------------
// 2. Reactive state and variables
// --------------------------------
const rows = ref([])
const loading = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 0,
})

const formData = reactive({
  type: '',
})

// --------------------------------
// 3. Table configuration
// --------------------------------
const columns = [
  { name: 'type', label: t('type'), field: 'type', align: 'left' },
  { name: 'actions', label: t('actions'), field: 'actions', align: 'center' },
]

// --------------------------------
// 4. Business logic
// --------------------------------
const fetchVehicleTypes = async () => {
  loading.value = true
  try {
    const response = await vehicleService.getVehicleTypes()
    rows.value = response.data.data
  } catch (error) {
    console.error(t('errorLoadingVehicleTypes'), error)
    $q.notify({ type: 'negative', message: t('errorLoadingVehicleTypes') + ': ' + error })
  } finally {
    loading.value = false
  }
}

const editVehicleType = (row) => {
  const initialFormData = { ...row }
  const editInputs = inputs.map((input) => ({
    ...input,
    modelValue: ref(initialFormData[input.key]),
  }))

  Dialog.create({
    component: SsPopUpForm,
    componentProps: {
      popUpTitle: t('editVehicleType'),
      confirmText: 'edit',
      inputs: editInputs,
      onSubmit: (editedData) => submitEditedVehicleTypeData(row.id, editedData, initialFormData),
    },
  })
}

const submitEditedVehicleTypeData = async (id, editedData, initialFormData) => {
  const changes = {}
  Object.keys(editedData).forEach((key) => {
    if (editedData[key] !== initialFormData[key]) {
      changes[key] = editedData[key]
    }
  })

  if (Object.keys(changes).length === 0) {
    $q.notify({ type: 'info', message: t('noChangesDetected') })
    return
  }

  try {
    const response = await vehicleService.editVehicleType(id, changes)
    if (response && response.status === 200) {
      $q.notify({ type: 'positive', message: t('vehicleTypeUpdated') })
      fetchVehicleTypes()
    }
    return response
  } catch (error) {
    console.error(t('errorUpdatingVehicleType'), error)
    $q.notify({ type: 'negative', message: t('errorUpdatingVehicleType') + ': ' + error })
  }
}

const confirmDelete = (row) => {
  Dialog.create({
    component: SsConfirmDialog,
    componentProps: {
      title: `${t('confirmDeleteVehicleType')} ${row.type}`,
      message: t('deleteWarning'),
      confirmLabel: t('delete'),
      cancelLabel: t('cancel'),
    },
  }).onOk(() => {
    handleDelete(row)
  })
}

const handleDelete = async (row) => {
  try {
    await vehicleService.deleteVehicleType(row.id)
    $q.notify({ type: 'positive', message: t('vehicleTypeDeleted') })
    fetchVehicleTypes()
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: t('errorDeletingVehicleType') })
  }
}

const addVehicleType = () => {
  Object.keys(formData).forEach((key) => {
    formData[key] = ''
  })

  Dialog.create({
    component: SsPopUpForm,
    componentProps: {
      popUpTitle: t('addVehicleType'),
      inputs: inputs,
      onSubmit: submitVehicleTypeData,
    },
  })
}

const submitVehicleTypeData = async (formData) => {
  try {
    const response = await vehicleService.createVehicleType(formData)
    if (response && response.status === 200) {
      $q.notify({ type: 'positive', message: t('vehicleTypeCreated') })
      fetchVehicleTypes()
    }
    return response
  } catch (error) {
    console.error(t('errorCreatingVehicleType'), error)
    $q.notify({ type: 'negative', message: t('errorCreatingVehicleType') + ': ' + error })
  }
}

// --------------------------------
// 5. Table actions
// --------------------------------

const rowActions = [
  {
    icon: 'o_delete',
    color: 'primary',
    action: (row) => confirmDelete(row),
    tooltip: t('delete'),
  },
  {
    icon: 'o_edit',
    color: 'primary',
    action: (row) => editVehicleType(row),
    tooltip: t('edit'),
  },
]

const additionalActions = [
  {
    label: t('addVehicleType'),
    backgroundColor: '#50B5D7',
    icon: 'o_library_add',
    action: addVehicleType,
  },
]

// --------------------------------
// 6. Form inputs configuration
// --------------------------------

const inputs = [
  {
    label: t('type'),
    key: 'type',
    modelValue: ref(formData.number_licenses),
    required: true,
    dense: true,
    placeholder: t('writeHere'),
  },
]

// --------------------------------
// 7. Lifecycle and watchers
// --------------------------------
onMounted(fetchVehicleTypes)
watch(pagination, fetchVehicleTypes, { deep: true })
</script>
