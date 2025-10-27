<template>
  <FormField v-bind="fieldProps">
    <div
      ref="editor"
      :id="name"
      :label="label"
      :name="name"
      class="min-h-[200px] rounded-lg border border-gray-300 dark:border-gray-600 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors text-sm"
      :class="{
        'border-red-500 dark:border-red-400': error,
        'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed':
          disabled,
      }"
      contenteditable
      @input="handleInput"
      :data-placeholder="placeholder"
    ></div>
  </FormField>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import FormField from "../FormField/FormField.vue";
import type { RichTextEditorProps } from "./types";

const props = defineProps<
  RichTextEditorProps & {
    modelValue?: string;
    placeholder?: string;
  }
>();

const emit = defineEmits<{
  (e: "update:content", content: string): void;
  (e: "update:modelValue", value: string): void;
}>();

const editor = ref<HTMLElement | null>(null);
const content = ref(props.modelValue || "");

watch(content, (newVal) => {
  emit("update:modelValue", newVal);
});

const fieldProps = computed(() => ({
  name: props.name,
  label: props.label,
  required: props.required,
  disabled: props.disabled,
  error: props.error,
  helpText: props.helpText,
}));

const handleInput = () => {
  if (editor.value) {
    content.value = editor.value.innerHTML;
    emit("update:content", editor.value.innerHTML);
  }
};

const validate = () => {
  // La validation réelle est gérée par FormField
  return content.value.trim().length > 0;
};

defineExpose({ validate });
</script>

<style>
[contenteditable][data-placeholder]:empty::before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}

.dark [contenteditable][data-placeholder]:empty::before {
  color: #6b7280;
}
</style>
