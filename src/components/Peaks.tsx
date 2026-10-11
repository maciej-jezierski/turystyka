import { peaksLabel } from "@/lib/utils";

export default function Peaks({ count, large }: { count: number; large?: boolean }) {
  return (
    <p className={`flex items-center gap-2 ${large ? "text-xl" : "text-lg"}`}>
      <svg viewBox="0 0 24 24" className={large ? "h-7 w-7" : "h-6 w-6"} aria-hidden>
        <path d="M2 20 L9 8 L13 14 L16 10 L22 20Z" fill="#166534" />
        <path d="M9 8 L11 11.4 L9.6 11 L8.4 12 L7.6 10.6Z" fill="#fff" />
      </svg>
      <span>
        <strong className="text-accent">{peaksLabel(count)}</strong>{" "}
        <span className="text-gray-700">do zdobycia</span>
      </span>
    </p>
  );
}
