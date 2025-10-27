<template>
    <svg 
      :width="size" 
      :height="size" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      :class="className"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        :stroke-width="strokeWidth" 
        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  </template>
  
  <script setup lang="ts">
  interface Props {
    size?: string | number
    strokeWidth?: string | number
    className?: string
  }
  
  withDefaults(defineProps<Props>(), {
    size: 24,
    strokeWidth: 2,
    className: ''
  })
  </script>