<!-- components/common/charts/BarChart.vue -->
<template>
  <div
    class="bar-chart-container"
    :class="[className, { 'is-loading': loading }]"
  >
    <!-- Loading state -->
    <div v-if="loading" class="chart-loading">
      <div class="loading-spinner"></div>
      <span class="loading-text">Chargement du graphique...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="chart-error">
      <div class="error-icon">⚠️</div>
      <span class="error-text">{{ error }}</span>
    </div>

    <!-- Chart canvas -->
    <canvas
      v-else
      ref="chartCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
      @click="handleClick"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    ></canvas>

    <!-- Chart info/legend overlay -->
    <div v-if="showChartInfo && chartInstance" class="chart-info">
      <div
        class="chart-title"
        v-if="finalConfig.options?.plugins?.title?.display"
      >
        {{ finalConfig.options.plugins.title.text }}
      </div>
      <div class="chart-stats">
        <span class="total-datasets">{{ datasets.length }} série(s)</span>
        <span class="total-data-points">{{ totalDataPoints }} points</span>
      </div>
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
} from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController, // ← AJOUTÉ
  Title,
  Tooltip,
  Legend,
  type Chart,
  type ChartConfiguration,
  type ChartData,
  type ChartOptions,
} from "chart.js";

import {
  BarChartConfig,
  ChartEvents,
  DatasetConfig,
  CHART_COLORS,
  CHART_COLORS_ALPHA,
  createGradient,
  GradientConfig,
} from "./types/types";
import { useThemeStore } from "@renderer/stores/ThemeStore";

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController, // ← AJOUTÉ
  Title,
  Tooltip,
  Legend
);

// Props
interface Props extends BarChartConfig, ChartEvents {
  // Configuration spécifique aux graphiques en barres
  config?: BarChartConfig;

  // Données alternatives (si pas dans config)
  labels?: string[];
  datasets?: DatasetConfig[];

  // Options d'affichage
  loading?: boolean;
  error?: string;
  showChartInfo?: boolean;

  // Styling
  theme?: "light" | "dark" | "auto";
  colorScheme?: keyof typeof CHART_COLORS | "auto";

  // Gradient support
  useGradients?: boolean;
  gradientConfig?: GradientConfig;

  // Accessibility
  ariaLabel?: string;
  ariaDescription?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: undefined,
  height: undefined,
  maintainAspectRatio: true,
  responsive: true,
  loading: false,
  showChartInfo: false,
  theme: "auto",
  colorScheme: "auto",
  useGradients: true,
  type: "bar",
  horizontal: false,
  stacked: false,
  className: "",
  ariaLabel: "Graphique en barres",
  ariaDescription: "Graphique en barres interactif",
});

// Emits
const emit = defineEmits<{
  "chart-ready": [chart: Chart];
  "chart-destroy": [];
  "chart-update": [chart: Chart];
  "chart-resize": [chart: Chart, size: { width: number; height: number }];
  "data-click": [event: any, elements: any[], data: any];
  "data-hover": [event: any, elements: any[], data: any];
  "dataset-hover": [event: any, datasetIndex: number];
  "dataset-click": [event: any, datasetIndex: number];
}>();

// Refs
const chartCanvas = ref<HTMLCanvasElement>();
const chartInstance = shallowRef<Chart | null>(null);

// Computed properties
const canvasWidth = computed(() => props.width || undefined);
const canvasHeight = computed(() => props.height || undefined);

const datasets = computed(() => {
  return props.config?.data?.datasets || props.datasets || [];
});

const labels = computed(() => {
  return props.config?.data?.labels || props.labels || [];
});

const totalDataPoints = computed(() => {
  return datasets.value.reduce(
    (total, dataset) => total + (dataset.data?.length || 0),
    0
  );
});

// Configuration finale du graphique
const { theme } = useThemeStore();
const isDarkMode = ref(false);

// Observer les changements de thème
const checkDarkMode = () => {
  isDarkMode.value = theme === 'dark';
};

onMounted(() => {
  checkDarkMode();

  // Observer les changements de classe sur l'élément html
  const observer = new MutationObserver(checkDarkMode);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  onUnmounted(() => observer.disconnect());
});

