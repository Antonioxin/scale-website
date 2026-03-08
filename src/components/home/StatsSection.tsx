import { getTranslations } from "next-intl/server";

const statKeys = [
  { value: "years", label: "yearsLabel" },
  { value: "countries", label: "countriesLabel" },
  { value: "customers", label: "customersLabel" },
  { value: "models", label: "modelsLabel" },
] as const;

export default async function StatsSection() {
  const t = await getTranslations("HomeStats");

  return (
    <section className="border-y border-slate-200 bg-white py-16 sm:py-20" aria-label="Company achievements">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {statKeys.map(({ value, label }) => (
            <div
              key={value}
              className="text-center"
            >
              <div className="text-4xl font-bold tracking-tight text-sky-600 sm:text-5xl">
                {t(value)}
              </div>
              <div className="mt-2 text-base font-medium text-slate-700 sm:text-lg">
                {t(label)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
