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
    :sortableColumns="sortableColumns"
    :selectable="true"
    :showUpload="true"
    :showDownload="true"
    :tableActions="tableActions"
    :tableName="$t('vehicles')"
    :rowActions="rowActions"
    :additionalActions="additionalActions"
    :pagination="pagination"
    @update:pagination="updatePagination"
    :rowsPerPageLabel="$t('vehiclesPerPage')"
    :rowsPerPageOptions="[10, 20, 0]"
  />
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import SsTable from '../ss-table/SsTable.vue'
import { useVehicleService } from 'src/services/vehicles/useVehicleService'
import { useVehicleTypeService } from 'src/services/vehicleTypes/useVehicleTypeService'
import { Dialog, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import SsPopUpForm from '../ss-popUpForm/SsPopUpForm.vue'
import SsConfirmDialog from '../ss-confirmDialog/SsConfirmDialog.vue'

// --------------------------------
// 1. Initialization of dependencies
// --------------------------------
const { t } = useI18n()
const $q = useQuasar()
const vehicleService = useVehicleService()
const vehicleTypeService = useVehicleTypeService()

// --------------------------------
// 2. Reactive state and variables
// --------------------------------
const rows = ref([])
const loading = ref(false)
const vehiclesTypes = ref([])
const loadingVehicleTypes = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: null,
})

const formData = reactive({
  make: '',
  model: '',
  license_plate: '',
  vin: '',
  load_capacity: '',
  vehicle_type_id: '',
})

// --------------------------------
// 3. Table configuration
// --------------------------------
const columns = [
  { name: 'make', label: t('brand'), field: 'make', align: 'left' },
  { name: 'model', label: t('model'), field: 'model', sortable: true, align: 'left' },
  {
    name: 'license_plate',
    label: t('plate'),
    field: 'license_plate',
    sortable: true,
    align: 'left',
  },
  { name: 'vin', label: t('vin'), field: 'vin', align: 'left' },
  { name: 'load_capacity', label: t('loadCapacity'), field: 'load_capacity', align: 'left' },
  { name: 'actions', label: t('actions'), field: 'actions', align: 'center' },
]

const sortableColumns = columns.filter((col) => col.sortable)

const filters = [
  { label: t('actives'), value: 'true' },
  { label: t('inactives'), value: 'false' },
]

// --------------------------------
// 4. Business logic
// --------------------------------
const fetchVehicles = async () => {
  loading.value = true
  try {
    const response = await vehicleService.getVehicles({
      page: pagination.value.page,
      pageSize: pagination.value.rowsPerPage,
    })

    rows.value = response.data.data.data
    pagination.value.rowsNumber = response.data.data.totalItems
  } catch (error) {
    console.error(t('errorLoadingVehicles'), error)
    $q.notify({ type: 'negative', message: t('errorLoadingVehicles') + ': ' + error })
  } finally {
    loading.value = false
  }
}

const fetchVehiclesTypes = async () => {
  if (vehiclesTypes.value.length > 0) return
  loadingVehicleTypes.value = true
  try {
    const response = await vehicleTypeService.getVehicleTypes()
    vehiclesTypes.value = response.data.data.map((vehicleType) => ({
      label: vehicleType.type,
      value: vehicleType.id,
    }))
  } catch (error) {
    console.error(t('errorLoadingVehicleTypes'), error)
    $q.notify({ type: 'negative', message: t('errorLoadingVehicleTypes') + ': ' + error })
  }
}

const updatePagination = (newPagination) => {
  pagination.value = { ...pagination.value, ...newPagination }
}

const editVehicle = async (row) => {
  if (vehiclesTypes.value.length === 0) {
    await fetchVehiclesTypes()
  }

  const initialFormData = { ...row }

  if (row.vehicle_type_id) {
    const vehicleType = vehiclesTypes.value.find((type) => type.value === row.vehicle_type_id)
    initialFormData.vehicle_type_id = vehicleType || null
  } else {
    initialFormData.vehicle_type_id = null
  }

  const editInputs = inputs.map((input) => ({
    ...input,
    modelValue: ref(initialFormData[input.key]),
    ...(input.key === 'vehicle_type_id' ? { options: vehiclesTypes.value } : {}),
  }))

  Dialog.create({
    component: SsPopUpForm,
    componentProps: {
      popUpTitle: t('editVehicle'),
      confirmText: 'edit',
      inputs: editInputs,
      onSubmit: (editedData) => submitEditedVehicleData(row.id, editedData, initialFormData),
    },
  })
}

