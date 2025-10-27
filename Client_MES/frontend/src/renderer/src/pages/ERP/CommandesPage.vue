<template>
  <PageTemplate
    :title="'🏭 Commandes'"
    buttonText="Ouvrir Spreadsheet"
    closeText="Retour"
    :workbookData="workbookData"
    :spreadsheetOpen="spreadsheetOpen"
    @action="openSpreadsheet"
    @close="closeSpreadsheet"
  >
    <template #stats>
      <StatsCard
        title="Nombre de commandes"
        :value="stats.orderCount"
        :theme="theme ? 'dark' : 'light'"
      />
      <StatsCard
        title="Nombre de commandes client"
        :value="stats.orderClientCount"
        :theme="theme ? 'dark' : 'light'"
      />
      <StatsCard
        title="Nombre de commandes fournisseur"
        :value="stats.orderSupplierCount"
        :theme="theme ? 'dark' : 'light'"
      />
    </template>
    <template #table>
      <PaginatedTable
        :headers="data.headersOrders"
        :items="data.orderData"
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
      <LineChart
        :labels="monthLabels"
        :datasets="[
          {
            label: 'Commandes fournisseur',
            data: supplierMonthly,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.15)',
            tension: 0.35,
            fill: false,
            pointRadius: 4,
            pointBackgroundColor: '#3b82f6'
          },
          {
            label: 'Commandes client',
            data: clientMonthly,
            borderColor: '#f59e42',
            backgroundColor: 'rgba(245,158,66,0.14)',
            tension: 0.35,
            fill: false,
            pointRadius: 4,
            pointBackgroundColor: '#f59e42'
          }
        ]"
        :height="340"
        :showChartInfo="false"
        :showTrendInfo="true"
        :showControls="true"
        :theme="theme ? 'dark' : 'light'"
        :loading="supplierMonthly.length === 0 && clientMonthly.length === 0"
        :title="'Commandes fournisseur vs client par mois (' + new Date().getFullYear() + ') '"
        style="margin-bottom: 30px"
      />
      <div class="flex gap-8 mb-6 flex-wrap">
        <PieChart
          :labels="supplierProductPieData.labels"
          :datasets="supplierProductPieData.datasets"
          :showCustomLegend="false"
          :theme="theme ? 'dark' : 'light'"
          :title="'Répartition produits achetés (fournisseurs)'"
          :height="700"
          :loading="!supplierProductPieData.labels.length"
        />
        <PieChart
          :labels="clientProductPieData.labels"
          :datasets="clientProductPieData.datasets"
          :showCustomLegend="false"
          :theme="theme ? 'dark' : 'light'"
          :title="'Répartition produits vendus (clients)'"
          :height="700"
          :loading="!clientProductPieData.labels.length"
        />
      </div>
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
  orders,
  orderLines,
  products,
  contractData,
  contractType,
  clientData,
  supplierData,
  billingOrders,
  headersOrders
} from '@renderer/mock/mockData'
import PageTemplate from '@renderer/pages/ERP/templates/PageTemplate.vue'
import { headersOrderLines } from '@renderer/mock/Billings/Orders/mockDataOrders'

