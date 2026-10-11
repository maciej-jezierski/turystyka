export default function PageHeader({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <p className="text-sm font-bold uppercase tracking-wider text-accent">{eyebrow}</p>}
      <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{title}</h1>
      {text && <p className="mt-4 text-lg text-slate-600 sm:text-xl">{text}</p>}
    </div>
  );
}
