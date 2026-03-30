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
    image_key?: string;
    caption?: string;
    display_order?: number;
    published?: boolean;
    featured?: boolean;
  };
  isEdit?: boolean;
}

interface FormValues {
  image_key: string;
  caption: string;
  display_order: number;
  published: boolean;
  featured: boolean;
}

export default function GalleryForm({ cancelUrl, initialData, isEdit }: Props) {
  const { form, submitting, serverError, successMsg, onDelete } =
    useAdminForm<FormValues>({
      defaultValues: {
        image_key: initialData?.image_key ?? "",
        caption: initialData?.caption ?? "",
        display_order: initialData?.display_order ?? 0,
        published: initialData?.published ?? true,
        featured: initialData?.featured ?? false,
      },
      checkboxFields: ["published", "featured"],
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
          if (file) {
            fd.append("photo", file);
          }
          fd.append("image_key", values.image_key);
          fd.append("caption", values.caption || "");
          fd.append("display_order", String(values.display_order));
          if (values.published) fd.append("published", "1");
          if (values.featured) fd.append("featured", "1");

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
              setUploadError(data.error);
            } else {
              window.location.href = data.redirect || res.url || window.location.href;
            }
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
        <FileField
          ref={fileRef}
          label="Photo"
          previewUrl={initialData?.image_key || null}
          previewStyle={{ maxWidth: 320, maxHeight: 240, borderRadius: 4 }}
        />
        <TextField
          label="Image URL / Key"
          placeholder="https://... or R2 key (auto-filled on upload)"
          registration={register("image_key")}
          error={errors.image_key}
        />
        <TextField
          label="Caption"
          hint="(optional)"
          registration={register("caption")}
        />
        <div className="row">
          <NumberField
            label="Display Order"
            hint="(lower = first)"
            min={0}
            registration={register("display_order", { valueAsNumber: true })}
          />
          {isEdit && (
            <CheckboxField label="Published" registration={register("published")} />
          )}
          <CheckboxField label="Featured" registration={register("featured")} />
        </div>
        <FormActions
          submitLabel={isEdit ? "Save Changes" : "Add Photo"}
          cancelUrl={cancelUrl}
          submitting={busy}
          onDelete={isEdit ? () => onDelete("Delete this photo?") : undefined}
        />
      </form>
    </>
  );
}
