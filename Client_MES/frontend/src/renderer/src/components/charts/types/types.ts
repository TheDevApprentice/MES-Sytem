// components/common/charts/types.ts
import type {
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
} from "chart.js";

// Types de base pour les couleurs
export type ChartColor = Color | string | CanvasGradient | CanvasPattern;
export type ChartPeriod = "day" | "week" | "month" | "year";
// Interface de base pour tous les composants de chart
export interface BaseChartProps {
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  responsive?: boolean;
  plugins?: Plugin[];
  className?: string;
}

// Configuration pour les datasets
export interface DatasetConfig {
  label?: string;
  data: number[];
  backgroundColor?: ChartColor | ChartColor[];
  borderColor?: ChartColor | ChartColor[];
  borderWidth?: number | number[];
  borderRadius?: number | BorderRadius | (number | BorderRadius)[];
  tension?: number;
  fill?: boolean | string | number;
  pointStyle?: string;
  pointRadius?: number | number[];
  pointBackgroundColor?: ChartColor | ChartColor[];
  pointBorderColor?: ChartColor | ChartColor[];
  pointBorderWidth?: number | number[];
  pointHoverRadius?: number | number[];
  pointHoverBackgroundColor?: ChartColor | ChartColor[];
  pointHoverBorderColor?: ChartColor | ChartColor[];
  pointHoverBorderWidth?: number | number[];
  stack?: string;
  hidden?: boolean;
  order?: number;
  yAxisID?: string;
  xAxisID?: string;
}

// Configuration pour les axes
export interface AxisConfig {
  type?:
    | "linear"
    | "logarithmic"
    | "category"
    | "time"
    | "timeseries"
    | "radialLinear";
  position?: "top" | "bottom" | "left" | "right" | "center" | "chartArea";
  display?: boolean;
  title?: {
    display?: boolean;
    text?: string | string[];
    color?: ChartColor;
    font?: Partial<FontSpec>;
    padding?:
      | number
      | { top?: number; bottom?: number; left?: number; right?: number };
  };
  min?: number;
  max?: number;
  suggestedMin?: number;
  suggestedMax?: number;
  beginAtZero?: boolean;
  stacked?: boolean;
  grid?: {
    display?: boolean;
    color?: ChartColor | ChartColor[];
    borderColor?: ChartColor;
    borderWidth?: number;
    borderDash?: number[];
    borderDashOffset?: number;
    lineWidth?: number | number[];
    drawOnChartArea?: boolean;
    drawTicks?: boolean;
    tickLength?: number;
    offset?: boolean;
  };
  ticks?: {
    display?: boolean;
    color?: ChartColor;
    font?: Partial<FontSpec>;
    major?: {
      enabled?: boolean;
    };
    padding?: number;
    stepSize?: number;
    count?: number;
    precision?: number;
    format?: Intl.NumberFormatOptions;
    callback?: (
      tickValue: string | number,
      index: number,
      ticks: any[]
    ) => string | number | null | undefined;
  };
}

// Configuration pour les animations
export interface AnimationConfig {
  duration?: number;
  easing?:
    | "linear"
    | "easeInQuad"
    | "easeOutQuad"
    | "easeInOutQuad"
    | "easeInCubic"
    | "easeOutCubic"
    | "easeInOutCubic"
    | "easeInQuart"
    | "easeOutQuart"
    | "easeInOutQuart"
    | "easeInQuint"
    | "easeOutQuint"
    | "easeInOutQuint"
    | "easeInSine"
    | "easeOutSine"
    | "easeInOutSine"
    | "easeInExpo"
    | "easeOutExpo"
    | "easeInOutExpo"
    | "easeInCirc"
    | "easeOutCirc"
    | "easeInOutCirc"
    | "easeInElastic"
    | "easeOutElastic"
    | "easeInOutElastic"
    | "easeInBack"
    | "easeOutBack"
    | "easeInOutBack"
    | "easeInBounce"
    | "easeOutBounce"
    | "easeInOutBounce";
  delay?: number;
  loop?: boolean;
  onComplete?: (animation: any) => void;
  onProgress?: (animation: any) => void;
}

