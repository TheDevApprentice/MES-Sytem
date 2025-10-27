<!-- components/common/charts/StatsCard.vue -->
<template>
  <div
    class="stat-card"
    :class="[
      className,
      sizeClasses,
      trendClasses,
      {
        'is-loading': loading,
        'is-clickable': !!onClick,
        'has-chart': hasChart,
        'is-compact': variant === 'compact',
        'trend-up': change?.type === 'increase',
        'trend-down': change?.type === 'decrease',
        'trend-neutral': !change || change?.type === 'neutral',
      },
    ]"
    @click="handleClick"
    role="button"
    :tabindex="onClick ? 0 : undefined"
    @keypress="handleKeyPress"
    :aria-label="ariaLabel"
    :aria-description="ariaDescription"
  >
    <!-- Loading state -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>

    <!-- Card content -->
    <div v-else class="stat-content">
      <!-- Icon section -->
      <div class="stat-icon">
        <component
          v-if="iconComponent"
          :is="iconComponent"
          class="w-8 h-8"
        />
        <span v-else-if="iconType" class="icon-emoji">{{ iconType }}</span>
        <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
      </div>

      <!-- Content section -->
      <div class="stat-info">
        <h3 class="stat-title">{{ title }}</h3>
        <p v-if="subtitle" class="stat-subtitle">{{ subtitle }}</p>
        
        <!-- Main value -->
        <div class="stat-value-section">
          <div class="stat-main-value">
            <span v-if="prefix" class="stat-prefix">{{ prefix }}</span>
            <span class="stat-value" :title="rawValue?.toString()">
              {{ formattedValue }}
            </span>
            <span v-if="suffix" class="stat-suffix">{{ suffix }}</span>
          </div>
          
          <!-- Change indicator -->
          <div
            v-if="change && showChange"
            class="stat-change"
            :class="changeClasses"
          >
            <component :is="changeIcon" class="trend-icon" />
            <span class="change-text">{{ changeText }}</span>
          </div>
        </div>
      </div>

      <!-- Chart section -->
      <div v-if="hasChart" class="stat-chart-section">
        <div ref="chartContainer" class="stat-chart-container">
          <canvas
            ref="chartCanvas"
            :width="chartWidth"
            :height="chartHeight"
            :key="canvasKey"
          ></canvas>
        </div>
      </div>

      <!-- Actions slot -->
      <div v-if="$slots.actions" class="stat-actions">
        <slot name="actions" :value="formattedValue" :change="change"></slot>
      </div>

      <!-- Footer slot -->
      <div v-if="$slots.footer" class="stat-footer">
        <slot name="footer" :value="formattedValue" :change="change"></slot>
      </div>
    </div>

    <!-- Tooltip -->
    <div v-if="showTooltip && tooltipText" class="stat-tooltip" ref="tooltip">
      {{ tooltipText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  shallowRef,
  onBeforeUnmount,
} from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler,
  type Chart,
  type ChartConfiguration,
} from "chart.js";

import type {
  StatsCardConfig,
  createGradient,
  GradientConfig,
} from "./types/types";
import { CHART_COLORS, CHART_COLORS_ALPHA } from "./types/types";
// Enregistrer TOUS les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Import des icônes depuis notre collection
import TrendingUpIcon from "@icons/TrendingUpIcon.vue";
import TrendingDownIcon from "@icons/TrendingDownIcon.vue";
import MinusIcon from "@icons/MinusIcon.vue";
import UsersIcon from "@icons/UsersIcon.vue";
import MoneyIcon from "@icons/MoneyIcon.vue";
import ShoppingBagIcon from "@icons/ShoppingBagIcon.vue";
import PerformanceIcon from "@icons/StatsPerformanceIcon.vue";
import BarChartIcon from "@icons/BarChartIcon.vue";
import DashboardIcon from "@icons/DashboardIcon.vue";
import SettingsIcon from "@icons/SettingsIcon.vue";
import TicketsIcon from "@icons/StatsTicketsIcon.vue";
import ActivityIcon from "@icons/StatsActivityIcon.vue";
import UserIcon from "@icons/UserIcon.vue";
import IconClock from "@icons/IconClock.vue";
import DocumentIcon from "@icons/DocumentIcon.vue";
import ExclamationCircleIcon from "@icons/ExclamationCircleIcon.vue";
import ReceiptIcon from "@icons/ReceiptIcon.vue";
import CheckCircleIcon from "@icons/CheckCircleIcon.vue";

