<template>
  <div class="mb-4">
    <label
      v-if="label"
      :for="name"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <slot
      :error="errorMessage"
      :state="fieldState"
      :onBlur="handleBlur"
      :onChange="handleChange"
    />

    <transition name="fade">
      <p
        v-if="errorMessage"
        class="mt-1 text-sm text-red-600 dark:text-red-400 transition-all duration-200"
      >
        {{ errorMessage }}
      </p>
    </transition>

    <p
      v-if="helpText && !errorMessage"
      class="mt-1 text-sm text-gray-500 dark:text-gray-400"
    >
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type {
  BaseFormFieldProps,
  ValidationRule,
  FormFieldError,
  FormFieldState,
} from "../types/types";

const props = withDefaults(defineProps<BaseFormFieldProps>(), {
  validateOnChange: true,
  validateOnBlur: true,
});

const localError = ref<string | null>(null);
const isDirty = ref(false);
const isTouched = ref(false);
const isValidating = ref(false);

const validateField = async (value: any) => {
  if (!props.validationRules) return true;

  isValidating.value = true;
  const rules = props.validationRules;
  const errors: FormFieldError[] = [];

  // Validation synchrone
  const syncValidations = [
    validateRequired(value, rules),
    validateMinLength(value, rules),
    validateMaxLength(value, rules),
    validatePattern(value, rules),
    validateCustom(value, rules),
  ].filter(Boolean) as FormFieldError[];

  errors.push(...syncValidations);

  // Validation asynchrone
  if (rules.asyncValidate) {
    try {
      const result = await rules.asyncValidate(value);
      if (typeof result === "string") {
        errors.push({ type: "async", message: result });
      } else if (result === false) {
        errors.push({
          type: "async",
          message: "Validation asynchrone échouée",
        });
      }
    } catch (err) {
      errors.push({ type: "async", message: "Erreur lors de la validation" });
    }
  }

  isValidating.value = false;
  localError.value = errors[0]?.message || null;
  return errors.length === 0;
};

// Fonctions de validation helpers
const validateRequired = (value: any, rules: ValidationRule) => {
  if (rules.required) {
    const message =
      typeof rules.required === "string"
        ? rules.required
        : "Ce champ est obligatoire";
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return { type: "required", message };
    }
  }
  return null;
};

const validateMinLength = (value: any, rules: ValidationRule) => {
  if (rules.minLength && value?.length) {
    const min =
      typeof rules.minLength === "number"
        ? rules.minLength
        : rules.minLength.value;
    const message =
      typeof rules.minLength === "number"
        ? `Doit contenir au moins ${min} caractères`
        : rules.minLength.message;

    if (value.length < min) {
      return { type: "minLength", message };
    }
  }
  return null;
};

const validateMaxLength = (value: any, rules: ValidationRule) => {
  if (rules.maxLength && value?.length) {
    const max =
      typeof rules.maxLength === "number"
        ? rules.maxLength
        : rules.maxLength.value;
    const message =
      typeof rules.maxLength === "number"
        ? `Doit contenir au maximum ${max} caractères`
        : rules.maxLength.message;

    if (value.length > max) {
      return { type: "maxLength", message };
    }
  }
  return null;
};

const validatePattern = (value: any, rules: ValidationRule) => {
  if (rules.pattern && value) {
    const pattern =
      typeof rules.pattern === "object" && "value" in rules.pattern
        ? rules.pattern.value
        : (rules.pattern as RegExp);
    const message =
      typeof rules.pattern === "object" && "message" in rules.pattern
        ? rules.pattern.message
        : "Le format est invalide";

    if (!pattern.test(value)) {
      return { type: "pattern", message };
    }
  }
  return null;
};

const validateCustom = (value: any, rules: ValidationRule) => {
  if (rules.validate) {
    const result = rules.validate(value);
    if (typeof result === "string") {
      return { type: "validate", message: result };
    } else if (result === false) {
      return { type: "validate", message: "Validation échouée" };
    }
  }
  return null;
};

const fieldState = computed<FormFieldState>(() => ({
  isDirty: isDirty.value,
  isTouched: isTouched.value,
  isValid: !localError.value,
  isValidating: isValidating.value,
}));

const errorMessage = computed(() =>
  isDirty.value || isTouched.value ? props.error || localError.value : null
);

const handleBlur = () => {
  isTouched.value = true;
  if (props.validateOnBlur) {
    validateField(slotProps.value?.value);
  }
};

const handleChange = (value: any) => {
  isDirty.value = true;
  if (props.validateOnChange) {
    validateField(value);
  }
};

defineExpose({
  validate: () => validateField,
  state: fieldState,
});
</script>

<style scoped></style>