// Configuration pour les légendes
export interface LegendConfig {
  display?: boolean;
  position?: "top" | "bottom" | "left" | "right" | "center" | "chartArea";
  align?: "start" | "center" | "end";
  fullSize?: boolean;
  reverse?: boolean;
  labels?: {
    boxWidth?: number;
    boxHeight?: number;
    color?: ChartColor;
    font?: Partial<FontSpec>;
    padding?: number;
    generateLabels?: (chart: Chart) => any[];
    filter?: (legendItem: any, chartData: ChartData) => boolean;
    sort?: (a: any, b: any, chartData: ChartData) => number;
    usePointStyle?: boolean;
    pointStyle?: string;
    textAlign?: "left" | "center" | "right";
  };
  onClick?: (event: any, legendItem: any, legend: any) => void;
  onHover?: (event: any, legendItem: any, legend: any) => void;
  onLeave?: (event: any, legendItem: any, legend: any) => void;
}

// Configuration pour les tooltips
export interface TooltipConfig {
  enabled?: boolean;
  external?: (context: { chart: Chart; tooltip: any }) => void;
  mode?: "point" | "nearest" | "index" | "dataset" | "x" | "y";
  intersect?: boolean;
  position?: "average" | "nearest";
  filter?: (tooltipItem: TooltipItem<any>) => boolean;
  itemSort?: (a: TooltipItem<any>, b: TooltipItem<any>) => number;
  backgroundColor?: ChartColor;
  titleColor?: ChartColor;
  titleFont?: Partial<FontSpec>;
  titleAlign?: "left" | "center" | "right";
  titleSpacing?: number;
  titleMarginBottom?: number;
  bodyColor?: ChartColor;
  bodyFont?: Partial<FontSpec>;
  bodyAlign?: "left" | "center" | "right";
  bodySpacing?: number;
  footerColor?: ChartColor;
  footerFont?: Partial<FontSpec>;
  footerAlign?: "left" | "center" | "right";
  footerSpacing?: number;
  footerMarginTop?: number;
  padding?:
    | number
    | { top?: number; bottom?: number; left?: number; right?: number };
  caretPadding?: number;
  caretSize?: number;
  cornerRadius?: number;
  multiKeyBackground?: ChartColor;
  displayColors?: boolean;
  borderColor?: ChartColor;
  borderWidth?: number;
  callbacks?: {
    beforeTitle?: (
      tooltipItems: TooltipItem<any>[]
    ) => string | string[] | void;
    title?: (tooltipItems: TooltipItem<any>[]) => string | string[] | void;
    afterTitle?: (tooltipItems: TooltipItem<any>[]) => string | string[] | void;
    beforeBody?: (tooltipItems: TooltipItem<any>[]) => string | string[] | void;
    beforeLabel?: (tooltipItem: TooltipItem<any>) => string | string[] | void;
    label?: (tooltipItem: TooltipItem<any>) => string | string[] | void;
    labelColor?: (tooltipItem: TooltipItem<any>) => {
      borderColor: ChartColor;
      backgroundColor: ChartColor;
    };
    labelTextColor?: (tooltipItem: TooltipItem<any>) => ChartColor;
    labelPointStyle?: (tooltipItem: TooltipItem<any>) => {
      pointStyle: string;
      rotation: number;
    };
    afterLabel?: (tooltipItem: TooltipItem<any>) => string | string[] | void;
    afterBody?: (tooltipItems: TooltipItem<any>[]) => string | string[] | void;
    beforeFooter?: (
      tooltipItems: TooltipItem<any>[]
    ) => string | string[] | void;
    footer?: (tooltipItems: TooltipItem<any>[]) => string | string[] | void;
    afterFooter?: (
      tooltipItems: TooltipItem<any>[]
    ) => string | string[] | void;
  };
}

