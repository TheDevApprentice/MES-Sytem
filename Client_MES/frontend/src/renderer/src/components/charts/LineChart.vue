<!-- components/common/charts/LineChart.vue -->
<template>
    <div
      class="line-chart-container"
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
  
      <!-- Chart controls overlay -->
      <div v-if="showControls && chartInstance" class="chart-controls">
        <button
          v-if="allowZoom"
          @click="resetZoom"
          class="control-button"
          title="Réinitialiser le zoom"
        >
          🔍
        </button>
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
  
      <!-- Chart info overlay -->
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
          <span v-if="showTrendInfo" class="trend-info">
            Tendance: {{ trendDirection }}
          </span>
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
    PointElement,
    LineElement,
    LineController,  // ← AJOUTÉ
    Title,
    Tooltip,
    Legend,
    Filler,
    type Chart,
    type ChartConfiguration,
    type ChartData,
    type ChartOptions,
  } from "chart.js";
  
  import type {
    LineChartConfig,
    ChartEvents,
    DatasetConfig,
    createGradient,
    GradientConfig,
  } from "./types/types";
  
  import { CHART_COLORS, CHART_COLORS_ALPHA } from "./types/types";
  // Enregistrer les composants Chart.js nécessaires
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    LineController,  // ← AJOUTÉ
    Title,
    Tooltip,
    Legend,
    Filler
  );
  
  // Props
  interface Props extends LineChartConfig, ChartEvents {
    // Configuration spécifique aux graphiques en ligne
    config?: LineChartConfig;
  
    // Données alternatives (si pas dans config)
    labels?: string[];
    datasets?: DatasetConfig[];
  
    // Options d'affichage
    loading?: boolean;
    error?: string;
    showChartInfo?: boolean;
    showTrendInfo?: boolean;
    showControls?: boolean;
  
    // Controls
    allowZoom?: boolean;
    allowToggleAnimation?: boolean;
    allowExport?: boolean;
  
    // Line-specific options
    smooth?: boolean;
    showPoints?: boolean;
    pointSize?: number;
    lineWidth?: number;
    fillArea?: boolean;
    showDataLabels?: boolean;
  
    // Styling
    theme?: "light" | "dark" | "auto";
    colorScheme?: keyof typeof CHART_COLORS | "auto";
  
    // Gradient support
    useGradients?: boolean;
    gradientConfig?: GradientConfig;
  
    // Time series support
    timeFormat?: string;
    timeUnit?:
      | "millisecond"
      | "second"
      | "minute"
      | "hour"
      | "day"
      | "week"
      | "month"
      | "quarter"
      | "year";
  
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
    showTrendInfo: false,
    showControls: false,
    allowZoom: false,
    allowToggleAnimation: false,
    allowExport: false,
    theme: "auto",
    colorScheme: "auto",
    useGradients: false,
    type: "line",
    stepped: false,
    tension: 0.4,
    spanGaps: false,
    smooth: true,
    showPoints: true,
    pointSize: 3,
    lineWidth: 2,
    fillArea: false,
    showDataLabels: false,
    className: "",
    ariaLabel: "Graphique en ligne",
    ariaDescription: "Graphique en ligne interactif",
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
    "zoom-change": [zoomLevel: number];
    "animation-toggle": [enabled: boolean];
    export: [format: string, data: string];
  }>();
  
  // Refs
  const chartCanvas = ref<HTMLCanvasElement>();
  const chartInstance = shallowRef<Chart | null>(null);
  const animationEnabled = ref(true);
  
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
  
  // Calcul de la tendance pour l'affichage
  const trendDirection = computed(() => {
    if (!datasets.value.length || !datasets.value[0].data.length) return "N/A";
  
    const data = datasets.value[0].data;
    const firstValue = data[0];
    const lastValue = data[data.length - 1];
  
    if (lastValue > firstValue) return "📈 Hausse";
    if (lastValue < firstValue) return "📉 Baisse";
    return "➡️ Stable";
  });
  
  // Configuration finale du graphique
  const finalConfig = computed<ChartConfiguration<"line">>(() => {
    const baseConfig: ChartConfiguration<"line"> = {
      type: "line",
      data: {
        labels: labels.value,
        datasets: processedDatasets.value,
      },
      options: {
        responsive: props.responsive,
        maintainAspectRatio: props.maintainAspectRatio,
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)",
              borderDash: [5, 5],
            },
            ticks: {
              color: "rgba(0, 0, 0, 0.7)",
              maxTicksLimit: 10,
            },
          },
          y: {
            display: true,
            beginAtZero: false,
            grid: {
              display: true,
              color: "rgba(0, 0, 0, 0.1)",
            },
            ticks: {
              color: "rgba(0, 0, 0, 0.7)",
              callback: function (tickValue: string | number) {
                return formatValue(Number(tickValue));
              },
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
              color: "rgba(0, 0, 0, 0.7)",
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
            padding: 12,
            callbacks: {
              title: (tooltipItems) => {
                return tooltipItems[0]?.label || "";
              },
              label: (context) => {
                const label = context.dataset.label || "";
                const value = context.parsed.y;
                return `${label}: ${formatValue(value)}`;
              },
              afterLabel: (context) => {
                if (props.showTrendInfo && context.dataIndex > 0) {
                  const currentValue = context.parsed.y;
                  const previousValue = context.dataset.data[
                    context.dataIndex - 1
                  ] as number;
                  const change = currentValue - previousValue;
                  const changePercent = ((change / previousValue) * 100).toFixed(
                    1
                  );
                  return `Variation: ${change >= 0 ? "+" : ""}${changePercent}%`;
                }
                return "";
              },
            },
          },
          title: {
            display: !!props.title,
            text: props.title,
            color: "rgba(0, 0, 0, 0.8)",
            font: {
              size: 16,
              weight: "bold",
            },
            padding: 20,
          },
        },
        animation: animationEnabled.value
          ? {
              duration: 1500,
              easing: "easeInOutCubic",
              tension: {
                duration: 1000,
                easing: "linear",
                from: 1,
                to: 0,
                loop: false,
              },
            }
          : false,
        elements: {
          line: {
            tension: props.smooth ? props.tension || 0.4 : 0,
            borderWidth: props.lineWidth,
            borderCapStyle: "round" as const,
            borderJoinStyle: "round" as const,
            fill: props.fillArea,
          },
          point: {
            radius: props.showPoints ? props.pointSize : 0,
            hoverRadius: props.showPoints ? (props.pointSize || 3) + 2 : 0,
            borderWidth: 2,
            hitRadius: 10,
          },
        },
        onClick: handleChartClick,
        onHover: handleChartHover,
      },
      plugins: [
        ...(props.plugins || []),
        ...(props.showDataLabels ? [dataLabelsPlugin] : []),
      ],
    };
  
    // Options spécifiques aux lignes
    if (props.lineOptions) {
      if (props.lineOptions.spanGaps !== undefined) {
        baseConfig.options!.spanGaps = props.lineOptions.spanGaps;
      }
      if (props.lineOptions.stepped !== undefined) {
        baseConfig.options!.elements!.line!.stepped = props.lineOptions.stepped;
      }
    }
  
    // Merge avec la configuration personnalisée
    if (props.config?.options) {
      return mergeConfigurations(
        baseConfig,
        props.config as ChartConfiguration<"line">
      );
    }
  
    // Merge avec les options individuelles
    if (props.options) {
      baseConfig.options = mergeDeep(baseConfig.options || {}, props.options);
    }
  
    return baseConfig;
  });
  
  // Plugin pour les labels de données
  const dataLabelsPlugin = {
    id: "dataLabels",
    afterDatasetsDraw(chart: Chart) {
      if (!props.showDataLabels) return;
  
      const ctx = chart.ctx;
  
      chart.data.datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
  
        meta.data.forEach((element: any, index) => {
          const value = dataset.data[index] as number;
          const x = element.x;
          const y = element.y - 10;
  
          ctx.save();
          ctx.textAlign = "center";
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          ctx.font = "12px Arial";
          ctx.fillText(formatValue(value), x, y);
          ctx.restore();
        });
      });
    },
  };
  
  // Datasets traités avec couleurs et gradients
  const processedDatasets = computed(() => {
    return datasets.value.map((dataset, index) => {
      const processedDataset = { ...dataset };
  
      // Application automatique des couleurs si non spécifiées
      if (!dataset.backgroundColor && !dataset.borderColor) {
        const colorKeys = Object.keys(CHART_COLORS || {});
        const colorIndex = index % colorKeys.length;
        const colorKey = colorKeys[colorIndex] as keyof typeof CHART_COLORS;
  
        processedDataset.borderColor = CHART_COLORS?.[colorKey] || '#3B82F6';
        processedDataset.pointBackgroundColor = CHART_COLORS?.[colorKey] || '#3B82F6';
        processedDataset.pointBorderColor = CHART_COLORS?.[colorKey] || '#3B82F6';
  
        if (props.fillArea) {
          if (props.useGradients && chartCanvas.value) {
            try {
              const gradientConfig: GradientConfig = props.gradientConfig || {
                start: CHART_COLORS_ALPHA?.[colorKey] || 'rgba(59, 130, 246, 0.2)',
                end: "rgba(255, 255, 255, 0)",
                direction: "vertical",
              };
              processedDataset.backgroundColor = createGradient?.(
                chartCanvas.value,
                gradientConfig
              );
            } catch {
              processedDataset.backgroundColor = CHART_COLORS_ALPHA?.[colorKey] || 'rgba(59, 130, 246, 0.2)';
            }
          } else {
            processedDataset.backgroundColor = CHART_COLORS_ALPHA?.[colorKey] || 'rgba(59, 130, 246, 0.2)';
          }
          processedDataset.fill = true;
        }
      }
  
      // Options spécifiques aux lignes
      processedDataset.tension = props.smooth ? props.tension || 0.4 : 0;
      processedDataset.stepped = props.stepped;
      processedDataset.spanGaps = props.spanGaps;
  
      // Configuration des points
      if (props.showPoints) {
        processedDataset.pointRadius = props.pointSize;
        processedDataset.pointHoverRadius = (props.pointSize || 3) + 2;
      } else {
        processedDataset.pointRadius = 0;
        processedDataset.pointHoverRadius = 0;
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
    base: ChartConfiguration<"line">,
    custom: ChartConfiguration<"line">
  ): ChartConfiguration<"line"> => {
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
  
  // Control methods
  const resetZoom = () => {
    if (chartInstance.value && "resetZoom" in chartInstance.value) {
      (chartInstance.value as any).resetZoom();
      emit("zoom-change", 1);
    }
  };
  
  const toggleAnimation = () => {
    animationEnabled.value = !animationEnabled.value;
    emit("animation-toggle", animationEnabled.value);
    updateChart();
  };
  
  const downloadChart = () => {
    if (chartInstance.value) {
      const url = chartInstance.value.toBase64Image("image/png", 1);
      const link = document.createElement("a");
      link.download = `chart-${Date.now()}.png`;
      link.href = url;
      link.click();
      emit("export", "png", url);
    }
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
  
  const addData = (label: string, data: number[]) => {
    if (chartInstance.value) {
      chartInstance.value.data.labels?.push(label);
      chartInstance.value.data.datasets.forEach((dataset, index) => {
        dataset.data.push(data[index] || 0);
      });
      chartInstance.value.update();
    }
  };
  
  const removeData = () => {
    if (chartInstance.value) {
      chartInstance.value.data.labels?.pop();
      chartInstance.value.data.datasets.forEach((dataset) => {
        dataset.data.pop();
      });
      chartInstance.value.update();
    }
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
    addData,
    removeData,
    resetZoom,
    toggleAnimation,
    chart: chartInstance,
  });
  </script>
  
  <style scoped>
  .line-chart-container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 300px;
  }
  
  .line-chart-container.is-loading {
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
  
  .chart-controls {
    position: absolute;
    top: 1rem;
    left: 1rem;
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
    right: 1rem;
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
    margin-bottom: 0.25rem;
  }
  
  .chart-stats {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }
  
  .trend-info {
    font-weight: 500;
    margin-top: 0.25rem;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .line-chart-container {
      min-height: 250px;
    }
  
    .chart-info {
      position: relative;
      top: auto;
      right: auto;
      margin-top: 1rem;
      display: inline-block;
    }
  
    .chart-controls {
      position: relative;
      top: auto;
      left: auto;
      margin-bottom: 1rem;
      justify-content: center;
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
  
    .control-button {
      background: rgba(31, 41, 55, 0.9);
      border-color: rgba(255, 255, 255, 0.1);
      color: #d1d5db;
    }
  
    .control-button:hover {
      background: rgba(31, 41, 55, 1);
    }
  }
  
  /* Focus styles for accessibility */
  .line-chart-container canvas:focus,
  .control-button:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  </style>