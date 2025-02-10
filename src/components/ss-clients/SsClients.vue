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
    :tableName="$t('clients')"
    :rowActions="rowActions"
    :additionalActions="additionalActions"
    :pagination="pagination"
    @update:pagination="updatePagination"
    :rowsPerPageLabel="$t('clientsPerPage')"
    :rowsPerPageOptions="[10, 20, 0]"
  />
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import SsTable from '../ss-table/SsTable.vue'
import { useClientService } from 'src/services/clients/useClientService'
import { Dialog, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import SsPopUpForm from '../ss-popUpForm/SsPopUpForm.vue'
import SsConfirmDialog from '../ss-confirmDialog/SsConfirmDialog.vue'

// --------------------------------
// 1. Initialization of dependencies
// --------------------------------
const { t } = useI18n()
const $q = useQuasar()
const clientService = useClientService()

// --------------------------------
// 2. Reactive state and variables
// --------------------------------
const rows = ref([])
const loading = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: null,
})

const formData = reactive({
  name: '',
  email: '',
  nit: '',
  password: '',
  contact_phone: '',
})

// --------------------------------
// 3. Table configuration
// --------------------------------
const columns = [
  { name: 'id', label: 'Id', field: 'id', align: 'left' },
  { name: 'name', label: t('name'), field: 'name', sortable: true, align: 'left' },
  { name: 'email', label: t('email'), field: 'email', sortable: true, align: 'left' },
  { name: 'contact_phone', label: t('phone'), field: 'contact_phone', align: 'left' },
  { name: 'nit', label: t('nit'), field: 'nit', align: 'left' },
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
const fetchClients = async () => {
  loading.value = true
  try {
    const response = await clientService.getClients({
      page: pagination.value.page,
      pageSize: pagination.value.rowsPerPage,
    })

    rows.value = response.data.data
    pagination.value.rowsNumber = response.data.data.totalItems
  } catch (error) {
    console.error(t('errorLoadingClients'), error)
    $q.notify({ type: 'negative', message: t('errorLoadingCClients') + ': ' + error })
  } finally {
    loading.value = false
  }
}

const updatePagination = (newPagination) => {
  pagination.value = { ...pagination.value, ...newPagination }
}

const editClient = async (row) => {
  const editInputs = inputs
    .filter((input) => input.key !== 'password')
    .map((input) => ({
      ...input,
      modelValue: ref(row[input.key]),
    }))

  Dialog.create({
    component: SsPopUpForm,
    componentProps: {
      popUpTitle: t('editClient'),
      confirmText: 'edit',
      inputs: editInputs,
      onSubmit: (editedData) => submitEditedClientData(row.id, editedData, row),
    },
  })
}

const submitEditedClientData = async (id, editedData, initialFormData) => {
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
    const response = await clientService.editClient(id, changes)
    if (response && response.status === 200) {
      $q.notify({ type: 'positive', message: t('clientUpdated') })
      fetchClients()
    }
    return response
  } catch (error) {
    console.error(t('errorUpdatingClient'), error)
    $q.notify({ type: 'negative', message: t('errorUpdatingClient') + ': ' + error })
  }
}

const confirmDelete = (row) => {
  Dialog.create({
    component: SsConfirmDialog,
    componentProps: {
      title: `${t('confirmDeleteClient')} ${row.name}`,
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
    await clientService.deleteClient(row.id)
    $q.notify({ type: 'positive', message: t('clientDeleted') })
    fetchClients()
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: t('errorDeletingClient') + ': ' + error })
  }
}

const addClient = async () => {
  Object.keys(formData).forEach((key) => {
    formData[key] = ''
  })

  const updatedInputs = inputs.map((input) => ({
    ...input,
    modelValue: ref(formData[input.key]),
  }))

  Dialog.create({
    component: SsPopUpForm,
    componentProps: {
      popUpTitle: t('addClient'),
      inputs: updatedInputs,
      onSubmit: submitClientData,
    },
  })
}

const submitClientData = async (formData) => {
  try {
    const response = await clientService.createClient(formData)
    if (response && response.status === 200) {
      $q.notify({ type: 'positive', message: t('clientCreated') })
      fetchClients()
    }
    return response
  } catch (error) {
    console.error(t('errorCreatingClient'), error)
    $q.notify({ type: 'negative', message: t('errorCreatingClient') + ': ' + error })
  }
}

// --------------------------------
// 5. Table actions
// --------------------------------

const tableActions = computed(() => [
  {
    label: t('deleteClients'),
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
    action: (row) => editClient(row),
    tooltip: t('edit'),
  },
]

const additionalActions = [
  {
    label: t('addClient'),
    backgroundColor: '#50B5D7',
    icon: 'o_library_add',
    action: addClient,
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
    label: t('nit'),
    key: 'nit',
    modelValue: ref(formData.nit),
    required: true,
    dense: true,
    placeholder: t('writeHere'),
    type: 'nit',
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
    label: t('phone'),
    key: 'contact_phone',
    modelValue: ref(formData.contact_phone),
    required: true,
    dense: true,
    type: 'number',
    placeholder: t('writeHere'),
  },
]

// --------------------------------
// 7. Lifecycle and watchers
// --------------------------------
onMounted(() => {
  fetchClients()
})
watch(pagination, fetchClients, { deep: true })
</script>