interface Props extends StatsCardConfig {
  // Configuration de la carte
  config?: StatsCardConfig;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  variant: "default",
  size: "md",
  color: "blue",
  theme: "light",
  borderRadius: "lg",
  shadow: "md",
  showTooltip: false,
  showChange: true,
  animated: true,
  className: "",
  ariaLabel: "Carte de statistique",
  ariaDescription: "Carte affichant une métrique avec valeur et tendance",
});

// Emits
const emit = defineEmits<{
  click: [event: MouseEvent];
  "chart-ready": [chart: Chart];
  "value-change": [newValue: number | string, oldValue: number | string];
}>();

// Refs
const chartContainer = ref<HTMLDivElement>();
const chartCanvas = ref<HTMLCanvasElement>();
const chartInstance = shallowRef<Chart | null>(null);
const tooltip = ref<HTMLDivElement>();
const canvasKey = ref(0); // Pour forcer la re-création du canvas

// Computed properties
const rawValue = computed(() => {
  if (typeof props.value === "string") {
    const numValue = parseFloat(props.value.replace(/[^\d.-]/g, ""));
    return isNaN(numValue) ? props.value : numValue;
  }
  return props.value;
});

const formattedValue = computed(() => {
  if (props.format && typeof rawValue.value === "number") {
    return props.format(rawValue.value);
  }

  if (typeof rawValue.value === "number") {
    if (Math.abs(rawValue.value) >= 1000000) {
      return (rawValue.value / 1000000).toFixed(1) + "M";
    }
    if (Math.abs(rawValue.value) >= 1000) {
      return (rawValue.value / 1000).toFixed(1) + "K";
    }
    return rawValue.value.toLocaleString();
  }

  return String(rawValue.value);
});

const hasChart = computed(() => {
  return !!(props.chart && props.chart.data && props.chart.data.length > 0);
});

const sizeClasses = computed(() => {
  const sizeClass = `stat-card-${props.size}`;
  const variantClass = `stat-card-${props.variant}`;
  const radiusClass = `rounded-${props.borderRadius}`;
  const shadowClass = props.shadow !== "none" ? `shadow-${props.shadow}` : "";

  return [sizeClass, variantClass, radiusClass, shadowClass].filter(Boolean);
});

const trendClasses = computed(() => {
  if (!props.change) return 'trend-neutral';
  
  switch (props.change.type) {
    case 'increase':
      return 'trend-up';
    case 'decrease':
      return 'trend-down';
    default:
      return 'trend-neutral';
  }
});

const changeClasses = computed(() => {
  if (!props.change) return [];

  const type = props.change.type;
  return [
    "change-indicator",
    `change-${type}`,
    { "change-animated": props.animated },
  ];
});

const changeIcon = computed(() => {
  if (!props.change) return null;

  switch (props.change.type) {
    case "increase":
      return TrendingUpIcon;
    case "decrease":
      return TrendingDownIcon;
    case "neutral":
    default:
      return MinusIcon;
  }
});

const changeText = computed(() => {
  if (!props.change) return "";

  const value = Math.abs(props.change.value);
  const sign =
    props.change.type === "increase"
      ? "+"
      : props.change.type === "decrease"
      ? "-"
      : "";

  return `${sign}${value}%`;
});

const chartWidth = computed(() => props.chart?.width || 120);
const chartHeight = computed(() => props.chart?.height || 40);

