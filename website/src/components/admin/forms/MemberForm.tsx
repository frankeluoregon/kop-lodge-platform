import { useAdminForm } from "../useAdminForm";
import FormMessage from "../FormMessage";
import FormActions from "../FormActions";
import TextField from "../fields/TextField";
import SelectField from "../fields/SelectField";
import DateField from "../fields/DateField";
import TextareaField from "../fields/TextareaField";
import CheckboxField from "../fields/CheckboxField";

const DEGREE_OPTIONS = [
  { value: "1", label: "1st Degree" },
  { value: "2", label: "2nd Degree" },
  { value: "3", label: "3rd Degree (Knight)" },
];

const OFFICE_OPTIONS = [
  { value: "", label: "— None —" },
  { value: "Chancellor Commander", label: "Chancellor Commander" },
  { value: "Vice-Chancellor", label: "Vice-Chancellor" },
  { value: "Prelate", label: "Prelate" },
  { value: "Master of Work", label: "Master of Work" },
  { value: "Secretary / Keeper of Records and Seal", label: "Secretary / Keeper of Records and Seal" },
  { value: "Treasurer / Master of Exchequer", label: "Treasurer / Master of Exchequer" },
  { value: "Master at Arms", label: "Master at Arms" },
  { value: "Inner Guard", label: "Inner Guard" },
  { value: "Outer Guard", label: "Outer Guard" },
];

interface Props {
  cancelUrl: string;
  initialData?: {
    name?: string;
    email?: string;
    phone?: string;
    degree?: number;
    office?: string;
    joined_date?: string;
    notes?: string;
    active?: boolean;
  };
  isEdit?: boolean;
}

interface FormValues {
  name: string;
  email: string;
  phone: string;
  degree: string;
  office: string;
  joined_date: string;
  notes: string;
  active: boolean;
}

export default function MemberForm({ cancelUrl, initialData, isEdit }: Props) {
  const { form, submitting, serverError, successMsg, onSubmit, onDelete } =
    useAdminForm<FormValues>({
      defaultValues: {
        name: initialData?.name ?? "",
        email: initialData?.email ?? "",
        phone: initialData?.phone ?? "",
        degree: String(initialData?.degree ?? 1),
        office: initialData?.office ?? "",
        joined_date: initialData?.joined_date ?? "",
        notes: initialData?.notes ?? "",
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
          />
          <TextField
            label="Phone"
            type="tel"
            registration={register("phone")}
          />
        </div>
        <div className="row">
          <SelectField
            label="Degree"
            options={DEGREE_OPTIONS}
            registration={register("degree")}
          />
          <DateField
            label="Joined Date"
            registration={register("joined_date")}
          />
        </div>
        <SelectField
          label="Office"
          hint="optional"
          options={OFFICE_OPTIONS}
          registration={register("office")}
        />
        <TextareaField
          label="Notes"
          hint="internal"
          rows={3}
          registration={register("notes")}
        />
        {isEdit && (
          <CheckboxField label="Active member" registration={register("active")} />
        )}
        <FormActions
          submitLabel={isEdit ? "Save Changes" : "Add Member"}
          cancelUrl={cancelUrl}
          submitting={submitting}
          onDelete={isEdit ? () => onDelete("Remove this member?") : undefined}
        />
      </form>
    </>
  );
}
