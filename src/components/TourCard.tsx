import Link from "next/link";
import Image from "next/image";
import { formatPrice, type Tour } from "@/lib/catalog";
import { type Locale } from "@/lib/site";
import { t } from "@/lib/translations";

export function TourCard({ tour, locale }: { tour: Tour; locale: Locale }) {
  const copy = t(locale);

  return (
    <article className="grid overflow-hidden border border-black/10 bg-white shadow-sm">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-ink)]">
        <Image
          alt={tour.title[locale]}
          className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          src={tour.image}
          unoptimized
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {tour.tags[locale].slice(0, 2).map((tag) => (
            <span
              className="bg-white px-2 py-1 text-xs font-black text-[var(--color-ink)]"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-4 p-4">
        <div>
          <h3 className="text-xl font-black leading-tight text-[var(--color-ink)]">
            {tour.title[locale]}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-muted)]">
            {tour.summary[locale]}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <Meta label={copy.labels.duration} value={`${tour.durationDays} gün`} />
          <Meta
            label={copy.labels.departure}
            value={tour.departures[locale].join(", ")}
          />
          <Meta label={copy.labels.transport} value={tour.transport[locale]} />
          <Meta label={copy.labels.visa} value={tour.visa[locale]} />
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-black/10 pt-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">
              {copy.labels.priceFrom}
            </p>
            <p className="text-2xl font-black text-[var(--color-coral)]">
              {formatPrice(tour.priceFrom, tour.currency)}
            </p>
          </div>
          <Link
            className="button-primary min-w-36"
            href={`/${locale}/turlar/${tour.slugs[locale]}`}
          >
            {copy.actions.viewDetails}
          </Link>
        </div>
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-black/10 bg-[var(--color-sand)] p-3">
      <p className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="mt-1 font-bold text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
