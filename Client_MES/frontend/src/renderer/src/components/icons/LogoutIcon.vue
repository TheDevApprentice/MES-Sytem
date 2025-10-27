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
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
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