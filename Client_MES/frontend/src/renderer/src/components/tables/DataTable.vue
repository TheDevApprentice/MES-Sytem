<template>
  <div class="data-table-container">
    <!-- Search Bar -->
    <div class="mb-4 relative">
      <div
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <IconSearch class="h-5 w-5 text-gray-400" />
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher..."
        class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <IconX class="h-5 w-5" />
      </button>
    </div>

    <!-- Table with optimized responsive design -->
    <div class="overflow-x-auto">
      <table
        class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed"
      >
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              v-for="(header, index) in headers"
              :key="index"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider truncate"
              :style="{ width: header.width || 'auto' }"
            >
              <slot is="header-cell" name="header-cell" :header="header">
                {{ header.text }}
              </slot>
            </th>
            <!-- Colonne Actions -->
            <th
              v-if="showActions"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              style="width: 150px"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody
          class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
        >
          <tr
            v-for="(item, itemIndex) in filteredItems"
            :key="itemIndex"
            class="hover:bg-gray-50 dark:hover:bg-gray-700"
            @click="$emit('rowClick', item)"
          >
            <td
              v-for="(header, headerIndex) in headers"
              :key="headerIndex"
              class="px-4 py-3 text-sm truncate"
              :class="{
                'text-gray-500 dark:text-gray-300':
                  !header.color && header.value !== 'status',
                'whitespace-normal': header.value === 'description',
                'whitespace-nowrap': header.value !== 'description',
                'font-mono': header.value === 'value',
                'text-center': header.align === 'center',
                'text-right': header.align === 'right',
              }"
            >
              <template v-if="header.type === 'image'">
                <div class="flex items-center">
                  <img
                    v-if="item[header.imageField || header.value]"
                    :src="item[header.imageField || header.value]"
                    class="w-8 h-8 rounded-full object-cover mr-3"
                    :alt="`Image de ${header.text}`"
                  />
                  <span>{{ item[header.value] }}</span>
                </div>
              </template>
              <template v-else-if="header.value === 'name' && item.image">
                <div class="flex items-center">
                  <img
                    :src="item.image"
                    class="w-8 h-8 rounded-full mr-3 object-cover"
                    alt="Profile"
                  />
                  {{ item.name }}
                </div>
              </template>
              <template v-else-if="header.value === 'active'">
              <span v-if="header.activeDisplay === 'tag'"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-red-100 text-red-800': !item.active,
                  'bg-yellow-100 text-yellow-800': item.active && item.satisfaction < 75,
                  'bg-green-100 text-green-800': item.active && item.satisfaction >= 75,
                }"
              >
                {{ !item.active ? 'Inactif' : (item.satisfaction < 75 ? 'À risque' : 'Actif') }}
              </span>
              <component v-else-if="header.activeDisplay === 'icon'" :is="item.active ? IconCheck : IconX" class="h-5 w-5 mx-auto" />
            </template>
            <template v-else-if="header.value === 'status'">
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-red-100 text-red-800': !item.active,
                    'bg-yellow-100 text-yellow-800': item.active && item.satisfaction < 75,
                    'bg-green-100 text-green-800': item.active && item.satisfaction >= 75,
                  }"
                >
                  {{ !item.active ? 'Inactif' : (item.satisfaction < 75 ? 'À risque' : 'Actif') }}
                </span>
              </template>
              <template v-else-if="header.value === 'status'">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                      item.status === 'Active' ||
                      item.status === 'Actif' ||
                      item.status === 'Résolu' ||
                      item.status === 'Payée',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                      item.status === 'Inactive' ||
                      item.status === 'Inactif' ||
                      item.status === 'En retard' ||
                      item.status === 'In Validation' ||
                      item.status === 'En cours',
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200':
                      item.status === 'Suspended' ||
                      item.status === 'Suspens' ||
                      item.status === 'Non payée',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-600':
                      item.status === 'Verified' || item.status === 'Ouvert',
                  }"
                >
                  {{ item.status }}
                </span>
              </template>
              <template v-else-if="header.value === 'priority'">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                      item.priority === 'Basse' ||
                      item.priority === 'basse' ||
                      item.priority === 'Low' ||
                      item.priority === 'low',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                      item.priority === 'Moyenne' ||
                      item.priority === 'moyenne' ||
                      item.priority === 'Medium' ||
                      item.priority === 'medium',
                    'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100':
                      item.priority === 'Haute' ||
                      item.priority === 'haute' ||
                      item.priority === 'High' ||
                      item.priority === 'high',
                    'bg-red-900 text-red-300 dark:bg-red-900 dark:text-red-300':
                      item.priority === 'Critique' ||
                      item.priority === 'critique' ||
                      item.priority === 'Critical' ||
                      item.priority === 'critical',
                  }"
                >
                  {{ item.priority }}
                </span>
              </template>
              <template
                v-else-if="
                  header.value === 'value' && header.format === 'currency'
                "
              >
                {{ formatCurrency(item.value) }}
              </template>
              <template v-else>
                {{ item[header.value] }}
              </template>
            </td>
            <!-- Cellule Actions -->
            <td v-if="showActions" class="px-4 py-3">
              <div class="flex space-x-2">
                <button
                  v-for="action in visibleActions"
                  :key="action.name"
                  @click.stop="
                    action.handler
                      ? action.handler(item)
                      : $emit('action-click', { action: action.name, item })
                  "
                  class="p-1 rounded-md"
                  :class="`text-${action.color}-600 hover:bg-${action.color}-50 dark:hover:bg-${action.color}-900/30`"
                  v-html="action.icon"
                ></button>
              </div>
            </td>
          </tr>
          <!-- Sentinel pour le lazy loading -->
          <tr
            v-if="lazyLoading && loadedItems.length < items.length"
            ref="sentinel"
          >
            <td
              :colspan="headers.length + (showActions ? 1 : 0)"
              class="py-4 text-center"
            >
              <div
                class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"
              ></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="filteredItems.length === 0"
      class="text-center py-8 text-gray-500 dark:text-gray-400"
    >
      <slot name="no-data"> Aucune donnée disponible </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import type { TableHeader, TableItem, TableAction } from "./types/types";
