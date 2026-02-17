import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface Props {
  label: string;
  hint?: string;
  type?: "text" | "email" | "tel" | "url";
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  required?: boolean;
  pattern?: string;
  disabled?: boolean;
}

export default function TextField({
  label,
  hint,
  type = "text",
  placeholder,
  registration,
  error,
  required,
  disabled,
}: Props) {
  return (
    <div className="field">
      <label>
        {label}
        {required && <span className="required"> *</span>}
        {hint && <span className="hint">{hint}</span>}
      </label>
      <input type={type} placeholder={placeholder} disabled={disabled} {...registration} />
      {error && <span className="field-error">{error.message}</span>}
    </div>
  );
}
