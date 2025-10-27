<!-- ReceiptIcon.vue -->
<template>
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      :class="className"
    >
      <path
        d="M18 21L15 18L12 21L9 18L6 21V3C6 2.44772 6.44772 2 7 2H17C17.5523 2 18 2.44772 18 3V21Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9 7H15"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9 11H15"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9 15H13"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </template>
  
  <script>
  export default {
    name: 'ReceiptIcon',
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