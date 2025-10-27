
<!-- IconHeart.vue -->
<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="icon-heart"
    :class="{ 'heart-filled': filled }"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  filled?: boolean;
}>();
</script>

<style scoped>
.icon-heart {
  width: 1em;
  height: 1em;
  transition: all 0.2s ease;
}

.heart-filled {
  fill: currentColor;
}
</style>