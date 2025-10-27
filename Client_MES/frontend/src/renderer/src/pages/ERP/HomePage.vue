<template>
  <Suspense>
    <template #default>
      <div class="home-container">
        <div class="home-header">
          <div class="home-title">💼 Tableau de bord ERP</div>
        </div>
        <div class="home-underheader">
          <div class="home-card main-card">
            <h2>Vue d'ensemble</h2>
            <!-- KPI Grid -->
            <div class="kpi-grid">
              <div class="kpi-item">
                <div class="kpi-value">{{ stats.supplierActiveCount }}</div>
                <div class="kpi-label">Fournisseurs actifs</div>
              </div>
              <div class="kpi-item">
                <div class="kpi-value">{{ stats.clientActiveCount }}</div>
                <div class="kpi-label">Clients actifs</div>
              </div>
              <div class="kpi-item">
                <div class="kpi-value">{{ stats.avgSatisfaction }}%</div>
                <div class="kpi-label">Satisfaction moyenne</div>
              </div>
              <div class="kpi-item">
                <div class="kpi-value">{{ stats.avgOrders }}</div>
                <div class="kpi-label">Commandes moyennes</div>
              </div>
              <div class="kpi-item">
                <div class="kpi-value">{{ stats.totalOrders }}</div>
                <div class="kpi-label">Commandes totales</div>
              </div>
              <div class="kpi-item">
                <div class="kpi-value">{{ stats.totalInvoices }}</div>
                <div class="kpi-label">Factures totales</div>
              </div>
            </div>
            <div class="kpi-grid">
              <div class="kpi-item">
                <div class="kpi-value">
                  {{
                    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                      stats.invoiceSupplierTotal
                    )
                  }}
                </div>
                <div class="kpi-label">Total Dépense Factures</div>
              </div>
              <div class="kpi-item">
                <div class="kpi-value">
                  {{
                    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                      stats.invoiceClientTotal
                    )
                  }}
                </div>
                <div class="kpi-label">Total Gain Factures</div>
              </div>
              <div class="kpi-item">
                <div class="kpi-value">
                  {{
                    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                      stats.invoiceProfit
                    )
                  }}
                </div>
                <div class="kpi-label">Bénéfices Factures</div>
              </div>
            </div>
          </div>
        </div>
        <div class="home-content">
          <div class="home-card main-card">
            <!-- Graphiques fournisseurs -->
            <div class="home-card main-card">
              <div class="chart-grid">
                <LineChart
                  title="Commandes"
                  :labels="monthLabels"
                  :datasets="combinedOrdersDatasets"
                  :maintain-aspect-ratio="false"
                  :height="300"
                />
                <!-- Flux total: Gains (clients) & Dépenses (fournisseurs) -->
                <LineChart
                  title="Flux transactionnel"
                  :labels="monthLabels"
                  :datasets="combinedDatasets"
                  :maintain-aspect-ratio="false"
                  :height="400"
                />
                <!-- Pie chart: Dépenses vs Gains -->
                <PieChart
                  title="Répartition Dépenses vs Gains"
                  :labels="expensesGainsPieLabels"
                  :datasets="expensesGainsPieDatasets"
                  :height="320"
                  :show-custom-legend="true"
                />
              </div>
            </div>
          </div>
          <div class="home-side">
            <div class="home-card quick-card">
              <h3>Actions rapides</h3>
              <ul>
                <li><a href="#">Créer un ordre</a></li>
                <li><a href="#">Exporter un rapport</a></li>
              </ul>
            </div>
            <div class="home-card quick-card">
              <h2>Liens rapides</h2>
              <p>Accédez rapidement à vos fonctionnalités principales</p>
              <div class="home-actions">
                <router-link to="/erp/fournisseurs"
                  ><button class="home-btn">Fournisseurs</button></router-link
                >
                <router-link to="/erp/commandes"
                  ><button class="home-btn">Commandes</button></router-link
                >
                <router-link to="/erp/factures"><button class="home-btn">Factures</button></router-link>
                <router-link to="/erp/stocks"><button class="home-btn">Stocks</button></router-link>
                <router-link to="/erp/reporting"
                  ><button class="home-btn">Reporting</button></router-link
                >
                <router-link to="/erp/parametres"
                  ><button class="home-btn">Paramètres</button></router-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>

</template>

<script setup lang="ts">
import { TableHeader, TableItem } from '@renderer/components/tables'
import {
  billingOrders,
  contractData,
  contractType,
  Order,
  orders,
  billings
} from '@renderer/mock/mockData'
import { reactive, onBeforeMount, defineAsyncComponent, computed, onUnmounted } from 'vue'
import LoadingSpinner from '@renderer/components/general/LoadingOverlay.vue'

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

