// Interface de base pour tous les champs de formulaire
export interface ValidationRule {
  required?: boolean | string;
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (value: any) => boolean | string | Promise<boolean | string>;
  asyncValidate?: (value: any) => Promise<boolean | string>;
  // Ajoutez d'autres règles au besoin
}

export interface BaseFormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  validationRules?: ValidationRule;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface FormFieldError {
  type: string;
  message: string;
}

export interface FormFieldState {
  isDirty: boolean;
  isTouched: boolean;
  isValid: boolean;
  isValidating: boolean;
}

// Types spécifiques réexportés depuis les composants
export type { FormFieldProps } from "../FormField/types";
export type { DatePickerProps } from "../DatePicker/types";
export type { FileUploadProps } from "../FileUpload/types";
export type { RichTextEditorProps } from "../RichTextEditor/types";
