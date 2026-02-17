import { useAdminForm } from "../useAdminForm";
import FormMessage from "../FormMessage";
import FormActions from "../FormActions";
import TextField from "../fields/TextField";
import NumberField from "../fields/NumberField";

interface Props {
  cancelUrl: string;
  initialData?: {
    title?: string;
    url?: string;
    category?: string;
    description?: string;
    display_order?: number;
  };
  isEdit?: boolean;
}

interface FormValues {
  title: string;
  url: string;
  category: string;
  description: string;
  display_order: number;
}

export default function LinkForm({ cancelUrl, initialData, isEdit }: Props) {
  const { form, submitting, serverError, successMsg, onSubmit, onDelete } =
    useAdminForm<FormValues>({
      defaultValues: {
        title: initialData?.title ?? "",
        url: initialData?.url ?? "",
        category: initialData?.category ?? "general",
        description: initialData?.description ?? "",
        display_order: initialData?.display_order ?? 0,
      },
    });

  const { register, formState: { errors } } = form;

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
        <FormActions
          submitLabel={isEdit ? "Save Changes" : "Add Link"}
          cancelUrl={cancelUrl}
          submitting={submitting}
          onDelete={isEdit ? () => onDelete("Delete this link?") : undefined}
        />
      </form>
    </>
  );
}
