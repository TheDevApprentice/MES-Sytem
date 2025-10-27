<template>
  <Transition name="modal">
    <div
      id="form-modal"
      href="#form-modal"
      ref="modalRef"
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm"
        @click="close"
      ></div>
      <div
        class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4 my-8"
      >
        <!-- Header coloré -->
        <div class="h-2 w-full bg-indigo-500"></div>

        <div class="p-6 h-full">
          <div class="flex items-start gap-4 h-full">
            <!-- Icône formulaire -->
            <div
              class="flex-shrink-0 p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>

            <div class="w-full">
              <h3
                class="text-lg font-medium text-gray-900 dark:text-white mb-4"
              >
                {{ title }}
              </h3>
              <slot></slot>
            </div>
          </div>
        </div>

        <div
          class="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800"
        >
          <button
            @click="close"
            class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ cancelText }}
          </button>
          <button
            @click="submit"
            class="px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ submitText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps({
  show: Boolean,
  title: String,
  submitText: { type: String, default: "Enregistrer" },
  cancelText: { type: String, default: "Annuler" },
});

const emit = defineEmits(["submit", "cancel", "update:show"]);

const submit = () => {
  emit("submit");
};

const close = () => {
  emit("cancel");
  emit("update:show", false);
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
