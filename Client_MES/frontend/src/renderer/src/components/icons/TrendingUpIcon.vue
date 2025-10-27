<!-- icons/TrendingUpIcon.vue -->
<template>
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      :class="className"
      :style="{ color: color }"
    >
      <!-- Ligne de tendance montante -->
      <path
        d="M7 17L17 7"
        :stroke="color || 'currentColor'"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      
      <!-- Flèche vers le haut -->
      <path
        d="M17 7L17 13"
        :stroke="color || 'currentColor'"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11 7L17 7"
        :stroke="color || 'currentColor'"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      
      <!-- Points optionnels pour montrer la progression -->
      <circle
        v-if="showPoints"
        cx="7"
        cy="17"
        r="2"
        :fill="color || 'currentColor'"
        opacity="0.6"
      />
      <circle
        v-if="showPoints"
        cx="12"
        cy="12"
        r="2"
        :fill="color || 'currentColor'"
        opacity="0.8"
      />
      <circle
        v-if="showPoints"
        cx="17"
        cy="7"
        r="2"
        :fill="color || 'currentColor'"
      />
    </svg>
  </template>
  
  <script setup lang="ts">
  interface Props {
    size?: number | string;
    color?: string;
    strokeWidth?: number;
    className?: string;
    showPoints?: boolean;
  }
  
  withDefaults(defineProps<Props>(), {
    size: 24,
    color: 'currentColor',
    strokeWidth: 2,
    className: '',
    showPoints: false
  });
  </script>
  
  <style scoped>
  svg {
    display: inline-block;
    vertical-align: middle;
    transition: all 0.2s ease;
  }
  
  svg:hover {
    transform: scale(1.1);
  }
  </style>