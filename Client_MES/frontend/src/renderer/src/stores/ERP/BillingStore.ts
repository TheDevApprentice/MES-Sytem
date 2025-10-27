import { defineStore } from 'pinia'
import { ref } from 'vue'

// Mock data import
import { billings } from '@renderer/mock/mockData'

export const useBillingStore = defineStore('billing', () => {
  const items = ref<typeof billings>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const mock = await import('@renderer/mock/mockData')
      items.value = mock.billings
    } catch (e: any) {
      error.value = e?.message || 'Failed to load billings'
    } finally {
      loading.value = false
    }
  }

  return { items, loading, error, fetchAll }
})
