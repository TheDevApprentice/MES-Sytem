<template>
  <FormField v-bind="fieldProps">
    <div
      class="mt-1 flex justify-center rounded-lg border-2 border-dashed px-6 pt-5 pb-6 transition-colors duration-200"
      :class="{
        'border-gray-300 dark:border-gray-600': !error && !isDragging,
        'border-blue-500 dark:border-blue-400': isDragging,
        'border-red-500 dark:border-red-400': error,
        'bg-gray-50 dark:bg-gray-800/50': !error,
        'bg-red-50/50 dark:bg-red-900/20': error,
      }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div class="space-y-1 text-center w-full">
        <div
          class="flex flex-col sm:flex-row items-center justify-center text-sm text-gray-600 dark:text-gray-300"
        >
          <label
            :for="name"
            :label="label"
            :name="name"
            class="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 transition-colors"
          >
            <span>Téléverser un fichier</span>
            <input
              :id="name"
              :name="name"
              type="file"
              class="sr-only"
              :accept="accept"
              :multiple="multiple"
              @change="handleFileChange"
            />
          </label>
          <p class="pl-1 mt-2 sm:mt-0">ou glisser-déposer</p>
        </div>

        <!-- Barre de progression -->
        <div
          v-if="uploadProgress > 0 && uploadProgress < 100"
          class="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"
        >
          <div
            class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>

        <!-- Aperçu des fichiers -->
        <div v-if="files.length > 0" class="mt-4 space-y-2">
          <div
            v-for="(file, index) in files"
            :key="index"
            class="flex items-start justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
          >
            <div class="flex items-center space-x-3 min-w-0">
              <!-- Icône/prévisualisation -->
              <div
                @click="openPreview(file)"
                class="flex-shrink-0 cursor-pointer"
              >
                <img
                  v-if="isImage(file)"
                  :src="getPreview(file)"
                  class="h-10 w-10 object-cover rounded hover:opacity-80 transition-opacity"
                  alt="Preview"
                />
                <div
                  v-else
                  class="flex items-center justify-center h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-500 dark:text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>

              <div class="min-w-0">
                <p class="text-sm font-medium truncate">{{ file.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formatFileSize(file.size) }}
                </p>
              </div>
            </div>

            <div class="flex space-x-2">
              <!-- Bouton Visualiser -->
              <button
                type="button"
                @click="openPreview(file)"
                :disabled="uploadProgress > 0 && uploadProgress < 100"
                class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                :title="
                  uploadProgress > 0 && uploadProgress < 100
                    ? 'Veuillez attendre la fin de l\'upload'
                    : 'Visualiser'
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>

              <!-- Bouton Supprimer -->
              <button
                type="button"
                @click="removeFile(index)"
                class="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                title="Supprimer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Modal de prévisualisation -->
        <div
          v-if="previewFile"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          @click.self="previewFile = null"
        >
          <div
            class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-screen overflow-auto"
          >
            <div
              class="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700"
            >
              <h3 class="text-lg font-medium">{{ previewFile.name }}</h3>
              <button
                @click="previewFile = null"
                class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="p-4 flex justify-center">
              <img
                v-if="isImage(previewFile)"
                :src="getPreview(previewFile)"
                class="max-w-full max-h-[70vh] object-contain"
                alt="Preview"
              />

              <div v-else class="py-12 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-16 w-16 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p class="mt-4 text-gray-500 dark:text-gray-400">
                  Aperçu non disponible pour ce type de fichier
                </p>
                <a
                  :href="getPreview(previewFile)"
                  download
                  class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Télécharger le fichier
                </a>
              </div>
            </div>
          </div>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {{ accept ? `Formats supportés: ${accept}` : "Tous les fichiers" }}
          {{ maxSize ? ` (max ${formatFileSize(maxSize)})` : "" }}
        </p>
      </div>
    </div>
  </FormField>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import FormField from "../FormField/FormField.vue";
import type { FileUploadProps } from "./types";

interface FileMeta {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  previewUrl: string | null;
}

const props = defineProps<FileUploadProps>();

const emit = defineEmits<{
  (e: "update:files", files: FileMeta[]): void;
}>();

const files = ref<File[]>([]);
const isDragging = ref(false);
const uploadProgress = ref(0);
const previewFile = ref<File | null>(null);

const fieldProps = computed(() => ({
  name: props.name,
  label: props.label,
  multiple: props.multiple,
  required: props.required,
  disabled: props.disabled,
  error: props.error,
  helpText: props.helpText,
}));

const isImage = (file: File) => {
  return file.type.startsWith("image/");
};

const getPreview = (file: File) => {
  return URL.createObjectURL(file);
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files) {
    processFiles(Array.from(input.files));
  }
  input.value = "";
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  if (e.dataTransfer?.files) {
    processFiles(Array.from(e.dataTransfer.files));
  }
};

const processFiles = (newFiles: File[]) => {
  const validationRules = props.validationRules || {
    required: false,
    accept: "*",
    maxSize: 5000000, // 5MB
  };

  const filteredFiles =
    validationRules.accept === "*"
      ? newFiles
      : newFiles.filter((file) => {
          const extensions = validationRules.accept
            ?.split(",")
            .map((ext) => ext.trim().replace(".", ""));
          const fileExt = file.name.split(".").pop()?.toLowerCase();
          return fileExt && extensions?.includes(fileExt);
        });

  const validFiles = validationRules.maxSize
    ? filteredFiles.filter((file) => file.size <= validationRules.maxSize!)
    : filteredFiles;

  const filesWithMeta = validFiles.map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    previewUrl: isImage(file) ? getPreview(file) : null,
  }));

  if (props.multiple) {
    files.value = [...files.value, ...validFiles];
    emit("update:files", filesWithMeta);
  } else {
    files.value = validFiles.slice(0, 1);
    emit("update:files", filesWithMeta[0] || null);
  }

  // Simulation de l'upload
  if (validFiles.length > 0) {
    simulateUpload();
  }
};

const simulateUpload = () => {
  uploadProgress.value = 0;
  const interval = setInterval(() => {
    uploadProgress.value += Math.floor(Math.random() * 10) + 5;
    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100;
      clearInterval(interval);
      setTimeout(() => (uploadProgress.value = 0), 2000);
    }
  }, 300);
};

const removeFile = (index: number) => {
  files.value.splice(index, 1);
  emit("update:files", []);
};

const openPreview = (file: File) => {
  if (uploadProgress.value > 0 && uploadProgress.value < 100) {
    return; // Empêche l'ouverture si upload en cours
  }
  previewFile.value = file;
};

onUnmounted(() => {
  if (previewFile.value) {
    URL.revokeObjectURL(getPreview(previewFile.value));
  }
  files.value.forEach((file) => {
    if (isImage(file)) {
      URL.revokeObjectURL(getPreview(file));
    }
  });
});
</script>

<style scoped>
/* Améliorations responsive */
@media (max-width: 640px) {
  .file-upload-container {
    padding: 1rem;
  }

  .file-info {
    max-width: 200px;
  }
}
</style>
