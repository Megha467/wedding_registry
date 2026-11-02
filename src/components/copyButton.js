import { useEffect, useState } from "react";
import { copyToClipboard } from "../utils/helpers";
import { useToast } from "./toast";

function CopyButton({ text, label = "Copy", className = "btn btn-secondary" }) {
  const showToast = useToast();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    if (await copyToClipboard(text)) {
      setCopied(true);
    } else {
      showToast("Couldn't copy, please copy the link manually.", "error");
    }
  };

  return (
    <button type="button" className={className} onClick={handleCopy}>
      {copied ? "Copied ✓" : label}
    </button>
  );
}

export default CopyButton;
