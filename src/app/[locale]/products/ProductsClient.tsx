"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { urlFor } from "sanity/lib/image";

type SanityImage = { _type: string; asset?: { _ref: string } };

type Category = {
  _id: string;
  slug: string;
  title_zh: string;
  title_en: string;
};

type Product = {
  _id: string;
  slug: string;
  title_zh: string;
  title_en: string;
  images?: SanityImage[];
  category?: {
    _id?: string;
    slug?: string;
    title_zh?: string;
    title_en?: string;
  };
  description_zh?: unknown;
  description_en?: unknown;
  specs?: unknown;
};

function pickLocale<T>(locale: string, zh: T, en: T): T {
  return locale === "zh" ? zh : en;
}

function blocksToPlainText(value: unknown): string {
  if (!Array.isArray(value)) return "";
  const firstText =
    value
      .map((block) => {
        if (!block || typeof block !== "object") return "";
        const b = block as { _type?: string; children?: Array<{ text?: string }> };
        if (b._type !== "block" || !Array.isArray(b.children)) return "";
        return b.children.map((c) => c?.text ?? "").join("");
      })
      .join("\n")
      .trim() ?? "";

  return firstText;
}

function normalizeSearch(s: string): string {
  return s.trim().toLowerCase();
}

function getProductSearchText(product: Product, locale: string): string {
  const title = pickLocale(locale, product.title_zh, product.title_en) ?? "";
  const descBlocks = pickLocale(locale, product.description_zh, product.description_en);
  const desc = blocksToPlainText(descBlocks);

  // specs: 这里先做尽可能宽松的字符串化，后续如果你增加了“型号”等字段可再精准提取
  const specsText = (() => {
    try {
      if (Array.isArray(product.specs)) {
        return product.specs
          .map((item) => {
            if (!item || typeof item !== "object") return "";
            const it = item as Record<string, unknown>;
            const n = pickLocale(locale, it.name_zh as string, it.name_en as string) ?? "";
            const v = pickLocale(locale, it.value_zh as string, it.value_en as string) ?? "";
            return [n, v].filter(Boolean).join(":");
          })
          .join(" ");
      }
      return typeof product.specs === "string" ? product.specs : "";
    } catch {
      return "";
    }
  })();

  return [title, desc, specsText].filter(Boolean).join(" ");
}

type Props = {
  locale: string;
  products: Product[];
  categories: Category[];
};

const PAGE_SIZE = 12;

