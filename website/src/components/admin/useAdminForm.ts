import { useForm, type UseFormReturn, type FieldValues, type DefaultValues } from "react-hook-form";
import { useState, useCallback } from "react";

interface UseAdminFormOptions<T extends FieldValues> {
  defaultValues?: DefaultValues<T>;
  /** Fields that are checkboxes — true → "1", false → omitted */
  checkboxFields?: string[];
}

interface UseAdminFormReturn<T extends FieldValues> {
  form: UseFormReturn<T>;
  submitting: boolean;
  serverError: string;
  successMsg: string;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: (confirmMsg: string) => void;
}

export function useAdminForm<T extends FieldValues>(
  opts: UseAdminFormOptions<T> = {}
): UseAdminFormReturn<T> {
  const form = useForm<T>({ defaultValues: opts.defaultValues });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const checkboxFields = opts.checkboxFields ?? [];

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      form.handleSubmit(async (values) => {
        setSubmitting(true);
        setServerError("");
        setSuccessMsg("");
        try {
          const fd = new FormData();
          for (const [key, val] of Object.entries(values)) {
            if (checkboxFields.includes(key)) {
              if (val) fd.append(key, "1");
            } else if (val != null && val !== "") {
              fd.append(key, String(val));
            }
          }
          const res = await fetch(window.location.href, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: fd,
          });
          if (res.redirected) {
            window.location.href = res.url;
            return;
          }
          if (res.ok) {
            const data = await res.json();
            if (data.error) {
              setServerError(data.error);
            } else {
              setSuccessMsg(data.message || "Saved.");
            }
          } else {
            const data = await res.json().catch(() => null);
            setServerError(data?.error || `Server error (${res.status})`);
          }
        } catch {
          setServerError("Network error. Please try again.");
        } finally {
          setSubmitting(false);
        }
      })(e);
    },
    [form, checkboxFields]
  );

  const onDelete = useCallback(
    (confirmMsg: string) => {
      if (!window.confirm(confirmMsg)) return;
      setSubmitting(true);
      setServerError("");
      const fd = new FormData();
      fd.append("_action", "delete");
      fetch(window.location.href, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      })
        .then((res) => {
          if (res.redirected) {
            window.location.href = res.url;
            return;
          }
          return res.json().then((data) => {
            setServerError(data?.error || "Delete failed.");
          });
        })
        .catch(() => setServerError("Network error."))
        .finally(() => setSubmitting(false));
    },
    []
  );

  return { form, submitting, serverError, successMsg, onSubmit, onDelete };
}
