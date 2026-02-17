import { useRef, useState, useCallback } from "react";
import { useAdminForm } from "../useAdminForm";
import FormMessage from "../FormMessage";
import FormActions from "../FormActions";
import TextField from "../fields/TextField";
import NumberField from "../fields/NumberField";
import CheckboxField from "../fields/CheckboxField";

interface Props {
  cancelUrl: string;
  initialData?: {
    image_key?: string;
    caption?: string;
    display_order?: number;
    published?: boolean;
  };
  isEdit?: boolean;
}

interface FormValues {
  image_key: string;
  caption: string;
  display_order: number;
  published: boolean;
}

export default function GalleryForm({ cancelUrl, initialData, isEdit }: Props) {
  const { form, submitting, serverError, successMsg, onDelete } =
    useAdminForm<FormValues>({
      defaultValues: {
        image_key: initialData?.image_key ?? "",
        caption: initialData?.caption ?? "",
        display_order: initialData?.display_order ?? 0,
        published: initialData?.published ?? true,
      },
      checkboxFields: ["published"],
    });

  const { register, formState: { errors }, handleSubmit } = form;

  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    initialData?.image_key || null
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const onFileChange = useCallback(() => {
    const file = fileRef.current?.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }, []);

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
        <div className="field">
          <label>
            Photo
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={onFileChange}
            />
          </label>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: 320, maxHeight: 240, marginTop: 8, borderRadius: 4 }}
            />
          )}
        </div>
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
