// components/common/charts/index.ts

// Composants
export { default as BarChart } from "./BarChart.vue";
export { default as LineChart } from "./LineChart.vue";
export { default as PieChart } from "./PieChart.vue";
export { default as StatsCard } from "./StatsCard.vue";

// Types et interfaces
export type {
  // Types de base
  ChartColor,
  ChartPeriod,
  BaseChartProps,
  DatasetConfig,
  AxisConfig,
  AnimationConfig,
  LegendConfig,
  TooltipConfig,
  CommonChartConfig,

  // Types spécifiques par chart
  BarChartConfig,
  LineChartConfig,
  PieChartConfig,
  StatsCardConfig,

  // Types d'événements
  ChartEvents,

  // Types utilitaires
  GradientConfig,

  // Types Chart.js réexportés
  Chart,
  ChartOptions,
  ChartData,
  ChartConfiguration,
  ChartType,
  Plugin,
  TooltipItem,
  ScriptableContext,
  Color,
  FontSpec,
  BorderRadius,
  Point,
} from "./types/types";

import { useTheme } from "@/composables/useTheme";
// Constantes utilitaires
export { CHART_COLORS, CHART_COLORS_ALPHA, createGradient } from "./types/types";

// Fonctions utilitaires pour Chart.js
export const chartUtils = {
  /**
   * Formate une valeur numérique pour l'affichage
   */
  formatValue: (value: number): string => {
    if (typeof value !== "number") return String(value);

    if (Math.abs(value) >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    }
    if (Math.abs(value) >= 1000) {
      return (value / 1000).toFixed(1) + "K";
    }
    return value.toLocaleString();
  },

  /**
   * Génère un array de couleurs basé sur le nombre d'éléments
   */
  generateColors: (
    count: number,
    scheme: "default" | "rainbow" | "monochrome" = "default"
  ): string[] => {
    if (scheme === "rainbow") {
      return Array.from({ length: count }, (_, i) => {
        const hue = (i * 360) / count;
        return `hsl(${hue}, 70%, 60%)`;
      });
    }

    if (scheme === "monochrome") {
      const baseHue = 220; // Bleu
      return Array.from({ length: count }, (_, i) => {
        const lightness = 30 + (i * 40) / count;
        return `hsl(${baseHue}, 70%, ${lightness}%)`;
      });
    }

    // Scheme par défaut
    const colorKeys = Object.keys(CHART_COLORS);
    return Array.from({ length: count }, (_, i) => {
      const colorKey = colorKeys[
        i % colorKeys.length
      ] as keyof typeof CHART_COLORS;
      return CHART_COLORS[colorKey];
    });
  },

  /**
   * Crée une configuration responsive standard
   */
  createResponsiveConfig: (baseConfig: any) => ({
    ...baseConfig,
    options: {
      ...baseConfig.options,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...baseConfig.options?.plugins,
        legend: {
          ...baseConfig.options?.plugins?.legend,
          labels: {
            ...baseConfig.options?.plugins?.legend?.labels,
            usePointStyle: true,
            padding: 20,
          },
        },
      },
    },
  }),

  /**
   * Merge deux configurations Chart.js de manière deep
   */
  mergeConfigurations: <T extends Record<string, any>>(
    base: T,
    override: Partial<T>
  ): T => {
    const result = { ...base };

    for (const key in override) {
      if (
        override[key] &&
        typeof override[key] === "object" &&
        !Array.isArray(override[key])
      ) {
        result[key] = chartUtils.mergeConfigurations(
          result[key] || {},
          override[key]
        );
      } else {
        result[key] = override[key] as T[Extract<keyof T, string>];
      }
    }

    return result;
  },

  /**
   * Calcule la tendance d'un dataset
   */
  calculateTrend: (
    data: number[]
  ): { direction: "up" | "down" | "stable"; percentage: number } => {
    if (data.length < 2) return { direction: "stable", percentage: 0 };

    const firstValue = data[0];
    const lastValue = data[data.length - 1];
    const change = lastValue - firstValue;
    const percentage = Math.abs((change / firstValue) * 100);

    if (Math.abs(change) < firstValue * 0.05) {
      // Moins de 5% de changement
      return { direction: "stable", percentage: 0 };
    }

    return {
      direction: change > 0 ? "up" : "down",
      percentage: Math.round(percentage * 10) / 10, // Arrondi à 1 décimale
    };
  },

  /**
   * Convertit des données pour le format Chart.js
   */
  transformDataForChart: (
    data: Array<{ label: string; value: number; [key: string]: any }>,
    type: "bar" | "line" | "pie" | "doughnut"
  ) => {
    const labels = data.map((item) => item.label);
    const values = data.map((item) => item.value);

    if (type === "pie" || type === "doughnut") {
      return {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: chartUtils.generateColors(
              values.length,
              "rainbow"
            ),
            borderWidth: 2,
            borderColor: "#ffffff",
          },
        ],
      };
    }

    return {
      labels,
      datasets: [
        {
          label: "Données",
          data: values,
          backgroundColor: CHART_COLORS_ALPHA.blue,
          borderColor: CHART_COLORS.blue,
          borderWidth: 2,
          tension: type === "line" ? 0.4 : 0,
        },
      ],
    };
  },

  /**
   * Crée une animation personnalisée
   */
  createCustomAnimation: (
    duration: number = 1000,
    easing: string = "easeInOutCubic",
    delay: number = 0
  ) => ({
    duration,
    easing,
    delay,
    onProgress: (animation: any) => {
      // Callback de progression si nécessaire
    },
    onComplete: (animation: any) => {
      // Callback de fin d'animation si nécessaire
    },
  }),

  /**
   * Configuration d'accessibilité standard
   */
  createA11yConfig: (title: string, description: string) => ({
    plugins: {
      title: {
        display: true,
        text: title,
      },
      legend: {
        labels: {
          generateLabels: (chart: any) => {
            const original =
              Chart.defaults.plugins.legend.labels.generateLabels;
            const labels = original.call(this, chart);

            labels.forEach((label: any, index: number) => {
              label.text += ` (${description})`;
            });

            return labels;
          },
        },
      },
    },
  }),

  /**
   * Détecte si le mode sombre est actif
   */
  isDarkMode: (): boolean => {
    if (typeof window === "undefined") return false;
    return useTheme().isDark;
  },

  /**
   * Applique le thème sombre à une configuration
   */
  applyDarkTheme: (config: any) => {
    const darkColors = {
      text: "#f9fafb",
      gridColor: "rgba(255, 255, 255, 0.1)",
      backgroundColor: "#1f2937",
    };

    return chartUtils.mergeConfigurations(config, {
      options: {
        plugins: {
          legend: {
            labels: {
              color: darkColors.text,
            },
          },
          title: {
            color: darkColors.text,
          },
        },
        scales: {
          x: {
            ticks: {
              color: darkColors.text,
            },
            grid: {
              color: darkColors.gridColor,
            },
          },
          y: {
            ticks: {
              color: darkColors.text,
            },
            grid: {
              color: darkColors.gridColor,
            },
          },
        },
      },
    });
  },
};

