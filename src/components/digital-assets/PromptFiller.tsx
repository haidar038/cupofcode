import { useMemo, useState } from "react";
import CopyButton from "../ui/CopyButton";

interface Props {
  template: string;
  variables: string[];
}

const toSafeId = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function PromptFiller({ template, variables }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const filledTemplate = useMemo(() => {
    return variables.reduce((acc, variable) => {
      const value = values[variable]?.trim();
      const pattern = new RegExp(`\\[${variable.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\]`, "g");
      return acc.replace(pattern, value || `{{${variable}}}`);
    }, template);
  }, [template, variables, values]);

  return (
    <div className="rounded-3xl border border-coc-line bg-coc-surface p-6 md:p-8">
      <div className="mb-6 border-b border-coc-line pb-4">
        <h3 className="text-lg font-bold text-coc-text">Sesuaikan Prompt</h3>
        <p className="mt-1 text-xs text-coc-muted">
          Isi variabel berikut untuk menghasilkan prompt final secara real-time.
        </p>
      </div>

      <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
        {variables.map((variable) => {
          const id = `prompt-var-${toSafeId(variable)}`;
          return (
            <div key={variable}>
              <label htmlFor={id} className="mb-2 block text-sm font-bold text-coc-text">
                {variable}
              </label>
              <input
                id={id}
                type="text"
                placeholder={`Masukkan ${variable.toLowerCase()}...`}
                value={values[variable] || ""}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setValues((prev) => ({ ...prev, [variable]: event.target.value }))
                }
                className="w-full rounded-xl border border-coc-line bg-gray-50 px-4 py-3 text-sm text-coc-text transition-all focus:border-coc-accent focus:outline-none focus:ring-1 focus:ring-coc-accent"
              />
            </div>
          );
        })}
      </form>

      <div className="mt-6 rounded-2xl border border-coc-line bg-gray-900 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Hasil Prompt</p>
          <span className="text-xs text-gray-400">{filledTemplate.length} karakter</span>
        </div>
        <pre className="max-h-72 whitespace-pre-wrap break-words overflow-y-auto font-mono text-sm leading-relaxed text-gray-200">
          {filledTemplate}
        </pre>
      </div>

      <div className="mt-4 flex justify-end">
        <CopyButton text={filledTemplate} label="Salin prompt final" />
      </div>
    </div>
  );
}
