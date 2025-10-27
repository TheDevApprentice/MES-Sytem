<template>
  <div class="paginated-table-container">
    <SortableTable
      :headers="headers"
      :items="paginatedItems"
      :theme="theme"
      :show-actions="showActions"
      :actions="actions"
      :lazy-loading="lazyLoading"
      :chunk-size="chunkSize"
      :initial-load="initialLoad"
      @row-click="$emit('rowClick', $event)"
      @action-click="$emit('action-click', $event)"
      @sort-change="$emit('sort-change', $event)"
      @load-more="handleLoadMore"
    >
    </SortableTable>

    <div v-if="showControls" class="flex items-center justify-between mt-4">
      <div class="flex-1 flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Affichage de <span class="font-medium">{{ startItem }}</span> à
            <span class="font-medium">{{ endItem }}</span> sur
            <span class="font-medium">{{ props.items.length }}</span> résultats
          </p>
        </div>
        <div class="flex space-x-2">
          <button
            @click="goToPreviousPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>

          <template v-for="page in visiblePages" :key="page">
            <button
              @click="goToPage(page)"
              :class="{
                'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:text-white':
                  page === currentPage,
                'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700':
                  page !== currentPage,
              }"
              class="relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md"
            >
              {{ page }}
            </button>
          </template>

          <button
            @click="goToNextPage"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SortableTable from "./SortableTable.vue";
import { computed, ref, watch } from "vue";
import type { TableHeader, TableItem, TableAction } from "./types/types";

const props = defineProps<{
  headers: TableHeader[];
  items: TableItem[];
  theme?: "light" | "dark";
  itemsPerPage?: number;
  showPageControls?: boolean;
  showActions?: boolean;
  actions?: TableAction[];
  lazyLoading?: boolean;
  chunkSize?: number;
  initialLoad?: number;
}>();

const emit = defineEmits<{
  (e: "rowClick", item: TableItem): void;
  (e: "action-click", payload: { action: string; item: TableItem }): void;
  (e: "update:page", page: number): void;
  (e: "load-more", payload: { startIndex: number; endIndex: number }): void;
  (e: "sort-change", payload: { column: string; order: string }): void;
}>();

const currentPage = ref(1);

const showControls = computed(() => {
  // Toujours afficher si lazy loading
  if (props.lazyLoading) return true;

  // Pour le mode normal, afficher seulement si on a plus d'items que itemsPerPage
  return props.items.length > (props.itemsPerPage || 10);
});

const perPage = computed(() => props.itemsPerPage || 10);

const paginatedItems = computed(() => {
  if (props.lazyLoading) {
    return props.items;
  }
  return getPaginatedData(
    props.items,
    currentPage.value,
    props.itemsPerPage || 10
  );
});

const totalPages = computed(() => {
  return Math.ceil(props.items.length / (props.itemsPerPage || 10));
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const startItem = computed(() => {
  return (currentPage.value - 1) * (props.itemsPerPage || 10) + 1;
});

const endItem = computed(() => {
  return Math.min(
    currentPage.value * (props.itemsPerPage || 10),
    props.items.length
  );
});

const getPaginatedData = (data: TableItem[], page: number, perPage: number) => {
  const start = (page - 1) * perPage;
  return data.slice(start, start + perPage);
};

const goToPage = (page: number) => {
  currentPage.value = page;
  emit("update:page", page);
};

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    emit("update:page", currentPage.value);
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    emit("update:page", currentPage.value);
  }
};

const handleLoadMore = (payload: { startIndex: number; endIndex: number }) => {
  emit("load-more", payload);
};

watch(
  () => props.items,
  (newItems) => {
    console.log("Items changed", newItems.length);
    currentPage.value = 1;
  },
  { immediate: true }
);
</script>

<style scoped>
@import "tailwindcss";

table {
  @apply min-w-full divide-y divide-gray-200 dark:divide-gray-700;
}

th {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider;
  text-align: left !important;
}

td {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100;
}

tr {
  @apply transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800;
}

.pagination-btn {
  @apply relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700;
}

.pagination-btn.active {
  @apply z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:text-white;
}
</style>
