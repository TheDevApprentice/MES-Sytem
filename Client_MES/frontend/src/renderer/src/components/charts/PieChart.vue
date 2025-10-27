<template>
  <div
    class="pie-chart-container"
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

    <!-- Chart wrapper -->
    <div v-else class="chart-wrapper">
      <canvas
        ref="chartCanvas"
        :width="width || 400"
        :height="height || 400"
      ></canvas>
    </div>

    <!-- Chart legend (custom) -->
    <div v-if="showCustomLegend && chartInstance" class="custom-legend">
      <div class="legend-title" v-if="legendTitle">{{ legendTitle }}</div>
      <div class="legend-items">
        <div
          v-for="(item, index) in legendItems"
          :key="index"
          class="legend-item"
          :class="{ 'legend-item-hidden': item.hidden }"
          @click="toggleDataset(index)"
        >
          <div
            class="legend-color"
            :style="{ backgroundColor: item.color }"
          ></div>
          <span class="legend-label">{{ item.label }}</span>
          <span class="legend-value">
            {{ formatValue(item.value) }}
            <span class="legend-percentage">({{ item.percentage }}%)</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Chart controls -->
    <div v-if="showControls && chartInstance" class="chart-controls">
      <button
        v-if="allowToggleAnimation"
        @click="toggleAnimation"
        class="control-button"
        title="Activer/Désactiver les animations"
      >
        {{ animationEnabled ? "⏸️" : "▶️" }}
      </button>
      <button
        v-if="allowExport"
        @click="downloadChart"
        class="control-button"
        title="Télécharger le graphique"
      >
        💾
      </button>
    </div>

    <!-- Chart stats overlay -->
    <div v-if="showChartInfo && chartInstance" class="chart-info">
      <div class="chart-title" v-if="title">
        {{ title }}
      </div>
      <div class="chart-stats">
        <div class="stat-item">
          <span class="stat-label">Total:</span>
          <span class="stat-value">{{ formatValue(totalValue) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Segments:</span>
          <span class="stat-value">{{ chartData.length }}</span>
        </div>
        <div class="stat-item" v-if="largestSegment">
          <span class="stat-label">Plus grand:</span>
          <span class="stat-value"
            >{{ largestSegment.label }} ({{ largestSegment.percentage }}%)</span
          >
        </div>
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
  ArcElement,
  PieController,
  Tooltip,
  Legend,
  Title,
  type Chart,
  type ChartConfiguration,
} from "chart.js";

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  ArcElement,
  PieController,
  Tooltip,
  Legend,
  Title
);

// Props simplifiées
interface Props {
  // Données
  labels?: string[];
  datasets?: any[];
  values?: number[];

  // Options d'affichage
  width?: number;
  height?: number;
  loading?: boolean;
  error?: string;
  title?: string;
  theme?: "light" | "dark";
  
  // Légende
  showCustomLegend?: boolean;
  legendTitle?: string;
  
  // Contrôles
  showControls?: boolean;
  showChartInfo?: boolean;
  allowToggleAnimation?: boolean;
  allowExport?: boolean;

  // Style
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  width: 320,
  height: 320,
  loading: false,
  showCustomLegend: false,
  showControls: false,
  showChartInfo: false,
  allowToggleAnimation: false,
  allowExport: false,
  theme: "light",
  className: "",
});

// Emits
const emit = defineEmits<{
  "chart-ready": [chart: Chart];
  "chart-destroy": [];
  "chart-update": [chart: Chart];
}>();

// Refs
const chartCanvas = ref<HTMLCanvasElement>();
const chartInstance = shallowRef<Chart | null>(null);
const animationEnabled = ref(true);

// Computed properties
const processedData = computed(() => {
  // Si on a des valeurs simples
  if (props.values && props.labels) {
    return {
      labels: props.labels,
      datasets: [{
        data: props.values,
        backgroundColor: generateColors(props.values.length),
        borderColor: '#ffffff',
        borderWidth: 2,
      }]
    };
  }
  
  // Si on a des datasets complets
  if (props.datasets && props.labels) {
    return {
      labels: props.labels,
      datasets: props.datasets.map(dataset => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor || generateColors(props.labels.length),
        borderColor: dataset.borderColor || '#ffffff',
        borderWidth: dataset.borderWidth || 2,
      }))
    };
  }
  
  return { labels: [], datasets: [] };
});

const chartData = computed(() => {
  if (!processedData.value.datasets.length || !processedData.value.datasets[0].data.length) return [];

  const data = processedData.value.datasets[0].data;
  const backgroundColors = processedData.value.datasets[0].backgroundColor as string[];
  const labels = processedData.value.labels;

  return labels.map((label, index) => ({
    label,
    value: data[index] as number,
    color: Array.isArray(backgroundColors)
      ? backgroundColors[index]
      : backgroundColors,
    percentage: (((data[index] as number) / totalValue.value) * 100).toFixed(1),
    hidden: false,
  }));
});

const totalValue = computed(() => {
  if (!processedData.value.datasets.length) return 0;
  const data = processedData.value.datasets[0].data;
  return data.reduce((sum, value) => sum + (value as number), 0);
});

