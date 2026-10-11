"use client";

export default function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={`relative inline-block h-9 w-16 shrink-0 rounded-full transition peer-focus-visible:outline-3 peer-focus-visible:outline-accent ${checked ? "bg-accent" : "bg-gray-300"}`}
      >
        <span
          className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow transition-all ${checked ? "left-8" : "left-1"}`}
        />
      </span>
      <span>
        <span className="block text-lg font-semibold">{label}</span>
        {hint && <span className="block text-base text-gray-600">{hint}</span>}
      </span>
    </label>
  );
}