// Configuration commune à tous les types de charts
export interface CommonChartConfig extends BaseChartProps {
  title?: string;
  data?: {
    labels?: string[];
    datasets?: DatasetConfig[];
  };
  options?: {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    aspectRatio?: number;
    resizeDelay?: number;
    devicePixelRatio?: number;
    hover?: {
      mode?: "point" | "nearest" | "index" | "dataset" | "x" | "y";
      intersect?: boolean;
      includeInvisible?: boolean;
    };
    events?: string[];
    onClick?: (event: any, elements: any[], chart: Chart) => void;
    onHover?: (event: any, elements: any[], chart: Chart) => void;
    animation?: AnimationConfig | false;
    animations?: { [key: string]: AnimationConfig };
    transitions?: { [key: string]: AnimationConfig };
    layout?: {
      padding?:
        | number
        | { top?: number; bottom?: number; left?: number; right?: number };
    };
    scales?: {
      [key: string]: AxisConfig;
    };
    indexAxis?: "x" | "y";
    plugins?: {
      legend?: LegendConfig;
      tooltip?: TooltipConfig;
      title?: {
        display?: boolean;
        text?: string | string[];
        color?: ChartColor;
        font?: Partial<FontSpec>;
        fullSize?: boolean;
        padding?:
          | number
          | { top?: number; bottom?: number; left?: number; right?: number };
        position?: "top" | "bottom" | "left" | "right";
        weight?: number;
      };
      subtitle?: {
        display?: boolean;
        text?: string | string[];
        color?: ChartColor;
        font?: Partial<FontSpec>;
        fullSize?: boolean;
        padding?:
          | number
          | { top?: number; bottom?: number; left?: number; right?: number };
        position?: "top" | "bottom" | "left" | "right";
        weight?: number;
      };
      [key: string]: any;
    };
    elements?: {
      point?: {
        radius?: number;
        pointStyle?: string;
        backgroundColor?: ChartColor;
        borderColor?: ChartColor;
        borderWidth?: number;
        hitRadius?: number;
        hoverRadius?: number;
        hoverBorderWidth?: number;
      };
      line?: {
        tension?: number;
        backgroundColor?: ChartColor;
        borderColor?: ChartColor;
        borderWidth?: number;
        borderCapStyle?: "butt" | "round" | "square";
        borderDash?: number[];
        borderDashOffset?: number;
        borderJoinStyle?: "bevel" | "round" | "miter";
        capBezierPoints?: boolean;
        cubicInterpolationMode?: "default" | "monotone";
        fill?: boolean | string | number;
        stepped?: boolean | "before" | "after" | "middle";
      };
      bar?: {
        backgroundColor?: ChartColor;
        borderColor?: ChartColor;
        borderWidth?: number;
        borderRadius?: number | BorderRadius;
        borderSkipped?:
          | "start"
          | "end"
          | "middle"
          | "bottom"
          | "left"
          | "top"
          | "right"
          | false;
        inflateAmount?: number | "auto";
      };
      arc?: {
        backgroundColor?: ChartColor;
        borderColor?: ChartColor;
        borderWidth?: number;
        borderAlign?: "center" | "inner";
        spacing?: number;
      };
    };
    interaction?: {
      mode?: "point" | "nearest" | "index" | "dataset" | "x" | "y";
      intersect?: boolean;
      includeInvisible?: boolean;
    };
  };
}

// Types spécifiques pour chaque type de chart
export interface BarChartConfig extends CommonChartConfig {
  type?: "bar";
  horizontal?: boolean;
  stacked?: boolean;
  barOptions?: {
    barPercentage?: number;
    categoryPercentage?: number;
    barThickness?: number | "flex";
    maxBarThickness?: number;
    minBarLength?: number;
    grouped?: boolean;
    skipNull?: boolean;
  };
}

export interface LineChartConfig extends CommonChartConfig {
  type?: "line";
  stepped?: boolean | "before" | "after" | "middle";
  tension?: number;
  spanGaps?: boolean | number;
  lineOptions?: {
    showLine?: boolean;
    spanGaps?: boolean | number;
    cubicInterpolationMode?: "default" | "monotone";
    stepped?: boolean | "before" | "after" | "middle";
  };
}

export interface PieChartConfig extends CommonChartConfig {
  type?: "pie" | "doughnut";
  cutout?: number | string;
  radius?: number | string;
  rotation?: number;
  circumference?: number;
  pieOptions?: {
    cutout?: number | string;
    radius?: number | string;
    rotation?: number;
    circumference?: number;
    spacing?: number;
    borderAlign?: "center" | "inner";
  };
}

