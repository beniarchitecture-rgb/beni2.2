import { useState } from "react";

import { formatApiError, uploadImage } from "@/lib/api";

import { Upload } from "lucide-react";

export default function UploadButton({ onUploaded, multiple = false, label = "Envoyer une image", testId }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onChange = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setError("");
    setBusy(true);
    try {
      for (const f of files) {
        const res = await uploadImage(f);
        onUploaded(res.url);
      }
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="inline-flex items-center gap-3 flex-wrap">
      <label
        className="btn-outline inline-flex items-center gap-2"
        style={{ cursor: busy ? "wait" : "pointer", opacity: busy ? 0.6 : 1 }}
        data-testid={testId}
      >
        <Upload className="h-4 w-4" />
        {busy ? "Envoi en cours..." : label}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple={multiple}
          onChange={onChange}
          disabled={busy}
          style={{ display: "none" }}
          data-testid={`${testId}-input`}
        />
      </label>
      {error && (
        <span style={{ color: "#f87171", fontSize: "0.75rem" }} data-testid={`${testId}-error`}>
          {error}
        </span>
      )}
    </span>
  );
}
