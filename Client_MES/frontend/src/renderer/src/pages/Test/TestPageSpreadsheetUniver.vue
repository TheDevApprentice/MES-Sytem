<template>
  <div class="home-container">
    <div class="home-header">
      <h2>📊 Test Spreadsheet avec Import/Export Excel</h2>
    </div>
    
    <!-- Boutons de contrôle -->
    <div class="controls">
      <button @click="exportData" class="home-btn">📋 Exporter JSON</button>
      <button @click="exportToExcel" class="home-btn excel-btn">📥 Exporter Excel</button>
      <button @click="triggerFileInput" class="home-btn import-btn">📤 Importer Excel</button>
      <button @click="resetData" class="home-btn reset-btn">🔄 Reset</button>
    </div>

    <!-- Input file caché -->
    <input 
      ref="fileInput" 
      type="file" 
      accept=".xlsx,.xls" 
      @change="handleFileImport" 
      style="display: none;"
    />
    
    <div class="home-content">
      <div class="spreadsheet-wrapper">
        <Spreadsheet ref="spreadsheetRef" :data="workbookData" />
      </div>
    </div>

    <!-- Zone de drop pour les fichiers -->
    <div 
      v-if="isDragging" 
      class="drop-zone"
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      @dragleave="isDragging = false"
    >
      <div class="drop-content">
        <div class="drop-icon">📁</div>
        <p>Déposez votre fichier Excel ici</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as XLSX from 'xlsx'
import Spreadsheet from '../../components/univers/Spreadsheet.vue';
import { readWorkbookFromFile } from '../../components/univers/logic/excelIO'
import { convertExcelToUniver } from '../../components/univers/logic/conversion/excelToUniver'
import { convertUniverToExcel } from '../../components/univers/logic/conversion/univerToExcel'
import type { IWorkbookData } from '../../components/univers/logic/model/UniverWorkbookModel'
import { sampleData } from '../../components/univers/logic/sampleDataTestCharts'

// Références
const spreadsheetRef = ref<InstanceType<typeof Spreadsheet> | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

// Données d'exemple initiales
let workbookData = ref<IWorkbookData>({ ...sampleData })

// ===========================
// FONCTIONS D'EXPORT
// ===========================

// Export JSON (existant)
const exportData = () => {
  try {
    const data = spreadsheetRef.value?.getData()
    console.log('Données exportées:', data)
    alert('Données exportées dans la console')
  } catch (error) {
    console.error('Erreur lors de l\'export:', error)
    alert('Erreur lors de l\'export')
  }
}

// Export Excel
const exportToExcel = () => {
  try {
    const data = spreadsheetRef.value?.getData()
    if (!data) {
      alert('Aucune donnée à exporter')
      return
    }

    const excelWorkbook = convertUniverToExcel(data)
    const fileName = `${data.name || 'export'}.xlsx`
    XLSX.writeFile(excelWorkbook, fileName)
    
    showNotification('Fichier Excel téléchargé !', 'success')
  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error)
    showNotification('Erreur lors de l\'export Excel', 'error')
  }
}

// ===========================
// FONCTIONS D'IMPORT AMÉLIORÉES
// ===========================

// Déclencher l'input file
const triggerFileInput = () => {
  fileInput.value?.click()
}

// Gérer la sélection de fichier
const handleFileImport = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    importExcelFile(file)
  }
}

// Gérer le drag & drop
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      importExcelFile(file)
    } else {
      showNotification('Veuillez sélectionner un fichier Excel (.xlsx ou .xls)', 'error')
    }
  }
}

// Import du fichier Excel via modules logiques
const importExcelFile = async (file: File) => {
  try {
    const workbook = await readWorkbookFromFile(file)
    console.log('Excel workbook lu:', workbook)
    const univerData = convertExcelToUniver(workbook, file.name)
    workbookData.value = { ...univerData }
    showNotification(`Fichier "${file.name}" importé avec succès !`, 'success')
  } catch (error) {
    console.error('Erreur import Excel:', error)
    showNotification('Erreur lors de l\'import du fichier Excel', 'error')
  }
}

const resetData = () => {
  workbookData.value = {...sampleData}
  showNotification('Données remises à zéro', 'info')
}

const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  // Simple alert pour le moment, vous pouvez implémenter un système de notifications plus sophistiqué
  alert(message)
}

// ===========================
// LIFECYCLE & EVENTS
// ===========================

onMounted(() => {
  // Écouteurs pour le drag & drop global
  document.addEventListener('dragover', handleGlobalDragOver)
  document.addEventListener('drop', handleGlobalDrop)
})

onBeforeUnmount(() => {
  document.removeEventListener('dragover', handleGlobalDragOver)
  document.removeEventListener('drop', handleGlobalDrop)
})

const handleGlobalDragOver = (e: DragEvent) => {
  e.preventDefault()
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      isDragging.value = true
    }
  }
}

const handleGlobalDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}
</script>

<style scoped>
.home-container {
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

.home-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.home-header h2 {
  font-size: 1.5em;
  font-weight: 600;
  color: var(--home-text-color, #333);
  letter-spacing: 0.5px;
  margin: 0;
}

.controls {
  display: flex;
  gap: 12px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.home-content {
}

.spreadsheet-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  height: 100%;
  contain: layout;
  position: relative;
}

.home-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 7px;
  padding: 12px 22px;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.home-btn:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.home-btn:active {
  transform: translateY(0);
}

/* Styles spécifiques pour chaque bouton */
.excel-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.excel-btn:hover {
  background: linear-gradient(135deg, #218838 0%, #1abc9c 100%);
}

.import-btn {
  background: linear-gradient(135deg, #fd7e14 0%, #e83e8c 100%);
}

.import-btn:hover {
  background: linear-gradient(135deg, #e8630a 0%, #dc3545 100%);
}

.reset-btn {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
}

.reset-btn:hover {
  background: linear-gradient(135deg, #5a6268 0%, #3d4142 100%);
}

/* Zone de drop */
.drop-zone {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(102, 126, 234, 0.1);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border: 3px dashed #667eea;
}

.drop-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.drop-icon {
  font-size: 4em;
  margin-bottom: 20px;
}

.drop-content p {
  font-size: 1.2em;
  color: #667eea;
  font-weight: 500;
  margin: 0;
}

@media (max-width: 900px) {
  .home-container {
    margin: 20px auto 0 auto;
    padding: 0 10px;
  }
  
  .controls {
    justify-content: center;
  }
  
  .spreadsheet-wrapper {
    height: 500px;
    min-height: 500px;
    max-height: 500px;
  }
  
  .home-btn {
    font-size: 0.9em;
    padding: 10px 16px;
  }
}
</style>