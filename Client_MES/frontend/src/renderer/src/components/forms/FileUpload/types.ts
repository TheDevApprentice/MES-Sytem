import type { BaseFormFieldProps } from "../types/types";

export interface FileUploadProps extends BaseFormFieldProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // en bytes
}

export default FileUploadProps;
