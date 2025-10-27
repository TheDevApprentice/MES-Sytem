<template>
  <PageTemplate
    :title="'🏭 Fournisseurs'"
    buttonText="Ouvrir Spreadsheet"
    closeText="Retour"
    :workbookData="workbookData"
    :spreadsheetOpen="spreadsheetOpen"
    @action="openSpreadsheet"
    @close="closeSpreadsheet"
  >
    <template #stats>
      <StatsCard
        title="Achats totaux"
        subtitle="année en cours"
        :value="stats.totalSpend"
        :theme="theme ? 'dark' : 'light'"
        :format="
          (val) =>
            new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val)
        "
        iconType="revenue"
      />
      <StatsCard
        title="Satisfaction moyenne"
        :theme="theme ? 'dark' : 'light'"
        :value="stats.avgSatisfaction"
        suffix="%"
        iconType="performance"
      />
      <StatsCard
        title="Fournisseurs actifs"
        :value="stats.activeCount"
        :theme="theme ? 'dark' : 'light'"
        iconType="users"
      />
      <StatsCard
        title="Commandes moyennes"
        subtitle="par fournisseur"
        :value="stats.avgOrders"
        :theme="theme ? 'dark' : 'light'"
        iconType="orders"
      />
      <StatsCard
        title="Délais moyen depuis dernière cmd."
        :value="stats.avgDaysSinceLastOrder"
        suffix="j"
        :theme="theme ? 'dark' : 'light'"
        iconType="clock"
      />
    </template>
    <template #table>
      <div class="flex gap-4 mb-2">
        <button
          @click="createFournisseur"
          aria-label="Créer un fournisseur"
          class="action-icon-btn"
        >
          <UserAddIcon />
        </button>
        <button
          @click="exportFournisseurs"
          aria-label="Exporter la liste des fournisseurs"
          class="action-icon-btn"
        >
          <ExportIcon />
        </button>
      </div>
      <PaginatedTable
        :headers="data.headersSuppliers"
        :items="data.supplierData"
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
      <BarChart
        title="Satisfaction"
        :labels="chartLabels"
        :datasets="satisfactionDatasets"
        :theme="theme ? 'dark' : 'light'"
        :loading="satisfactionDatasets.length === 0"
        :maintain-aspect-ratio="false"
        :height="300"
      />
      <LineChart
        title="Commandes"
        :labels="chartLabels"
        :datasets="orderDatasets"
        :theme="theme ? 'dark' : 'light'"
        :loading="orderDatasets.length === 0"
        :maintain-aspect-ratio="false"
        :height="300"
      />
      <LineChart
        title="Dépenses"
        :labels="expenseLabels"
        :datasets="expenseDatasets"
        :theme="theme ? 'dark' : 'light'"
        :loading="expenseDatasets.length === 0"
        :maintain-aspect-ratio="false"
        :height="400"
      />
    </template>
  </PageTemplate>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  onBeforeMount,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
  computed
} from 'vue'
import UserAddIcon from '@components/icons/UserAddIcon.vue'
import ExportIcon from '@components/icons/ExportIcon.vue'
import type { TableHeader, TableItem } from '@components/tables/types/types'
import { useThemeStore } from '@renderer/stores/ThemeStore'
import { convertDataToUniver } from '@renderer/components/univers/logic/conversion/dataToUniversjs'
import type { Order, Supplier } from '@renderer/mock/mockData'
import PageTemplate from '@renderer/pages/ERP/templates/PageTemplate.vue'
import { contractType, contractData, billingOrders, orders } from '@renderer/mock/mockData'