// KPI stats
// Données mock chargées dynamiquement dans onMounted
// doit rester ici
const data = reactive({
  invoiceData: [] as TableItem[],
  headersInvoices: [] as TableHeader[],
  clientData: [] as TableItem[],
  supplierData: [] as TableItem[],
  supplierOrders: [] as TableItem[],
  clientOrders: [] as TableItem[],
  headersSuppliers: [] as TableItem[]
})

// doit rester ici
const stats = reactive({
  invoiceCount: 0,
  clientActiveCount: 0,
  supplierActiveCount: 0,
  avgSatisfaction: 0,
  avgOrders: 0,
  avgDaysSinceLastOrder: 0,
  invoiceSupplierTotal: 0,
  invoiceClientTotal: 0,
  invoiceProfit: 0,
  totalOrders: 0,
  totalInvoices: 0
})

// Lifecycle hooks
onBeforeMount(async () => {
  console.log('Préparation avant montage')
  await import('@renderer/mock/mockData').then((mockData) => {
    const addresses = mockData.addressData
    const addressCountries = mockData.addressCountryData
    const countries = mockData.countryData
    const countryRegionData = mockData.countryRegionData
    const regions = mockData.regionData
    const clientData = mockData.clientData
    const supplierData = mockData.supplierData
    const contacts = mockData.contactData
    const emails = mockData.emailData
    const phones = mockData.phoneData
    const supplierAddr = mockData.supplierAddressData
    const supplierContacts = mockData.supplierContactData

    // build supplier orders list
    const supplierContracts = mockData.contractData.filter(
      (c) => c.type === mockData.contractType.Supplier
    )

    const clientContracts = mockData.contractData.filter(
      (c) => c.type === mockData.contractType.Client
    )

    const supplierBillingIds = supplierContracts.map((c) => c.billingId)
    const clientBillingIds = clientContracts.map((c) => c.billingId)

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

    data.clientOrders = mockData.billingOrders
      .filter((b) => clientBillingIds.includes(b.billingId))
      .map((b) => mockData.orders.find((o) => o.id === b.orderId))
      .filter((o): o is Order => o !== undefined)

    data.headersSuppliers = mockData.headersSuppliers

    data.clientData = mockData.clientData
  })

  stats.supplierActiveCount = data.supplierData.filter((item) => item.active).length
  stats.clientActiveCount = data.clientData.filter((item) => item.active).length
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
  // Total orders et factures
  stats.totalOrders = orders.length
  stats.totalInvoices = billings.length
  // Montants factures: dépenses et gains
  stats.invoiceSupplierTotal = billings
    .filter((b) => {
      const c = contractData.find((c) => c.billingId === b.id)
      return c?.type === contractType.Supplier
    })
    .reduce((sum, b) => sum + b.total, 0)
  stats.invoiceClientTotal = billings
    .filter((b) => {
      const c = contractData.find((c) => c.billingId === b.id)
      return c?.type === contractType.Client
    })
    .reduce((sum, b) => sum + b.total, 0)
  stats.invoiceProfit = stats.invoiceClientTotal - stats.invoiceSupplierTotal
})

onUnmounted(async () => {
  console.log('Déchargement de la page')

  data.invoiceData = []
  data.supplierData = []
  data.clientData = []
  data.headersSuppliers = []
  data.clientOrders = []
  data.supplierOrders = []

  stats.supplierActiveCount = 0
  stats.clientActiveCount = 0
  stats.avgSatisfaction = 0
  stats.avgOrders = 0
  stats.avgDaysSinceLastOrder = 0
  stats.totalOrders = 0
  stats.totalInvoices = 0
  stats.invoiceSupplierTotal = 0
  stats.invoiceClientTotal = 0
  stats.invoiceProfit = 0
})

// Labels mensuels pour commandes et factures
// const monthLabels = expenseLabels
// Labels mensuels
const monthLabels = computed(() => {
  const year = new Date().getFullYear()
  return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1).toLocaleDateString())
})

const clientMoneyMonthly = computed(() =>
  monthLabels.value.map((_, m) =>
    data.invoiceData
      .filter((i) => i.contractType === contractType.Client && new Date(i.date).getMonth() === m)
      .reduce((s, i) => s + i.total, 0)
  )
)

const supplierMoneyMonthly = computed(() =>
  monthLabels.value.map((_, m) =>
    data.invoiceData
      .filter((i) => i.contractType === contractType.Supplier && new Date(i.date).getMonth() === m)
      .reduce((s, i) => s + i.total, 0)
  )
)

const clientOrdersMonthly = computed(() =>
  monthLabels.value.map(
    (_, m) => data.clientOrders.filter((o) => new Date(o.date).getMonth() === m).length
  )
)

