<!-- icons/MinusIcon.vue -->
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
      <!-- Ligne horizontale pour tendance neutre -->
      <path
        d="M5 12H19"
        :stroke="color || 'currentColor'"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      
      <!-- Points optionnels pour montrer la stabilité -->
      <circle
        v-if="showPoints"
        cx="7"
        cy="12"
        r="1.5"
        :fill="color || 'currentColor'"
        opacity="0.6"
      />
      <circle
        v-if="showPoints"
        cx="12"
        cy="12"
        r="1.5"
        :fill="color || 'currentColor'"
        opacity="0.8"
      />
      <circle
        v-if="showPoints"
        cx="17"
        cy="12"
        r="1.5"
        :fill="color || 'currentColor'"
      />
      
      <!-- Variante avec double ligne pour plus d'épaisseur -->
      <path
        v-if="variant === 'thick'"
        d="M5 10H19M5 14H19"
        :stroke="color || 'currentColor'"
        :stroke-width="strokeWidth * 0.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.7"
      />
      
      <!-- Variante avec ligne en pointillés -->
      <path
        v-if="variant === 'dashed'"
        d="M5 12H19"
        :stroke="color || 'currentColor'"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="2 2"
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
    variant?: 'default' | 'thick' | 'dashed';
  }
  
  withDefaults(defineProps<Props>(), {
    size: 24,
    color: 'currentColor',
    strokeWidth: 2,
    className: '',
    showPoints: false,
    variant: 'default'
  });
  </script>
  
  <style scoped>
  svg {
    display: inline-block;
    vertical-align: middle;
    transition: all 0.2s ease;
  }
  
  svg:hover {
    transform: scale(1.05);
  }
  </style>