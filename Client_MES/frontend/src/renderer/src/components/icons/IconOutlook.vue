<template>
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      :class="className"
    >
      <!-- Fond principal bleu d'Outlook -->
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        fill="#0078D4"
      />
      
      <!-- Lettre O centrale -->
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="white"
        stroke-width="1.5"
      />
      
      <!-- Enveloppe stylisée -->
      <path
        d="M2 6L12 13L22 6"
        stroke="white"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
      
      <!-- Accent décoratif -->
      <path
        d="M2 4H22V6L12 13L2 6V4Z"
        fill="#106EBE"
      />
    </svg>
  </template>
  
  <script setup>
  defineProps({
    size: {
      type: [String, Number],
      default: 24
    },
    className: {
      type: String,
      default: ''
    }
  })
  </script>
  
  <style scoped>
  svg {
    display: inline-block;
    vertical-align: middle;
  }
  
  /* Classes utilitaires optionnelles */
  .icon-small {
    width: 16px;
    height: 16px;
  }
  
  .icon-medium {
    width: 24px;
    height: 24px;
  }
  
  .icon-large {
    width: 32px;
    height: 32px;
  }
  
  .icon-hover:hover {
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }
  </style>