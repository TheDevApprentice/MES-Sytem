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
        d="M4 6h16M4 12h16M4 18h16"
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