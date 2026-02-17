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
    meeting_date?: string;
    title?: string;
    content?: string;
    published?: boolean;
  };
  isEdit?: boolean;
}

interface FormValues {
  meeting_date: string;
  title: string;
  content: string;
  published: boolean;
}

export default function MinutesForm({ cancelUrl, initialData, isEdit }: Props) {
  const { form, submitting, serverError, successMsg, onSubmit, onDelete } =
    useAdminForm<FormValues>({
      defaultValues: {
        meeting_date: initialData?.meeting_date ?? new Date().toISOString().slice(0, 10),
        title: initialData?.title ?? "",
        content: initialData?.content ?? "",
        published: initialData?.published ?? true,
      },
      checkboxFields: ["published"],
    });

  const { register, formState: { errors } } = form;

  return (
    <>
      <FormMessage error={serverError} success={successMsg} />
      <form onSubmit={onSubmit}>
        <div className="row">
          <DateField
            label="Meeting Date"
            registration={register("meeting_date", { required: "Meeting date is required" })}
            error={errors.meeting_date}
            required
          />
          <TextField
            label="Title"
            hint="optional"
            placeholder="e.g. Regular Meeting"
            registration={register("title")}
          />
        </div>
        <TextareaField
          label="Minutes Content"
          hint="Markdown supported"
          rows={14}
          registration={register("content", { required: "Content is required" })}
          error={errors.content}
          required
        />
        <CheckboxField
          label="Visible to lodge admins"
          registration={register("published")}
        />
        <FormActions
          submitLabel={isEdit ? "Save Changes" : "Save Minutes"}
          cancelUrl={cancelUrl}
          submitting={submitting}
          onDelete={isEdit ? () => onDelete("Delete these minutes?") : undefined}
        />
      </form>
    </>
  );
}
