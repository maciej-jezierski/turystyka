import { peaksLabel } from "@/lib/utils";
import MountainIcon from "./MountainIcon";

export default function Peaks({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent" aria-hidden>
        <MountainIcon className="h-8 w-8" />
      </span>
      <p>
        <span className="block font-display text-4xl font-extrabold leading-none text-accent">{count}</span>
        <span className="text-slate-600">{peaksLabel(count).replace(/^\d+ /, "")} do zdobycia</span>
      </p>
    </div>
  );
}
