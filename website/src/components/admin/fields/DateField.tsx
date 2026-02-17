import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface Props {
  label: string;
  hint?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  required?: boolean;
}

export default function DateField({
  label,
  hint,
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
      <input type="date" {...registration} />
      {error && <span className="field-error">{error.message}</span>}
    </div>
  );
}
