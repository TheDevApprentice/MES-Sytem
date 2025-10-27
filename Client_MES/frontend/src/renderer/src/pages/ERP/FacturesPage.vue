<template>
  <PageTemplate
    :title="'🏭 Factures'"
    buttonText="Ouvrir Spreadsheet"
    closeText="Retour"
    :workbookData="workbookData"
    :spreadsheetOpen="spreadsheetOpen"
    @action="openSpreadsheet"
    @close="closeSpreadsheet"
  >
    <template #stats>
      <StatsCard
        title="Nombre de factures"
        :value="stats.invoiceCount"
        :theme="theme ? 'dark' : 'light'"
      />
      <!-- Flux transctionnel Total - l'argent que l'on a facturé et reçu -->
      <StatsCard
        title="Flux transactionnel Total"
        :value="stats.fluxTotal"
        :theme="theme ? 'dark' : 'light'"
        :format="
          (val) =>
            new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val)
        "
      />
      <!-- Fournisseur - l'argent que l'on a facturé -->
      <StatsCard
        title="Total Dépense"
        :value="stats.supplierTotal"
        :theme="theme ? 'dark' : 'light'"
        :format="
          (val) =>
            new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val)
        "
      />
      <!-- Client - l'argent que l'on a reçu -->
      <StatsCard
        title="Total Gain"
        :value="stats.clientTotal"
        :theme="theme ? 'dark' : 'light'"
        :format="
          (val) =>
            new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val)
        "
      />
      <StatsCard
        title="Bénéfices"
        :value="stats.profit"
        :theme="theme ? 'dark' : 'light'"
        :format="
          (val) =>
            new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val)
        "
      />
    </template>
    <template #table>
      <PaginatedTable
        :headers="data.headersInvoices"
        :items="data.invoiceData"
        :theme="theme ? 'dark' : 'light'"
        :show-actions="true"
        :actions="[
          { name: 'edit', handler: handleEdit },
          { name: 'delete', handler: handleDelete }
        ]"
        :items-per-page="10"
        :lazy-loading="false"
        @row-click="handleRowClick"
        @action-click="handleActionClick"
      />
    </template>
    <template #charts>
      <!-- Flux total: Gains (clients) & Dépenses (fournisseurs) -->
      <LineChart
        title="Flux transactionnel"
        :labels="monthLabels"
        :datasets="combinedDatasets"
        :theme="theme ? 'dark' : 'light'"
        :loading="combinedDatasets.length === 0"
        :maintain-aspect-ratio="false"
        :height="400"
      />
      <!-- Pie chart: Dépenses vs Gains -->
      <PieChart
        title="Répartition Dépenses vs Gains"
        :labels="expensesGainsPieLabels"
        :datasets="expensesGainsPieDatasets"
        :theme="theme ? 'dark' : 'light'"
        :height="320"
        :show-custom-legend="true"
        :loading="false"
      />
    </template>
  </PageTemplate>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  onBeforeMount,
  onUnmounted,
  computed,
  defineAsyncComponent,
  onMounted
} from 'vue'
import type { TableHeader, TableItem } from '@components/tables/types/types'
import { useThemeStore } from '@renderer/stores/ThemeStore'
import { convertDataToUniver } from '@renderer/components/univers/logic/conversion/dataToUniversjs'
import {
  billings,
  contractData,
  contractType,
  clientData,
  supplierData,
  billingOrders,
  headersBillings
} from '@renderer/mock/mockData'
import PageTemplate from '@renderer/pages/ERP/templates/PageTemplate.vue'

const LineChart = defineAsyncComponent({
  loader: () => import('@components/charts/LineChart.vue'),
  delay: 200,
  timeout: 3000
})
const PieChart = defineAsyncComponent({
  loader: () => import('@components/charts/PieChart.vue'),
  delay: 200,
  timeout: 3000
})
const StatsCard = defineAsyncComponent({
  loader: () => import('@components/charts/StatsCard.vue'),
  delay: 200,
  timeout: 3000
})
const PaginatedTable = defineAsyncComponent({
  loader: () => import('@components/tables/PaginatedTable.vue'),
  delay: 200,
  timeout: 3000
})

// Données mock chargées dynamiquement dans onMounted
// Invoice data
const data = reactive({
  invoiceData: [] as TableItem[],
  invoiceClientData: [] as TableItem[],
  invoiceSupplierData: [] as TableItem[],
  headersInvoices: headersBillings as TableHeader[]
})
// doit rester ici
const stats = reactive({
  invoiceCount: 0,
  fluxTotal: 0,
  supplierTotal: 0,
  clientTotal: 0,
  profit: 0
})
// doit rester ici
const spreadsheetData = computed(() => ({
  invoiceData: data.invoiceData,
  invoiceClientData: data.invoiceClientData,
  invoiceSupplierData: data.invoiceSupplierData
}))
// doit rester ici
const workbookData = computed(() => {
  return convertDataToUniver(spreadsheetData.value, {
    workbookId: 'factures',
    workbookName: 'Données Factures'
  })
})
// doivent rester ici
let spreadsheetOpen = ref(false)
const themeStore = useThemeStore()
const theme = themeStore.theme

