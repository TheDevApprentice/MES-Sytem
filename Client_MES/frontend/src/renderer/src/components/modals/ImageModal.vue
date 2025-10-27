<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div class="fixed inset-0 bg-black/90" @click="close"></div>
      <div class="relative max-w-4xl w-full">
        <button
          @click="close"
          class="absolute -top-10 right-0 text-white hover:text-gray-300"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <img :src="src" class="max-h-[90vh] w-auto mx-auto" :alt="alt" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps({
  show: Boolean,
  src: String,
  alt: { type: String, default: "Image preview" },
});

const emit = defineEmits(["close", "update:show"]);

const close = () => {
  emit("close");
  emit("update:show", false);
};
</script>

<style scoped>
@import "tailwindcss";

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
