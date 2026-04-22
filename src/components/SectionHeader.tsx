export function SectionHeader({
  eyebrow,
  title,
  summary,
}: {
  eyebrow?: string;
  title: string;
  summary?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-coral)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-3xl font-black leading-tight text-[var(--color-ink)] sm:text-4xl">
        {title}
      </h2>
      {summary ? (
        <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">
          {summary}
        </p>
      ) : null}
    </div>
  );
}
