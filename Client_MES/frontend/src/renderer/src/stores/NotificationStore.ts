import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface NotificationItem {
  id: string
  message: string
  url: string
  type: NotificationType
  timestamp: number // epoch ms
  read: boolean
}

/**
 * NotificationStore – gère la liste des notifications utilisateur.
 * (Le backend pourra pousser via WebSocket ou polling.)
 */
export const useNotificationStore = defineStore('notifications', () => {
  const items = ref<NotificationItem[]>([])

  // --- Getters ---
  const unreadCount = computed(() => items.value.filter(n => !n.read).length)

  // --- Actions ---
  function addNotification(message: string, url: string, type: NotificationType = 'info') {
    const id = Math.random().toString(36).slice(2)
    items.value.unshift({ id, message, url, type, timestamp: Date.now(), read: false })
  }

  function markAsRead(id: string) {
    const notif = items.value.find(n => n.id === id)
    if (notif) notif.read = true
  }

  function markAllRead() {
    items.value.forEach(n => (n.read = true))
  }

  // --- Dev samples ---
  if (import.meta.env.DEV) {
    addNotification('Nouvelle commande créée', '/orders/123', 'info')
    addNotification('Production terminée avec succès', '/production', 'success')
    addNotification('Température machine élevée', '/dashboard', 'warning')
  }

  return {
    items,
    unreadCount,
    addNotification,
    markAsRead,
    markAllRead,
  }
})
