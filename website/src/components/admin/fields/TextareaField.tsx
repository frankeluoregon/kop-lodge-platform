import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface Props {
  label: string;
  hint?: string;
  rows?: number;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  required?: boolean;
}

export default function TextareaField({
  label,
  hint,
  rows = 8,
  placeholder,
  registration,
  error,
  required,
}: Props) {
  return (
    <div className="field">
      <label>
        {label}
        {required && <span className="required"> *</span>}
        {hint && <span className="hint">{hint}</span>}
      </label>
      <textarea rows={rows} placeholder={placeholder} {...registration} />
      {error && <span className="field-error">{error.message}</span>}
    </div>
  );
}
