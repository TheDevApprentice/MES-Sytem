<template>
    <div class="spinner-loader">
      <div class="spinner-dot"></div>
      <div class="spinner-dot"></div>
      <div class="spinner-dot"></div>
    </div>
</template>

<script setup lang="ts">
defineProps<{}>()
</script>

<style scoped>
.spinner-loader {
  display: flex;
  gap: 16px;
  margin-bottom: 18px;
}
.spinner-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(135deg, #90caf9 0%, #b03a7a 100%);
  box-shadow: 0 2px 12px 0 #b03a7a44;
  animation: bounce 0.6s infinite ease-in-out alternate;
}
.spinner-dot:nth-child(2) {
  animation-delay: 0.25s;
}
.spinner-dot:nth-child(3) {
  animation-delay: 0.5s;
}
@keyframes bounce {
  0% { transform: translateY(0); }
  100% { transform: translateY(-22px) scale(1.12); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}

.dot {
  opacity: 0.14;
  animation: dotFade 1.1s infinite;
  font-weight: bold;
  font-size: 1.25em;
  transition: opacity 0.18s;
}
.dot:nth-child(2) { animation-delay: 0.0s; }
.dot:nth-child(3) { animation-delay: 0.22s; }
.dot:nth-child(4) { animation-delay: 0.44s; }
@keyframes dotFade {
  0%   { opacity: 0.14; }
  15%  { opacity: 1; }
  40%  { opacity: 1; }
  60%  { opacity: 0.14; }
  100% { opacity: 0.14; }
}
</style>
