"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { urlFor } from "sanity/lib/image";

type CoverImage = { _type: string; asset?: { _ref: string } };

type Post = {
  _id: string;
  slug: string;
  title_zh: string;
  title_en: string;
  excerpt_zh?: string;
  excerpt_en?: string;
  category?: string;
  coverImage?: CoverImage;
  publishedAt?: string;
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

type Props = {
  locale: string;
  posts: Post[];
};

const TAB_DEFS = [
  { key: "all", zh: "全部", en: "All", category: null as string | null },
  { key: "company", zh: "公司新闻", en: "Company News", category: "company" },
  { key: "industry", zh: "行业资讯", en: "Industry News", category: "industry" },
  { key: "product", zh: "产品发布", en: "Product Release", category: "product" },
];

export default function NewsClient({ locale, posts }: Props) {
  const t = useTranslations("NewsPage");
  const isZh = locale === "zh";

  const [activeKey, setActiveKey] = useState<(typeof TAB_DEFS)[number]["key"]>("all");
  const [visibleCount, setVisibleCount] = useState(9);

  const activeCategory = useMemo(() => {
    return TAB_DEFS.find((x) => x.key === activeKey)?.category ?? null;
  }, [activeKey]);

  const filtered = useMemo(() => {
    if (!activeCategory) return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [activeCategory, posts]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  function onTabClick(key: (typeof TAB_DEFS)[number]["key"]) {
    setActiveKey(key);
    setVisibleCount(9);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      {/* 顶部 */}
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {t("title")}
        </h1>
      </header>

      {/* 分类筛选 */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {TAB_DEFS.map((tab) => {
            const selected = tab.key === activeKey;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabClick(tab.key)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2",
                  selected ? "bg-sky-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                ].join(" ")}
              >
                {isZh ? tab.zh : tab.en}
              </button>
            );
          })}
        </div>
      </div>

      {/* 卡片列表 */}
      {!posts?.length ? (
        <p className="mt-10 text-slate-600">{isZh ? "暂无新闻。" : "No news yet."}</p>
      ) : !filtered.length ? (
        <p className="mt-10 text-slate-600">
          {isZh ? "该分类下暂无文章。" : "No posts in this category."}
        </p>
      ) : (
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => {
              const title = pickLocale(locale, post.title_zh, post.title_en);
              const excerpt = pickLocale(locale, post.excerpt_zh ?? "", post.excerpt_en ?? "");
              const category = post.category;
              const categoryLabel =
                TAB_DEFS.find((x) => x.category === category)?.[isZh ? "zh" : "en"] ?? (isZh ? "新闻" : "News");
              const coverUrl = post.coverImage ? urlFor(post.coverImage)?.width(800).height(480).url() : null;
              const publishedAt = post.publishedAt;

              return (
                <article
                  key={post._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
                >
                  <Link href={post.slug ? `/news/${post.slug}` : "/news"}>
                    <div className="aspect-[16/10] w-full bg-slate-200">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt=""
                          className="h-full w-full object-cover transition group-hover:opacity-95"
                        />
                      ) : (
                        <div
                          className="h-full w-full bg-cover bg-center opacity-90"
                          style={{
                            backgroundImage: "linear-gradient(135deg, #94a3b8 0%, #64748b 50%, #475569 100%)",
                          }}
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                          {categoryLabel}
                        </span>
                        <time className="text-xs font-medium text-slate-500" dateTime={publishedAt ?? undefined}>
                          {formatDate(publishedAt, locale)}
                        </time>
                      </div>
                      <h2 className="mt-3 text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-sky-700">
                        {title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-2">
                        {excerpt || "—"}
                      </p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          {/* 加载更多 */}
          <div className="mt-10 flex flex-col items-center gap-3">
            {hasMore && (
              <button
                type="button"
                onClick={() => setVisibleCount((c) => Math.min(c + 9, filtered.length))}
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                {isZh ? "加载更多" : "Load more"}
              </button>
            )}
            <p className="text-xs text-slate-500">
              {isZh ? `已显示 ${visible.length} / ${filtered.length}` : `Showing ${visible.length} / ${filtered.length}`}
            </p>
          </div>
        </>
      )}
    </section>
  );
}