import { TableActions } from "./types/types";
import IconSearch from "@icons/IconSearch.vue";
import IconX from "@icons/XMarkIcon.vue";
import IconCheck from "@components/icons/IconCheck.vue";

const props = defineProps<{
  headers: TableHeader[];
  items: TableItem[];
  theme?: "light" | "dark";
  showActions?: boolean;
  actions?: TableAction[];
  lazyLoading?: boolean;
  chunkSize?: number;
  initialLoad?: number;
}>();

const emit = defineEmits<{
  (e: "rowClick", item: TableItem): void;
  (e: "action-click", payload: { action: string; item: TableItem }): void;
  (e: "load-more", payload: { startIndex: number; endIndex: number }): void;
}>();

const searchQuery = ref("");
const loadedItems = ref<TableItem[]>([]);
const observer = ref<IntersectionObserver | null>(null);
const loading = ref(false);
const sentinel = ref<HTMLElement | null>(null);

const clearSearch = () => {
  searchQuery.value = "";
};

const visibleActions = computed(() => {
  if (!props.showActions || !props.actions?.length) return [];

  return props.actions
    .map((action) => {
      const baseAction = TableActions.find((a) => a.name === action.name);
      if (!baseAction) return null;

      return {
        ...baseAction, // Prend les valeurs par défaut (icône, couleur)
        ...action, // Permet de surcharger les propriétés
        handler: action.handler, // Garde le handler spécifique
      };
    })
    .filter(Boolean); // Filtre les actions non trouvées
});

// Chargement initial optimisé
onMounted(() => {
  if (props.lazyLoading) {
    loadedItems.value = props.items.slice(0, props.initialLoad);
    setupIntersectionObserver();
  } else {
    loadedItems.value = [...props.items];
  }
});

// Nettoyage
onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});

// Observation pour le lazy loading
const setupIntersectionObserver = () => {
  observer.value = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !loading.value) {
        loadMoreItems();
      }
    },
    { threshold: 0.1 }
  );

  if (sentinel.value) {
    observer.value.observe(sentinel.value);
  }
};

// Chargement supplémentaire
const loadMoreItems = () => {
  if (loading.value || loadedItems.value.length >= props.items.length) return;

  loading.value = true;

  const startIndex = loadedItems.value.length;
  const endIndex = Math.min(startIndex + props.chunkSize, props.items.length);

  // Simulation d'un chargement asynchrone
  setTimeout(() => {
    loadedItems.value = [
      ...loadedItems.value,
      ...props.items.slice(startIndex, endIndex),
    ];
    loading.value = false;
    emit("load-more", { startIndex, endIndex });
  }, 300);
};

// Fonction de formatage des devises
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Filtrage optimisé
const filteredItems = computed(() => {
  if (!searchQuery.value)
    return props.lazyLoading ? loadedItems.value : props.items;

  const query = searchQuery.value.toLowerCase();
  const source = props.lazyLoading ? loadedItems.value : props.items;

  return source.filter((item) =>
    props.headers.some((header) => {
      const value = item[header.value];
      return value && String(value).toLowerCase().includes(query);
    })
  );
});

watch(
  () => props.items,
  (newItems) => {
    if (!props.lazyLoading) {
      loadedItems.value = [...newItems];
    } else if (newItems.length < loadedItems.value.length) {
      // Réinitialisation si les items changent complètement
      loadedItems.value = newItems.slice(0, props.initialLoad);
    }
  },
  { deep: true }
);
</script>

<style scoped>
@import "tailwindcss";

table {
  @apply w-full divide-y divide-gray-200 dark:divide-gray-700;
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

button svg {
  @apply text-current;
}

.data-table-container .relative {
  position: relative;
}

.data-table-container .absolute {
  position: absolute;
}

.data-table-container .pointer-events-none {
  pointer-events: none;
}
</style>
