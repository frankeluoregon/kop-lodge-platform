import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";

interface Props {
  initialData?: {
    name?: string;
    number?: string;
    slug?: string;
    active?: boolean;
    admin_emails?: string;
    member_names?: string;
  };
  isEdit?: boolean;
  viewSiteUrl?: string;
  lodgeAdminUrl?: string;
}

interface FormValues {
  name: string;
  number: string;
  slug: string;
  active: boolean;
  admin_emails: string;
  member_names: string;
}

export default function LodgeForm({ initialData, isEdit, viewSiteUrl, lodgeAdminUrl }: Props) {
  const form = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name ?? "",
      number: initialData?.number ?? "",
      slug: initialData?.slug ?? "",
      active: initialData?.active ?? true,
      admin_emails: initialData?.admin_emails ?? "",
      member_names: initialData?.member_names ?? "",
    },
  });

  const { register, formState: { errors }, watch, setValue } = form;
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Auto-generate slug from name + number for new lodges
  const name = watch("name");
  const number = watch("number");
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (!isEdit && !slugEdited) {
      const n = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
      const num = number.trim();
      setValue("slug", n && num ? n + num : n || num);
    }
  }, [name, number, isEdit, slugEdited, setValue]);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      form.handleSubmit(async (values) => {
        setSubmitting(true);
        setServerError("");
        setSuccessMsg("");
        try {
          const fd = new FormData();
          fd.append("name", values.name);
          fd.append("number", values.number);
          fd.append("slug", values.slug);
          fd.append("admin_emails", values.admin_emails);
          if (!isEdit) {
            fd.append("member_names", values.member_names);
          }
          if (isEdit && values.active) {
            fd.append("active", "on");
          }
          const res = await fetch(window.location.href, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: fd,
          });
          if (res.redirected) {
            window.location.href = res.url;
            return;
          }
          if (res.ok) {
            const data = await res.json();
            if (data.error) setServerError(data.error);
            else setSuccessMsg(data.message || "Saved.");
          } else {
            const data = await res.json().catch(() => null);
            setServerError(data?.error || `Server error (${res.status})`);
          }
        } catch {
          setServerError("Network error. Please try again.");
        } finally {
          setSubmitting(false);
        }
      })(e);
    },
    [form, isEdit]
  );

  return (
    <>
      {successMsg && <div className="success-msg">{successMsg}</div>}
      {serverError && <div className="error-msg">{serverError}</div>}
      <form onSubmit={onSubmit}>
        <div className="field">
          <label>Lodge Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            placeholder={isEdit ? undefined : "e.g. Damon"}
          />
          {errors.name && <span className="field-error">{errors.name.message}</span>}
        </div>
        <div className="field">
          <label>Lodge Number</label>
          <input
            type="number"
            {...register("number", { required: "Number is required" })}
            placeholder={isEdit ? undefined : "e.g. 4"}
            min={1}
          />
          {errors.number && <span className="field-error">{errors.number.message}</span>}
        </div>
        <div className="field">
          <label>URL Slug <span className="hint">{isEdit ? "lowercase, letters/numbers/hyphens only" : "auto-generated — edit if needed"}</span></label>
          <input
            type="text"
            {...register("slug", {
              required: "Slug is required",
              pattern: { value: /^[a-z0-9-]+$/, message: "Lowercase letters, numbers, and hyphens only" },
              onChange: () => setSlugEdited(true),
            })}
          />
          {errors.slug && <span className="field-error">{errors.slug.message}</span>}
        </div>
        {isEdit && (
          <div className="field">
            <div className="checkbox-row">
              <input type="checkbox" id="active" {...register("active")} />
              <label htmlFor="active">Active</label>
            </div>
          </div>
        )}
        <div className="field">
          <label>Lodge Admin Emails <span className="hint">{isEdit ? "one per line or comma-separated — replaces existing admins on save" : "one per line or comma-separated"}</span></label>
          <textarea
            {...register("admin_emails")}
            rows={isEdit ? 4 : 3}
            placeholder={"admin@example.com\nanother@example.com"}
          />
        </div>
        {!isEdit && (
          <div className="field">
            <label>Initial Member Names <span className="hint">optional — one per line, adds to member roster</span></label>
            <textarea
              {...register("member_names")}
              rows={4}
              placeholder={"John Smith\nJane Doe"}
            />
          </div>
        )}
        <div className="actions">
          <button type="submit" className="btn primary" disabled={submitting}>
            {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Lodge"}
          </button>
          {isEdit && viewSiteUrl && (
            <a className="btn secondary" href={viewSiteUrl}>View Site</a>
          )}
          {isEdit && lodgeAdminUrl && (
            <a className="btn secondary" href={lodgeAdminUrl}>Lodge Admin</a>
          )}
        </div>
      </form>
    </>
  );
}
