interface Props {
  error?: string;
  success?: string;
}

export default function FormMessage({ error, success }: Props) {
  if (!error && !success) return null;
  if (error) return <div className="error-msg">{error}</div>;
  return <div className="success-msg">{success}</div>;
}
