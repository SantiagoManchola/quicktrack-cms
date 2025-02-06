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
    :tableName="$t('companies')"
    :rowActions="rowActions"
    :additionalActions="additionalActions"
    :pagination="pagination"
    @update:pagination="updatePagination"
    :rowsPerPageLabel="$t('companiesPerPage')"
    :rowsPerPageOptions="[10, 20, 0]"
  />
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import SsTable from '../ss-table/SsTable.vue'
import { useCompanyService } from 'src/services/company/useCompanyService'
import { usePlansService } from 'src/services/plans/usePlansService'
import { Dialog, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import SsPopUpForm from '../ss-popUpForm/SsPopUpForm.vue'
import SsConfirmDialog from '../ss-confirmDialog/SsConfirmDialog.vue'

// --------------------------------
// 1. Initialization of dependencies
// --------------------------------
const { t } = useI18n()
const $q = useQuasar()
const companyService = useCompanyService()
const plansService = usePlansService()

// --------------------------------
// 2. Reactive state and variables
// --------------------------------
const rows = ref([])
const loading = ref(false)
const plans = ref([])
const loadingPlans = ref(false)

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
  nit: '',
  number_licenses: '',
  plan_id: '',
})

// --------------------------------
// 3. Table configuration
// --------------------------------
const columns = [
  { name: 'id', label: 'Id', field: 'id', align: 'left' },
  { name: 'name', label: t('name'), field: 'name', sortable: true, align: 'left' },
  { name: 'email', label: t('email'), field: 'email', sortable: true, align: 'left' },
  { name: 'nit', label: t('nit'), field: 'nit', align: 'left' },
  { name: 'numberLicenses', label: t('licensesNumber'), field: 'numberLicenses', align: 'left' },
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
const fetchCompanies = async () => {
  loading.value = true
  try {
    const response = await companyService.getCompanies({
      page: pagination.value.page,
      pageSize: pagination.value.rowsPerPage,
    })

    rows.value = response.data.data.data
    pagination.value.rowsNumber = response.data.data.totalItems
  } catch (error) {
    console.error(t('errorLoadingCompanies'), error)
    $q.notify({ type: 'negative', message: t('errorLoadingCompanies') + ': ' + error })
  } finally {
    loading.value = false
  }
}

const fetchPlans = async () => {
  if (plans.value.length > 0) return
  loadingPlans.value = true
  try {
    const response = await plansService.getPlans()
    plans.value = response.data.data.data.map((plan) => ({
      label: plan.name,
      value: plan.id,
    }))
  } catch (error) {
    console.error(t('errorLoadingPlans'), error)
    $q.notify({ type: 'negative', message: t('errorLoadingPlans') + ': ' + error })
  }
}

const updatePagination = (newPagination) => {
  pagination.value = { ...pagination.value, ...newPagination }
}

const editCompany = async (row) => {
  if (plans.value.length === 0) {
    await fetchPlans()
  }

  const initialFormData = { ...row }

  if (row.plan && row.plan.id && row.plan.name) {
    initialFormData.plan_id = {
      label: row.plan.name,
      value: row.plan.id,
    }
  } else {
    initialFormData.plan_id = null
  }

  const editInputs = inputs
    .filter((input) => input.key !== 'phone' && input.key !== 'password')
    .map((input) => ({
      ...input,
      modelValue: ref(initialFormData[input.key]),
      ...(input.key === 'plan_id' ? { options: plans.value } : {}),
    }))

  Dialog.create({
    component: SsPopUpForm,
    componentProps: {
      popUpTitle: t('editCompany'),
      confirmText: 'edit',
      inputs: editInputs,
      onSubmit: (editedData) => submitEditedCompanyData(row.id, editedData, initialFormData),
    },
  })
}

const submitEditedCompanyData = async (id, editedData, initialFormData) => {
  const changes = {}
  Object.keys(editedData).forEach((key) => {
    if (key === 'plan_id') {
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

  if (changes.plan_id && changes.plan_id.value) {
    changes.plan_id = changes.plan_id.value
  }

  try {
    const response = await companyService.editCompany(id, changes)
    if (response && response.status === 200) {
      $q.notify({ type: 'positive', message: t('companyUpdated') })
      fetchCompanies()
    }
    return response
  } catch (error) {
    console.error(t('errorUpdatingCompany'), error)
    $q.notify({ type: 'negative', message: t('errorUpdatingCompany') + ': ' + error })
  }
}

const toggleUserStatus = (row) => {
  Dialog.create({
    component: SsConfirmDialog,
    componentProps: {
      title: row.active
        ? `${t('confirmDeactivateCompany')} ${row.name}`
        : t('confirmActivateCompany', { user: row.name }),
      message: row.active ? t('deactivateMessage') : t('activateMessage'),
      confirmLabel: row.active ? t('deactivate') : t('activate'),
      cancelLabel: t('cancel'),
    },
  }).onOk(() => {
    handleToggleStatus(row)
  })
}

const confirmDelete = (row) => {
  Dialog.create({
    component: SsConfirmDialog,
    componentProps: {
      title: `${t('confirmDeleteCompany')} ${row.name}`,
      message: t('deleteWarning'),
      confirmLabel: t('delete'),
      cancelLabel: t('cancel'),
    },
  }).onOk(() => {
    handleDelete(row)
  })
}

const handleToggleStatus = async (row) => {
  try {
    await companyService.editCompany(row.id, { active: !row.active })
    $q.notify({ type: 'positive', message: t('statusUpdated') })
    fetchCompanies()
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: t('errorUpdatingStatus') })
  }
}

const handleDelete = async (row) => {
  try {
    await companyService.deleteCompany(row.id)
    $q.notify({ type: 'positive', message: t('companyDeleted') })
    fetchCompanies()
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: t('errorDeletingCompany') })
  }
}