// Interface pour les événements des charts
export interface ChartEvents {
  onDatasetHover?: (event: any, datasetIndex: number) => void;
  onDatasetClick?: (event: any, datasetIndex: number) => void;
  onElementClick?: (event: any, elements: any[]) => void;
  onElementHover?: (event: any, elements: any[]) => void;
  onChartReady?: (chart: Chart) => void;
  onChartDestroy?: () => void;
  onChartUpdate?: (chart: Chart) => void;
  onChartResize?: (
    chart: Chart,
    size: { width: number; height: number }
  ) => void;
}

// Interface pour StatsCard
export interface StatsCardConfig {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
    period?: string;
  };
  iconType?:
    | "users"
    | "user"
    | "revenue"
    | "clock"
    | "activity"
    | "tickets"
    | "performance"
    | "orders"
    | "dashboard"
    | "settings"
    | "analytics"
    | "document"
    | "exclamation-circle"
    | "receipt"
    | "check-circle";
  // Options d'affichage
  variant?: "default" | "compact" | "detailed";
  size?: "sm" | "md" | "lg";

  // Styling
  theme?: "light" | "dark" | "auto";
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  color?:
    | "blue"
    | "green"
    | "red"
    | "yellow"
    | "orange"
    | "purple"
    | "indigo"
    | "pink"
    | "gray";
  chart?: {
    type?: "line" | "bar" | "area";
    width?: number;
    data?: number[];
    color?: ChartColor;
    height?: number;
    showTooltip?: boolean;
  };
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  subtitle?: string;
  prefix?: string;
  suffix?: string;
  format?: (value: number) => string;

  // Interactions
  showTooltip?: boolean;
  tooltipText?: string;
  showChange?: boolean;
  animated?: boolean;

  // Icon
  iconComponent?: any;

  // Accessibility
  ariaLabel?: string;
  ariaDescription?: string;
}

// Utilitaires pour la configuration des couleurs
export const CHART_COLORS = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
  primary: "rgb(59, 130, 246)",
  secondary: "rgb(107, 114, 128)",
  success: "rgb(34, 197, 94)",
  warning: "rgb(251, 191, 36)",
  danger: "rgb(239, 68, 68)",
  info: "rgb(14, 165, 233)",
  light: "rgb(243, 244, 246)",
  dark: "rgb(31, 41, 55)",
} as const;

export const CHART_COLORS_ALPHA = {
  red: "rgba(255, 99, 132, 0.2)",
  orange: "rgba(255, 159, 64, 0.2)",
  yellow: "rgba(255, 205, 86, 0.2)",
  green: "rgba(75, 192, 192, 0.2)",
  blue: "rgba(54, 162, 235, 0.2)",
  purple: "rgba(153, 102, 255, 0.2)",
  grey: "rgba(201, 203, 207, 0.2)",
  primary: "rgba(59, 130, 246, 0.2)",
  secondary: "rgba(107, 114, 128, 0.2)",
  success: "rgba(34, 197, 94, 0.2)",
  warning: "rgba(251, 191, 36, 0.2)",
  danger: "rgba(239, 68, 68, 0.2)",
  info: "rgba(14, 165, 233, 0.2)",
  light: "rgba(243, 244, 246, 0.2)",
  dark: "rgba(31, 41, 55, 0.2)",
} as const;

// Fonction utilitaire pour créer des gradients
export interface GradientConfig {
  start: string;
  end: string;
  direction?: "vertical" | "horizontal" | "diagonal";
}

export const createGradient = (
  canvas: HTMLCanvasElement,
  config: GradientConfig
): CanvasGradient => {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  let gradient: CanvasGradient;

  switch (config.direction) {
    case "horizontal":
      gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      break;
    case "diagonal":
      gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      break;
    case "vertical":
    default:
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      break;
  }

  gradient.addColorStop(0, config.start);
  gradient.addColorStop(1, config.end);

  return gradient;
};

// Export des types Chart.js natifs pour réexportation
export type {
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
} from "chart.js";
