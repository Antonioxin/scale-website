import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getLatestPosts } from "sanity/lib/queries";
import { urlFor } from "sanity/lib/image";

type NewsSectionProps = {
  locale: string;
};

function pickLocale<T>(locale: string, zh: T, en: T): T {
  return locale === "zh" ? zh : en;
}

function formatDate(dateStr: string | undefined, locale: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return locale === "zh"
    ? d.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })
    : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default async function NewsSection({ locale }: NewsSectionProps) {
  const t = await getTranslations("HomeNews");
  const posts = await getLatestPosts(3);
  if (process.env.NODE_ENV === "development") {
    console.log("[NewsSection] locale:", locale, "posts length:", posts?.length, "first:", posts?.[0]?.title_zh);
  }
  const isZh = locale === "zh";

  if (!posts?.length) {
    return (
      <section className="bg-white py-16 sm:py-20" aria-labelledby="news-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="news-heading" className="text-3xl font-bold text-slate-900 sm:text-4xl">
            {t("sectionTitle")}
          </h2>
          <p className="mt-8 text-slate-600">{isZh ? "暂无新闻" : "No news yet."}</p>
        </div>
      </section>
    );
  }

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
          {posts.map((post) => {
            const slug = (post.slug as string) ?? "";
            const title = pickLocale(locale, post.title_zh, post.title_en) as string;
            const excerpt = pickLocale(locale, post.excerpt_zh, post.excerpt_en) as string;
            const coverImage = post.coverImage as { _type: string; asset?: { _ref: string } } | undefined;
            const imageUrl = coverImage ? urlFor(coverImage)?.width(600).height(375).url() : null;
            const publishedAt = post.publishedAt as string | undefined;
            return (
              <article
                key={post._id as string}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="aspect-[16/10] w-full bg-slate-200">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt=""
                      className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                    />
                  ) : (
                    <div
                      className="h-full w-full bg-cover bg-center opacity-90 transition group-hover:opacity-100"
                      style={{
                        backgroundImage: `linear-gradient(135deg, #94a3b8 0%, #64748b 50%, #475569 100%)`,
                      }}
                    />
                  )}
                </div>
                <div className="p-5">
                  <time className="text-sm font-medium text-slate-500" dateTime={publishedAt ?? undefined}>
                    {formatDate(publishedAt, locale)}
                  </time>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-sky-700">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-2">
                    {excerpt || "—"}
                  </p>
                  <Link
                    href={slug ? `/news/${slug}` : "/news"}
                    className="mt-3 inline-block text-sm font-semibold text-sky-600 transition hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                  >
                    {t("viewAll")} →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