const finalConfig = computed<ChartConfiguration<"bar">>(() => {
  const textColor = isDarkMode.value ? "#e5e7eb" : "#374151";
  const gridColor = isDarkMode.value
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(0, 0, 0, 0.1)";
  const borderColor = isDarkMode.value
    ? "rgba(255, 255, 255, 0.2)"
    : "rgba(0, 0, 0, 0.1)";

  const baseConfig: ChartConfiguration<"bar"> = {
    type: "bar",
    data: {
      labels: labels.value,
      datasets: processedDatasets.value,
    },
    options: {
      responsive: props.responsive,
      maintainAspectRatio: props.maintainAspectRatio,
      indexAxis: props.horizontal ? "y" : "x",
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        x: {
          stacked: props.stacked,
          grid: {
            display: true,
            color: gridColor,
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: true,
          },
          ticks: {
            color: textColor,
            font: {
              size: 12,
            },
            padding: 8,
          },
          border: {
            color: borderColor,
            width: 1,
          },
        },
        y: {
          stacked: props.stacked,
          beginAtZero: true,
          grid: {
            display: true,
            color: gridColor,
            drawBorder: true,
            drawOnChartArea: true,
            drawTicks: true,
          },
          ticks: {
            color: textColor,
            font: {
              size: 12,
            },
            padding: 8,
          },
          border: {
            color: borderColor,
            width: 1,
          },
        },
      },
      plugins: {
        legend: {
          display: datasets.value.length > 1,
          position: "top" as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            color: textColor,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          enabled: true,
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "white",
          bodyColor: "white",
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || "";
              const value = context.parsed.y;
              return `${label}: ${formatValue(value)}`;
            },
          },
        },
        title: {
          display: !!props.title,
          text: props.title,
          color: textColor,
          font: {
            size: 16,
            weight: "bold",
            family: "'Inter', sans-serif",
          },
          padding: 20,
        },
      },
      animation: {
        duration: 1000,
        easing: "easeInOutCubic",
      },
      elements: {
        bar: {
          borderRadius: 8,
          borderWidth: 0,
          ...(props.barOptions && {
            borderRadius: props.barOptions.barThickness ? 4 : 8,
          }),
        },
      },
      // Options spécifiques aux barres
      ...(props.barOptions && {
        barPercentage: 0.7,
        categoryPercentage: 0.8,
        barThickness: props.barOptions.barThickness,
        maxBarThickness: props.barOptions.maxBarThickness,
      }),
      onClick: handleChartClick,
      onHover: handleChartHover,
    },
    plugins: props.plugins || [],
  };

  // Merge avec la configuration personnalisée
  if (props.config?.options) {
    return mergeConfigurations(
      baseConfig,
      props.config as ChartConfiguration<"bar">
    );
  }

  // Merge avec les options individuelles
  if (props.options) {
    baseConfig.options = mergeDeep(baseConfig.options || {}, props.options);
  }

  return baseConfig;
});

// Datasets traités avec couleurs et gradients
const processedDatasets = computed(() => {
  return datasets.value.map((dataset, index) => {
    const processedDataset = { ...dataset };

    // Application automatique des couleurs si non spécifiées
    if (!dataset.backgroundColor && !dataset.borderColor) {
      if (props.useGradients && chartCanvas.value) {
        try {
          processedDataset.backgroundColor = createGradient?.(
            chartCanvas.value,
            {
              start: "#4F46E5", // indigo-600 (plus saturé)
              end: "#7C3AED", // violet-600 (plus saturé)
              direction: "vertical",
            }
          );
          processedDataset.borderColor = "#7C3AED";
          processedDataset.borderWidth = 0;
        } catch {
          processedDataset.backgroundColor = "#4F46E5";
          processedDataset.borderColor = "#7C3AED";
        }
      } else {
        processedDataset.backgroundColor = "#4F46E5";
        processedDataset.borderColor = "#7C3AED";
      }
    }

    // Options spécifiques aux barres
    if (props.barOptions) {
      if (props.barOptions.skipNull) {
        processedDataset.data = dataset.data.map((value) =>
          value === null ? NaN : value
        );
      }
    }

    return processedDataset;
  });
});

