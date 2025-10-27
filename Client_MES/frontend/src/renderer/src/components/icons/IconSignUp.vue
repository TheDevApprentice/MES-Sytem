<template>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="signup-icon"
    >
      <!-- User circle -->
      <circle cx="9" cy="7" r="4"/>
      <path d="m3 21 v-2 a4 4 0 0 1 4 -4 h4 a4 4 0 0 1 4 4 v2"/>
      
      <!-- Plus sign (sign up / add user) -->
      <path d="m19 8 v6"/>
      <path d="m16 11 h6"/>
    </svg>
  </template>
  
  <style scoped>
  .signup-icon {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .signup-icon:hover {
    transform: scale(1.05);
  }
  </style>