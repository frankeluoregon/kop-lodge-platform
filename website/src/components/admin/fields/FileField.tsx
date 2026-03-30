import { useRef, useState, useCallback, forwardRef, useImperativeHandle } from "react";

interface Props {
  label: string;
  hint?: string;
  accept?: string;
  onFileSelect?: (file: File) => void;
  previewUrl?: string | null;
  previewStyle?: React.CSSProperties;
}

export interface FileFieldHandle {
  files: FileList | null;
}

const FileField = forwardRef<FileFieldHandle, Props>(({
  label,
  hint,
  accept = "image/*",
  onFileSelect,
  previewUrl,
  previewStyle,
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<string | null>(previewUrl || null);

  useImperativeHandle(ref, () => ({
    get files() { return inputRef.current?.files ?? null; },
  }));

  const handleChange = useCallback(() => {
    const file = inputRef.current?.files?.[0];
    if (file) {
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
      onFileSelect?.(file);
    }
  }, [onFileSelect]);

  return (
    <div className="field">
      <label>
        {label}
        {hint && <span className="hint">{hint}</span>}
      </label>
      <div className="file-upload">
        <button type="button" className="file-upload-btn" onClick={() => inputRef.current?.click()}>
          Choose File
        </button>
        {fileName && <span className="file-upload-name">{fileName}</span>}
      </div>
      <input type="file" accept={accept} ref={inputRef} onChange={handleChange} />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ marginTop: 8, ...previewStyle }}
        />
      )}
    </div>
  );
});

FileField.displayName = "FileField";
export default FileField;
