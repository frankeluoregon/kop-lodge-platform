import { useEffect } from "react";
import { useAdminForm } from "../useAdminForm";
import FormMessage from "../FormMessage";
import FormActions from "../FormActions";
import TextField from "../fields/TextField";
import TextareaField from "../fields/TextareaField";
import CheckboxField from "../fields/CheckboxField";

interface Props {
  cancelUrl: string;
  initialData?: {
    title?: string;
    slug?: string;
    author?: string;
    excerpt?: string;
    content?: string;
    published?: boolean;
  };
  isEdit?: boolean;
}

interface FormValues {
  title: string;
  slug: string;
  author: string;
  excerpt: string;
  content: string;
  published: boolean;
}

export default function BlogForm({ cancelUrl, initialData, isEdit }: Props) {
  const { form, submitting, serverError, successMsg, onSubmit, onDelete } =
    useAdminForm<FormValues>({
      defaultValues: {
        title: initialData?.title ?? "",
        slug: initialData?.slug ?? "",
        author: initialData?.author ?? "",
        excerpt: initialData?.excerpt ?? "",
        content: initialData?.content ?? "",
        published: initialData?.published ?? false,
      },
      checkboxFields: ["published"],
    });

  const { register, formState: { errors }, watch, setValue } = form;

  // Auto-generate slug from title (only for new posts when slug is empty)
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
        <div className="row">
          <TextField
            label="Slug"
            hint={isEdit ? undefined : "(auto-generated)"}
            placeholder={isEdit ? undefined : "leave blank to auto-generate"}
            registration={register("slug", isEdit ? { required: "Slug is required" } : {})}
            error={errors.slug}
            required={isEdit}
          />
          <TextField
            label="Author"
            registration={register("author")}
          />
        </div>
        <TextField
          label="Excerpt"
          registration={register("excerpt")}
        />
        <TextareaField
          label="Content"
          hint="(Markdown)"
          registration={register("content", { required: "Content is required" })}
          error={errors.content}
          required
        />
        <CheckboxField
          label={isEdit ? "Published" : "Publish immediately"}
          registration={register("published")}
        />
        <FormActions
          submitLabel={isEdit ? "Save Changes" : "Save Post"}
          cancelUrl={cancelUrl}
          submitting={submitting}
          onDelete={isEdit ? () => onDelete("Delete this post?") : undefined}
        />
      </form>
    </>
  );
}
