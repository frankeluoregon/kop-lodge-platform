import { useAdminForm } from "../useAdminForm";
import FormMessage from "../FormMessage";
import FormActions from "../FormActions";
import TextField from "../fields/TextField";
import TextareaField from "../fields/TextareaField";
import DateField from "../fields/DateField";
import SelectField from "../fields/SelectField";
import NumberField from "../fields/NumberField";
import CheckboxField from "../fields/CheckboxField";

const LEVEL_OPTIONS = [
  { value: "lodge", label: "Lodge" },
  { value: "grand", label: "Grand Lodge" },
  { value: "supreme", label: "Supreme Lodge" },
];

const RECUR_TYPE_OPTIONS = [
  { value: "weekly", label: "Weekly – same day of week" },
  { value: "monthly-day", label: "Monthly – same day of month" },
  { value: "monthly-nth", label: "Monthly – Nth weekday" },
];

const WEEKDAY_OPTIONS = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

const NTH_OPTIONS = [
  { value: "1", label: "1st" },
  { value: "2", label: "2nd" },
  { value: "3", label: "3rd" },
  { value: "4", label: "4th" },
  { value: "5", label: "Last" },
];

interface Props {
  cancelUrl: string;
  initialData?: {
    title?: string;
    event_date?: string;
    end_date?: string;
    level?: string;
    location?: string;
    description?: string;
    url?: string;
    published?: boolean;
    recurring?: boolean;
    recur_type?: string;
    recur_day?: number | null;
    recur_nth?: number | null;
    recur_weekday?: number | null;
    recur_end_date?: string;
  };
  isEdit?: boolean;
}

interface FormValues {
  title: string;
  event_date: string;
  end_date: string;
  level: string;
  location: string;
  description: string;
  url: string;
  published: boolean;
  recurring: boolean;
  recur_type: string;
  recur_day: string;
  recur_nth: string;
  recur_weekday: string;
  recur_end_date: string;
}

export default function EventForm({ cancelUrl, initialData, isEdit }: Props) {
  const { form, submitting, serverError, successMsg, onSubmit, onDelete } =
    useAdminForm<FormValues>({
      defaultValues: {
        title: initialData?.title ?? "",
        event_date: initialData?.event_date ?? "",
        end_date: initialData?.end_date ?? "",
        level: initialData?.level ?? "lodge",
        location: initialData?.location ?? "",
        description: initialData?.description ?? "",
        url: initialData?.url ?? "",
        published: initialData?.published ?? true,
        recurring: initialData?.recurring ?? false,
        recur_type: initialData?.recur_type ?? "weekly",
        recur_day: initialData?.recur_day != null ? String(initialData.recur_day) : "",
        recur_nth: initialData?.recur_nth != null ? String(initialData.recur_nth) : "1",
        recur_weekday: initialData?.recur_weekday != null ? String(initialData.recur_weekday) : "0",
        recur_end_date: initialData?.recur_end_date ?? "",
      },
      checkboxFields: ["published", "recurring"],
    });

  const { register, formState: { errors }, watch } = form;

  const isRecurring = watch("recurring");
  const recurType = watch("recur_type");

  return (
    <>
      <FormMessage error={serverError} success={successMsg} />
      <form onSubmit={onSubmit}>
        <TextField
          label="Event Title"
          registration={register("title", { required: "Title is required" })}
          error={errors.title}
          required
        />
        <div className="row">
          <DateField
            label="Event Date"
            registration={register("event_date", { required: "Event date is required" })}
            error={errors.event_date}
            required
          />
          <DateField
            label="End Date"
            hint="optional"
            registration={register("end_date")}
          />
        </div>
        <div className="row">
          <SelectField
            label="Level"
            options={LEVEL_OPTIONS}
            registration={register("level")}
          />
          <TextField
            label="Location"
            registration={register("location")}
          />
        </div>
        <TextareaField
          label="Description"
          registration={register("description")}
          style={{ minHeight: "100px" }}
        />
        <TextField
          label="URL"
          hint="optional"
          type="url"
          registration={register("url")}
        />

        <CheckboxField
          label="Recurring event"
          registration={register("recurring")}
        />

        {isRecurring && (
          <div>
            <SelectField
              label="Repeat"
              options={RECUR_TYPE_OPTIONS}
              registration={register("recur_type")}
            />

            {recurType === "weekly" && (
              <SelectField
                label="Day of week"
                options={WEEKDAY_OPTIONS}
                registration={register("recur_weekday")}
              />
            )}

            {recurType === "monthly-day" && (
              <NumberField
                label="Day of month"
                min={1}
                max={31}
                placeholder="e.g. 15"
                registration={register("recur_day")}
              />
            )}

            {recurType === "monthly-nth" && (
              <div className="row">
                <SelectField
                  label="Which week"
                  options={NTH_OPTIONS}
                  registration={register("recur_nth")}
                />
                <SelectField
                  label="Weekday"
                  options={WEEKDAY_OPTIONS}
                  registration={register("recur_weekday")}
                />
              </div>
            )}

            <DateField
              label="End date"
              hint="optional"
              registration={register("recur_end_date")}
            />
          </div>
        )}

        <CheckboxField
          label="Published"
          registration={register("published")}
        />
        <FormActions
          submitLabel={isEdit ? "Save Changes" : "Save Event"}
          cancelUrl={cancelUrl}
          submitting={submitting}
          onDelete={isEdit ? () => onDelete("Delete this event?") : undefined}
        />
      </form>
    </>
  );
}
