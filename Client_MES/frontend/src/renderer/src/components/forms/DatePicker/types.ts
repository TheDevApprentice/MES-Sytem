import type { BaseFormFieldProps } from "../types/types";

export interface DatePickerProps extends BaseFormFieldProps {
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
}

export default DatePickerProps;
