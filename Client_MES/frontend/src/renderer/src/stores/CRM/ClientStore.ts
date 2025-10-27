import { defineStore } from 'pinia'
import { ref } from 'vue'

// Mock data import
import { clientData } from '@renderer/mock/mockData'

export const useClientStore = defineStore('client', () => {
  const clients = ref<typeof clientData>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      // Load from mock data for now
      const mock = await import('@renderer/mock/mockData')
      clients.value = mock.clientData
    } catch (e: any) {
      error.value = e?.message || 'Failed to load clients'
    } finally {
      loading.value = false
    }
  }

  return { clients, loading, error, fetchAll }
})
