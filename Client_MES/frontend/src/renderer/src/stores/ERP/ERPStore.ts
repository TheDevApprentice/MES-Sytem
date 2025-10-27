import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { useBillingStore } from './BillingStore'
import { useOrderStore } from './OrderStore'
import { useSupplierStore } from './SupplierStore'

export const useERPStore = defineStore('erp', () => {
  const billingStore = useBillingStore()
  const orderStore = useOrderStore()
  const supplierStore = useSupplierStore()

  const state = reactive({
    billings: billingStore.items,
    orders: orderStore.items,
    suppliers: supplierStore.items,
    loading: {
      billings: billingStore.loading,
      orders: orderStore.loading,
      suppliers: supplierStore.loading
    },
    error: {
      billings: billingStore.error,
      orders: orderStore.error,
      suppliers: supplierStore.error
    }
  })

  async function init() {
    // Load all ERP data
    await Promise.all([billingStore.fetchAll(), orderStore.fetchAll(), supplierStore.fetchAll()])
  }

  return {
    ...toRefs(state),
    init
  }
})
