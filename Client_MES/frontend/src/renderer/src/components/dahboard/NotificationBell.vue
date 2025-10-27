<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useNotificationStore } from '../../stores/NotificationStore'
import { useRouter } from 'vue-router'

const store = useNotificationStore()
const router = useRouter()

const open = ref(false)

function toggle() {
  open.value = !open.value
}

function goTo(notifId: string, url: string) {
  store.markAsRead(notifId)
  open.value = false
  router.push(url)
}

// Ferme le dropdown lorsqu'on clique en dehors
function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.notification-container')) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

/**
 * Retourne une chaîne « il y a X sec/min/h/ j »
 */
function relativeTime(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000) // secondes
  if (diff < 60) return `${diff}s`
  const min = Math.floor(diff / 60)
  if (min < 60) return `${min}m`
  const hrs = Math.floor(min / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  return `${days}j`
}

const unread = computed(() => store.unreadCount)

const typeMeta: Record<string, { color: string; svg: string }> = {
  info: {
    color: '#2196f3',
    svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm.75 15h-1.5v-6h1.5v6zm0-8h-1.5V7h1.5v2z" /></svg>',
  },
  success: {
    color: '#4caf50',
    svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 15l-5-5 1.41-1.41L11 13.17l6.59-6.59L19 8l-8 9z" /></svg>',
  },
  warning: {
    color: '#ff9800',
    svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M1 21h22L12 2 1 21zm12-3h-2v2h2v-2zm0-6h-2v4h2v-4z" /></svg>',
  },
  error: {
    color: '#f44336',
    svg: '<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" /></svg>',
  },
}
</script>

<template>
  <div class="notification-container" style="position: relative">
    <button class="notification-btn" @click="toggle" aria-label="Notifications">
      <span class="bell-anim">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 24a2.4 2.4 0 002.4-2.4h-4.8A2.4 2.4 0 0012 24zm6.4-6v-5.6c0-3.12-1.68-5.76-4.8-6.48V5.6a1.6 1.6 0 10-3.2 0v.32c-3.12.72-4.8 3.36-4.8 6.48V18l-1.6 1.6v.8h16v-.8L18.4 18z"
        />
      </svg>
      </span>
      <span v-if="unread" class="dot"></span>
    </button>

    <div v-if="open" class="dropdown">
      <p v-if="!store.items.length" class="empty">Aucune notification</p>
      <ul v-else>
        <li
          v-for="n in store.items"
          :key="n.id"
          :class="{ unread: !n.read }"
          @click="goTo(n.id, n.url)"
        >
          <span class="icon" :style="{ background: typeMeta[n.type]?.color || '#ccc' }" v-html="typeMeta[n.type]?.svg"></span>
          <span class="msg">{{ n.message }}</span>
          <span class="time">{{ relativeTime(n.timestamp) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.notification-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: var(--color-background-mute);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.25s,
    box-shadow 0.25s;
}
.notification-btn:hover {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
}
.bell-anim {
  display: flex;
}
.notification-btn:hover .bell-anim {
  animation: shake-bell 0.6s cubic-bezier(.36,.07,.19,.97) both;
}
.notification-btn svg {
  width: 20px;
  height: 20px;
  fill: var(--color-text);
}
.dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background: var(--home-accent-color);
  border-radius: 50%;
}
.dropdown {
  position: absolute;
  top: 42px;
  right: 0;
  min-width: 240px;
  max-height: 300px;
  overflow-y: auto;
  background: var(--home-bg-card);
  color: var(--home-text-color);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  z-index: 2000;
}
.dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.dropdown li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 14px;
  font-size: 0.9em;
  cursor: pointer;
}
.icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.dropdown li.unread {
  font-weight: 600;
  background: rgba(0, 0, 0, 0.05);
}
.dropdown li:hover {
  background: rgba(0, 0, 0, 0.08);
}
.empty {
  padding: 10px 14px;
  font-size: 0.9em;
  color: var(--color-text);
}
.time {
  margin-left: auto;
  opacity: 0.6;
  font-size: 0.8em;
}
@keyframes shake-bell {
  0% { transform: rotate(0deg); }
  10% { transform: rotate(-18deg); }
  20% { transform: rotate(14deg); }
  30% { transform: rotate(-12deg); }
  40% { transform: rotate(8deg); }
  50% { transform: rotate(-6deg); }
  60% { transform: rotate(4deg); }
  70% { transform: rotate(-2deg); }
  80% { transform: rotate(1deg); }
  90% { transform: rotate(-1deg); }
  100% { transform: rotate(0deg); }
}
</style>