const addCompany = async () => {
  Object.keys(formData).forEach((key) => {
    formData[key] = ''
  })

  if (plans.value.length === 0) {
    await fetchPlans()
  }

  const updatedInputs = inputs.map((input) => ({
    ...input,
    modelValue: ref(formData[input.key]),
    ...(input.key === 'plan_id' ? { options: plans.value } : {}),
  }))

  Dialog.create({
    component: SsPopUpForm,
    componentProps: {
      popUpTitle: t('addCompany'),
      inputs: updatedInputs,
      onSubmit: submitCompanyData,
    },
  })
}

const submitCompanyData = async (formData) => {
  const dataToSend = {
    ...formData,
    number_licenses: Number(formData.number_licenses),
    plan_id: formData.plan_id.value,
  }
  try {
    const response = await companyService.createCompany(dataToSend)
    if (response && response.status === 200) {
      $q.notify({ type: 'positive', message: t('companyCreated') })
      fetchCompanies()
    }
    return response
  } catch (error) {
    console.error(t('errorCreatingCompany'), error)
    $q.notify({ type: 'negative', message: t('errorCreatingCompany') + ': ' + error })
  }
}

// --------------------------------
// 5. Table actions
// --------------------------------

const tableActions = computed(() => [
  {
    label: t('deactivateCompanies'),
    icon: 'o_no_accounts',
    action: handlePrintIndexes,
  },
  {
    label: t('activateCompanies'),
    icon: 'o_account_circle',
    action: handlePrintIndexes,
  },
  {
    label: t('deleteCompanies'),
    icon: 'o_delete',
    action: handlePrintIndexes,
  },
])

const rowActions = [
  {
    icon: (row) => (row.active ? 'o_no_accounts' : 'o_account_circle'),
    color: 'primary',
    action: (row) => toggleUserStatus(row),
    tooltip: (row) => (row.active ? t('deactivate') : t('activate')),
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
    action: (row) => editCompany(row),
    tooltip: t('edit'),
  },
]

const additionalActions = [
  {
    label: t('addCompany'),
    backgroundColor: '#50B5D7',
    icon: 'o_library_add',
    action: addCompany,
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
    label: t('nit'),
    key: 'nit',
    modelValue: ref(formData.nit),
    required: true,
    dense: true,
    placeholder: t('writeHere'),
    type: 'nit',
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
    label: t('licensesNumber'),
    key: 'number_licenses',
    modelValue: ref(formData.number_licenses),
    required: true,
    dense: true,
    type: 'number',
    placeholder: t('writeHere'),
  },
  {
    label: t('plan'),
    key: 'plan_id',
    modelValue: ref(formData.plan_id),
    required: true,
    dense: true,
    type: 'select',
    options: plans,
    onPopupShow: fetchPlans,
  },
]

// --------------------------------
// 7. Lifecycle and watchers
// --------------------------------
onMounted(() => {
  fetchCompanies()
})
watch(pagination, fetchCompanies, { deep: true })
</script>
