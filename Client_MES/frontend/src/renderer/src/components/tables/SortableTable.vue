<template>
  <DataTable
    :headers="headers"
    :items="sortedItems"
    :theme="theme"
    :show-actions="showActions"
    :actions="actions"
    :lazy-loading="lazyLoading"
    :chunk-size="chunkSize"
    :initial-load="initialLoad"
    @row-click="$emit('rowClick', $event)"
    @action-click="$emit('action-click', $event)"
    @load-more="$emit('load-more', $event)"
  >
    <template #header-cell="{ header }">
      <div
        class="flex items-center"
        :class="{
          'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700':
            header.sortable !== false,
          'bg-gray-100 dark:bg-gray-700': currentSort?.key === header.value,
        }"
        @click="header.sortable !== false ? handleSort(header.value) : null"
      >
        {{ header.text }}
        <span
          v-if="header.sortable !== false"
          class="pl-3"
          v-html="getSortIcon(header.key)"
        ></span>
      </div>
    </template>

    <template #no-data>
      <slot name="no-data"> Aucune donnée disponible </slot>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from "./DataTable.vue";
import { computed, ref } from "vue";
import type { TableHeader, TableItem, SortState, TableAction } from "./types/types";

const props = defineProps<{
  headers: TableHeader[];
  items: TableItem[];
  theme?: "light" | "dark";
  initialSort?: SortState;
  showActions?: boolean;
  actions?: TableAction[];
  lazyLoading?: boolean;
  chunkSize?: number;
  initialLoad?: number;
}>();

const emit = defineEmits<{
  (e: "update:sort", sort: SortState): void;
  (e: "rowClick", item: TableItem): void;
  (e: "action-click", payload: { action: string; item: TableItem }): void;
  (e: "load-more", payload: { startIndex: number; endIndex: number }): void;
}>();

const currentSort = ref<SortState | null>(props.initialSort ?? null);

// Initialisation après le montage
const initSort = () => {
  if (!currentSort.value) {
    const sortableHeader = props.headers.find((h) => h.sortable !== false);
    if (sortableHeader) {
      currentSort.value = {
        key: sortableHeader.value,
        order: "asc",
      };
    }
  }
};

initSort();

const sortedItems = computed(() => {
  if (!currentSort.value?.key) return props.items;

  const source = props.lazyLoading ? props.items : [...props.items];

  return source.sort((a, b) => {
    const aValue = a[currentSort.value!.key];
    const bValue = b[currentSort.value!.key];

    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    const comparison = String(aValue).localeCompare(String(bValue));
    return currentSort.value!.order === "asc" ? comparison : -comparison;
  });
});

const handleSort = (key: string) => {
  if (!currentSort.value) {
    currentSort.value = { key, order: "asc" };
  } else if (currentSort.value.key === key) {
    currentSort.value.order =
      currentSort.value.order === "asc" ? "desc" : "asc";
  } else {
    currentSort.value.key = key;
    currentSort.value.order = "asc";
  }

  emit("update:sort", currentSort.value);
};

const getSortIcon = (key: string) => {
  if (!currentSort.value || currentSort.value.key !== key) {
    return `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>`;
  }
  return currentSort.value.order === "asc"
    ? `<svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
       </svg>`
    : `<svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
       </svg>`;
};

const handleLoadMore = (payload: { startIndex: number; endIndex: number }) => {
  emit("load-more", payload);
};
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
</style>
