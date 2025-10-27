<template>
  <FormField v-bind="fieldProps">
    <div class="relative">
      <input
        type="date"
        :id="name"
        :label="label"
        :name="name"
        v-model="internalValue"
        :required="required"
        :disabled="disabled"
        :min="minDate?.toISOString().split('T')[0]"
        :max="maxDate?.toISOString().split('T')[0]"
        :placeholder="placeholder"
        class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all text-sm px-4 py-3 pr-10 border appearance-none"
        :class="{
          'border-red-500 dark:border-red-400': error,
          'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed':
            disabled,
        }"
      />

      <!-- Icône calendrier -->
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
      >
        <svg
          class="h-5 w-5 text-gray-400 dark:text-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
  </FormField>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import FormField from "@components/common/ui/forms/FormField/FormField.vue";
import type { DatePickerProps } from "./types";

const props = defineProps<
  DatePickerProps & {
    modelValue?: string;
    validationRules: {
      required?: boolean | string;
      minDate?: Date | string;
      maxDate?: Date | string;
      validate?: (date: string) => boolean | string;
    };
  }
>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const internalValue = ref(props.modelValue || "");

watch(internalValue, (newVal) => {
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

const validate = (date: string) => {
  if (!props.validationRules) return true;

  if (!date && props.validationRules.required) {
    return typeof props.validationRules.required === "string"
      ? props.validationRules.required
      : "Ce champ est obligatoire";
  }

  const dateObj = date ? new Date(date) : null;

  if (dateObj) {
    // Validation minDate
    if (props.validationRules.minDate) {
      const minDate =
        typeof props.validationRules.minDate === "string"
          ? new Date(props.validationRules.minDate)
          : props.validationRules.minDate;

      if (dateObj < minDate) {
        return `La date doit être après ${minDate.toLocaleDateString()}`;
      }
    }

    // Validation maxDate
    if (props.validationRules.maxDate) {
      const maxDate =
        typeof props.validationRules.maxDate === "string"
          ? new Date(props.validationRules.maxDate)
          : props.validationRules.maxDate;

      if (dateObj > maxDate) {
        return `La date doit être avant ${maxDate.toLocaleDateString()}`;
      }
    }
  }

  // Validation custom
  if (props.validationRules.validate) {
    const result = props.validationRules.validate(date);
    if (typeof result === "string") return result;
    if (result === false) return "Validation échouée";
  }

  return true;
};

defineExpose({ validate });
</script>

<style>
/* Style personnalisé pour le sélecteur de date */
input[type="date"]::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}

/* Styles spécifiques iOS */
@supports (-webkit-touch-callout: none) {
  input[type="date"] {
    min-height: 3rem; /* Meilleure ergonomie sur iOS */
  }
}

/* Améliorations pour le popup de sélection */
input[type="date"]::-webkit-datetime-edit {
  padding: 0;
}

input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-clear-button {
  display: none;
  -webkit-appearance: none;
}
</style>
