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
    :tableName="$t('deliveries')"
    :rowActions="rowActions"
    :additionalActions="additionalActions"
    :pagination="pagination"
    @update:pagination="updatePagination"
    :rowsPerPageLabel="$t('deliveriesPerPage')"
    :rowsPerPageOptions="[10, 20, 0]"
  />
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import SsTable from '../ss-table/SsTable.vue'
import { useDeliveryService } from 'src/services/deliveries/useDeliveryService'
import { useClientService } from 'src/services/clients/useClientService'
import { useCityService } from 'src/services/cities/useCityService'
import { useVehicleService } from 'src/services/vehicles/useVehicleService'
import { useRouteService } from 'src/services/routes/useRouteService'
import { useDriverService } from 'src/services/drivers/useDriverService'
import { Dialog, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import SsPopUpForm from '../ss-popUpForm/SsPopUpForm.vue'

// --------------------------------
// 1. Initialization of dependencies
// --------------------------------
const { t } = useI18n()
const $q = useQuasar()
const deliveryService = useDeliveryService()
const clientService = useClientService()
const cityService = useCityService()
const routeService = useRouteService()
const vehicleService = useVehicleService()
const driverService = useDriverService()

// --------------------------------
// 2. Reactive state and variables
// --------------------------------
const rows = ref([])
const loading = ref(false)
const clients = ref([])
const cities = ref([])
const vehicles = ref([])
const drivers = ref([])
const loadingClients = ref(false)
const loadingCities = ref(false)
const loadingVehicles = ref(false)
const loadingDrivers = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: null,
})

const formData = reactive({
  code: '',
  client_id: '',
  address: '',
  address_detail: '',
  latitude: '',
  longitude: '',
  customer_name: '',
  customer_phone: '',
  delivery_date: '',
  city_id: '',
  weight: '',
})

// --------------------------------
// 3. Table configuration
// --------------------------------
const columns = [
  { name: 'code', label: t('code'), field: 'code', sortable: true, align: 'left' },
  { name: 'address', label: t('address'), field: 'address', sortable: true, align: 'left' },
  { name: 'address_detail', label: t('addressDetail'), field: 'address_detail', align: 'left' },
  { name: 'latitude', label: t('latitude'), field: 'latitude', align: 'left' },
  { name: 'customer_name', label: t('customerName'), field: 'customer_name', align: 'left' },
  { name: 'customer_phone', label: t('customerPhone'), field: 'customer_phone', align: 'left' },
  { name: 'weight', label: t('weight'), field: 'weight', align: 'left' },
  { name: 'delivery_date', label: t('deliveryDate'), field: 'delivery_date', align: 'left' },
  { name: 'city', label: t('city'), field: 'city', align: 'left' },
]

const sortableColumns = columns.filter((col) => col.sortable)

const filters = [
  { label: t('actives'), value: 'true' },
  { label: t('inactives'), value: 'false' },
]

// --------------------------------
// 4. Business logic
// --------------------------------
const fetchDeliveries = async () => {
  loading.value = true
  try {
    const response = await deliveryService.getDeliveries({
      page: pagination.value.page,
      pageSize: pagination.value.rowsPerPage,
    })

    rows.value = response.data.data.data
    pagination.value.rowsNumber = response.data.data.totalItems
  } catch (error) {
    console.error(t('errorLoadingDeliveries'), error)
    $q.notify({ type: 'negative', message: t('errorLoadingDeliveries') + ': ' + error })
  } finally {
    loading.value = false
  }
}

const fetchClients = async () => {
  if (clients.value.length > 0) return
  loadingClients.value = true
  try {
    const response = await clientService.getClients({ page: 1, pageSize: 100 })
    clients.value = response.data.data.map((client) => ({
      label: client.name,
      value: client.id,
    }))
  } catch (error) {
    console.error(t('errorLoadingClients'), error)
    $q.notify({ type: 'negative', message: t('errorLoadingClients') + ': ' + error })
  }
}

