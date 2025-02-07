<template>
  <div class="qt-brand">
    <img src="~/assets/brand/qt-black.svg" alt="Quasar Tools" />
    <span>Quick Track</span>
  </div>

  <q-list>
    <q-expansion-item
      v-for="(link, index) in filteredLinksWithChildren"
      :key="index"
      :label="link.name"
      :expand-icon="link.icon"
    >
      <q-item
        v-for="(child, childIndex) in link.childrens"
        :key="childIndex"
        clickable
        v-ripple
        @click="navigateTo(child.route)"
      >
        <q-item-section>{{ child.name }}</q-item-section>
      </q-item>
    </q-expansion-item>

    <q-item
      v-for="(link, index) in filteredLinksWithoutChildren"
      :key="index"
      clickable
      v-ripple
      @click="navigateTo(link.route)"
      class="flex items-center"
      :class="[{ active: isActive(link.route) }]"
    >
      <q-icon style="color: #a83d1a" size="24px" :name="link.icon" class="q-mr-sm" />
      <q-item-section class="link-name">{{ link.name }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()
const router = useRouter()

const navigateTo = (routeName) => {
  router.push({ name: routeName })
}

const isActive = (routeName) => {
  return router.currentRoute.value.name === routeName
}

const roleRoutes = {
  Admin: ['companies', 'vehiclesTypes', 'splashes'],
  Carrier: ['clients', 'routesAndZones', 'vehicles', 'drivers', 'managers'],
}

const filteredLinks = computed(() => {
  const role = authStore.userRole
  if (role && roleRoutes[role]) {
    return links.value.filter((link) => roleRoutes[role].includes(link.route))
  }
  return []
})

const filteredLinksWithChildren = computed(() => {
  return filteredLinks.value.filter((link) => link.childrens && link.childrens.length > 0)
})

const filteredLinksWithoutChildren = computed(() => {
  return filteredLinks.value.filter((link) => !link.childrens || link.childrens.length === 0)
})

const links = ref([
  { name: t('companies'), icon: 'o_person', route: 'companies', childrens: [] },
  { name: t('vehicles_types'), icon: 'o_garage', route: 'vehiclesTypes', childrens: [] },
  { name: t('splashes'), icon: 'o_switch_account', route: 'splashes', childrens: [] },
  { name: t('clients'), icon: 'o_person', route: 'clients', childrens: [] },
  { name: t('routesAndZones'), icon: 'o_pin_drop', route: 'routesAndZones', childrens: [] },
  { name: t('vehicles'), icon: 'o_directions_car', route: 'vehicles', childrens: [] },
  { name: t('drivers'), icon: 'o_badge', route: 'drivers', childrens: [] },
  { name: t('managers'), icon: 'o_manage_accounts', route: 'managers', childrens: [] },
])
</script>

<style scoped lang="scss">
.qt-brand {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 40px;

  img {
    height: 35px;
  }

  span {
    font-size: 16px;
    font-weight: 700;
    line-height: 21.86px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }
}

.link-name {
  font-size: 16px;
  font-weight: 400;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: #a83d1a;
}

.q-item {
  padding: 8px 40px;
}

.active {
  background: #ffedcc;
  .link-name {
    font-weight: 700;
  }
}
</style>
