<script setup lang="ts">
import LateralMenu from '../../components/dahboard/LateralMenu.vue'
</script>

<template>
  <div class="dashboard-root">
    <LateralMenu />
    <div class="dashboard-container" >
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.dashboard-root {
  display: flex;
  background: none;
  position: relative;
}

.dashboard-container {
  transition: margin-left 0.26s cubic-bezier(0.7, 1.4, 0.6, 1);
  position: relative;
  z-index: 1;
}
</style>
