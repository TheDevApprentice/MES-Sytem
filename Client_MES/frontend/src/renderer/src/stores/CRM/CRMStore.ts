import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import { useClientStore } from './ClientStore'

export const useCRMStore = defineStore('crm', () => {
  const clientStore = useClientStore()

  const state = reactive({
    clients: clientStore.clients,
    loading: clientStore.loading,
    error: clientStore.error
  })

  async function init() {
    // Initialize CRM module by loading clients
    await clientStore.fetchAll()
  }

  return {
    ...toRefs(state),
    init
  }
})
