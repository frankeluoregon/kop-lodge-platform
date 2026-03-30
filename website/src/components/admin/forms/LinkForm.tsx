import { useRef, useState, useCallback } from "react";
import { useAdminForm } from "../useAdminForm";
import FormMessage from "../FormMessage";
import FormActions from "../FormActions";
import TextField from "../fields/TextField";
import NumberField from "../fields/NumberField";
import FileField, { type FileFieldHandle } from "../fields/FileField";

interface Props {
  cancelUrl: string;
  initialData?: {
    title?: string;
    url?: string;
    category?: string;
    description?: string;
    display_order?: number;
    image_key?: string;
  };
  isEdit?: boolean;
}

interface FormValues {
  title: string;
  url: string;
  category: string;
  description: string;
  display_order: number;
  image_key: string;
}

export default function LinkForm({ cancelUrl, initialData, isEdit }: Props) {
  const { form, submitting, serverError, successMsg, onDelete } =
    useAdminForm<FormValues>({
      defaultValues: {
        title: initialData?.title ?? "",
        url: initialData?.url ?? "",
        category: initialData?.category ?? "general",
        description: initialData?.description ?? "",
        display_order: initialData?.display_order ?? 0,
        image_key: initialData?.image_key ?? "",
      },
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
            fd.append("image", file);
          }
          fd.append("title", values.title);
          fd.append("url", values.url);
          fd.append("category", values.category || "general");
          fd.append("description", values.description || "");
          fd.append("display_order", String(values.display_order));
          fd.append("image_key", values.image_key || "");

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
            } else if (data.redirect) {
              window.location.href = data.redirect;
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
        <TextField
          label="Title"
          registration={register("title", { required: "Title is required" })}
          error={errors.title}
          required
        />
        <TextField
          label="URL"
          type="url"
          placeholder="https://..."
          registration={register("url", { required: "URL is required" })}
          error={errors.url}
          required
        />
        <div className="row">
          <TextField
            label="Category"
            hint="(e.g. general, pythian, community)"
            registration={register("category")}
          />
          <NumberField
            label="Display Order"
            hint="(lower = first)"
            min={0}
            registration={register("display_order", { valueAsNumber: true })}
          />
        </div>
        <TextField
          label="Description"
          hint="(optional)"
          registration={register("description")}
        />
        <FileField
          ref={fileRef}
          label="Image"
          hint="(optional logo/icon)"
          previewUrl={initialData?.image_key || null}
          previewStyle={{ maxWidth: 200, maxHeight: 100, borderRadius: 4, objectFit: 'contain' as const }}
        />
        <FormActions
          submitLabel={isEdit ? "Save Changes" : "Add Link"}
          cancelUrl={cancelUrl}
          submitting={busy}
          onDelete={isEdit ? () => onDelete("Delete this link?") : undefined}
        />
      </form>
    </>
  );
}
