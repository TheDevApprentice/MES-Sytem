<template>
  <div ref="container" class="univer-container"></div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, nextTick, watch } from 'vue'
import { UniverSheetsAdvancedPreset } from '@univerjs/preset-sheets-advanced'
import sheetsAdvancedEnUS from '@univerjs/preset-sheets-advanced/locales/en-US'
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core'
import sheetsCoreEnUS from '@univerjs/preset-sheets-core/locales/en-US'
import { createUniver, FUniver, LocaleType, merge, Univer } from '@univerjs/presets'
import { UniverSheetsCustomMenuPlugin } from './logic/menu/plugin'
import '@univerjs/preset-sheets-core/lib/index.css'
import { UniverSheetsDrawingPreset } from '@univerjs/preset-sheets-drawing'
import sheetsDrawingEnUS from '@univerjs/preset-sheets-drawing/locales/en-US'
import { insertChart } from './logic/charts/function'

import '@univerjs/preset-sheets-core/lib/index.css'
import '@univerjs/preset-sheets-drawing/lib/index.css'
import '@univerjs/preset-sheets-advanced/lib/index.css'

// Props
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }, 
  loadCharts: {
    type: Boolean,
    default: false
  }
})

const container = ref<HTMLElement | null>(null)

let univerInstance: Univer | null = null
let univerAPIInstance: FUniver | null = null

onMounted(async () => {
  await nextTick()
  if (!container.value) {
    console.error('Container not found')
    return
  }

  initUniver()
})

// Watcher : ne recharge que si l'objet de données CHANGE (pas les mutations internes)
watch(
  () => props.data,
  (newData, oldData) => {
    if (newData === oldData) return // mêmes données, pas de reload
    console.log('Workbook de remplacement détecté, rechargement...')
    if (univerAPIInstance && Object.keys(newData).length > 0) {
      loadDataIntoUniver(newData)
    }
  }
)

const initUniver = () => {
  if (!container.value) return

  try {
    const { univer, univerAPI } = createUniver({
      locale: LocaleType.EN_US,
      locales: {
        [LocaleType.EN_US]: merge({}, sheetsCoreEnUS, sheetsDrawingEnUS, sheetsAdvancedEnUS)
      },
      presets: [
        UniverSheetsCorePreset({
          container: container.value as HTMLElement
        }),
        UniverSheetsDrawingPreset({
          container: container.value as HTMLElement
        }),
        UniverSheetsAdvancedPreset({
          container: container.value as HTMLElement
        })
      ],
      plugins: [
        UniverSheetsCustomMenuPlugin,
      ]
    })

    univerInstance = univer
    univerAPIInstance = univerAPI

    // Charger les données initiales
    loadDataIntoUniver(props.data)
    univerAPIInstance.addEvent(univerAPIInstance.Event.LifeCycleChanged, ({ stage }) => {
      if (stage === univerAPIInstance.Enum.LifecycleStages.Steady && props.loadCharts) {
        loadCharts()
      }
    })
    console.log('Univer initialized successfully')
  } catch (error) {
    console.error('Error initializing Univer:', error)
  }
}

const loadCharts = () => {
  if (!univerAPIInstance) return
  insertChart(univerAPIInstance)
}

const loadDataIntoUniver = (data: any) => {
  if (!univerAPIInstance) return

  try {
    // Si des données existent, disposer le workbook actuel
    const currentWorkbook = univerAPIInstance.getActiveWorkbook()
    if (currentWorkbook) {
      // Fermer le workbook actuel
      univerAPIInstance.disposeUnit(currentWorkbook.getId())
    }

    // Créer un nouveau workbook avec les nouvelles données
    if (Object.keys(data).length > 0) {
      univerAPIInstance.createWorkbook(data)
      console.log('Nouvelles données chargées dans Univer')
    } else {
      // Créer un workbook vide
      univerAPIInstance.createWorkbook({})
      console.log('Workbook vide créé')
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)

    // En cas d'erreur, essayer de créer un workbook vide
    try {
      univerAPIInstance?.createWorkbook({})
    } catch (fallbackError) {
      console.error('Erreur fallback:', fallbackError)
    }
  }
}

onBeforeUnmount(() => {
  try {
    univerInstance?.dispose()
    univerAPIInstance?.dispose()
    univerInstance = null
    univerAPIInstance = null
  } catch (error) {
    console.error('Error disposing Univer:', error)
  }
})

// Méthodes exposées
const getData = () => {
  if (!univerAPIInstance) {
    throw new Error('Univer is not initialized')
  }
  return univerAPIInstance.getActiveWorkbook()?.save()
}

const getUniversAPI = () => {
  return univerAPIInstance
}

const getUniverInstance = () => {
  return univerInstance
}

// Nouvelle méthode pour recharger manuellement les données
const reloadData = (newData: any) => {
  loadDataIntoUniver(newData)
}

// Exposer les méthodes
defineExpose({
  getData,
  getUniversAPI,
  getUniverInstance,
  reloadData
})
</script>

<style scoped>
.univer-container {
  width: 100%;
  height: 600px;
  min-height: 600px;
  max-height: 600px;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  overflow: hidden;
  background: white;
  position: relative;

  /* ANTI-FLICKER : Isoler complètement le composant */
  contain: layout style paint size;
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: auto;

  /* Empêcher toute transition/animation */
  transition: none !important;
  animation: none !important;
}

/* Styles globaux pour stabiliser Univer */
:global(.univer-container .univer) {
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
  transition: none !important;
  animation: none !important;
}

:global(.univer-container .univer-render-canvas) {
  width: 100% !important;
  height: 100% !important;
  transition: none !important;
  animation: none !important;
  transform: translateZ(0);
}

:global(.univer-container canvas) {
  transition: none !important;
  animation: none !important;
  transform: translateZ(0);
}

/* Cacher la barre de menu */
:global(.univer-menubar) {
  display: none !important;
}

/* Empêcher les transitions sur tous les éléments enfants */
:global(.univer-container *) {
  box-sizing: border-box;
  transition: none !important;
  animation: none !important;
}

/* Stabiliser spécifiquement les éléments problématiques */
:global(.univer-container .univer-sheet) {
  position: relative !important;
  transform: none !important;
}

/* CSS pour Electron - optimisations supplémentaires */
:global(.univer-container) {
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
}
</style>
