import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const newsKeys = ["news1", "news2", "news3"] as const;

export default async function NewsSection() {
  const t = await getTranslations("HomeNews");

  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="news-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
          <h2 id="news-heading" className="text-3xl font-bold text-slate-900 sm:text-4xl">
            {t("sectionTitle")}
          </h2>
          <Link
            href="/news"
            className="text-sm font-semibold text-sky-600 transition hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            {t("viewAll")} →
          </Link>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {newsKeys.map((key) => (
            <article key={key} className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-shadow hover:shadow-md">
              <div className="aspect-[16/10] w-full bg-slate-200">
                {/* 封面占位：渐变模拟图片 */}
                <div
                  className="h-full w-full bg-cover bg-center opacity-90 transition group-hover:opacity-100"
                  style={{
                    backgroundImage: `linear-gradient(135deg, #94a3b8 0%, #64748b 50%, #475569 100%)`,
                  }}
                />
              </div>
              <div className="p-5">
                <time className="text-sm font-medium text-slate-500" dateTime={key === "news1" ? "2024-01-15" : key === "news2" ? "2024-02-20" : "2024-03-05"}>
                  {t(`${key}.date`)}
                </time>
                <h3 className="mt-2 text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-sky-700">
                  {t(`${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-2">
                  {t(`${key}.excerpt`)}
                </p>
                <Link
                  href="/news"
                  className="mt-3 inline-block text-sm font-semibold text-sky-600 transition hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  {t("viewAll")} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
