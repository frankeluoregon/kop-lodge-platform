interface Props {
  submitLabel: string;
  cancelUrl: string;
  submitting: boolean;
  onDelete?: () => void;
  deleteLabel?: string;
}

export default function FormActions({
  submitLabel,
  cancelUrl,
  submitting,
  onDelete,
  deleteLabel = "Delete",
}: Props) {
  return (
    <div className="actions">
      <button type="submit" className="btn primary" disabled={submitting}>
        {submitting ? "Saving…" : submitLabel}
      </button>
      <a href={cancelUrl} className="btn secondary">
        Cancel
      </a>
      {onDelete && (
        <button
          type="button"
          className="btn danger"
          disabled={submitting}
          onClick={onDelete}
        >
          {deleteLabel}
        </button>
      )}
    </div>
  );
}
