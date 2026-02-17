import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface Props {
  label: string;
  hint?: string;
  min?: number;
  max?: number;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  required?: boolean;
}

export default function NumberField({
  label,
  hint,
  min,
  max,
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
      <input type="number" min={min} max={max} placeholder={placeholder} {...registration} />
      {error && <span className="field-error">{error.message}</span>}
    </div>
  );
}
