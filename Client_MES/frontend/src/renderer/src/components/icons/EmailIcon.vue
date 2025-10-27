<template>
  <svg
    :width="size"
    :height="size"
    :class="className"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :aria-label="ariaLabel"
    role="img"
    :style="svgStyle"
  >
    <!-- Cercle pour la tête -->
    <circle
      cx="12"
      cy="8"
      r="4"
      :stroke="strokeColor"
      :stroke-width="strokeWidth"
      :fill="fillColor"
      class="user-head transition-all duration-200"
    />
    
    <!-- Corps/épaules -->
    <path
      d="M20 20c0-4.418-3.582-8-8-8s-8 3.582-8 8"
      :stroke="strokeColor"
      :stroke-width="strokeWidth"
      :fill="fillColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="user-body transition-all duration-200"
    />
    
    <!-- Effet de brillance optionnel -->
    <circle
      v-if="withGlow"
      cx="12"
      cy="8"
      r="4"
      fill="none"
      :stroke="glowColor"
      :stroke-width="0.5"
      opacity="0"
      class="user-glow transition-opacity duration-300"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// ===== PROPS =====
interface Props {
  size?: string | number;
  className?: string;
  strokeWidth?: number;
  variant?: 'outline' | 'filled' | 'dual';
  color?: string;
  withGlow?: boolean;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  className: '',
  strokeWidth: 2,
  variant: 'outline',
  color: 'currentColor',
  withGlow: false,
  ariaLabel: 'User icon'
});

// ===== COMPUTED STYLES =====
const strokeColor = computed(() => {
  if (props.variant === 'filled') return props.color;
  return props.color;
});

const fillColor = computed(() => {
  switch (props.variant) {
    case 'filled':
      return props.color;
    case 'dual':
      return 'rgba(59, 130, 246, 0.1)'; // Bleu léger pour le mode dual
    default:
      return 'none';
  }
});

const glowColor = computed(() => {
  return props.color === 'currentColor' ? 'rgba(59, 130, 246, 0.6)' : props.color;
});

const svgStyle = computed(() => ({
  minWidth: typeof props.size === 'number' ? `${props.size}px` : props.size,
  minHeight: typeof props.size === 'number' ? `${props.size}px` : props.size,
}));
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}

/* Effets hover pour l'icône */
svg:hover .user-head {
  transform: translateY(-1px);
}

svg:hover .user-body {
  transform: translateY(1px);
}

svg:hover .user-glow {
  opacity: 1;
}

/* Animation de pulsation pour le variant filled */
.variant-filled {
  animation: user-pulse 2s infinite;
}

@keyframes user-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Optimisations de performance */
.user-head,
.user-body {
  will-change: transform;
}

.user-glow {
  will-change: opacity;
}

/* Styles responsifs */
@media (max-width: 768px) {
  svg {
    touch-action: manipulation;
  }
}

/* Respect des préférences d'accessibilité */
@media (prefers-reduced-motion: reduce) {
  .user-head,
  .user-body,
  .user-glow {
    transition: none !important;
    animation: none !important;
  }
  
  svg:hover .user-head,
  svg:hover .user-body {
    transform: none;
  }
}

/* Mode sombre optimisé */
@media (prefers-color-scheme: dark) {
  svg {
    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.1));
  }
}
</style>