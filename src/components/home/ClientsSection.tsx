import { getTranslations } from "next-intl/server";

const PLACEHOLDER_COUNT = 8;

export default async function ClientsSection() {
  const t = await getTranslations("HomeClients");

  return (
    <section className="bg-slate-50 py-16 sm:py-20" aria-labelledby="clients-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="clients-heading" className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">
          {t("sectionTitle")}
        </h2>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
            <div
              key={i}
              className="flex h-16 w-32 flex-shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-400 sm:h-20 sm:w-40"
              aria-hidden
            >
              <span className="text-xs font-medium">Logo {i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