const fetchCities = async () => {
  if (cities.value.length > 0) return
  loadingCities.value = true
  try {
    const response = await cityService.getCities()
    cities.value = response.data.data.map((city) => ({
      label: city.name,
      value: city.id,
    }))
  } catch (error) {
    console.error(t('errorLoadingCities'), error)
    $q.notify({ type: 'negative', message: t('errorLoadingCities') + ': ' + error })
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

const fetchDrivers = async () => {
  if (drivers.value.length > 0) return
  loadingDrivers.value = true
  try {
    const response = await driverService.getDrivers({
      page: 1,
      pageSize: 100,
    })
    drivers.value = response.data.data.data.map((driver) => ({
      label: driver.name,
      value: driver.id,
    }))
  } catch (error) {
    console.error(t('errorLoadingDrivers'), error)
    $q.notify({ type: 'negative', message: t('errorLoadingDrivers') + ': ' + error })
  }
}

const updatePagination = (newPagination) => {
  pagination.value = { ...pagination.value, ...newPagination }
}

const addDelivery = async () => {
  Object.keys(formData).forEach((key) => {
    formData[key] = ''
  })

  if (clients.value.length === 0) {
    await fetchClients()
  }

  if (cities.value.length === 0) {
    await fetchCities()
  }

  const updatedInputs = inputs.map((input) => ({
    ...input,
    modelValue: ref(formData[input.key]),
    ...(input.key === 'client_id' ? { options: clients.value } : {}),
    ...(input.key === 'city_id' ? { options: cities.value } : {}),
  }))

  Dialog.create({
    component: SsPopUpForm,
    componentProps: {
      popUpTitle: t('addDelivery'),
      inputs: updatedInputs,
      onSubmit: submitDeliveryData,
    },
  })
}

const submitDeliveryData = async (formData) => {
  const dataToSend = {
    ...formData,
    city_id: formData.city_id.value,
    client_id: formData.client_id.value,
  }
  try {
    const response = await deliveryService.createDelivery(dataToSend)
    if (response && response.status === 200) {
      $q.notify({ type: 'positive', message: t('deliveryCreated') })
      fetchDeliveries()
    }
    return response
  } catch (error) {
    console.error(t('errorCreatingDelivery'), error)
    $q.notify({ type: 'negative', message: t('errorCreatingDelivery') + ': ' + error })
  }
}

// --------------------------------
// 5. Table actions
// --------------------------------

const tableActions = computed(() => [
  {
    label: t('createRoute'),
    icon: 'o_pin_drop',
    action: handleCreateRoute,
  },
])

const additionalActions = [
  {
    label: t('addDelivery'),
    backgroundColor: '#50B5D7',
    icon: 'o_library_add',
    action: addDelivery,
  },
]

const handleCreateRoute = async (selectedRows) => {
  if (vehicles.value.length === 0) {
    await fetchVehicles()
  }

  if (drivers.value.length === 0) {
    await fetchDrivers()
  }

  const selectedRowsIds = selectedRows.map((row) => row.id)

  const initialFormData = {
    code: '',
    start_date: '',
    end_date: '',
    vehicle_id: null,
    driver_id: null,
  }

  const routeInputs = [
    {
      label: t('code'),
      key: 'code',
      modelValue: ref(initialFormData.code),
      required: true,
      dense: true,
      placeholder: t('writeHere'),
    },
    {
      label: t('startDate'),
      key: 'start_date',
      modelValue: ref(initialFormData.start_date),
      required: true,
      dense: true,
      type: 'date',
      placeholder: t('selectDate'),
    },
    {
      label: t('endDate'),
      key: 'end_date',
      modelValue: ref(initialFormData.end_date),
      required: true,
      dense: true,
      type: 'date',
      placeholder: t('selectDate'),
    },
    {
      label: t('vehicle'),
      key: 'vehicle_id',
      modelValue: ref(initialFormData.vehicle_id),
      required: true,
      dense: true,
      type: 'select',
      options: vehicles.value,
    },
    {
      label: t('driver'),
      key: 'driver_id',
      modelValue: ref(initialFormData.driver_id),
      required: true,
      dense: true,
      type: 'select',
      options: drivers.value,
    },
  ]

  Dialog.create({
    component: SsPopUpForm,
    componentProps: {
      popUpTitle: t('createRoute'),
      confirmText: 'create',
      inputs: routeInputs,
      onSubmit: async (formData) => {
        try {
          const formattedData = {
            ...formData,
            vehicle_id: formData.vehicle_id?.value || null,
            driver_id: formData.driver_id?.value || null,
            deliveries: selectedRowsIds,
          }

          const response = await routeService.createRoute(formattedData)
          if (response && response.status === 200) {
            $q.notify({ type: 'positive', message: t('routeCreated') })
            fetchDeliveries()
          }
          return response
        } catch (error) {
          console.error(t('errorCreatingRoute'), error)
          $q.notify({ type: 'negative', message: t('errorCreatingRoute') + ': ' + error })
        }
      },
    },
  })
}

// --------------------------------
// 6. Form inputs configuration
// --------------------------------

const inputs = [
  {
    label: t('code'),
    key: 'code',
    modelValue: ref(formData.code),
    required: true,
    dense: true,
    placeholder: t('writeHere'),
  },
  {
    label: t('address'),
    key: 'address',
    modelValue: ref(formData.address),
    required: true,
    dense: true,
    placeholder: t('writeHere'),
  },
  {
    label: t('client'),
    key: 'client_id',
    modelValue: ref(formData.client_id),
    required: true,
    dense: true,
    type: 'select',
    options: clients,
    onPopupShow: fetchClients,
  },
  {
    label: t('addressDetail'),
    key: 'address_detail',
    modelValue: ref(formData.address_detail),
    required: true,
    dense: true,
    placeholder: t('writeHere'),
  },
  {
    label: t('latitude'),
    key: 'latitude',
    modelValue: ref(formData.latitude),
    dense: true,
    type: 'number',
    placeholder: t('writeHere'),
  },
  {
    label: t('longitude'),
    key: 'longitude',
    modelValue: ref(formData.longitude),
    dense: true,
    type: 'number',
    placeholder: t('writeHere'),
  },
  {
    label: t('customerName'),
    key: 'customer_name',
    modelValue: ref(formData.customer_name),
    required: true,
    dense: true,
    placeholder: t('writeHere'),
  },
  {
    label: t('customerPhone'),
    key: 'customer_phone',
    modelValue: ref(formData.customer_phone),
    required: true,
    dense: true,
    type: 'number',
    placeholder: t('writeHere'),
  },
  {
    label: t('deliveryDate'),
    key: 'delivery_date',
    modelValue: ref(formData.delivery_date),
    required: true,
    dense: true,
    type: 'date',
    placeholder: t('selectDate'),
  },
  {
    label: t('city'),
    key: 'city_id',
    modelValue: ref(formData.city_id),
    required: true,
    dense: true,
    type: 'select',
    options: cities,
    onPopupShow: fetchCities,
  },
  {
    label: t('weight'),
    key: 'weight',
    modelValue: ref(formData.weight),
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
  fetchDeliveries()
})
watch(pagination, fetchDeliveries, { deep: true })
</script>