const PieChart = defineAsyncComponent({
  loader: () => import('@components/charts/PieChart.vue'),
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
// Invoice data
const data = reactive({
  orderData: [] as TableItem[],
  orderLinesData: [] as TableItem[],
  orderClientData: [] as TableItem[],
  orderSupplierData: [] as TableItem[],
  orderLinesClientData: [] as TableItem[],
  orderLinesSupplierData: [] as TableItem[],
  headersOrders: headersOrders as TableHeader[],
  headersOrderLines: headersOrderLines as TableHeader[]
})
// doit rester ici
// doit rester ici
const stats = reactive({
  orderCount: 0,
  orderClientCount: 0,
  orderSupplierCount: 0
})

// doit rester ici
const spreadsheetData = computed(() => ({
  orderData: data.orderData,
  orderClientData: data.orderClientData,
  orderSupplierData: data.orderSupplierData,
  orderLinesData: data.orderLinesData,
  orderLinesClientData: data.orderLinesClientData,
  orderLinesSupplierData: data.orderLinesSupplierData
}))
// doit rester ici
const workbookData = computed(() => {
  return convertDataToUniver(spreadsheetData.value, {
    workbookId: 'commandes',
    workbookName: 'Données Commandes'
  })
})
// doivent rester ici
let spreadsheetOpen = ref(false)
const themeStore = useThemeStore()
const theme = themeStore.theme

// Lifecycle hooks
onBeforeMount(() => {
  // Initialize orders with contract information
  data.orderData = orders.map((o) => {
    const billingOrder = billingOrders.find((b) => b.orderId === o.id)
    const billing = billings.find((b) => b.id === billingOrder?.billingId)
    const contract = contractData.find((c) => c.billingId === billing?.id)
    const contractName =
      contract?.type === contractType.Client
        ? clientData.find((cl) => cl.id === contract?.contractId)?.name
        : supplierData.find((s) => s.id === contract?.contractId)?.name
    return {
      id: o.id,
      contractName,
      contractType: contract?.type,

      name: o.name,
      date: o.date,
      cost: o.cost,
      billingId: billing?.id
    }
  })

  data.orderClientData = data.orderData.filter((o) => o.contractType === contractType.Client)
  data.orderSupplierData = data.orderData.filter((o) => o.contractType === contractType.Supplier)
  // Load all order lines
  data.orderLinesData = orderLines.map((ol) => {
    const ord = data.orderData.find((o) => o.id === ol.orderId)
    return {
      id: ol.id,
      contractName: ord?.contractName,
      contractType: ord?.contractType,
      orderId: ol.orderId,
      orderName: ord?.name,
      discount: ol.discount,
      productId: ol.productId,
      productName: products.find((p) => p.id === ol.productId)?.name,
      quantity: ol.quantity,
      total: ol.total
    }
  })
  // Split order lines by client/supplier
  data.orderLinesClientData = orderLines
    .filter((ol) => {
      const ord = data.orderData.find((o) => o.id === ol.orderId)
      return ord?.contractType === contractType.Client
    })
    .map((ol) => {
      const ord = data.orderData.find((o) => o.id === ol.orderId)
      return {
        id: ol.id,
        contractName: ord?.contractName,
        contractType: ord?.contractType,
        orderId: ol.orderId,
        orderName: ord?.name,
        discount: ol.discount,
        productId: ol.productId,
        productName: products.find((p) => p.id === ol.productId)?.name,
        quantity: ol.quantity,
        total: ol.total
      }
    })

  data.orderLinesSupplierData = orderLines
    .filter((ol) => {
      const ord = data.orderData.find((o) => o.id === ol.orderId)
      return ord?.contractType === contractType.Supplier
    })
    .map((ol) => {
      const ord = data.orderData.find((o) => o.id === ol.orderId)
      return {
        id: ol.id,
        contractName: ord?.contractName,
        contractType: ord?.contractType,
        orderId: ol.orderId,
        orderName: ord?.name,
        discount: ol.discount,
        productId: ol.productId,
        productName: products.find((p) => p.id === ol.productId)?.name,
        quantity: ol.quantity,
        total: ol.total
      }
    })

  // compute stats
  stats.orderCount = data.orderData.length
  stats.orderClientCount = data.orderClientData.length
  stats.orderSupplierCount = data.orderSupplierData.length
})

onMounted(async () => {
  console.log('onMounted - data updated in onmounted', data)
  console.log('onMounted - using data updated in onmounted to update stats reactive data')

  console.log('onMounted - after updating stats reactive data', stats)

  console.log('supplierMonthly', supplierMonthly.value)
  console.log('clientMonthly', clientMonthly.value)
})

onUnmounted(async () => {
  stats.orderCount = 0
  stats.orderClientCount = 0
  stats.orderSupplierCount = 0

  data.orderData = []
  data.orderClientData = []
  data.orderSupplierData = []
  data.orderLinesData = []
  data.orderLinesClientData = []
  data.orderLinesSupplierData = []

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

const supplierMonthly = computed(() => {
  return monthLabels.value.map((_, m) =>
    data.orderSupplierData
      .filter((i) => new Date(i.date).getMonth() === m)
      .reduce((s, i) => s + i.cost, 0)
  )
})

const clientMonthly = computed(() => {
  return monthLabels.value.map((_, m) =>
    data.orderClientData
      .filter((i) => new Date(i.date).getMonth() === m)
      .reduce((s, i) => s + i.cost, 0)
  )
})

const pastelPalette = [
  '#a5d8ff',
  '#b2f2bb',
  '#ffd6a5',
  '#ffadad',
  '#cdb4db',
  '#fdffb6',
  '#b5ead7',
  '#fbc3bc',
  '#b5b9ff',
  '#f1c0e8',
  '#f9f9c5',
  '#f7b267',
  '#b7e4c7',
  '#e2f0cb',
  '#f6d6ad',
  '#f8ad9d',
  '#d0bdf4',
  '#b3cde0',
  '#fbb4ae',
  '#ccebc5'
]

const supplierProductPieData = computed(() => {
  const counts = {}
  data.orderLinesSupplierData.forEach((line) => {
    const prod = products.find((p) => p.id === line.productId)
    const name = prod ? prod.name : `Produit #${line.productId}`
    counts[name] = (counts[name] || 0) + line.quantity
  })
  return {
    labels: Object.keys(counts),
    datasets: [
      {
        data: Object.values(counts),
        backgroundColor: pastelPalette.slice(0, Object.keys(counts).length)
      }
    ]
  }
})

const clientProductPieData = computed(() => {
  const counts = {}
  data.orderLinesClientData.forEach((line) => {
    const prod = products.find((p) => p.id === line.productId)
    console.log('prod', prod)
    console.log('line', line)
    console.log('products', products)

    const name = prod ? prod.name : `Produit #${line.productId}`
    counts[name] = (counts[name] || 0) + line.quantity
  })
  return {
    labels: Object.keys(counts),
    datasets: [
      {
        data: Object.values(counts),
        backgroundColor: pastelPalette.slice(0, Object.keys(counts).length)
      }
    ]
  }
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
