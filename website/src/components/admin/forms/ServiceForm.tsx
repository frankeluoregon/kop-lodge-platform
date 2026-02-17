import { useAdminForm } from "../useAdminForm";
import FormMessage from "../FormMessage";
import FormActions from "../FormActions";
import TextField from "../fields/TextField";
import DateField from "../fields/DateField";
import TextareaField from "../fields/TextareaField";
import CheckboxField from "../fields/CheckboxField";

interface Props {
  cancelUrl: string;
  initialData?: {
    title?: string;
    description?: string;
    service_date?: string;
    featured?: boolean;
    published?: boolean;
  };
  isEdit?: boolean;
}

interface FormValues {
  title: string;
  description: string;
  service_date: string;
  featured: boolean;
  published: boolean;
}

export default function ServiceForm({ cancelUrl, initialData, isEdit }: Props) {
  const { form, submitting, serverError, successMsg, onSubmit, onDelete } =
    useAdminForm<FormValues>({
      defaultValues: {
        title: initialData?.title ?? "",
        description: initialData?.description ?? "",
        service_date: initialData?.service_date ?? "",
        featured: initialData?.featured ?? false,
        published: initialData?.published ?? true,
      },
      checkboxFields: ["featured", "published"],
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
        <DateField
          label="Service Date"
          registration={register("service_date")}
        />
        <TextareaField
          label="Description"
          hint="(Markdown)"
          registration={register("description", { required: "Description is required" })}
          error={errors.description}
          required
        />
        <div className="row">
          <CheckboxField
            label="Featured on home page"
            registration={register("featured")}
          />
          <CheckboxField
            label="Published"
            registration={register("published")}
          />
        </div>
        <FormActions
          submitLabel={isEdit ? "Save Changes" : "Save Entry"}
          cancelUrl={cancelUrl}
          submitting={submitting}
          onDelete={isEdit ? () => onDelete("Delete this entry?") : undefined}
        />
      </form>
    </>
  );
}
