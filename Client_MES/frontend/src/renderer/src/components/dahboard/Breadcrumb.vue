<template>
  <nav aria-label="breadcrumb" class="breadcrumb-container">
    <transition-group name="breadcrumb-anim" tag="ol" class="breadcrumb-list">
      <template v-if="breadcrumbs.length <= 6">
        <li
          v-for="(crumb, index) in breadcrumbs"
          :key="index"
          class="breadcrumb-item"
          :class="{ active: index === breadcrumbs.length - 1 }"
        >
          <span v-if="index > 0" class="breadcrumb-chevron">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b1b4bb" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </span>
          <router-link
            v-if="index < breadcrumbs.length - 1"
            :to="crumb.to"
            class="breadcrumb-link"
          >
            {{ crumb.text }}
          </router-link>
          <span v-else class="breadcrumb-current">{{ crumb.text }}</span>
        </li>
      </template>
      <template v-else>
        <li
          v-for="(crumb, index) in breadcrumbs.slice(0,2)"
          :key="'start-' + index"
          class="breadcrumb-item"
        >
          <span v-if="index > 0" class="breadcrumb-chevron">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b1b4bb" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </span>
          <router-link :to="crumb.to" class="breadcrumb-link">{{ crumb.text }}</router-link>
        </li>
        <li class="breadcrumb-item breadcrumb-ellipsis" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
          <span class="breadcrumb-chevron">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b1b4bb" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </span>
          <span class="breadcrumb-link ellipsis">...</span>
          <div v-if="showDropdown" class="breadcrumb-dropdown">
            <router-link
              v-for="(crumb, idx) in breadcrumbs.slice(2, breadcrumbs.length-3)"
              :key="'drop-' + idx"
              :to="crumb.to"
              class="breadcrumb-link dropdown-link"
            >
              {{ crumb.text }}
            </router-link>
          </div>
        </li>
        <li
          v-for="(crumb, index) in breadcrumbs.slice(-3)"
          :key="'end-' + index"
          class="breadcrumb-item"
          :class="{ active: index === 2 }"
        >
          <span class="breadcrumb-chevron">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b1b4bb" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </span>
          <router-link
            v-if="index < 2"
            :to="crumb.to"
            class="breadcrumb-link"
          >
            {{ crumb.text }}
          </router-link>
          <span v-else class="breadcrumb-current">{{ crumb.text }}</span>
        </li>
      </template>
    </transition-group>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useHistoryStore } from '../../stores/HistoryStore';
import { useAuthStore } from '../../stores/AuthStore';

const showDropdown = ref(false);
const historyStore = useHistoryStore();
const authStore = useAuthStore();
const breadcrumbs = computed(() => {
  // On ne veut jamais afficher 'Root', ni 'Login' si on est authentifié
  return historyStore.history
    .filter(crumb => crumb.name !== 'Root' && (crumb.name !== 'Login' || !authStore.isAuthenticated))
    .map(crumb => ({
      text: crumb.meta?.breadcrumb || crumb.name,
      to: { name: crumb.name, params: crumb.params }
    }));
});
</script>

<style scoped>
/* Consolidated breadcrumb styles with unique selectors */
.breadcrumb-container {
  display: flex;
  align-items: center;
  padding: 7px 0;
  margin: 0 0 18px;
  border-radius: 18px;
  background: var(--breadcrumb-container-background-color);
  backdrop-filter: blur(2px) saturate(15%);
  -webkit-backdrop-filter: blur(2px) saturate(150%);
  border: 1.2px solid var(--breadcrumb-container-border-color);
  box-shadow: none;
  position: static;
  overflow: visible;
}

.breadcrumb-list {
  list-style: none;
  display: flex;
  align-items: center;
  padding: 0 14px;
  margin: 0;
  gap: 0.6vw;
  position: relative;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: var(--breadcrumb-item-color);
  font-weight: 500;
  letter-spacing: 0.01em;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  background: none;
  box-shadow: none;
}

.breadcrumb-chevron {
  display: flex;
  align-items: center;
  margin: 0 7px 0 7px;
  height: 16px;
}
.breadcrumb-chevron svg {
  width: 14px;
  height: 14px;
  stroke: var(--breadcrumb-chevron-stroke-svg-color);
  stroke-width: 1.5;
  vertical-align: middle;
  opacity: 0.9;
  filter: none;
}

