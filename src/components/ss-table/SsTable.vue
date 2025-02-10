<template>
  <q-table
    flat
    :rows="filteredRows"
    :columns="columns"
    row-key="id"
    :loading="loading"
    :selection="selectable ? 'multiple' : 'none'"
    v-model:selected="selected"
    class="q-pa-md fit"
    :pagination="pagination"
    @request="handlePagination"
    :rows-per-page-label="rowsPerPageLabel"
    :pagination-label="paginationLabel"
    :rows-per-page-options="rowsPerPageOptions"
    :no-data-label="$t('noData')"
  >
    <template v-slot:top>
      <div class="top-table-container">
        <div class="top-container">
          <q-input v-model="search" debounce="300" :placeholder="$t('search')" outlined dense>
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <div class="table-buttons">
            <q-btn
              v-if="showUpload"
              padding="8px 24px"
              icon="publish"
              no-caps
              flat
              class="upload-button"
              :label="$t('upload') + ' xlsx'"
            />

            <q-btn
              v-for="action in additionalActions"
              padding="8px 24px"
              :key="action.label"
              :icon="action.icon"
              :label="action.label"
              :color="action.color || 'primary'"
              no-caps
              :style="{ backgroundColor: action.backgroundColor + ' !important' }"
              @click="action.action"
              class="additional-action-button"
            />
          </div>
        </div>

        <div v-if="tableName" class="table-information">
          <span class="title">{{ tableName }}</span>
          <span class="records">{{ filteredRows.length }} {{ tableName }}</span>

          <div class="filter-container">
            <q-btn-dropdown
              outline
              unelevated="true"
              no-caps
              icon="o_filter_alt"
              v-if="filters.length"
              :label="$t('filter_by')"
              class="custom-drowpdown"
              dropdown-icon="keyboard_arrow_down"
              content-class="dropdown-content"
            >
              <q-list>
                <q-item
                  clickable
                  v-for="filter in filters"
                  :key="filter.value"
                  @click="applyFilter(filter.value)"
                >
                  <q-item-section>{{ filter.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>

            <q-btn-dropdown
              outline
              unelevated="true"
              no-caps
              icon="o_unfold_more"
              v-if="sortableColumns.length"
              :label="$t('order_by')"
              class="custom-drowpdown"
              dropdown-icon="keyboard_arrow_down"
            >
              <q-list>
                <q-item
                  clickable
                  v-for="column in sortableColumns"
                  :key="column.name"
                  @click="applySort(column.name)"
                >
                  <q-item-section>{{ column.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>

        <div class="actions-container">
          <q-checkbox
            v-if="selectable"
            v-model="selectAll"
            @update:model-value="toggleSelectAll"
            color="primary"
          />

          <q-btn
            no-caps
            v-for="action in tableActions"
            :key="action.label"
            :icon="action.icon"
            :label="action.label"
            color="primary"
            flat
            :disable="selected.length === 0"
            @click="action.action(selected)"
          />
        </div>
      </div>
    </template>
    <template v-slot:body-cell-actions="{ row }">
      <q-td align="center">
        <q-btn
          v-for="action in rowActions"
          :key="typeof action.icon === 'function' ? action.icon(row) : action.icon"
          :icon="typeof action.icon === 'function' ? action.icon(row) : action.icon"
          :color="action.color"
          dense
          flat
          round
          @click="action.action(row)"
        >
          <q-tooltip>
            {{ typeof action.tooltip === 'function' ? action.tooltip(row) : action.tooltip }}
          </q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>

  <q-btn
    v-if="showDownload"
    padding="8px 24px"
    no-caps
    flat
    :label="$t('download') + ' xlsx'"
    class="download-button"
  />
</template>

<script setup>
import { ref, computed, defineProps, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  rows: Array,
  columns: Array,
  loading: Boolean,
  pagination: Object,
  rowsPerPageLabel: String,
  filters: { type: Array, default: () => [] },
  sortableColumns: { type: Array, default: () => [] },
  selectable: { type: Boolean, default: false },
  showUpload: { type: Boolean, default: false },
  showDownload: { type: Boolean, default: false },
  tableActions: { type: Array, default: () => [] },
  tableName: { type: String, default: '' },
  rowActions: { type: Array, default: () => [] },
  additionalActions: { type: Array, default: () => [] },
  rowsPerPageOptions: { type: Array, default: () => [10, 20, 50, 0] },
})

const emit = defineEmits(['update:pagination'])

const handlePagination = (props) => {
  emit('update:pagination', props.pagination)
}

const paginationLabel = (firstRowIndex, endRowIndex, totalRowsNumber) => {
  return `${firstRowIndex}-${endRowIndex} ${t('paginationOf')} ${totalRowsNumber}`
}

const search = ref('')

const selected = ref([])
const selectAll = ref(false)

const activeFilter = ref(null)
const activeSort = ref(null)

const applyFilter = (filter) => {
  activeFilter.value = filter
}

const applySort = (column) => {
  activeSort.value = column
}

const filteredRows = computed(() => {
  let rows = props.rows

  if (search.value) {
    rows = rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search.value.toLowerCase()),
      ),
    )
  }

  if (activeFilter.value) {
    rows = rows.filter((row) => row[activeFilter.value])
  }

  if (activeSort.value) {
    rows = [...rows].sort((a, b) => (a[activeSort.value] > b[activeSort.value] ? 1 : -1))
  }

  return rows
})

const toggleSelectAll = () => {
  if (selected.value.length === 0) {
    selected.value = [...filteredRows.value]
    selectAll.value = true
  } else {
    selected.value = []
    selectAll.value = false
  }
}

watch(selected, (newValue) => {
  if (newValue.length === 0) {
    selectAll.value = false
  } else if (newValue.length === filteredRows.value.length) {
    selectAll.value = true
  } else {
    selectAll.value = null
  }
})
</script>

<style scoped lang="scss">
.top-table-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;

  .table-information {
    display: flex;
    flex-direction: column;
    gap: 8px;
    .title {
      font-size: 24px;
      font-weight: 700;
      line-height: 32.78px;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
    }
    .records {
      font-family: Manrope;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
    }
  }
  .top-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    .table-buttons {
      display: flex;
      gap: 16px;
      .additional-action-button {
        border-radius: 8px;
      }
    }
  }

  .filter-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    .custom-drowpdown {
      font-size: 14px;
      font-weight: 300;
      line-height: 20px;
      text-align: center;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      color: #a83d1a;
      padding: 4px 8px;
      &::before {
        border: 1px solid #ffedcc;
      }
    }
  }
}
.download-button {
  display: flex;
  justify-self: center;
  background: #701e0c;
  color: white;
  border-radius: 8px;
}

.upload-button {
  background: #a83d1a;
  color: white;
  border-radius: 8px;
}
</style>
