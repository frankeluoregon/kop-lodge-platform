import { useAdminForm } from "../useAdminForm";
import FormMessage from "../FormMessage";
import FormActions from "../FormActions";
import TextField from "../fields/TextField";
import TextareaField from "../fields/TextareaField";
import DateField from "../fields/DateField";
import CheckboxField from "../fields/CheckboxField";

interface Props {
  cancelUrl: string;
  initialData?: {
    title?: string;
    content?: string;
    expires_at?: string;
    published?: boolean;
  };
  isEdit?: boolean;
}

interface FormValues {
  title: string;
  content: string;
  expires_at: string;
  published: boolean;
}

export default function AnnouncementForm({ cancelUrl, initialData, isEdit }: Props) {
  const { form, submitting, serverError, successMsg, onSubmit, onDelete } =
    useAdminForm<FormValues>({
      defaultValues: {
        title: initialData?.title ?? "",
        content: initialData?.content ?? "",
        expires_at: initialData?.expires_at ?? "",
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
          label="Title"
          registration={register("title", { required: "Title is required" })}
          error={errors.title}
          required
        />
        <TextareaField
          label="Content"
          hint="Markdown supported — internal only"
          rows={8}
          registration={register("content", { required: "Content is required" })}
          error={errors.content}
          required
        />
        <div className="row">
          <DateField
            label="Expires"
            hint="optional — leave blank to keep indefinitely"
            registration={register("expires_at")}
          />
          <div className="field" style={{ paddingTop: "1.5rem" }}>
            <CheckboxField label="Active" registration={register("published")} />
          </div>
        </div>
        <FormActions
          submitLabel={isEdit ? "Save Changes" : "Post Announcement"}
          cancelUrl={cancelUrl}
          submitting={submitting}
          onDelete={isEdit ? () => onDelete("Delete this announcement?") : undefined}
        />
      </form>
    </>
  );
}