.breadcrumb-link {
  display: inline;
  background: none;
  color: var(--breadcrumb-link-color);
  border-radius: 0;
  padding: 0 3px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  position: relative;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  transition: color 0.18s;
}
.breadcrumb-link::after {
  content: '';
  display: block;
  position: absolute;
  left: 0; right: 0; bottom: -2px;
  height: 2px;
  background: var(--breadcrumb-link-after-background-color);
  border-radius: 2px;
  transform: scaleX(0);
  transition: transform 0.22s cubic-bezier(.4,0,.2,1);
}
.breadcrumb-link:hover {
  color: var(--breadcrumb-link-hover-color);
}
.breadcrumb-link:hover::after {
  transform: scaleX(1);
}

.breadcrumb-current {
  display: inline;
  background: none;
  color: var(--breadcrumb-current-color);
  font-size: 16.5px;
  font-weight: 700;
  margin-left: 2px;
  letter-spacing: 0.01em;
  border: none;
  text-shadow: 0 1px 7px var(--breadcrumb-text-shadow-color);
  padding: 0 3px;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  position: relative;
}

.breadcrumb-dropdown {
  position: absolute;
  background: var(--breadcrumb-dropdown-background-color);
  box-shadow: 0 2px 12px 0 var(--breadcrumb-dropdown-box-shadow-color);
  border-radius: 10px;
  margin-top: 7px;
  padding: 7px 0;
  z-index: 10;
  min-width: 140px;
  border: 1px solid var(--breadcrumb-dropdown-border-color);
  backdrop-filter: blur(3px);
}
.dropdown-link {
  display: block;
  padding: 7px 16px;
  color: var(--breadcrumb-link-color);
  background: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
}
.dropdown-link:hover {
  background: var(--breadcrumb-dropdown-link-hover-background-color);
  color: var(--breadcrumb-dropdown-link-hover-color);
}
.ellipsis {
  letter-spacing: 0.22em;
  color: var(--breadcrumb-ellipsis-color);
  font-size: 17px;
}

.breadcrumb-ellipsis {
  position: relative;
}

@media (max-width: 700px) {
  .breadcrumb-list {
    padding: 0 4px;
    gap: 1px;
  }
  .breadcrumb-link, .breadcrumb-current {
    font-size: 13px;
    padding: 3px 8px;
  }
  .breadcrumb-current {
    padding: 3px 10px;
  }
}

.breadcrumb-container::after {
  content: '';
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: var(--breadcrumb-container-background-color-after);
  opacity: 0.7;
  z-index: 0;
  mix-blend-mode: var(--breadcrumb-container-background-color-mix-blend-mode);
}
.breadcrumb-list {
  list-style: none;
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin: 0;
  gap: 0.5vw;
  position: relative;
  z-index: 1;
}
.breadcrumb-item {
  display: flex;
  align-items: center;
  font-size: 17px;
  color: var(--breadcrumb-item-color);
  font-weight: 400;
  letter-spacing: 0.01em;
  transition: color 0.2s;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}
.breadcrumb-chevron {
  display: flex;
  align-items: center;
  margin: 0 10px 0 10px;
  height: 16px;
}
.breadcrumb-chevron svg {
  width: 15px;
  height: 15px;
  stroke: var(--breadcrumb-chevron-stroke-svg-color);
  stroke-width: 1.3;
  vertical-align: middle;
  transition: stroke 0.2s;
  opacity: 0.68;
  filter: drop-shadow(0 1px 2px var(--breadcrumb-chevron-stroke-svg-color));
}
.breadcrumb-link {
  display: inline;
  background: none;
  color: var(--breadcrumb-link-color);
  border-radius: 0;
  padding: 0 2px;
  font-size: 17px;
  font-weight: 400;
  text-decoration: none;
  transition: color 0.18s, text-shadow 0.18s;
  box-shadow: none;
  border: none;
  position: relative;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}
