import type { UseFormRegisterReturn } from "react-hook-form";

interface Props {
  label: string;
  registration: UseFormRegisterReturn;
}

export default function CheckboxField({ label, registration }: Props) {
  return (
    <div className="field">
      <label className="checkbox-row">
        <input type="checkbox" {...registration} /> {label}
      </label>
    </div>
  );
}
