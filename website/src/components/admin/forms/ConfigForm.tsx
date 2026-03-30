import { useAdminForm } from "../useAdminForm";
import FormMessage from "../FormMessage";
import FormActions from "../FormActions";
import TextField from "../fields/TextField";
import SelectField from "../fields/SelectField";

const DISPLAY_OPTIONS = [
  { value: "off", label: "Off" },
  { value: "home", label: "Front Page" },
  { value: "page", label: "Separate Page" },
];

const PAGE_ONLY_OPTIONS = [
  { value: "off", label: "Off" },
  { value: "page", label: "Separate Page" },
];

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
    mailing_address: string;
    primary_color: string;
    accent_color: string;
    display_events: string;
    display_gallery: string;
    display_links: string;
    display_service: string;
    display_blog: string;
    display_history: string;
    display_membership: string;
    display_newsletter: string;
    display_programs: string;
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
  mailing_address: string;
  primary_color: string;
  accent_color: string;
  display_events: string;
  display_gallery: string;
  display_links: string;
  display_service: string;
  display_blog: string;
  display_history: string;
  display_membership: string;
  display_newsletter: string;
  display_programs: string;
}

export default function ConfigForm({ cancelUrl, initialData }: Props) {
  const { form, submitting, serverError, successMsg, onSubmit } =
    useAdminForm<FormValues>({
      defaultValues: initialData,
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
        <TextField label="Mailing Address" registration={register("mailing_address")} />

        <h3>Appearance</h3>
        <div className="row">
          <TextField label="Primary Color" hint="(hex)" registration={register("primary_color")} />
          <TextField label="Accent Color" hint="(hex)" registration={register("accent_color")} />
        </div>

        <h3>Section Layout</h3>
        <p className="hint">Officers and Lodge at a Glance always appear on the front page. For other sections, choose Front Page (displayed on home), Separate Page (own page with nav link), or Off.</p>
        <div className="row">
          <SelectField label="Events" options={DISPLAY_OPTIONS} registration={register("display_events")} />
          <SelectField label="Gallery" options={DISPLAY_OPTIONS} registration={register("display_gallery")} />
        </div>
        <div className="row">
          <SelectField label="Links" options={DISPLAY_OPTIONS} registration={register("display_links")} />
          <SelectField label="Community Service" options={DISPLAY_OPTIONS} registration={register("display_service")} />
        </div>
        <div className="row">
          <SelectField label="Blog / News" options={DISPLAY_OPTIONS} registration={register("display_blog")} />
          <SelectField label="History" options={PAGE_ONLY_OPTIONS} registration={register("display_history")} />
        </div>
        <div className="row">
          <SelectField label="Membership / Join" options={PAGE_ONLY_OPTIONS} registration={register("display_membership")} />
          <SelectField label="Newsletter" options={PAGE_ONLY_OPTIONS} registration={register("display_newsletter")} />
        </div>
        <div className="row">
          <SelectField label="Programs" options={PAGE_ONLY_OPTIONS} registration={register("display_programs")} />
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
