import { useAdminForm } from "../useAdminForm";
import FormMessage from "../FormMessage";
import TextareaField from "../fields/TextareaField";

interface Props {
  initialEmails: string;
}

interface FormValues {
  admin_emails: string;
  _action: string;
}

export default function AdminEmailsForm({ initialEmails }: Props) {
  const { form, submitting, serverError, successMsg, onSubmit } =
    useAdminForm<FormValues>({
      defaultValues: {
        admin_emails: initialEmails,
        _action: "save_admins",
      },
    });

  const { register } = form;

  return (
    <>
      <FormMessage error={serverError} success={successMsg} />
      <form onSubmit={onSubmit}>
        <input type="hidden" {...register("_action")} />
        <TextareaField
          label=""
          rows={5}
          registration={register("admin_emails")}
        />
        <div className="actions">
          <button type="submit" className="btn primary" disabled={submitting}>
            {submitting ? "Saving…" : "Update Admins"}
          </button>
        </div>
      </form>
    </>
  );
}
