import { useAdminForm } from "../useAdminForm";
import FormMessage from "../FormMessage";
import FormActions from "../FormActions";
import TextField from "../fields/TextField";
import CheckboxField from "../fields/CheckboxField";

interface Props {
  cancelUrl: string;
  initialData: {
    lodge_name: string;
    lodge_number: string;
    state: string;
    grand_domain: string;
    city: string;
    founded_year: string;
    tagline: string;
    meeting_schedule: string;
    meeting_location: string;
    phone: string;
    email: string;
    facebook_url: string;
    instagram_url: string;
    twitter_url: string;
    donation_url: string;
    grand_lodge_url: string;
    mailing_address: string;
    primary_color: string;
    accent_color: string;
    show_events: boolean;
    show_officers: boolean;
    show_blog: boolean;
    show_service: boolean;
    show_history: boolean;
    show_membership: boolean;
    show_gallery: boolean;
    show_links: boolean;
    show_newsletter: boolean;
    show_programs: boolean;
  };
}

interface FormValues {
  lodge_name: string;
  lodge_number: string;
  state: string;
  grand_domain: string;
  city: string;
  founded_year: string;
  tagline: string;
  meeting_schedule: string;
  meeting_location: string;
  phone: string;
  email: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  donation_url: string;
  grand_lodge_url: string;
  mailing_address: string;
  primary_color: string;
  accent_color: string;
  show_events: boolean;
  show_officers: boolean;
  show_blog: boolean;
  show_service: boolean;
  show_history: boolean;
  show_membership: boolean;
  show_gallery: boolean;
  show_links: boolean;
  show_newsletter: boolean;
  show_programs: boolean;
}

export default function ConfigForm({ cancelUrl, initialData }: Props) {
  const { form, submitting, serverError, successMsg, onSubmit } =
    useAdminForm<FormValues>({
      defaultValues: initialData,
      checkboxFields: [
        "show_events", "show_officers", "show_blog", "show_service",
        "show_history", "show_membership", "show_gallery", "show_links",
        "show_newsletter", "show_programs",
      ],
    });

  const { register, formState: { errors } } = form;

  return (
    <>
      <FormMessage error={serverError} success={successMsg} />
      <form onSubmit={onSubmit}>
        <div className="row">
          <TextField
            label="Lodge Name"
            registration={register("lodge_name", { required: "Lodge name is required" })}
            error={errors.lodge_name}
            required
          />
          <TextField label="Lodge Number" registration={register("lodge_number")} />
        </div>
        <div className="row">
          <TextField label="State" registration={register("state")} />
          <TextField label="Grand Domain" hint='(e.g. "Oregon")' registration={register("grand_domain")} />
        </div>
        <div className="row">
          <TextField label="City" registration={register("city")} />
          <TextField label="Founded Year" registration={register("founded_year")} />
        </div>
        <TextField label="Tagline" registration={register("tagline")} />
        <TextField
          label="Meeting Schedule"
          placeholder="e.g. First and Third Monday, 7:00 PM"
          registration={register("meeting_schedule")}
        />
        <TextField label="Meeting Location / Address" registration={register("meeting_location")} />
        <div className="row">
          <TextField label="Phone" registration={register("phone")} />
          <TextField label="Email" type="email" registration={register("email")} />
        </div>

        <h3>Social & Links</h3>
        <div className="row">
          <TextField label="Facebook URL" type="url" registration={register("facebook_url")} />
          <TextField label="Instagram URL" type="url" registration={register("instagram_url")} />
        </div>
        <div className="row">
          <TextField label="Twitter / X URL" type="url" registration={register("twitter_url")} />
          <TextField label="Donation URL" type="url" registration={register("donation_url")} />
        </div>
        <TextField label="Grand Lodge URL" type="url" registration={register("grand_lodge_url")} />
        <TextField label="Mailing Address" registration={register("mailing_address")} />

        <h3>Appearance</h3>
        <div className="row">
          <TextField label="Primary Color" hint="(hex)" registration={register("primary_color")} />
          <TextField label="Accent Color" hint="(hex)" registration={register("accent_color")} />
        </div>

        <h3>Section Visibility</h3>
        <p className="hint">Check sections to show in your lodge's navigation. Uncheck to hide.</p>
        <div className="row">
          <CheckboxField label="Events" registration={register("show_events")} />
          <CheckboxField label="Officers" registration={register("show_officers")} />
          <CheckboxField label="Blog / News" registration={register("show_blog")} />
          <CheckboxField label="Community Service" registration={register("show_service")} />
        </div>
        <div className="row">
          <CheckboxField label="History" registration={register("show_history")} />
          <CheckboxField label="Membership / Join" registration={register("show_membership")} />
          <CheckboxField label="Photo Gallery" registration={register("show_gallery")} />
          <CheckboxField label="Links" registration={register("show_links")} />
        </div>
        <div className="row">
          <CheckboxField label="Newsletter" registration={register("show_newsletter")} />
          <CheckboxField label="Programs" registration={register("show_programs")} />
        </div>

        <FormActions
          submitLabel="Save Settings"
          cancelUrl={cancelUrl}
          submitting={submitting}
        />
      </form>
    </>
  );
}