// Méthodes utilitaires
const formatValue = (value: number): string => {
  if (typeof value !== "number") return String(value);

  if (Math.abs(value) >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  }
  if (Math.abs(value) >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value.toLocaleString();
};

const mergeDeep = (target: any, source: any): any => {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
};

const isObject = (item: any): boolean => {
  return item && typeof item === "object" && !Array.isArray(item);
};

const mergeConfigurations = (
  base: ChartConfiguration<"bar">,
  custom: ChartConfiguration<"bar">
): ChartConfiguration<"bar"> => {
  return {
    ...base,
    ...custom,
    data: {
      ...base.data,
      ...custom.data,
      datasets: custom.data?.datasets || base.data?.datasets || [],
    },
    options: mergeDeep(base.options || {}, custom.options || {}),
  };
};

// Event handlers
const handleChartClick = (event: any, elements: any[]) => {
  if (elements.length > 0) {
    const element = elements[0];
    const datasetIndex = element.datasetIndex;
    const dataIndex = element.index;
    const dataset = finalConfig.value.data.datasets[datasetIndex];
    const data = {
      datasetIndex,
      dataIndex,
      dataset,
      value: dataset.data[dataIndex],
      label: finalConfig.value.data.labels?.[dataIndex],
    };

    emit("data-click", event, elements, data);

    if (props.onElementClick) {
      props.onElementClick(event, elements);
    }
  }
};

const handleChartHover = (event: any, elements: any[]) => {
  if (elements.length > 0) {
    const element = elements[0];
    const datasetIndex = element.datasetIndex;
    const dataIndex = element.index;
    const dataset = finalConfig.value.data.datasets[datasetIndex];
    const data = {
      datasetIndex,
      dataIndex,
      dataset,
      value: dataset.data[dataIndex],
      label: finalConfig.value.data.labels?.[dataIndex],
    };

    emit("data-hover", event, elements, data);

    if (props.onElementHover) {
      props.onElementHover(event, elements);
    }
  }
};

const handleClick = (event: MouseEvent) => {
  // Délégué à Chart.js
};

const handleMouseMove = (event: MouseEvent) => {
  // Délégué à Chart.js
};

const handleMouseLeave = (event: MouseEvent) => {
  // Reset hover state
};

// Méthodes publiques
const updateChart = () => {
  if (chartInstance.value) {
    chartInstance.value.update();
    emit("chart-update", chartInstance.value);
  }
};

const resizeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.resize();
    const size = {
      width: chartInstance.value.width,
      height: chartInstance.value.height,
    };
    emit("chart-resize", chartInstance.value, size);
  }
};

const exportChart = (format: "png" | "jpeg" = "png", quality = 1) => {
  if (chartInstance.value) {
    return chartInstance.value.toBase64Image(`image/${format}`, quality);
  }
  return null;
};

const getDatasetAtEvent = (event: any) => {
  if (chartInstance.value) {
    return chartInstance.value.getElementsAtEventForMode(
      event,
      "dataset",
      { intersect: true },
      false
    );
  }
  return [];
};

const getElementsAtEvent = (event: any) => {
  if (chartInstance.value) {
    return chartInstance.value.getElementsAtEventForMode(
      event,
      "nearest",
      { intersect: true },
      false
    );
  }
  return [];
};

// Lifecycle
const initChart = async () => {
  if (!chartCanvas.value) return;

  try {
    // Détruire l'instance existante
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }

    // Créer la nouvelle instance
    chartInstance.value = new ChartJS(chartCanvas.value, finalConfig.value);

    // Accessibility
    if (props.ariaLabel) {
      chartCanvas.value.setAttribute("aria-label", props.ariaLabel);
    }
    if (props.ariaDescription) {
      chartCanvas.value.setAttribute("aria-description", props.ariaDescription);
    }
    chartCanvas.value.setAttribute("role", "img");

    emit("chart-ready", chartInstance.value);

    if (props.onChartReady) {
      props.onChartReady(chartInstance.value);
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation du graphique:", error);
    emit("chart-destroy");
  }
};

const destroyChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
    emit("chart-destroy");

    if (props.onChartDestroy) {
      props.onChartDestroy();
    }
  }
};

// Watchers
watch(
  [
    () => props.config,
    () => props.data,
    () => props.datasets,
    () => props.labels,
    () => props.options,
  ],
  async () => {
    await nextTick();
    if (chartInstance.value) {
      updateChart();
    } else {
      initChart();
    }
  },
  { deep: true }
);

watch(
  () => props.loading,
  (loading) => {
    if (!loading) {
      nextTick(initChart);
    }
  }
);

// Hooks
onMounted(() => {
  if (!props.loading) {
    nextTick(initChart);
  }
});

onUnmounted(() => {
  destroyChart();
});

// Expose des méthodes publiques
defineExpose({
  updateChart,
  resizeChart,
  exportChart,
  getDatasetAtEvent,
  getElementsAtEvent,
  chart: chartInstance,
});
</script>

<style scoped>
.bar-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.bar-chart-container.is-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-loading,
.chart-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text,
.error-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.error-icon {
  font-size: 2rem;
}

.chart-error {
  color: #ef4444;
}

.chart-info {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.5rem;
  padding: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 0.75rem;
  color: #6b7280;
  pointer-events: none;
}

.dark .chart-info {
  background: rgba(31, 41, 55, 0.95);
  color: #ffff;
}

.chart-title {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.dark .chart-title {
  color: #ffff;
}
.chart-stats {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .bar-chart-container {
    min-height: 250px;
  }

  .chart-info {
    position: relative;
    top: auto;
    right: auto;
    margin-top: 1rem;
    display: inline-block;
  }
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .chart-info {
    background: rgba(31, 41, 55, 0.95);
    color: #d1d5db;
  }

  .chart-title {
    color: #f9fafb;
  }
}

/* Focus styles for accessibility */
.bar-chart-container canvas:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Dark theme styles */
.dark .bar-chart-container canvas {
  /* Les couleurs sont maintenant gérées directement dans la configuration JS */
}
</style>
