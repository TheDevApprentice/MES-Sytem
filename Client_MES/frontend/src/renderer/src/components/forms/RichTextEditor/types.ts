import type { BaseFormFieldProps } from "../types/types";

export interface RichTextEditorProps extends BaseFormFieldProps {
  toolbar?: Array<"bold" | "italic" | "underline" | "link">;
  placeholder?: string;
}

export default RichTextEditorProps;
