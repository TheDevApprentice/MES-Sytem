import { defineStore } from 'pinia'
import { ref } from 'vue'

// Mock data import
import { orders } from '@renderer/mock/mockData'

export const useOrderStore = defineStore('order', () => {
  const items = ref<typeof orders>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const mock = await import('@renderer/mock/mockData')
      items.value = mock.orders
    } catch (e: any) {
      error.value = e?.message || 'Failed to load orders'
    } finally {
      loading.value = false
    }
  }

  return { items, loading, error, fetchAll }
})
