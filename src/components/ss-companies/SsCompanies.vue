<template>
  <SsTable
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
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import SsTable from '../ss-table/SsTable.vue'
import { useCompanyService } from 'src/services/company/useCompanyService'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const $q = useQuasar()
const companyService = useCompanyService()

const rows = ref([])
const loading = ref(false)

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

const handlePrintIndexes = (selectedRows) => {
  selectedRows.forEach((row) => {
    console.log(`Índice: ${row.id}, Empresa: ${row.name}`)
  })
}

const editCompany = (row) => {
  console.log('Editar empresa:', row)
  $q.notify({ type: 'info', message: `Editar empresa: ${row.name}` })
}

const deleteCompany = (row) => {
  console.log('Eliminar empresa:', row)
  $q.notify({ type: 'negative', message: `Eliminar empresa: ${row.name}` })
}

const fetchCompanies = async () => {
  loading.value = true
  try {
    const response = await companyService.getCompanies()
    rows.value = response.data.data.data
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: t('errorLoadingCompanies') + ': ' + error.message })
  } finally {
    loading.value = false
  }
}

onMounted(fetchCompanies)
</script>