// Lifecycle hooks
onBeforeMount(() => {
  // Initialize invoice data with contract information
  data.invoiceData = billings.map((b) => {
    const contract = contractData.find((c) => c.billingId === b.id)
    const name =
      contract?.type === contractType.Client
        ? clientData.find((cl) => cl.id === contract.contractId)?.name
        : supplierData.find((s) => s.id === contract?.contractId)?.name
    const nbOrders = billingOrders.filter((o) => o.billingId === b.id).length
    return {
      id: b.id,
      date: b.date,
      total: b.total,
      contractName: name || '',
      contractType: contract?.type || '',
      nbOrders
    }
  })
  data.invoiceClientData = billings
    .filter((b) => contractData.some((c) => c.billingId === b.id && c.type === contractType.Client))
    .map((b) => {
      const contract = contractData.find(
        (c) => c.billingId === b.id && c.type === contractType.Client
      )
      const name = clientData.find((cl) => cl.id === contract?.contractId)?.name
      const nbOrders = billingOrders.filter((o) => o.billingId === b.id).length
      return {
        id: b.id,
        date: b.date,
        total: b.total,
        contractName: name || '',
        contractType: contract?.type || '',
        nbOrders
      }
    })
  data.invoiceSupplierData = billings
    .filter((b) =>
      contractData.some((c) => c.billingId === b.id && c.type === contractType.Supplier)
    )
    .map((b) => {
      const contract = contractData.find(
        (c) => c.billingId === b.id && c.type === contractType.Supplier
      )
      const name = supplierData.find((s) => s.id === contract?.contractId)?.name
      const nbOrders = billingOrders.filter((o) => o.billingId === b.id).length
      return {
        id: b.id,
        date: b.date,
        total: b.total,
        contractName: name || '',
        contractType: contract?.type || '',
        nbOrders
      }
    })
  // compute stats
  stats.invoiceCount = data.invoiceData.length
  stats.fluxTotal = data.invoiceData.reduce((sum, i) => sum + i.total, 0)
  stats.clientTotal = data.invoiceClientData.reduce((sum, i) => sum + i.total, 0)
  stats.supplierTotal = data.invoiceSupplierData.reduce((sum, i) => sum + i.total, 0)
  stats.profit = stats.clientTotal - stats.supplierTotal
})

onMounted(async () => {
  console.log('onMounted - data updated in onmounted', data)
  console.log('onMounted - using data updated in onmounted to update stats reactive data')

  console.log('onMounted - after updating stats reactive data', stats)
})

onUnmounted(async () => {
  stats.invoiceCount = 0
  stats.fluxTotal = 0
  stats.supplierTotal = 0
  stats.clientTotal = 0
  stats.profit = 0

  data.invoiceData = []

  console.log('onUnmounted - stats reactive stats', stats)
  console.log('onUnmounted - data', data)
})

function handleRowClick(item: TableItem) {
  console.log('Row clicked', item)
}

function handleEdit(item: TableItem) {
  console.log('Edit', item)
}

function handleDelete(item: TableItem) {
  console.log('Delete', item)
}

function handleActionClick(payload: { action: string; item: TableItem }) {
  console.log('Action clicked', payload)
}
function openSpreadsheet() {
  console.log('Ouvrir Spreadsheet')
  spreadsheetOpen.value = true
  console.log('Spreadsheet state', spreadsheetOpen.value)
}

function closeSpreadsheet() {
  console.log('Fermer Spreadsheet')
  spreadsheetOpen.value = false
  console.log('Spreadsheet state', spreadsheetOpen.value)
}

// Labels mensuels
const monthLabels = computed(() => {
  const year = new Date().getFullYear()
  return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1).toLocaleDateString())
})

const clientMonthly = computed(() =>
  monthLabels.value.map((_, m) =>
    data.invoiceData
      .filter((i) => i.contractType === contractType.Client && new Date(i.date).getMonth() === m)
      .reduce((s, i) => s + i.total, 0)
  )
)
const supplierMonthly = computed(() =>
  monthLabels.value.map((_, m) =>
    data.invoiceData
      .filter((i) => i.contractType === contractType.Supplier && new Date(i.date).getMonth() === m)
      .reduce((s, i) => s + i.total, 0)
  )
)
const expensesGainsPieLabels = computed(() => ['Dépenses', 'Gains'])
const expensesGainsPieDatasets = computed(() => [
  {
    data: [stats.supplierTotal, stats.clientTotal],
    backgroundColor: [
      '#fbbf24', // Dépenses - pastel yellow/orange
      '#60a5fa'  // Gains - pastel blue
    ],
    borderColor: '#fff',
    borderWidth: 2
  }
])
const combinedDatasets = computed(() => [
  { label: 'Gain', data: clientMonthly.value },
  { label: 'Dépenses', data: supplierMonthly.value }
])
</script>

<style scoped>
/* Action icons */
.action-icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--page-accent-color);
  padding: 6px;
  border-radius: 6px;
  transition: background 0.2s;
}
.action-icon-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}
</style>
