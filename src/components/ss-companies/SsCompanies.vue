<template>
  <q-spinner v-if="loading" color="primary" size="3em" :thickness="2" />
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
  />
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import SsTable from '../ss-table/SsTable.vue'
import { useCompanyService } from 'src/services/company/useCompanyService'
import { Dialog, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import SsPopUpForm from '../ss-popUpForm/SsPopUpForm.vue'

const { t } = useI18n()
const $q = useQuasar()
const companyService = useCompanyService()

const rows = ref([])
const loading = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: null,
})

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

watch(pagination, fetchCompanies, { deep: true })

const updatePagination = (newPagination) => {
  pagination.value = { ...pagination.value, ...newPagination }
}

onMounted(fetchCompanies)

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  nit: '',
  number_licenses: '',
  plan: '',
})

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
    key: 'plan',
    modelValue: ref(formData.plan),
    required: true,
    dense: true,
    type: 'select',
    options: [
      { label: 'Plan A', value: 'A' },
      { label: 'Plan B', value: 'B' },
      { label: 'Plan C', value: 'C' },
    ],
  },
]

const columns = [
  { name: 'id', label: 'Id', field: 'id', align: 'left' },
  { name: 'name', label: t('name'), field: 'name', sortable: true, align: 'left' },
  { name: 'email', label: t('email'), field: 'email', sortable: true, align: 'left' },
  { name: 'nit', label: t('nit'), field: 'nit', align: 'left' },
  { name: 'numberLicenses', label: t('licensesNumber'), field: 'numberLicenses', align: 'left' },
  { name: 'active', label: t('active'), field: 'active', align: 'left' },
  { name: 'actions', label: t('actions'), field: 'actions', align: 'center' },
]

const sortableColumns = columns.filter((col) => col.sortable)

const filters = [
  { label: t('actives'), value: 'true' },
  { label: t('inactives'), value: 'false' },
]

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
    icon: 'o_no_accounts',
    color: 'primary',
    action: (row) => editCompany(row),
    tooltip: t('enableDisable'),
  },
  {
    icon: 'o_delete',
    color: 'primary',
    action: (row) => deleteCompany(row),
    tooltip: t('delete'),
  },
]

const addCompany = () => {
  Object.keys(formData).forEach((key) => {
    formData[key] = ''
  })

  Dialog.create({
    component: SsPopUpForm,
    componentProps: {
      popUpTitle: t('addCompany'),
      inputs: inputs,
      onSubmit: submitCompanyData,
    },
  })
}

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

const editCompany = (row) => {
  console.log('Editar empresa:', row)
}

const deleteCompany = (row) => {
  console.log('Eliminar empresa:', row)
  $q.notify({ type: 'negative', message: `Eliminar empresa: ${row.name}` })
}

const submitCompanyData = async (formData) => {
  try {
    const response = await companyService.createCompany({
      ...formData,
      plan: formData.plan.value,
    })
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
</script>
