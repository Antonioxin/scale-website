import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPostBySlug } from "sanity/lib/queries";
import { urlFor } from "sanity/lib/image";
import { getOtherLatestPosts } from "sanity/lib/queries";
import { Link } from "@/i18n/navigation";
import { PortableText } from "@portabletext/react";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
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

export default async function NewsSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const title = pickLocale(locale, post.title_zh, post.title_en) as string;
  const excerpt = pickLocale(locale, post.excerpt_zh, post.excerpt_en) as string;
  const coverImage = post.coverImage as { _type: string; asset?: { _ref: string } } | undefined;
  const imageUrl = coverImage ? urlFor(coverImage)?.width(1200).height(630).url() : null;
  const publishedAt = post.publishedAt as string | undefined;
  const category = post.category as string | undefined;
  const isZh = locale === "zh";
  const categoryLabel =
    category === "company"
      ? isZh
        ? "公司新闻"
        : "Company News"
      : category === "industry"
        ? isZh
          ? "行业资讯"
          : "Industry News"
        : category === "product"
          ? isZh
            ? "产品发布"
            : "Product Release"
          : isZh
            ? "新闻"
            : "News";

  const body = pickLocale(locale, post.body_zh, post.body_en) as any;
  const related = await getOtherLatestPosts({ excludeSlug: slug, limit: 3 });

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/news" className="text-sm font-medium text-sky-600 hover:text-sky-700">
        ← {isZh ? "返回新闻列表" : "Back to News"}
      </Link>

      {imageUrl && (
        <div className="mt-6 aspect-video overflow-hidden rounded-xl bg-slate-200">
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
          {categoryLabel}
        </span>
        <time className="text-sm text-slate-500" dateTime={publishedAt ?? undefined}>
          {formatDate(publishedAt, locale)}
        </time>
      </div>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
      {excerpt && <p className="mt-4 text-lg text-slate-600">{excerpt}</p>}

      {/* 正文（支持图文混排） */}
      <div className="prose prose-slate mt-8 max-w-none">
        <PortableText
          value={body}
          components={{
            types: {
              image: ({ value }: { value: any }) => {
                const u = urlFor(value)?.width(1200).height(800).url() ?? null;
                if (!u) return null;
                const alt = value?.alt ?? "";
                const caption = value?.caption ?? "";
                return (
                  <figure className="mt-6">
                    <img src={u} alt={alt} className="rounded-xl border border-slate-200" />
                    {caption ? <figcaption className="mt-2 text-sm text-slate-500">{caption}</figcaption> : null}
                  </figure>
                );
              },
            },
          }}
        />
      </div>

      {/* 底部：返回 + 推荐 */}
      <div className="mt-14">
        <Link href="/news" className="text-sm font-medium text-sky-600 hover:text-sky-700">
          ← {isZh ? "返回新闻列表" : "Back to News"}
        </Link>

        {related?.length ? (
          <section className="mt-8">
            <h2 className="text-xl font-bold text-slate-900">
              {isZh ? "最新推荐" : "Latest Recommendations"}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => {
                const rSlug = (p.slug as string) ?? "";
                const rTitle = pickLocale(locale, p.title_zh, p.title_en) as string;
                const rCover = p.coverImage as { _type: string; asset?: { _ref: string } } | undefined;
                const rCoverUrl = rCover ? urlFor(rCover)?.width(600).height(375).url() : null;
                const rDate = p.publishedAt as string | undefined;
                const rCategory = p.category as string | undefined;
                const rCatLabel =
                  rCategory === "company"
                    ? isZh
                      ? "公司新闻"
                      : "Company News"
                    : rCategory === "industry"
                      ? isZh
                        ? "行业资讯"
                        : "Industry News"
                      : rCategory === "product"
                        ? isZh
                          ? "产品发布"
                          : "Product Release"
                        : isZh
                          ? "新闻"
                          : "News";
                return (
                  <Link
                    key={(p._id as string) ?? rSlug}
                    href={rSlug ? `/news/${rSlug}` : "/news"}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
                  >
                    <div className="aspect-[16/10] bg-slate-200">
                      {rCoverUrl ? (
                        <img src={rCoverUrl} alt="" className="h-full w-full object-cover transition group-hover:opacity-95" />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                        {rCatLabel}
                      </span>
                      <h3 className="mt-2 text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-sky-700">
                        {rTitle}
                      </h3>
                      <time className="mt-2 block text-xs text-slate-500">{formatDate(rDate, locale)}</time>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
