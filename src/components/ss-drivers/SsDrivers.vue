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
    :tableName="$t('drivers')"
    :rowActions="rowActions"
    :additionalActions="additionalActions"
    :pagination="pagination"
    @update:pagination="updatePagination"
    :rowsPerPageLabel="$t('driversPerPage')"
    :rowsPerPageOptions="[10, 20, 0]"
  />
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import SsTable from '../ss-table/SsTable.vue'
import { useDriverService } from 'src/services/drivers/useDriverService'
import { useVehicleService } from 'src/services/vehicles/useVehicleService'
import { Dialog, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import SsPopUpForm from '../ss-popUpForm/SsPopUpForm.vue'
import SsConfirmDialog from '../ss-confirmDialog/SsConfirmDialog.vue'

// --------------------------------
// 1. Initialization of dependencies
// --------------------------------
const { t } = useI18n()
const $q = useQuasar()
const driverService = useDriverService()
const vehicleService = useVehicleService()

// --------------------------------
// 2. Reactive state and variables
// --------------------------------
const rows = ref([])
const loading = ref(false)
const vehicles = ref([])
const loadingVehicles = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: null,
})

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  identification: '',
})

// --------------------------------
// 3. Table configuration
// --------------------------------
const columns = [
  { name: 'identification', label: t('identification'), field: 'identification', align: 'left' },
  { name: 'name', label: t('name'), field: 'name', sortable: true, align: 'left' },
  { name: 'email', label: t('email'), field: 'email', sortable: true, align: 'left' },
  { name: 'phone', label: t('phone'), field: 'phone', align: 'left' },
  {
    name: 'brand',
    label: t('brand'),
    field: (row) => (row.vehicle ? row.vehicle.brand : t('noVehicle')),
    align: 'left',
  },
  {
    name: 'model',
    label: t('model'),
    field: (row) => (row.vehicle ? row.vehicle.model : t('noVehicle')),
    align: 'left',
  },
  {
    name: 'plate',
    label: t('plate'),
    field: (row) => (row.vehicle ? row.vehicle.plate : t('noVehicle')),
    align: 'left',
  },
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
const fetchDrivers = async () => {
  loading.value = true
  try {
    const response = await driverService.getDrivers({
      page: pagination.value.page,
      pageSize: pagination.value.rowsPerPage,
    })

    rows.value = response.data.data.data
    pagination.value.rowsNumber = response.data.data.totalItems
  } catch (error) {
    console.error(t('errorLoadingDrivers'), error)
    $q.notify({ type: 'negative', message: t('errorLoadingDrivers') + ': ' + error })
  } finally {
    loading.value = false
  }
}

const fetchVehicles = async () => {
  if (vehicles.value.length > 0) return
  loadingVehicles.value = true
  try {
    const response = await vehicleService.getVehicles()
    vehicles.value = response.data.data.data.map((vehicle) => ({
      label: vehicle.license_plate,
      value: vehicle.id,
    }))
  } catch (error) {
    console.error(t('errorLoadingVehicles'), error)
    $q.notify({ type: 'negative', message: t('errorLoadingVehicles') + ': ' + error })
  }
}

const updatePagination = (newPagination) => {
  pagination.value = { ...pagination.value, ...newPagination }
}

const editDriver = async (row) => {
  if (vehicles.value.length === 0) {
    await fetchVehicles()
  }

  const initialFormData = { ...row }

  if (row.vehicle && row.vehicle.id && row.vehicle.plate) {
    initialFormData.vehicle_id = {
      label: row.vehicle.plate,
      value: row.vehicle.id,
    }
  } else {
    initialFormData.vehicle_id = null
  }

  const editInputs = inputs
    .filter((input) => input.key !== 'password')
    .map((input) => ({
      ...input,
      modelValue: ref(initialFormData[input.key]),
      ...(input.key === 'vehicle_id' ? { options: vehicles.value } : {}),
    }))

  Dialog.create({
    component: SsPopUpForm,
    componentProps: {
      popUpTitle: t('editDriver'),
      confirmText: 'edit',
      inputs: editInputs,
      onSubmit: (editedData) => submitEditedDriverData(row.id, editedData, initialFormData),
    },
  })
}

const submitEditedDriverData = async (id, editedData, initialFormData) => {
  const changes = {}
  Object.keys(editedData).forEach((key) => {
    if (key === 'vehicle_id') {
      if (editedData[key]?.value !== initialFormData[key]?.value) {
        changes[key] = editedData[key]
      }
    } else {
      if (editedData[key] !== initialFormData[key]) {
        changes[key] = editedData[key]
      }
    }
  })

  if (Object.keys(changes).length === 0) {
    $q.notify({ type: 'info', message: t('noChangesDetected') })
    return
  }

  if (changes.vehicle_id && changes.vehicle_id.value) {
    changes.vehicle_id = changes.vehicle_id.value
  }

  try {
    const response = await driverService.editDriver(id, changes)
    if (response && response.status === 200) {
      $q.notify({ type: 'positive', message: t('driverUpdated') })
      fetchDrivers()
    }
    return response
  } catch (error) {
    console.error(t('errorUpdatingDriver'), error)
    $q.notify({ type: 'negative', message: t('errorUpdatingDriver') + ': ' + error })
  }
}

//TODO: attach and detach vehicle
const toggleVehicleAssignment = async (row) => {
  if (row.vehicle) {
    Dialog.create({
      component: SsConfirmDialog,
      componentProps: {
        title: t('confirmUnassignVehicle'),
        message: t('unassignVehicleMessage', { user: row.name }),
        confirmLabel: t('unassign'),
        cancelLabel: t('cancel'),
      },
    }).onOk(async () => {
      await handleAssignVehicle(row, null)
    })
  } else {
    editDriver(row)
  }
}

const confirmDelete = (row) => {
  Dialog.create({
    component: SsConfirmDialog,
    componentProps: {
      title: `${t('confirmDeleteDriver')} ${row.name}`,
      message: t('deleteWarning'),
      confirmLabel: t('delete'),
      cancelLabel: t('cancel'),
    },
  }).onOk(() => {
    handleDelete(row)
  })
}

const handleAssignVehicle = async (row, vehicleId) => {
  try {
    await driverService.editDriver(row.id, { vehicle_id: vehicleId })
    $q.notify({
      type: 'positive',
      message: vehicleId ? t('vehicleAssigned') : t('vehicleUnassigned'),
    })
    fetchDrivers()
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: t('errorUpdatingVehicle') })
  }
}

