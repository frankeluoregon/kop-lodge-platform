import { useRef, useState, useCallback } from "react";
import { useAdminForm } from "../useAdminForm";
import FormMessage from "../FormMessage";
import FormActions from "../FormActions";
import TextField from "../fields/TextField";
import NumberField from "../fields/NumberField";
import CheckboxField from "../fields/CheckboxField";
import FileField, { type FileFieldHandle } from "../fields/FileField";

interface Props {
  cancelUrl: string;
  initialData?: {
    title?: string;
    name?: string;
    email?: string;
    display_order?: number;
    active?: boolean;
    photo_key?: string;
  };
  isEdit?: boolean;
}

interface FormValues {
  title: string;
  name: string;
  email: string;
  display_order: number;
  active: boolean;
  photo_key: string;
}

export default function OfficerForm({ cancelUrl, initialData, isEdit }: Props) {
  const { form, submitting, serverError, successMsg, onDelete } =
    useAdminForm<FormValues>({
      defaultValues: {
        title: initialData?.title ?? "",
        name: initialData?.name ?? "",
        email: initialData?.email ?? "",
        display_order: initialData?.display_order ?? 0,
        active: initialData?.active ?? true,
        photo_key: initialData?.photo_key ?? "",
      },
      checkboxFields: ["active"],
    });

  const { register, formState: { errors }, handleSubmit } = form;

  const fileRef = useRef<FileFieldHandle>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSubmit(async (values) => {
        setUploading(true);
        setUploadError("");
        try {
          const fd = new FormData();
          const file = fileRef.current?.files?.[0];
          if (file) fd.append("photo", file);
          fd.append("title", values.title);
          fd.append("name", values.name);
          fd.append("email", values.email || "");
          fd.append("display_order", String(values.display_order));
          if (values.active) fd.append("active", "1");
          fd.append("photo_key", values.photo_key || "");

          const res = await fetch(window.location.href, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: fd,
          });
          if (res.redirected) { window.location.href = res.url; return; }
          if (res.ok) {
            const data = await res.json();
            if (data.error) setUploadError(data.error);
            else if (data.redirect) window.location.href = data.redirect;
          } else {
            const data = await res.json().catch(() => null);
            setUploadError(data?.error || `Server error (${res.status})`);
          }
        } catch {
          setUploadError("Network error. Please try again.");
        } finally {
          setUploading(false);
        }
      })(e);
    },
    [handleSubmit]
  );

  const busy = submitting || uploading;

  return (
    <>
      <FormMessage error={serverError || uploadError} success={successMsg} />
      <form onSubmit={onSubmit}>
        <TextField
          label="Officer Title"
          hint="(e.g. Chancellor Commander)"
          registration={register("title", { required: "Title is required" })}
          error={errors.title}
          required
        />
        <TextField
          label="Full Name"
          registration={register("name", { required: "Name is required" })}
          error={errors.name}
          required
        />
        <div className="row">
          <TextField
            label="Email"
            type="email"
            registration={register("email")}
            error={errors.email}
          />
          <NumberField
            label="Display Order"
            hint="(lower = first)"
            min={0}
            registration={register("display_order", { valueAsNumber: true })}
            error={errors.display_order}
          />
        </div>
        <FileField
          ref={fileRef}
          label="Photo"
          hint="(optional)"
          previewUrl={initialData?.photo_key || null}
          previewStyle={{ maxWidth: 150, maxHeight: 150, borderRadius: '50%', objectFit: 'cover' as const }}
        />
        {isEdit && (
          <CheckboxField label="Active" registration={register("active")} />
        )}
        <FormActions
          submitLabel={isEdit ? "Save Changes" : "Add Officer"}
          cancelUrl={cancelUrl}
          submitting={busy}
          onDelete={isEdit ? () => onDelete("Delete this officer?") : undefined}
        />
      </form>
    </>
  );
}