const largestSegment = computed(() => {
  if (!chartData.value.length) return null;
  return chartData.value.reduce((max, current) =>
    current.value > max.value ? current : max
  );
});

const legendItems = computed(() => chartData.value);

// Génération des couleurs
const generateColors = (count: number): string[] => {
  // Palette de couleurs pastel similaire à vos captures d'écran
  const pastelColors = [
    '#87CEEB', // Sky Blue
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#F8B195', // Peach
    '#C39BD3', // Lavender
    '#85C1E2', // Light Blue
    '#82E0AA', // Light Green
    '#F9E79F', // Light Yellow
    '#D7BDE2', // Light Purple
    '#FAD7A0', // Light Orange
    '#A9CCE3', // Powder Blue
    '#ABEBC6', // Pale Green
    '#F5B7B1', // Light Pink
    '#D2B4DE', // Pale Purple
    '#AED6F1', // Baby Blue
  ];

  return Array.from({ length: count }, (_, i) => pastelColors[i % pastelColors.length]);
};

// Configuration du graphique
const chartConfig = computed<ChartConfiguration<"pie">>(() => ({
  type: "pie",
  data: processedData.value,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !props.showCustomLegend,
        position: "bottom",
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = ((value / totalValue.value) * 100).toFixed(1);
            return `${label}: ${formatValue(value)} (${percentage}%)`;
          },
        },
      },
      title: {
        display: !!props.title,
        text: props.title,
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
    animation: animationEnabled.value
      ? {
          animateRotate: true,
          animateScale: false,
          duration: 1000,
        }
      : false,
  },
}));

// Méthodes
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

const toggleAnimation = () => {
  animationEnabled.value = !animationEnabled.value;
  updateChart();
};

const toggleDataset = (index: number) => {
  if (chartInstance.value) {
    const meta = chartInstance.value.getDatasetMeta(0);
    meta.data[index].hidden = !meta.data[index].hidden;
    chartInstance.value.update();
  }
};

const downloadChart = () => {
  if (chartInstance.value) {
    const url = chartInstance.value.toBase64Image("image/png", 1);
    const link = document.createElement("a");
    link.download = `pie-chart-${Date.now()}.png`;
    link.href = url;
    link.click();
  }
};

const updateChart = () => {
  if (chartInstance.value) {
    chartInstance.value.update();
    emit("chart-update", chartInstance.value);
  }
};

const initChart = async () => {
  await nextTick();
  
  if (!chartCanvas.value) return;

  try {
    // Détruire l'instance existante
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }

    // Créer la nouvelle instance
    chartInstance.value = new ChartJS(chartCanvas.value, chartConfig.value);
    
    emit("chart-ready", chartInstance.value);
  } catch (error) {
    console.error("Erreur lors de l'initialisation du graphique:", error);
  }
};

const destroyChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
    emit("chart-destroy");
  }
};

// Watchers
watch(
  () => [props.labels, props.datasets, props.values],
  async () => {
    await nextTick();
    if (chartInstance.value) {
      chartInstance.value.data = processedData.value;
      updateChart();
    } else {
      initChart();
    }
  },
  { deep: true }
);

// Lifecycle
onMounted(() => {
  if (!props.loading) {
    initChart();
  }
});

onUnmounted(() => {
  destroyChart();
});

// Expose
defineExpose({
  updateChart,
  toggleDataset,
  downloadChart,
  chart: chartInstance,
});
</script>

<style scoped>
.pie-chart-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-wrapper canvas {
  max-width: 100%;
  height: auto !important;
}

.pie-chart-container.is-loading {
  justify-content: center;
  min-height: 300px;
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

.chart-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
}

.control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.control-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.chart-info {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.5rem;
  padding: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 0.75rem;
  color: #6b7280;
  pointer-events: none;
  min-width: 140px;
}

.chart-title {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.chart-stats {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-weight: 500;
}

.stat-value {
  font-weight: 600;
  color: #374151;
}

.custom-legend {
  margin-top: 1rem;
  width: 100%;
  max-width: 400px;
}

.legend-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
  text-align: center;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.legend-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.legend-item-hidden {
  opacity: 0.5;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  font-weight: 500;
  color: #374151;
}

.legend-value {
  font-weight: 600;
  color: #374151;
}

.legend-percentage {
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: 0.25rem;
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .chart-info,
  .legend-item {
    background: rgba(31, 41, 55, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .chart-title,
  .stat-value,
  .legend-label,
  .legend-value {
    color: #f9fafb;
  }

  .stat-label,
  .legend-percentage {
    color: #d1d5db;
  }

  .control-button {
    background: rgba(31, 41, 55, 0.9);
    border-color: rgba(255, 255, 255, 0.1);
    color: #d1d5db;
  }

  .control-button:hover {
    background: rgba(31, 41, 55, 1);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .pie-chart-container {
    min-height: 250px;
  }

  .chart-info {
    position: relative;
    top: auto;
    left: auto;
    margin-bottom: 1rem;
  }

  .chart-controls {
    position: relative;
    top: auto;
    right: auto;
    margin-top: 1rem;
    justify-content: center;
  }

  .custom-legend {
    max-width: 100%;
  }
}
</style>