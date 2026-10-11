export default function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="rounded-full bg-green-100 px-3 py-1 text-base font-semibold text-green-800">
      Widoczna
    </span>
  ) : (
    <span className="rounded-full bg-yellow-100 px-3 py-1 text-base font-semibold text-yellow-800">
      Ukryta (szkic)
    </span>
  );
}
