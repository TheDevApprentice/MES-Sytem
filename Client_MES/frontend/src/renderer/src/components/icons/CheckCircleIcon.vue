<!-- CheckCircleIcon.vue -->
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
        d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4814 2.02168 11.3084C2.16356 9.13537 2.99721 7.06947 4.39828 5.39617C5.79935 3.72287 7.69279 2.53454 9.79619 2.02148C11.8996 1.50842 14.1003 1.69619 16.07 2.56"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M22 4L12 14.01L9 11.01"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </template>
  
  <script>
  export default {
    name: 'CheckCircleIcon',
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