const BarChart = defineAsyncComponent({
  loader: () => import('@components/charts/BarChart.vue'),
  delay: 200,
  timeout: 3000
})
const LineChart = defineAsyncComponent({
  loader: () => import('@components/charts/LineChart.vue'),
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
// doit rester ici
const data = reactive({
  supplierData: [] as Supplier[],
  supplierOrders: [] as Order[],
  headersSuppliers: [] as TableHeader[]
})
// doit rester ici
const stats = reactive({
  activeCount: 0,
  totalSpend: 0,
  avgSatisfaction: 0,
  avgOrders: 0,
  avgDaysSinceLastOrder: 0
})
// doit rester ici
const spreadsheetData = computed(() => ({
  supplierData: data.supplierData,
  supplierOrders: data.supplierOrders
}))
// doit rester ici
const workbookData = computed(() => {
  console.log('calcul des données')
  return convertDataToUniver(spreadsheetData.value, {
    workbookId: 'fournisseurs',
    workbookName: 'Données Fournisseurs'
  })
})
// doivent rester ici
let spreadsheetOpen = ref(false)
const themeStore = useThemeStore()
const theme = themeStore.theme

// Lifecycle hooks
onBeforeMount(async () => {
  console.log('Préparation avant montage')
  await import('@renderer/mock/mockData').then((mockData) => {
    const addresses = mockData.addressData
    const addressCountries = mockData.addressCountryData
    const countries = mockData.countryData
    const countryRegionData = mockData.countryRegionData
    const regions = mockData.regionData
    const contacts = mockData.contactData
    const emails = mockData.emailData
    const phones = mockData.phoneData
    const supplierAddr = mockData.supplierAddressData
    const supplierContacts = mockData.supplierContactData
    // build supplier orders list
    const supplierContracts = mockData.contractData.filter(
      (c) => c.type === mockData.contractType.Supplier
    )
    const supplierBillingIds = supplierContracts.map((c) => c.billingId)

    data.supplierData = mockData.supplierData.map((s) => {
      const assoc = supplierAddr.find((a) => a.idSupplier === s.id)
      const addr = addresses.find((a) => a.id === assoc?.idAddress)
      const country = countries.find(
        (c) => c.id === addressCountries.find((ac) => ac.addressId === addr?.id)?.countryId
      )
      const countryRegion = countryRegionData.find((cr) => cr.countryId === country?.id)
      const region = regions.find((r) => r.id === countryRegion?.regionId)

      const supplierContactAssoc = supplierContacts.find((c) => c.idSupplier === s.id)
      const contact = contacts.find((c) => c.id === supplierContactAssoc?.idContact)
      const contactName = contact?.name
      const contactEmail = emails.find((e) => e.id === contact?.emailsId[0])?.email
      const contactPhone = phones.find((p) => p.id === contact?.phonesId[0])?.number
      // find contract entries for this supplier
      const contracts = mockData.contractData.filter(
        (c) => c.contractId === s.id && c.type === contractType.Supplier
      )
      const billingIds = contracts.map((c) => c.billingId)
      // find orders linked to those billing records
      const myOrders = mockData.billingOrders
        .filter((b) => billingIds.includes(b.billingId))
        .map((b) => mockData.orders.find((o) => o.id === b.orderId))
        .filter((o): o is Order => o !== undefined)
      const ordersCount = myOrders.length
      const totalSpend = myOrders.reduce((sum, o) => sum + o.cost, 0)
      const lastOrder = myOrders.reduce(
        (max, o) => (new Date(o.date) > new Date(max) ? o.date : max),
        myOrders[0]?.date || ''
      )
      return {
        ...s,
        ordersCount,
        totalSpend,
        lastOrder,
        region: region?.name,
        contactName,
        contactEmail,
        contactPhone
      }
    })
    data.supplierOrders = mockData.billingOrders
      .filter((b) => supplierBillingIds.includes(b.billingId))
      .map((b) => mockData.orders.find((o) => o.id === b.orderId))
      .filter((o): o is Order => o !== undefined)
    data.headersSuppliers = mockData.headersSuppliers
  })

  stats.activeCount = data.supplierData.filter((item) => item.active).length
  stats.totalSpend = data.supplierData.reduce((sum, item) => sum + (item.totalSpend ?? 0), 0)
  stats.avgSatisfaction = +(
    data.supplierData.reduce((sum, item) => sum + item.satisfaction, 0) / data.supplierData.length
  ).toFixed(1)
  stats.avgOrders = +(
    data.supplierData.reduce((sum, item) => sum + (item.ordersCount ?? 0), 0) /
    data.supplierData.length
  ).toFixed(1)
  const today = Date.now()
  const daysSinceList = data.supplierOrders.map((item) => {
    const d = new Date(item.date).getTime()
    return Math.floor((today - d) / (1000 * 60 * 60 * 24))
  })
  stats.avgDaysSinceLastOrder = +(
    daysSinceList.reduce((sum, days) => sum + days, 0) / daysSinceList.length
  ).toFixed(1)
})

onMounted(async () => {
  console.log('onMounted - data updated in onmounted', data)
  console.log('onMounted - using data updated in onmounted to update stats reactive data')

  console.log('onMounted - after updating stats reactive data', stats)
})

onUnmounted(async () => {
  console.log('Nettoyage après démontage')

  stats.activeCount = 0
  stats.totalSpend = 0
  stats.avgSatisfaction = 0
  stats.avgOrders = 0
  stats.avgDaysSinceLastOrder = 0

  data.supplierData = []
  data.supplierOrders = []
  data.headersSuppliers = []

  console.log('onUnmounted - stats reactive stats', stats)
  console.log('onUnmounted - stats reactive data', data)
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

function createFournisseur() {
  console.log('Créer un fournisseur')
}

function exportFournisseurs() {
  console.log('Exporter la liste des fournisseurs')
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

// Generate chart data from supplierData
const chartLabels = computed(() => data.supplierData.map((item) => item.name))

// Bar chart: satisfaction percentage per supplier
const satisfactionDatasets = computed(() => [
  { label: 'Satisfaction (%)', data: data.supplierData.map((item) => item.satisfaction) }
])

// Line chart: dépenses totales par fournisseur
const orderDatasets = computed(() => [
  { label: 'Dépenses', data: data.supplierData.map((item) => item.totalSpend) }
])

// Labels pour dépenses groupées par tous les mois de l’année en cours (YYYY-MM)
const expenseLabels = computed(() => {
  const year = new Date().getFullYear()
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(year, i, 1)
    return d.toLocaleDateString()
  })
})

// Datasets: dépenses par fournisseur par mois
const expenseDatasets = computed(() => {
  return data.supplierData.map((supplier) => {
    // commandes liées au fournisseur
    const contracts = contractData.filter(
      (c) => c.contractId === supplier.id && c.type === contractType.Supplier
    )
    const billingIds = contracts.map((c) => c.billingId)
    const supplierOrdersList = billingOrders
      .filter((b) => billingIds.includes(b.billingId))
      .map((b) => orders.find((o) => o.id === b.orderId))
      .filter((o): o is Order => o !== undefined)
    // dépenses mensuelles
    const monthlyData = expenseLabels.value.map((_, monthIndex) => {
      return supplierOrdersList
        .filter((o) => new Date(o.date).getMonth() === monthIndex)
        .reduce((sum, o) => sum + o.cost, 0)
    })
    return {
      label: supplier.name,
      data: monthlyData
    }
  })
})
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
