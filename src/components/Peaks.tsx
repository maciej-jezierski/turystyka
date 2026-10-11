import { peaksLabel } from "@/lib/utils";

export default function Peaks({ count }: { count: number }) {
  return (
    <p>
      <span className="block font-display text-6xl font-extrabold leading-none [font-stretch:75%]">{count}</span>
      <span className="text-lg text-ink-soft">{peaksLabel(count).replace(/^\d+ /, "")} do zdobycia</span>
    </p>
  );
}
