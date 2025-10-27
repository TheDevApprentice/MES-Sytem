<template>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="signin-icon"
    >
      <!-- User circle -->
      <circle cx="9" cy="7" r="4"/>
      <path d="m3 21 v-2 a4 4 0 0 1 4 -4 h4 a4 4 0 0 1 4 4 v2"/>
      
      <!-- Arrow pointing right (sign in) -->
      <path d="m16 11 5 0"/>
      <path d="m18 9 3 2 -3 2"/>
    </svg>
  </template>
  
  <style scoped>
  .signin-icon {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .signin-icon:hover {
    transform: scale(1.05);
  }
  </style>