// Présets de configuration pour une utilisation rapide
export const chartPresets = {
  /**
   * Configuration simple pour graphique en barres
   */
  simpleBar: (data: number[], labels: string[], title?: string) => ({
    type: "bar" as const,
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: CHART_COLORS_ALPHA.blue,
          borderColor: CHART_COLORS.blue,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: !!title, text: title },
      },
    },
  }),

  /**
   * Configuration simple pour graphique en ligne
   */
  simpleLine: (data: number[], labels: string[], title?: string) => ({
    type: "line" as const,
    data: {
      labels,
      datasets: [
        {
          data,
          borderColor: CHART_COLORS.blue,
          backgroundColor: CHART_COLORS_ALPHA.blue,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: !!title, text: title },
      },
    },
  }),

  /**
   * Configuration simple pour graphique circulaire
   */
  simplePie: (data: number[], labels: string[], title?: string) => ({
    type: "doughnut" as const,
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: chartUtils.generateColors(data.length, "rainbow"),
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: !!title, text: title },
      },
    },
  }),

  /**
   * Configuration pour dashboard avec stats
   */
  dashboardStats: (value: number, change: number, title: string) => ({
    title,
    value,
    change: {
      value: Math.abs(change),
      type:
        change > 0
          ? ("increase" as const)
          : change < 0
          ? ("decrease" as const)
          : ("neutral" as const),
      period: "vs mois dernier",
    },
    color:
      change > 0
        ? ("green" as const)
        : change < 0
        ? ("red" as const)
        : ("gray" as const),
  }),
};

/**
 * Hook Vue pour Chart.js (si vous utilisez la Composition API)
 */
export const useChart = () => {
  const chartRef = ref<HTMLCanvasElement | null>(null);
  const chartInstance = shallowRef<Chart | null>(null);

  const createChart = (config: ChartConfiguration) => {
    if (!chartRef.value) return;

    if (chartInstance.value) {
      chartInstance.value.destroy();
    }

    chartInstance.value = new Chart(chartRef.value, config);
    return chartInstance.value;
  };

  const updateChart = (newData: any) => {
    if (chartInstance.value) {
      Object.assign(chartInstance.value.data, newData);
      chartInstance.value.update();
    }
  };

  const destroyChart = () => {
    if (chartInstance.value) {
      try {
        chartInstance.value.destroy();
      } catch (e) {
        console.warn("Erreur lors de la destruction du graphique:", e);
      }
      chartInstance.value = null;
    }
  };

  onUnmounted(() => {
    destroyChart();
  });

  return {
    chartRef,
    chartInstance: readonly(chartInstance),
    createChart,
    updateChart,
    destroyChart,
  };
};

// Import des hooks Vue nécessaires pour useChart
import { ref, shallowRef, readonly, onUnmounted } from "vue";
import { Chart, ChartConfiguration } from "chart.js";
import { CHART_COLORS, CHART_COLORS_ALPHA } from "./types/types";