// Computed property pour l'icône
const iconComponent = computed(() => {
  if (props.iconComponent) return props.iconComponent;
  
  switch (props.iconType) {
    case 'users': return UsersIcon;
    case 'revenue': return MoneyIcon;
    case 'orders': return ShoppingBagIcon;
    case 'performance': return PerformanceIcon;
    case 'tickets': return TicketsIcon;
    case 'activity': return ActivityIcon;
    case 'user': return UserIcon;
    case 'analytics': return BarChartIcon;
    case 'dashboard': return DashboardIcon;
    case 'clock': return IconClock;
    case 'settings': return SettingsIcon;
    case 'document': return DocumentIcon;
    case 'exclamation-circle': return ExclamationCircleIcon;
    case 'receipt': return ReceiptIcon;
    case 'check-circle': return CheckCircleIcon;
    default: return null;
  }
});

// Normaliser le type de graphique
const normalizedChartType = computed(() => {
  if (!props.chart) return 'line';
  
  // Convertir "area" en "line" avec fill
  return props.chart.type === 'area' ? 'line' : (props.chart.type || 'line');
});

// Chart configuration
const chartConfig = computed<ChartConfiguration>(() => {
  if (!hasChart.value || !props.chart) return {} as ChartConfiguration;

  const data = props.chart.data || [];
  const color =
    props.chart.color || CHART_COLORS?.[props.color] || CHART_COLORS?.blue || '#3B82F6';

  // Déterminer si c'est un graphique en aire
  const isAreaChart = props.chart.type === "area";
  const chartType = normalizedChartType.value as "line" | "bar";

  const baseConfig: ChartConfiguration = {
    type: chartType,
    data: {
      labels: data.map((_, index) => index.toString()),
      datasets: [
        {
          data: data,
          borderColor: color,
          backgroundColor: isAreaChart ? `${color}20` : "transparent",
          pointRadius: 0,
          pointHoverRadius: 0,
          borderWidth: 2,
          fill: isAreaChart,
          tension: chartType === "line" ? 0.4 : 0,
          ...(chartType === "bar" && {
            borderRadius: 2,
            borderSkipped: false,
          }),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 0,
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false,
          },
        },
        y: {
          display: false,
          grid: {
            display: false,
          },
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: props.chart.showTooltip || false,
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "white",
          bodyColor: "white",
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          cornerRadius: 6,
          padding: 8,
          displayColors: false,
          callbacks: {
            title: () => "",
            label: (context) => {
              return `${context.parsed.y}`;
            },
          },
        },
        title: {
          display: false,
        },
      },
      elements: {
        point: {
          radius: 0,
          hoverRadius: 0,
          hitRadius: 0,
        },
        line: {
          borderWidth: 2,
          tension: 0.4,
        },
        bar: {
          borderRadius: 2,
          borderWidth: 0,
        },
      },
      animation: props.animated
        ? {
            duration: 800,
            easing: "easeInOutCubic",
          }
        : false,
      interaction: {
        intersect: false,
        mode: "index",
      },
    },
  };

  return baseConfig;
});

// Methods
const handleClick = (event: MouseEvent) => {
  if (props.onClick) {
    props.onClick();
  }
  emit("click", event);
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleClick(event as any);
  }
};

