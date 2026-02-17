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
  const { form, submitting, serverError, successMsg, onSubmit, onDelete } =
    useAdminForm<FormValues>({
      defaultValues: {
        image_key: initialData?.image_key ?? "",
        caption: initialData?.caption ?? "",
        display_order: initialData?.display_order ?? 0,
        published: initialData?.published ?? true,
      },
      checkboxFields: ["published"],
    });

  const { register, formState: { errors } } = form;

  return (
    <>
      <FormMessage error={serverError} success={successMsg} />
      <form onSubmit={onSubmit}>
        <TextField
          label="Image URL / Key"
          placeholder="https://... or R2 key"
          registration={register("image_key", { required: "Image URL is required" })}
          error={errors.image_key}
          required
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
          submitting={submitting}
          onDelete={isEdit ? () => onDelete("Delete this photo?") : undefined}
        />
      </form>
    </>
  );
}
