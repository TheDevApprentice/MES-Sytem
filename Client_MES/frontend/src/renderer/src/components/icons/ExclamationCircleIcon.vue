<!-- ExclamationCircleIcon.vue -->
<template>
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      :class="className"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="2"
      />
      <path
        d="M12 8V12"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12 16H12.01"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </template>
  
  <script>
  export default {
    name: 'ExclamationCircleIcon',
    props: {
      size: {
        type: [String, Number],
        default: 24
      },
      className: {
        type: String,
        default: ''
      }
    }
  }
  </script>