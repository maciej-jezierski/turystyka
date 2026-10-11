export default function PageHeader({ title, text }: { title: string; text?: string }) {
  return (
    <div className="max-w-3xl">
      <h1 className="text-5xl sm:text-6xl">{title}</h1>
      {text && <p className="mt-4 max-w-[60ch] text-xl text-ink-soft">{text}</p>}
    </div>
  );
}
