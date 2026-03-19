import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getProductCategories } from "sanity/lib/queries";
import { urlFor } from "sanity/lib/image";

const FALLBACK_ICONS = [
  <svg key="industrial" className="h-12 w-12 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m1.745-1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>,
  <svg key="commercial" className="h-12 w-12 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
  <svg key="precision" className="h-12 w-12 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" /></svg>,
  <svg key="custom" className="h-12 w-12 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 6.75l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>,
];

type ProductCategoriesSectionProps = {
  locale: string;
};

function pickLocale<T>(locale: string, zh: T, en: T): T {
  return locale === "zh" ? zh : en;
}

export default async function ProductCategoriesSection({ locale }: ProductCategoriesSectionProps) {
  const t = await getTranslations("HomeProducts");
  const categories = await getProductCategories();
  if (process.env.NODE_ENV === "development") {
    console.log("[ProductCategoriesSection] locale:", locale, "categories length:", categories?.length, "first:", categories?.[0]);
  }
  const isZh = locale === "zh";

  if (!categories?.length) {
    return (
      <section className="bg-slate-50 py-16 sm:py-20 lg:py-24" aria-labelledby="products-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="products-heading" className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">
            {t("sectionTitle")}
          </h2>
          <p className="mt-8 text-center text-slate-600">{isZh ? "暂无分类数据" : "No categories yet."}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-24" aria-labelledby="products-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="products-heading" className="text-center text-3xl font-bold text-slate-900 sm:text-4xl">
          {t("sectionTitle")}
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => {
            const title = pickLocale(locale, cat.title_zh, cat.title_en);
            const description = pickLocale(locale, cat.description_zh, cat.description_en);
            const iconUrl = cat.icon ? urlFor(cat.icon)?.width(96).height(96).url() : null;
            return (
              <Link
                key={cat._id}
                href="/products"
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-100/50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                <div className="flex h-14 items-center">
                  {iconUrl ? (
                    <img src={iconUrl} alt="" className="h-12 w-12 object-contain text-sky-600" />
                  ) : (
                    FALLBACK_ICONS[i % FALLBACK_ICONS.length]
                  )}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-sky-700">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {description || (isZh ? "—" : "—")}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
