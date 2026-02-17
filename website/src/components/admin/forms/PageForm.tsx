import { useEffect } from "react";
import { useAdminForm } from "../useAdminForm";
import FormMessage from "../FormMessage";
import FormActions from "../FormActions";
import TextField from "../fields/TextField";
import TextareaField from "../fields/TextareaField";

interface Props {
  cancelUrl: string;
  lodgeSlug: string;
  initialData?: {
    title?: string;
    slug?: string;
    content?: string;
    meta_description?: string;
  };
  isEdit?: boolean;
}

interface FormValues {
  title: string;
  slug: string;
  content: string;
  meta_description: string;
}

export default function PageForm({ cancelUrl, lodgeSlug, initialData, isEdit }: Props) {
  const { form, submitting, serverError, successMsg, onSubmit, onDelete } =
    useAdminForm<FormValues>({
      defaultValues: {
        title: initialData?.title ?? "",
        slug: initialData?.slug ?? "",
        content: initialData?.content ?? "",
        meta_description: initialData?.meta_description ?? "",
      },
    });

  const { register, formState: { errors }, watch, setValue } = form;

  // Auto-generate slug from title for new pages
  const title = watch("title");
  const slug = watch("slug");
  useEffect(() => {
    if (!isEdit && title && !slug) {
      setValue("slug", title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }, [title, isEdit, setValue, slug]);

  return (
    <>
      <FormMessage error={serverError} success={successMsg} />
      <form onSubmit={onSubmit}>
        <TextField
          label="Title"
          registration={register("title", { required: "Title is required" })}
          error={errors.title}
          required
        />
        <TextField
          label="Slug"
          hint={isEdit ? "(read-only URL path)" : `(URL path: e.g. "history" → /lodges/${lodgeSlug}/history)`}
          registration={register("slug", {
            required: "Slug is required",
            pattern: { value: /^[a-z0-9-]+$/, message: "Lowercase letters, numbers, and hyphens only" },
          })}
          error={errors.slug}
          required
          disabled={isEdit}
        />
        <TextareaField
          label="Content"
          hint="(Markdown)"
          rows={20}
          registration={register("content")}
        />
        <TextField
          label="Meta Description"
          hint="(optional, for SEO)"
          registration={register("meta_description")}
        />
        <FormActions
          submitLabel={isEdit ? "Save Changes" : "Create Page"}
          cancelUrl={cancelUrl}
          submitting={submitting}
          onDelete={isEdit ? () => onDelete("Delete this page?") : undefined}
        />
      </form>
    </>
  );
}