const submitEditedVehicleData = async (id, editedData, initialFormData) => {
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
    const response = await vehicleService.editVehicle(id, changes)
    if (response && response.status === 200) {
      $q.notify({ type: 'positive', message: t('vehicleUpdated') })
      fetchVehicles()
    }
    return response
  } catch (error) {
    console.error(t('errorUpdatingVehicle'), error)
    $q.notify({ type: 'negative', message: t('errorUpdatingVehicle') + ': ' + error })
  }
}

const confirmDelete = (row) => {
  Dialog.create({
    component: SsConfirmDialog,
    componentProps: {
      title: `${t('confirmDeleteVehicle')} ${row.license_plate}`,
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
    await vehicleService.deleteVehicle(row.id)
    $q.notify({ type: 'positive', message: t('vehicleDeleted') })
    fetchVehicles()
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: t('errorDeletingVehicle') + ': ' + error })
  }
}

const addVehicle = async () => {
  Object.keys(formData).forEach((key) => {
    formData[key] = ''
  })

  if (vehiclesTypes.value.length === 0) {
    await fetchVehiclesTypes()
  }

  const updatedInputs = inputs.map((input) => ({
    ...input,
    modelValue: ref(formData[input.key]),
    ...(input.key === 'vehicle_type_id' ? { options: vehiclesTypes.value } : {}),
  }))

  Dialog.create({
    component: SsPopUpForm,
    componentProps: {
      popUpTitle: t('addVehicle'),
      inputs: updatedInputs,
      onSubmit: submitVehicleData,
    },
  })
}

const submitVehicleData = async (formData) => {
  const dataToSend = { ...formData, vehicle_type_id: formData.vehicle_type_id.value }
  try {
    const response = await vehicleService.createVehicle(dataToSend)
    if (response && response.status === 200) {
      $q.notify({ type: 'positive', message: t('vehicleCreated') })
      fetchVehicles()
    }
    return response
  } catch (error) {
    console.error(t('errorCreatingVehicle'), error)
    $q.notify({ type: 'negative', message: t('errorCreatingVehicle') + ': ' + error })
  }
}

// --------------------------------
// 5. Table actions
// --------------------------------

const tableActions = computed(() => [
  {
    label: t('deleteVehicles'),
    icon: 'o_delete',
    action: handlePrintIndexes,
  },
])

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
    action: (row) => editVehicle(row),
    tooltip: t('edit'),
  },
]

const additionalActions = [
  {
    label: t('addVehicle'),
    backgroundColor: '#50B5D7',
    icon: 'o_library_add',
    action: addVehicle,
  },
]

const handlePrintIndexes = (selectedRows) => {
  selectedRows.forEach((row) => {
    console.log(`Índice: ${row.id}, Empresa: ${row.name}`)
  })
}

// --------------------------------
// 6. Form inputs configuration
// --------------------------------

const inputs = [
  {
    label: t('brand'),
    key: 'make',
    modelValue: ref(formData.make),
    required: true,
    dense: true,
    placeholder: t('writeHere'),
  },
  {
    label: t('model'),
    key: 'model',
    modelValue: ref(formData.model),
    required: true,
    dense: true,
    placeholder: t('writeHere'),
    type: 'year',
  },
  {
    label: t('plate'),
    key: 'license_plate',
    modelValue: ref(formData.license_plate),
    required: true,
    dense: true,
    placeholder: t('writeHere'),
    type: 'license_plate',
  },
  {
    label: t('vin'),
    key: 'vin',
    modelValue: ref(formData.vin),
    required: true,
    dense: true,
    placeholder: t('writeHere'),
    type: 'vin',
  },
  {
    label: t('loadCapacity'),
    key: 'load_capacity',
    modelValue: ref(formData.load_capacity),
    required: true,
    dense: true,
    placeholder: t('writeHere'),
    type: 'number',
  },
  {
    label: t('vehicleType'),
    key: 'vehicle_type_id',
    modelValue: ref(formData.vehicle_type_id),
    required: true,
    dense: true,
    type: 'select',
    options: vehiclesTypes,
    onPopupShow: fetchVehiclesTypes,
  },
]

// --------------------------------
// 7. Lifecycle and watchers
// --------------------------------
onMounted(() => {
  fetchVehicles()
})
watch(pagination, fetchVehicles, { deep: true })
</script>
