<template>
  <q-page class="column">
    <q-btn flat dense icon="arrow_back" @click="$router.push('/companies')" />
    <h2>{{ company.name }}</h2>
    <p><strong>Email:</strong> {{ company.email }}</p>
    <p><strong>NIT:</strong> {{ company.nit }}</p>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCompanyService } from 'src/services/companies/useCompanyService'

const route = useRoute()
const companyService = useCompanyService()
const company = ref({})

onMounted(async () => {
  const response = await companyService.getCompanyById(route.params.id)
  company.value = response.data
})
</script>
