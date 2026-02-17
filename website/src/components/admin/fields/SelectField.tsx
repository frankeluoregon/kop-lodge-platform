import type { UseFormRegisterReturn, FieldError } from "react-hook-form";

interface Props {
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
  registration: UseFormRegisterReturn;
  error?: FieldError;
  required?: boolean;
}

export default function SelectField({
  label,
  hint,
  options,
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
      <select {...registration}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="field-error">{error.message}</span>}
    </div>
  );
}
