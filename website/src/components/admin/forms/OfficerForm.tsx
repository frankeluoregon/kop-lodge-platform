import { useAdminForm } from "../useAdminForm";
import FormMessage from "../FormMessage";
import FormActions from "../FormActions";
import TextField from "../fields/TextField";
import NumberField from "../fields/NumberField";
import CheckboxField from "../fields/CheckboxField";

interface Props {
  cancelUrl: string;
  initialData?: {
    title?: string;
    name?: string;
    email?: string;
    display_order?: number;
    active?: boolean;
  };
  isEdit?: boolean;
}

interface FormValues {
  title: string;
  name: string;
  email: string;
  display_order: number;
  active: boolean;
}

export default function OfficerForm({ cancelUrl, initialData, isEdit }: Props) {
  const { form, submitting, serverError, successMsg, onSubmit, onDelete } =
    useAdminForm<FormValues>({
      defaultValues: {
        title: initialData?.title ?? "",
        name: initialData?.name ?? "",
        email: initialData?.email ?? "",
        display_order: initialData?.display_order ?? 0,
        active: initialData?.active ?? true,
      },
      checkboxFields: ["active"],
    });

  const { register, formState: { errors } } = form;

  return (
    <>
      <FormMessage error={serverError} success={successMsg} />
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
        {isEdit && (
          <CheckboxField label="Active" registration={register("active")} />
        )}
        <FormActions
          submitLabel={isEdit ? "Save Changes" : "Add Officer"}
          cancelUrl={cancelUrl}
          submitting={submitting}
          onDelete={isEdit ? () => onDelete("Delete this officer?") : undefined}
        />
      </form>
    </>
  );
}
