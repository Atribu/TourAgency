export function PageHero({
  eyebrow,
  title,
  summary,
  image,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-black/10 pt-20 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(13,31,37,0.9), rgba(13,31,37,0.56), rgba(13,31,37,0.25)), url('${image ?? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80"}')`,
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
        <p className="inline-flex border border-white/30 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] backdrop-blur">
          {eyebrow}
        </p>
        <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.08] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/84">
          {summary}
        </p>
      </div>
    </section>
  );
}