const supplierOrdersMonthly = computed(() =>
  monthLabels.value.map(
    (_, m) => data.supplierOrders.filter((o) => new Date(o.date).getMonth() === m).length
  )
)

const combinedDatasets = computed(() => [
  { label: 'Gain', data: clientMoneyMonthly.value },
  { label: 'Dépenses', data: supplierMoneyMonthly.value }
])

const expensesGainsPieLabels = computed(() => ['Dépenses', 'Gains'])
const expensesGainsPieDatasets = computed(() => [
  {
    data: [stats.invoiceSupplierTotal, stats.invoiceClientTotal],
    backgroundColor: [
      '#fbbf24', // Dépenses - pastel yellow/orange
      '#60a5fa'  // Gains - pastel blue
    ],
    borderColor: '#fff',
    borderWidth: 2
  }
])
const combinedOrdersDatasets = computed(() => [
  { label: 'Client', data: clientOrdersMonthly.value },
  { label: 'Fournisseur', data: supplierOrdersMonthly.value }
])
</script>

<style scoped>
.home-container {
  max-height: calc(100vh - 100px);
  width: calc(100vw - 100px);
  overflow-y: auto;
  /* hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin: 90px auto 0 70px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  transition: margin-left 0.26s cubic-bezier(0.7, 1.4, 0.6, 1);
  position: relative;
  z-index: 1;
}
.home-container.menu-shift {
  margin-left: 220px;
}

.home-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 10px;
}
.home-logo {
  width: 44px;
  height: 44px;
  filter: drop-shadow(0 2px 8px #b03a7a33);
}
.home-title {
  font-size: 1.5em;
  font-weight: 600;
  color: var(--home-text-color);
  letter-spacing: 0.5px;
}
.username {
  color: var(--home-accent-color);
  font-weight: 700;
}
.home-content {
  display: flex;
  gap: 32px;
}
.home-card {
  background: var(--home-bg-card);
  border-radius: 14px;
  box-shadow: var(--home-card-shadow);
  padding: 30px 28px 24px 28px;
  color: var(--home-text-color);
  margin-bottom: 22px;
  transition:
    box-shadow 0.22s,
    transform 0.18s;
}
.home-card:hover {
  box-shadow: var(--home-card-shadow-hover);
  transform: translateY(-3px) scale(1.012);
}
.home-card h2 {
  color: var(--home-secondary-color);
  font-size: 1.08em;
  margin-bottom: 8px;
}
.main-card {
  flex: 2;
}

/* KPI grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 22px;
  margin-top: 18px;
}
.kpi-item {
  background: var(--home-bg-card);
  border-radius: 10px;
  padding: 18px 20px;
  text-align: center;
  box-shadow: var(--home-card-shadow);
  transition:
    box-shadow 0.18s,
    transform 0.15s;
}
.kpi-item:hover {
  box-shadow: var(--home-card-shadow-hover);
  transform: translateY(-2px) scale(1.02);
}
.kpi-value {
  font-size: calc(2em * var(--user-font-scale));
  font-weight: 700;
  color: var(--home-accent-color);
  line-height: 1.1;
}
.kpi-label {
  font-size: calc(0.9em * var(--user-font-scale));
  color: var(--home-secondary-color);
  margin-top: 4px;
}
.home-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.home-actions {
  display: flex;
  gap: 18px;
  margin-top: 18px;
  flex-wrap: wrap;
}
.home-btn {
  background: var(--home-btn-gradient);
  color: var(--btn-color-text);
  border: none;
  border-radius: 7px;
  padding: 12px 22px;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  box-shadow: var(--home-btn-shadow);
  transition:
    background 0.18s,
    box-shadow 0.18s,
    transform 0.13s;
  margin-bottom: 8px;
}
.home-btn:hover {
  background: var(--home-btn-gradient-hover);
  box-shadow: var(--home-link-hover-shadow);
  transform: scale(1.04);
}
.info-card h3,
.quick-card h3 {
  color: var(--home-secondary-color);
  font-size: 1.08em;
  margin-bottom: 8px;
}
.info-card ul,
.quick-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.98em;
}
.info-card li,
.quick-card li {
  margin-bottom: 5px;
}
.quick-card a {
  color: var(--home-accent-color);
  text-decoration: underline;
  transition: color 0.16s;
}
.quick-card a:hover {
  color: #e94090;
}
@media (max-width: 900px) {
  .home-content {
    flex-direction: column;
    gap: 18px;
  }
  .home-side {
    flex-direction: row;
    gap: 18px;
  }
  .main-card,
  .home-side {
    width: 100%;
  }
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 18px;
}
</style>