const handleDelete = async (row) => {
  try {
    await driverService.deleteDriver(row.id)
    $q.notify({ type: 'positive', message: t('driverDeleted') })
    fetchDrivers()
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: t('errorDeletingDriver') })
  }
}

const addDriver = async () => {
  Object.keys(formData).forEach((key) => {
    formData[key] = ''
  })

  if (vehicles.value.length === 0) {
    await fetchVehicles()
  }

  const updatedInputs = inputs.map((input) => ({
    ...input,
    modelValue: ref(formData[input.key]),
    ...(input.key === 'vehicle_id' ? { options: vehicles.value } : {}),
  }))

  Dialog.create({
    component: SsPopUpForm,
    componentProps: {
      popUpTitle: t('addDriver'),
      inputs: updatedInputs,
      onSubmit: submitDriverData,
    },
  })
}

const submitDriverData = async (formData) => {
  const dataToSend = { ...formData }

  if (formData.vehicle_id?.value) {
    dataToSend.vehicle_id = formData.vehicle_id.value
  } else {
    delete dataToSend.vehicle_id
  }
  try {
    const response = await driverService.createDriver(dataToSend)
    if (response && response.status === 200) {
      $q.notify({ type: 'positive', message: t('driverCreated') })
      fetchDrivers()
    }
    return response
  } catch (error) {
    console.error(t('errorCreatingDriver'), error)
    $q.notify({ type: 'negative', message: t('errorCreatingDriver') + ': ' + error })
  }
}

// --------------------------------
// 5. Table actions
// --------------------------------

const tableActions = computed(() => [
  {
    label: t('unassignVehicles'),
    icon: 'o_no_transfer',
    action: handlePrintIndexes,
  },
  {
    label: t('assignVehicles'),
    icon: 'o_local_shipping',
    action: handlePrintIndexes,
  },
  {
    label: t('deleteDrivers'),
    icon: 'o_delete',
    action: handlePrintIndexes,
  },
])

const rowActions = [
  {
    icon: (row) => (row.vehicle ? 'o_local_shipping' : 'o_no_transfer'),
    color: 'primary',
    action: (row) => toggleVehicleAssignment(row),
    tooltip: (row) => (row.vehicle ? t('unassignVehicle') : t('assignVehicle')),
  },
  {
    icon: 'o_delete',
    color: 'primary',
    action: (row) => confirmDelete(row),
    tooltip: t('delete'),
  },
  {
    icon: 'o_edit',
    color: 'primary',
    action: (row) => editDriver(row),
    tooltip: t('edit'),
  },
]

const additionalActions = [
  {
    label: t('addDriver'),
    backgroundColor: '#50B5D7',
    icon: 'o_library_add',
    action: addDriver,
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
    label: t('name'),
    key: 'name',
    modelValue: ref(formData.name),
    required: true,
    dense: true,
    placeholder: t('writeHere'),
  },
  {
    label: t('email'),
    key: 'email',
    modelValue: ref(formData.email),
    required: true,
    dense: true,
    placeholder: t('writeHere'),
    type: 'email',
  },
  {
    label: t('phone'),
    key: 'phone',
    modelValue: ref(formData.phone),
    required: true,
    dense: true,
    type: 'number',
    placeholder: t('writeHere'),
  },
  {
    label: t('password'),
    key: 'password',
    modelValue: ref(formData.password),
    required: true,
    dense: true,
    type: 'password',
    placeholder: '··········',
  },
  {
    label: t('identification'),
    key: 'identification',
    modelValue: ref(formData.identification),
    required: true,
    dense: true,
    placeholder: t('writeHere'),
  },
  {
    label: t('vehicle'),
    key: 'vehicle_id',
    modelValue: ref(formData.vehicle_id),
    required: false,
    dense: true,
    type: 'select',
    options: vehicles,
    onPopupShow: fetchVehicles,
  },
]

// --------------------------------
// 7. Lifecycle and watchers
// --------------------------------
onMounted(() => {
  fetchDrivers()
})
watch(pagination, fetchDrivers, { deep: true })
</script>
