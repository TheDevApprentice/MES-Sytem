<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/AuthStore'

const menuOpen = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const navLinks = [
  { label: 'Accueil', icon: '🏠', route: '/home' },
  {
    label: 'MES', icon: '🛠️', children: [
      { label: 'Accueil MES', icon: '🏠', route: '/mes/home' },
      { label: 'Ordres', icon: '📦', route: '/mes/ordres' },
      { label: 'Suivi production', icon: '🏭', route: '/mes/suivi-production' },
      { label: 'Rapports', icon: '📈', route: '/mes/rapports' },
      { label: 'Paramètres', icon: '⚙️', route: '/mes/parametres' }
    ]
  },
  {
    label: 'ERP', icon: '💼', children: [
      { label: 'Accueil ERP', icon: '🏠', route: '/erp/home' },
      { label: 'Fournisseurs', icon: '🔗', route: '/erp/fournisseurs' },
      { label: 'Commandes', icon: '📝', route: '/erp/commandes' },
      { label: 'Factures', icon: '💳', route: '/erp/factures' },
      { label: 'Stocks', icon: '📦', route: '/erp/stocks' },
      { label: 'Reporting', icon: '📊', route: '/erp/reporting' },
      { label: 'Paramètres', icon: '⚙️', route: '/erp/parametres' }
    ]
  },
  {
    label: 'CRM', icon: '👥', children: [
      { label: 'Accueil CRM', icon: '🏠', route: '/crm/home' },
      { label: 'Clients', icon: '🧑‍💼', route: '/crm/clients' },
      { label: 'Opportunités', icon: '💡', route: '/crm/opportunites' },
      { label: 'Activités', icon: '📅', route: '/crm/activites' },
      { label: 'Reporting', icon: '📊', route: '/crm/reporting' },
      { label: 'Paramètres', icon: '⚙️', route: '/crm/parametres' }
    ]
  },
  {
    label: 'RH', icon: '🧑‍💼', children: [
      { label: 'Accueil RH', icon: '🏠', route: '/rh/home' },
      { label: 'Employés', icon: '👷', route: '/rh/employes' },
      { label: 'Absences', icon: '📆', route: '/rh/absences' },
      { label: 'Recrutement', icon: '📝', route: '/rh/recrutement' },
      { label: 'Entretiens', icon: '💬', route: '/rh/entretiens' },
      { label: 'Reporting', icon: '📊', route: '/rh/reporting' },
      { label: 'Paramètres', icon: '⚙️', route: '/rh/parametres' }
    ]
  },
  {
    label: 'Reporting', icon: '📊', children: [
      { label: 'Accueil Reporting', icon: '🏠', route: '/reporting/home' },
      { label: 'Rapports', icon: '📈', route: '/reporting/rapports' }
    ]
  },
  { label: 'Data Analyse', icon: '🧪', route: '/data-analyse' },
  { label: 'Test', icon: '🧪', route: '/test' }
];

const openSubMenu = ref<string | null>(null);

function toggleSubMenu(link: any) {
  if (openSubMenu.value === link.label) {
    openSubMenu.value = null;
  } else {
    openSubMenu.value = link.label;
  }
}

function isParentActive(link: any) {
  if (!link.children) return false;
  return link.children.some((child: any) => child.route === route.path);
}