.breadcrumb-link::after {
  content: '';
  display: block;
  position: absolute;
  left: 0; right: 0; bottom: -2px;
  height: 2px;
  background: var(--breadcrumb-gradient-2);
  border-radius: 2px;
  transform: scaleX(0);
  transition: transform 0.22s cubic-bezier(.4,0,.2,1);
}
.breadcrumb-link:hover {
  color: #007aff;
  text-shadow: 0 2px 8px rgba(0,122,255,0.08);
}
.breadcrumb-link:hover::after {
  transform: scaleX(1);
}
.breadcrumb-current {
  display: inline;
  background: none;
  color: #181d2a;
  font-size: 17.5px;
  font-weight: 700;
  margin-left: 2px;
  border: none;
  z-index: 1;
}

.breadcrumb-link::after {
  content: '';
  display: block;
  position: absolute;
  left: 0; right: 0; bottom: -2px;
  height: 2px;
  background: var(--breadcrumb-gradient-2);
  border-radius: 2px;
  transform: scaleX(0);
  transition: transform 0.22s cubic-bezier(.4,0,.2,1);
}

.breadcrumb-link::before {
  content: '';
  position: absolute;
  left: 0; right: 0; top: 50%;
  height: 80%;
  border-radius: 8px;
  pointer-events: none;
  background: var(--breadcrumb-gradient-4);
  opacity: 0;
  transform: scaleX(0.7) translateY(-50%);
  transition: opacity 0.32s, transform 0.42s cubic-bezier(.4,0,.2,1);
  z-index: 0;
}

.breadcrumb-link:hover {
  color: var(--breadcrumb-link-hover-color-alt);
  text-decoration: underline;
  text-shadow: 0 2px 8px var(--breadcrumb-link-hover-shadow);
  background: var(--breadcrumb-link-hover-bg);
  border: none;
}

.breadcrumb-link:hover::after {
  transform: scaleX(1);
}

.breadcrumb-link:hover::before {
  opacity: 1;
  transform: scaleX(1.09) translateY(-50%);
}

.breadcrumb-current {
  display: inline;
  background: none;
  color: var(--breadcrumb-current-color-alt);
  font-size: 16.5px;
  font-weight: 700;
  margin-left: 2px;
  letter-spacing: 0.01em;
  border: none;
  text-shadow: none;
  padding: 0 2px;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  position: relative;
}

.breadcrumb-current::after {
  content: '';
  display: block;
  position: absolute;
  left: 0; right: 0; bottom: -3px;
  height: 3px;
  background: var(--breadcrumb-gradient-1);
  border-radius: 2px;
  opacity: 0.7;
}

.breadcrumb-dropdown {
  position: absolute;
  background: var(--breadcrumb-dropdown-bg);
  box-shadow: var(--breadcrumb-dropdown-box-shadow);
  border-radius: 12px;
  margin-top: 8px;
  padding: 8px 0;
  z-index: 10;
  min-width: 160px;
  border: 1px solid var(--breadcrumb-dropdown-border-color-alt);
  backdrop-filter: blur(4px);
}

.dropdown-link {
  display: block;
  padding: 8px 20px;
  color: var(--breadcrumb-dropdown-link-color-alt);
  background: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  transition: background 0.18s, color 0.18s;
}

.dropdown-link:hover {
  background: var(--breadcrumb-dropdown-link-hover-bg-alt);
  color: var(--breadcrumb-dropdown-link-hover-color-alt);
}

.ellipsis {
  letter-spacing: 0.25em;
  color: var(--breadcrumb-ellipsis-color-alt);
  font-size: 18px;
}

.breadcrumb-ellipsis {
  position: relative;
}

@media (max-width: 700px) {
  .breadcrumb-list {
    padding: 0 4px;
    gap: 1px;
  }
  .breadcrumb-link, .breadcrumb-current {
    font-size: 13px;
    padding: 3px 8px;
  }
  .breadcrumb-current {
    padding: 3px 10px;
  }
}

.breadcrumb-anim-enter-active, .breadcrumb-anim-leave-active {
  transition: all 0.55s cubic-bezier(.4,0,.2,1);
}

.breadcrumb-anim-enter-from {
  opacity: 0;
  transform: translateY(18px) scale(0.92);
  filter: blur(8px);
}

.breadcrumb-anim-enter-to {
  opacity: 1;
  transform: none;
  filter: none;
}

.breadcrumb-anim-leave-from {
  opacity: 1;
  transform: none;
  filter: none;
}

.breadcrumb-anim-leave-to {
  opacity: 0;
  transform: translateY(-18px) scale(0.95);
  filter: blur(8px);
}
</style>
