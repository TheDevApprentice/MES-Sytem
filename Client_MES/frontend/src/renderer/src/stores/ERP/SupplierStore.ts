import { defineStore } from 'pinia'
import { ref } from 'vue'

// Mock data import
import { supplierData } from '@renderer/mock/mockData'

export const useSupplierStore = defineStore('supplier', () => {
  const items = ref<typeof supplierData>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const mock = await import('@renderer/mock/mockData')
      items.value = mock.supplierData
    } catch (e: any) {
      error.value = e?.message || 'Failed to load suppliers'
    } finally {
      loading.value = false
    }
  }

  return { items, loading, error, fetchAll }
})
