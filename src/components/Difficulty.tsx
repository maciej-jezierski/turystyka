import { DIFFICULTY_LABELS } from "@/lib/utils";

export default function Difficulty({ level }: { level: number }) {
  return (
    <p className="flex items-center gap-2 text-base">
      <span className="flex gap-1" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`inline-block h-3 w-6 rounded-full ${i <= level ? "bg-accent" : "bg-gray-200"}`}
          />
        ))}
      </span>
      <span className="text-gray-700">Trudność: {DIFFICULTY_LABELS[level]}</span>
    </p>
  );
}