const generateCanvasId = () => {
  return `stats-chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const destroyChart = () => {
  if (chartInstance.value) {
    try {
      chartInstance.value.destroy();
    } catch (error) {
      console.warn("Erreur lors de la destruction du chart:", error);
    } finally {
      chartInstance.value = null;
    }
  }
};

const initChart = async () => {
  if (!hasChart.value || !chartCanvas.value) return;

  try {
    // Nettoyer l'instance existante AVANT de créer la nouvelle
    destroyChart();

    // Attendre que le DOM soit prêt
    await nextTick();

    // Vérifier que le canvas est toujours disponible
    if (!chartCanvas.value) return;

    // Nettoyer le canvas et assigner un ID unique
    const ctx = chartCanvas.value.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, chartCanvas.value.width, chartCanvas.value.height);
    }
    
    // Assigner un ID unique au canvas
    chartCanvas.value.id = generateCanvasId();

    // Créer la nouvelle instance
    chartInstance.value = new ChartJS(chartCanvas.value, chartConfig.value);

    emit("chart-ready", chartInstance.value);
  } catch (error) {
    console.error("Erreur lors de l'initialisation du mini-chart:", error);
    destroyChart();
  }
};

const updateChart = () => {
  if (chartInstance.value && hasChart.value) {
    try {
      const newConfig = chartConfig.value;
      chartInstance.value.data = newConfig.data!;
      chartInstance.value.update("none"); // Pas d'animation pour les mises à jour
    } catch (error) {
      console.warn("Erreur lors de la mise à jour du chart:", error);
      // En cas d'erreur, recréer le chart
      initChart();
    }
  }
};

const forceRecreateChart = () => {
  destroyChart();
  canvasKey.value++; // Force la re-création du canvas
  nextTick(() => {
    initChart();
  });
};

// Watchers
watch(
  () => props.value,
  (newValue, oldValue) => {
    emit("value-change", newValue, oldValue);
  }
);

watch(
  () => props.chart,
  async (newChart, oldChart) => {
    if (hasChart.value) {
      // Si le type de graphique change, on recrée complètement
      if (newChart?.type !== oldChart?.type) {
        forceRecreateChart();
      } else if (chartInstance.value) {
        updateChart();
      } else {
        await nextTick();
        initChart();
      }
    } else {
      destroyChart();
    }
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  if (hasChart.value) {
    nextTick(() => {
      initChart();
    });
  }
});

onBeforeUnmount(() => {
  destroyChart();
});

onUnmounted(() => {
  destroyChart();
});

// Expose methods
defineExpose({
  updateChart,
  destroyChart,
  forceRecreateChart,
  chart: chartInstance,
});
</script>

<style scoped>
@import "tailwindcss";

/* Base styles */
.stat-card {
  @apply rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md hover:scale-105 relative overflow-hidden;
  border: 1px solid;
  border-left-width: 4px;
  border-left-style: solid;
  border-left-color: transparent;
}

/* Light theme */
.stat-card {
  @apply bg-white border-gray-200;
}

/* Dark theme */
.dark .stat-card {
  @apply bg-gray-800 border-gray-700;
}

/* Loading state */
.stat-card.is-loading {
  @apply pointer-events-none;
}

/* Clickable state */
.stat-card.is-clickable {
  @apply cursor-pointer;
}

.stat-card.is-clickable:hover {
  @apply transform -translate-y-1 shadow-lg;
}

.stat-card.is-clickable:active {
  @apply transform translate-y-0;
}

/* Trend colors - matching AdminDashboard style */
.trend-up {
  @apply border-l-green-500;
}

.trend-down {
  @apply border-l-red-500;
}

.trend-neutral {
  @apply border-l-blue-500;
}

/* Loading overlay */
.loading-overlay {
  @apply absolute inset-0 flex items-center justify-center z-10;
}

.loading-overlay {
  @apply bg-white/80;
}

.dark .loading-overlay {
  @apply bg-gray-900/80;
}

.loading-spinner {
  @apply w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin;
}

/* Card content */
.stat-content {
  @apply h-full flex flex-col;
}

.stat-card-compact .stat-content {
  @apply p-4;
}

.stat-card-sm .stat-content {
  @apply p-4;
}

.stat-card-lg .stat-content {
  @apply p-8;
}

/* Icon section */
.stat-icon {
  @apply w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 
         text-white rounded-lg flex items-center justify-center mb-4;
}

.stat-card-sm .stat-icon {
  @apply w-10 h-10;
}

.stat-card-lg .stat-icon {
  @apply w-14 h-14;
}

.icon-emoji {
  @apply text-2xl;
}

/* Info section */
.stat-info {
  @apply flex-1;
}

.stat-title {
  @apply text-sm font-medium mb-1;
}

.stat-title {
  @apply text-gray-600;
}

.dark .stat-title {
  @apply text-gray-400;
}

.stat-subtitle {
  @apply text-xs mb-3;
}

.stat-subtitle {
  @apply text-gray-500;
}

.dark .stat-subtitle {
  @apply text-gray-500;
}

/* Value section */
.stat-value-section {
  @apply space-y-2;
}

.stat-main-value {
  @apply flex items-baseline space-x-1;
}

.stat-value {
  @apply text-2xl font-bold;
}

.stat-value {
  @apply text-gray-900;
}

.dark .stat-value {
  @apply text-white;
}

.stat-card-sm .stat-value {
  @apply text-xl;
}

.stat-card-lg .stat-value {
  @apply text-3xl;
}

.stat-card-compact .stat-value {
  @apply text-lg;
}

.stat-prefix,
.stat-suffix {
  @apply text-sm font-medium;
}

.stat-prefix,
.stat-suffix {
  @apply text-gray-600;
}

.dark .stat-prefix,
.dark .stat-suffix {
  @apply text-gray-400;
}

/* Change indicator */
.stat-change {
  @apply flex items-center space-x-1;
}

.change-indicator {
  @apply flex items-center space-x-1 text-sm font-medium;
}

.change-increase {
  @apply text-green-600;
}

.dark .change-increase {
  @apply text-green-400;
}

.change-decrease {
  @apply text-red-600;
}

.dark .change-decrease {
  @apply text-red-400;
}

.change-neutral {
  @apply text-gray-600;
}

.dark .change-neutral {
  @apply text-gray-400;
}

.trend-icon {
  @apply w-4 h-4;
}

.change-text {
  @apply font-semibold;
}

.change-animated {
  @apply animate-pulse;
}

/* Chart section */

.stat-chart-container {
  @apply mt-4 rounded-xl shadow-sm border p-3;
}

.stat-table-container {
  @apply bg-white border-gray-200;
}

.dark .stat-chart-container,
.dark .stat-table-container {
  @apply bg-gray-800 border-gray-700;
}
/* Actions and footer */
.stat-actions,
.stat-footer {
  @apply mt-4 pt-3 border-t;
}

.stat-actions,
.stat-footer {
  @apply border-gray-200;
}

.dark .stat-actions,
.dark .stat-footer {
  @apply border-gray-700;
}

/* Tooltip */
.stat-tooltip {
  @apply absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
         text-xs font-medium px-3 py-2 rounded-lg shadow-lg
         opacity-0 pointer-events-none transition-opacity duration-200 z-50;
}

.stat-tooltip {
  @apply bg-gray-900 text-white;
}

.dark .stat-tooltip {
  @apply bg-gray-100 text-gray-900;
}

.stat-card:hover .stat-tooltip {
  @apply opacity-100;
}

.stat-tooltip::after {
  content: '';
  @apply absolute top-full left-1/2 transform -translate-x-1/2
         border-4 border-transparent;
}

.stat-tooltip::after {
  @apply border-t-gray-900;
}

.dark .stat-tooltip::after {
  @apply border-t-gray-100;
}

/* Size variants */
.stat-card-sm {
  @apply p-4;
}

.stat-card-lg {
  @apply p-8;
}

.stat-card-compact {
  @apply p-4;
}

.stat-card-compact .stat-icon {
  @apply w-8 h-8 mb-2;
}

.stat-card-compact .stat-title {
  @apply text-xs;
}

.stat-card-compact .stat-value {
  @apply text-base;
}

.stat-card-compact .change-indicator {
  @apply text-xs;
}

/* Responsive design */
@media (max-width: 640px) {
  .stat-card {
    @apply p-4;
  }

  .stat-value {
    @apply text-xl;
  }

  .stat-icon {
    @apply w-10 h-10;
  }
}

/* Focus styles for accessibility */
.stat-card:focus {
  @apply outline-none ring-2 ring-blue-500 ring-offset-2;
}

.dark .stat-card:focus {
  @apply ring-offset-gray-900;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .stat-card {
    @apply border-2;
  }

  .stat-icon {
    @apply border border-current;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .stat-card,
  .change-animated,
  .loading-spinner {
    @apply transition-none animate-none;
  }
}

/* Hover effects */
.stat-card::before {
  content: '';
  @apply absolute left-0 top-0 w-1 h-full transition-transform duration-200 -translate-x-full;
}

.trend-up::before {
  @apply bg-green-500;
}

.trend-down::before {
  @apply bg-red-500;
}

.trend-neutral::before {
  @apply bg-blue-500;
}

.stat-card:hover::before {
  @apply translate-x-0;
}
</style>