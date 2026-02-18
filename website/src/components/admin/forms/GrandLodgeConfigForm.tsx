import { useAdminForm } from "../useAdminForm";
import FormMessage from "../FormMessage";
import FormActions from "../FormActions";
import TextField from "../fields/TextField";
import TextareaField from "../fields/TextareaField";

interface Props {
  cancelUrl: string;
  initialData: {
    grand_lodge_name: string;
    grand_domain_name: string;
    tagline: string;
    about_text: string;
    history_text: string;
    contact_email: string;
    contact_phone: string;
    website_url: string;
    supreme_lodge_url: string;
    facebook_url: string;
    mailing_address: string;
  };
}

interface FormValues {
  grand_lodge_name: string;
  grand_domain_name: string;
  tagline: string;
  about_text: string;
  history_text: string;
  contact_email: string;
  contact_phone: string;
  website_url: string;
  supreme_lodge_url: string;
  facebook_url: string;
  mailing_address: string;
}

export default function GrandLodgeConfigForm({ cancelUrl, initialData }: Props) {
  const { form, submitting, serverError, successMsg, onSubmit } =
    useAdminForm<FormValues>({
      defaultValues: initialData,
    });

  const { register, formState: { errors } } = form;

  return (
    <>
      <FormMessage error={serverError} success={successMsg} />
      <form onSubmit={onSubmit}>
        <TextField
          label="Grand Lodge Name"
          registration={register("grand_lodge_name", { required: "Grand lodge name is required" })}
          error={errors.grand_lodge_name}
          required
        />
        <TextField
          label="Grand Domain Name"
          hint='(e.g. "Grand Domain of Oregon")'
          registration={register("grand_domain_name")}
        />
        <TextField label="Tagline" registration={register("tagline")} />

        <h3>Content</h3>
        <TextareaField
          label="About Text"
          hint="(shown on the grand lodge homepage)"
          registration={register("about_text")}
        />
        <TextareaField
          label="History Text"
          hint="(shown on the history page)"
          registration={register("history_text")}
        />

        <h3>Contact</h3>
        <div className="row">
          <TextField label="Contact Email" type="email" registration={register("contact_email")} />
          <TextField label="Contact Phone" registration={register("contact_phone")} />
        </div>
        <TextField label="Mailing Address" registration={register("mailing_address")} />

        <h3>Links</h3>
        <TextField label="Website URL" type="url" registration={register("website_url")} />
        <TextField label="Supreme Lodge URL" type="url" registration={register("supreme_lodge_url")} />
        <TextField label="Facebook URL" type="url" registration={register("facebook_url")} />

        <FormActions
          submitLabel="Save Settings"
          cancelUrl={cancelUrl}
          submitting={submitting}
        />
      </form>
    </>
  );
}