async function handleLogout(e?: Event) {
  if (e) e.preventDefault()
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div>
    <div
      :class="['side-menu', { open: menuOpen }]"
      @mouseenter="menuOpen = true"
      @mouseleave="menuOpen = false"
    >
      <div class="menu-header">
        <img src="../../assets/mes.png" class="menu-logo" alt="logo" />
        <button class="menu-toggle always" @click="menuOpen = !menuOpen">
          <span class="hamburger" :class="{ open: menuOpen }">
            <span></span><span></span><span></span>
          </span>
        </button>
      </div>
      <nav class="menu-links">
  <template v-for="link in navLinks" :key="link.label">
  <router-link
    v-if="!link.children"
    :to="link.route"
    class="menu-link"
    active-class="active"
  >
    <span class="menu-icon">{{ link.icon }}</span>
    <span class="menu-label">{{ link.label }}</span>
  </router-link>
  <div v-else class="submenu-parent-group" @mouseenter="openSubMenu = link.label" @mouseleave="openSubMenu = null">
    <div class="menu-link submenu-parent" :class="{ active: isParentActive(link) }" @click="toggleSubMenu(link)">
      <span class="menu-icon">{{ link.icon }}</span>
      <span class="menu-label">{{ link.label }}</span>
      <span class="submenu-arrow" :class="{ open: openSubMenu === link.label }">▶</span>
    </div>
    <transition name="submenu-dropdown">
      <div
        v-if="openSubMenu === link.label"
        class="submenu-vertical"
      >
        <router-link
          v-for="(child, idx) in link.children"
          :key="child.label"
          :to="child.route"
          class="menu-link submenu-link"
          active-class="active"
          :style="{'--submenu-index': idx}"
        >
          <span class="menu-icon">{{ child.icon }}</span>
          <span class="menu-label">{{ child.label }}</span>
        </router-link>
      </div>
    </transition>
  </div>
</template>

</nav>

    </div>
    <div v-if="menuOpen" class="menu-overlay" @click="menuOpen = false"></div>
  </div>
</template>

<style scoped>
.side-menu {
  position: fixed;
  top: 32px;
  left: 0;
  height: calc(100vh - 32px);
  width: 66px;
  background: linear-gradient(120deg, rgba(44, 62, 120, 0.92) 0%, rgba(90, 30, 140, 0.92) 100%);
  backdrop-filter: blur(12px);
  z-index: 3000;
  box-shadow: 2px 0 24px 0 rgba(44, 62, 120, 0.13);
  transition:
    width 0.26s cubic-bezier(0.7, 1.4, 0.6, 1),
    box-shadow 0.22s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.side-menu.open {
  width: 220px;
  box-shadow: 8px 0 40px 0 rgba(90, 30, 140, 0.13);
}
.menu-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px 10px 16px;
}
.menu-logo {
  width: 36px;
  height: 36px;
  filter: drop-shadow(0 2px 8px #b03a7a33);
}
.menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
  padding: 6px;
  border-radius: 5px;
  transition: background 0.18s;
  z-index: 10;
}
.menu-toggle:hover {
  background: rgba(255, 255, 255, 0.09);
}
.hamburger {
  display: inline-block;
  width: 24px;
  height: 18px;
  position: relative;
}
.hamburger span {
  display: block;
  height: 3px;
  width: 100%;
  background: linear-gradient(90deg, #90caf9 0%, #e94090 100%);
  border-radius: 2px;
  margin: 3px 0;
  transition: all 0.26s cubic-bezier(0.7, 1.4, 0.6, 1);
}
.hamburger.open span:nth-child(1) {
  transform: translateY(7.5px) rotate(45deg);
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
}
.hamburger.open span:nth-child(3) {
  transform: translateY(-7.5px) rotate(-45deg);
}
.menu-links {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 16px;
}
.menu-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 18px;
  color: #fff;
  font-size: 1.08em;
  font-weight: 500;
  border-radius: 8px;
  text-decoration: none;
  transition:
    background 0.18s,
    color 0.18s,
    box-shadow 0.18s;
  position: relative;
}
.menu-link.submenu-arrow {
  margin-left: auto;
  font-size: 1.1em;
  transition: transform 0.45s cubic-bezier(.44,1.7,.5,1);
}
.submenu-arrow.open {
  transform: rotate(90deg);
  transition: transform 0.65s cubic-bezier(.44,1.7,.5,1);
}
.menu-link.submenu-link {
  padding-left: 56px;
  font-size: 0.98em;
  opacity: 0;
  transform: translateX(-24px);
  transition:
    opacity 0.35s cubic-bezier(.44,1.7,.5,1),
    transform 0.35s cubic-bezier(.44,1.7,.5,1),
    background 0.22s, box-shadow 0.18s, scale 0.18s;
  transition-delay: calc(var(--submenu-index, 0) * 55ms);
  border-radius: 7px;
}
.submenu-vertical .submenu-link {
  opacity: 1;
  transform: translateX(0);
}
.menu-link:hover, .menu-link.active {
  background: linear-gradient(90deg, #f5e9fa 0%, #e3f0ff 100%);
  color: #4a3a7a;
  box-shadow: 0 2px 8px 0 rgba(90, 30, 140, 0.10);
  transform: scale(1.035);
  border-radius: 7px;
}
.submenu-link:hover, .submenu-link.active {
  background: linear-gradient(90deg, #f7faff 0%, #f1f6ff 100%);
  color: #4a3a7a;
  box-shadow: 0 2px 8px 0 rgba(90, 30, 140, 0.09);
  transform: scale(1.027);
  border-radius: 7px;
}
/* Animation apparition du sous-menu (slide-down + fade) */
.submenu-dropdown-enter-active, .submenu-dropdown-leave-active {
  transition: max-height 0.35s cubic-bezier(.44,1.7,.5,1), opacity 0.35s, transform 0.35s cubic-bezier(.44,1.7,.5,1);
  overflow: hidden;
}
.submenu-dropdown-enter-from, .submenu-dropdown-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-14px);
}
.submenu-dropdown-enter-to, .submenu-dropdown-leave-from {
  max-height: 300px;
  opacity: 1;
  transform: translateY(0);
}

.menu-label {
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.18s;
}
.side-menu:not(.open) .menu-label {
  opacity: 0;
  width: 0;
  overflow: hidden;
}
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(30, 30, 40, 0.18);
  z-index: 2999;
  cursor: pointer;
}
</style>