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
        d="M13 10V3L4 14h7v7l9-11h-7z"
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