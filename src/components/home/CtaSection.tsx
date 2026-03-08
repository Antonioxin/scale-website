import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function CtaSection() {
  const t = await getTranslations("HomeCta");

  return (
    <section className="bg-slate-900 py-16 sm:py-20" aria-label="Call to action">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          {t("title")}
        </h2>
        <Link
          href="/contact"
          className="mt-8 inline-flex rounded-lg bg-sky-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          {t("button")}
        </Link>
      </div>
    </section>
  );
}
