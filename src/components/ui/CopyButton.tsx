import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = "Salin" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg border border-coc-line bg-coc-surface px-3 py-1.5 text-xs font-medium text-coc-muted transition-all hover:border-coc-accent hover:text-coc-text"
      aria-label={copied ? "Tersalin" : label}
    >
      {copied ? (
        <>
          <Check width="14" height="14" className="text-green-600" />
          <span className="text-green-600">Tersalin!</span>
        </>
      ) : (
        <>
          <Copy width="14" height="14" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