export default function ProductsClient({ locale, products, categories }: Props) {
  const t = useTranslations("ProductsPage");
  const isZh = locale === "zh";

  const tabs = useMemo(() => {
    const all = {
      id: "all",
      label: isZh ? "全部" : "All",
      slug: null as string | null,
    };

    const byZhTitle = new Map((categories ?? []).map((c) => [c.title_zh, c]));

    // 固定标签顺序（优先用 Sanity 里对应分类的 slug 来做筛选）
    const fixed = [
      { id: "industrial", zh: "工业秤", en: "Industrial" },
      { id: "commercial", zh: "商用秤", en: "Commercial" },
      { id: "precision", zh: "精密天平", en: "Precision" },
      { id: "custom", zh: "定制方案", en: "Custom" },
    ].map((x) => {
      const matched = byZhTitle.get(x.zh);
      return {
        id: x.id,
        label: isZh ? x.zh : x.en,
        slug: matched?.slug ?? null,
        disabled: !matched?.slug,
      };
    });

    // 额外分类（不在固定 4 个里面的）放到后面，避免丢数据
    const fixedZhSet = new Set(["工业秤", "商用秤", "精密天平", "定制方案"]);
    const extra = (categories ?? [])
      .filter((c) => !fixedZhSet.has(c.title_zh))
      .map((c) => ({
        id: c._id,
        slug: c.slug,
        label: pickLocale(locale, c.title_zh, c.title_en),
        disabled: false,
      }));

    return [all, ...fixed, ...extra];
  }, [categories, isZh, locale]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = normalizeSearch(query);
    const byCategory = (products ?? []).filter((p) => {
      if (!activeCategory) return true;
      const catSlug = p.category?.slug ?? "";
      return catSlug === activeCategory;
    });

    if (!q) return byCategory;
    return byCategory.filter((p) => normalizeSearch(getProductSearchText(p, locale)).includes(q));
  }, [activeCategory, locale, products, query]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visible.length;

  function onSelectCategory(slug: string | null) {
    setActiveCategory(slug);
    setVisibleCount(PAGE_SIZE);
  }

  function onQueryChange(value: string) {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      {/* 顶部标题与描述 */}
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {isZh ? "产品中心" : t("title")}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          {isZh
            ? "浏览我们覆盖工业、商用与精密称重场景的产品系列，支持按分类筛选与关键词搜索。"
            : "Explore our weighing solutions across industrial, commercial and precision scenarios. Filter by category or search by keywords."}
        </p>
      </div>

      {/* 筛选区域 */}
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const selected = (tab.slug ?? null) === (activeCategory ?? null);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectCategory(tab.slug)}
                  disabled={"disabled" in tab ? Boolean((tab as any).disabled) : false}
                  className={[
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    selected
                      ? "bg-sky-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="w-full lg:max-w-md">
            <label className="sr-only" htmlFor="product-search">
              {isZh ? "搜索产品" : "Search products"}
            </label>
            <div className="relative">
              <input
                id="product-search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder={isZh ? "搜索产品名称或型号…" : "Search by name or model…"}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
              />
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 7.5 15a7.5 7.5 0 0 0 9.15 1.65Z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {isZh ? `共 ${filtered.length} 个结果` : `${filtered.length} results`}
            </p>
          </div>
        </div>
      </div>

      {/* 产品网格 */}
      {!products?.length ? (
        <p className="mt-10 text-slate-600">{isZh ? "暂无产品" : "No products yet."}</p>
      ) : !filtered.length ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="text-slate-600">{isZh ? "未找到匹配的产品，请尝试更换筛选或关键词。" : "No matching products. Try another filter or keyword."}</p>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => {
              const slug = product.slug ?? "";
              const title = pickLocale(locale, product.title_zh, product.title_en) ?? "";
              const categoryName = product.category
                ? (pickLocale(locale, product.category.title_zh, product.category.title_en) as string) ?? ""
                : "";
              const descBlocks = pickLocale(locale, product.description_zh, product.description_en);
              const shortDesc = blocksToPlainText(descBlocks).split("\n").find(Boolean) ?? "";

              const firstImage = product.images?.[0];
              const imageUrl = firstImage ? urlFor(firstImage)?.width(720).height(540).url() : null;

              return (
                <Link
                  key={product._id ?? slug}
                  href={slug ? `/products/${slug}` : "/products"}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
                >
                  <div className="aspect-[4/3] w-full bg-slate-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt=""
                        className="h-full w-full object-cover transition group-hover:opacity-95"
                      />
                    ) : (
                      <div
                        className="h-full w-full bg-cover bg-center"
                        style={{
                          backgroundImage:
                            "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 50%, #64748b 100%)",
                        }}
                      />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-3">
                      {categoryName ? (
                        <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                          {categoryName}
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {isZh ? "未分类" : "Uncategorized"}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-slate-400">
                        {isZh ? "详情" : "Details"} →
                      </span>
                    </div>

                    <h2 className="mt-3 text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-sky-700">
                      {title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-2">
                      {shortDesc || (isZh ? "点击查看产品参数与应用场景。" : "Click to view specs and applications.")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 加载更多 */}
          <div className="mt-10 flex flex-col items-center gap-3">
            {hasMore && (
              <button
                type="button"
                onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length))}
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                {isZh ? "加载更多" : "Load more"}
              </button>
            )}
            <p className="text-xs text-slate-500">
              {isZh
                ? `已显示 ${visible.length} / ${filtered.length}`
                : `Showing ${visible.length} / ${filtered.length}`}
            </p>
          </div>
        </>
      )}
    </section>
  );
}

