<script setup lang="ts">
function minimize() { (window.electron as any).minimize() }
function maximize() { (window.electron as any).maximize() }
function close() { (window.electron as any).close() }
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../../stores/AuthStore';
const authStore = useAuthStore();

let displayName = ref<string>('');
onMounted(async () => {
  await authStore.getUserDisplayName()
  displayName.value = authStore.user || 'Connectez vous';
});
</script>

<template>
  <div class="custom-titlebar">
    <div class="left">
      <img src="../../assets/mes.png" alt="logo" class="titlebar-logo" />
      <span class="title">Client MES  {{ '- ' + displayName || '' }}</span>
    </div>
    <div class="window-controls">
      <button @click="minimize">—</button>
      <button @click="maximize">□</button>
      <button @click="close">✕</button>
    </div>
  </div>
</template>

<style scoped>
.custom-titlebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 1000;
  -webkit-app-region: drag;
  height: 32px;
  background: var(--titlebar-bg);
  background-size: 400% 400%;
  animation: gradientFlowTitleBar 15s ease-in-out infinite;
  backdrop-filter: blur(8px);
  color: var(--titlebar-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  user-select: none;
  box-shadow: 0 1px 10px 0 rgba(0,0,0,0.12);
  border-bottom: 1px solid var(--titlebar-border);
  font-family: inherit;
}

.left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.titlebar-logo {
  width: 20px;
  height: 20px;
  margin-right: 6px;
  -webkit-app-region: no-drag;
}
.title {
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 1px;
  opacity: 0.88;
}

.window-controls {
  display: flex;
  align-items: center;
}
.window-controls button {
  -webkit-app-region: no-drag;
  margin-left: 8px;
  background: none;
  border: none;
  color: var(--titlebar-text);
  font-size: 18px;
  cursor: pointer;
  width: 32px;
  height: 28px;
  border-radius: 4px;
  transition: background 0.2s;
}
.window-controls button:hover {
  background: var(--titlebar-btn-hover-bg);
  color: var(--titlebar-btn-hover-text);
}
.title {
  font-weight: bold;
  font-size: 15px;
  letter-spacing: 1px;
}

@keyframes gradientFlowTitleBar {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

</style>
