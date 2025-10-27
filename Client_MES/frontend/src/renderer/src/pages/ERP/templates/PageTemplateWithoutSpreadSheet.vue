<template>
  <Suspense>
    <template #default>
      <div>
        <div class="page-container">
          <!-- Header -->
          <div class="page-header appear appear-delay-1">
            <div class="flex flex-row items-center justify-between w-full">
              <div class="page-title">{{ title }}</div>
            </div>
            <!-- Stats slot -->
            <div class="flex flex-row gap-4 mt-4 appear appear-delay-2">
              <slot name="stats" />
            </div>
          </div>
          <!-- Main Content -->
          <div class="page-content">
            <!-- Table slot -->
            <div class="page-card main-card appear appear-delay-3">
              <slot name="table" />
            </div>
            <!-- Charts slot -->
            <div class="page-side">
              <div class="page-card info-card appear appear-delay-5">
                <div class="flex flex-col overflow-x-auto">
                  <slot name="charts" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import LoadingSpinner from '@renderer/components/general/LoadingOverlay.vue'

defineProps<{
  title: string
}>()
</script>

<style scoped>
.page-container {
  max-height: calc(100vh - 100px);
  width: calc(100vw - 100px);
  overflow-y: auto;
  /* hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin: 90px auto 0 70px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  transition: margin-left 0.26s cubic-bezier(0.7, 1.4, 0.6, 1);
  position: relative;
  z-index: 1;
}
.page-container::-webkit-scrollbar {
  display: none;
}

.page-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: self-start;
}

.page-title {
  font-size: 1.5em;
  font-weight: 600;
  color: var(--page-text-color);
  letter-spacing: 0.5px;
}

.page-content {
  display: flex;
  gap: 32px;
}
.page-card {
  background: var(--page-bg-card);
  border-radius: 14px;
  box-shadow: var(--page-card-shadow);
  height: min-content;
  padding: 10px 28px 24px 28px;
  color: var(--page-text-color);
  transition:
    box-shadow 0.22s,
    transform 0.18s;
}
.page-card:hover {
  box-shadow: var(--page-card-shadow-hover);
  transform: translateY(-3px) scale(1.032);
}
.main-card {
  flex: 2;
}

.page-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-btn {
  background: var(--page-btn-gradient);
  color: var(--btn-color-text);
  border: none;
  border-radius: 7px;
  padding: 12px 22px;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  box-shadow: var(--page-btn-shadow);
  transition:
    background 0.18s,
    box-shadow 0.18s,
    transform 0.13s;
  margin-bottom: 8px;
}
.page-btn:hover {
  background: var(--page-btn-gradient-hover);
  box-shadow: var(--page-link-hover-shadow);
  transform: scale(1.04);
}
.quick-card h3 {
  color: var(--page-secondary-color);
  font-size: 1.08em;
  margin-bottom: 8px;
}
.quick-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.98em;
}
.quick-card li {
  margin-bottom: 5px;
}
.quick-card a {
  color: var(--page-accent-color);
  text-decoration: underline;
  transition: color 0.16s;
}
.quick-card a:hover {
  color: #e94090;
}
@media (max-width: 900px) {
  .page-content {
    flex-direction: column;
    gap: 18px;
  }
  .page-side {
    flex-direction: row;
    gap: 18px;
  }
  .main-card,
  .page-side {
    width: 100%;
  }
}
/* Appearance animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.appear {
  animation: fadeInUp 0.6s ease-out both;
}
.appear-delay-1 {
  animation-delay: 0.1s;
}
.appear-delay-2 {
  animation-delay: 0.2s;
}
.appear-delay-3 {
  animation-delay: 0.3s;
}
.appear-delay-4 {
  animation-delay: 0.4s;
}
.appear-delay-5 {
  animation-delay: 0.5s;
}
/* Action icons */
.action-icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--page-accent-color);
  padding: 6px;
  border-radius: 6px;
  transition: background 0.2s;
}
.action-icon-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}
</style>
