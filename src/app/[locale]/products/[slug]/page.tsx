import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { PortableText } from "@portabletext/react";
import { getProductBySlug, getRelatedProductsByCategorySlug } from "sanity/lib/queries";
import { urlFor } from "sanity/lib/image";
import ProductGallery from "./ProductGallery";

type Props = { params: Promise<{ locale: string; slug: string }> };

function pickLocale<T>(locale: string, zh: T, en: T): T {
  return locale === "zh" ? zh : en;
}

type SanityImage = { _type: string; asset?: { _ref: string } };

type SpecItem = {
  name_zh?: string;
  name_en?: string;
  value_zh?: string;
  value_en?: string;
};

type ProductDocument = { name?: string; url?: string };

export default async function ProductSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const title = pickLocale(locale, product.title_zh, product.title_en) as string;
  const images = product.images as SanityImage[] | undefined;
  const isZh = locale === "zh";
  const category = product.category as { title_zh?: string; title_en?: string; slug?: string } | undefined;
  const categoryName = category ? (pickLocale(locale, category.title_zh, category.title_en) as string) : "";
  const description = pickLocale(locale, product.description_zh, product.description_en);
  const features = pickLocale(locale, product.features_zh, product.features_en);
  const applications = pickLocale(locale, product.applications_zh, product.applications_en) as string[] | undefined;
  const specs = (product.specs as SpecItem[] | undefined) ?? [];
  const documents = (product.documents as ProductDocument[] | undefined) ?? [];

  const related =
    category?.slug
      ? await getRelatedProductsByCategorySlug({
          categorySlug: category.slug,
          excludeSlug: slug,
          limit: 4,
        })
      : [];

  return (
    <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/products" className="text-sm font-medium text-sky-600 hover:text-sky-700">
        ← {isZh ? "返回产品列表" : "Back to Products"}
      </Link>

      {/* 顶部：画廊 + 信息 */}
      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-start">
        <ProductGallery images={images} title={title} />

        <div>
          {categoryName && (
            <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              {categoryName}
            </span>
          )}
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>

          {/* 描述：富文本 */}
          <div className="prose prose-slate mt-6 max-w-none">
            {Array.isArray(description) && description.length ? (
              <PortableText value={description as any} />
            ) : (
              <p className="text-slate-600">
                {isZh ? "暂无产品描述。" : "No description yet."}
              </p>
            )}
          </div>

          {/* 浮动询盘按钮（移动端也可见） */}
          <Link
            href="/contact"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 sm:w-auto"
          >
            {isZh ? "获取报价" : "Get a Quote"}
          </Link>
        </div>
      </div>

      {/* 技术参数表 */}
      <section className="mt-14">
        <h2 className="text-xl font-bold text-slate-900">
          {isZh ? "技术参数" : "Specifications"}
        </h2>
        {!specs.length ? (
          <p className="mt-4 text-slate-600">{isZh ? "暂无参数。" : "No specs yet."}</p>
        ) : (
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-5 py-3 font-semibold">{isZh ? "参数名" : "Parameter"}</th>
                  <th className="px-5 py-3 font-semibold">{isZh ? "参数值" : "Value"}</th>
                </tr>
              </thead>
              <tbody>
                {specs.map((item, idx) => {
                  const name = pickLocale(locale, item.name_zh, item.name_en) ?? "";
                  const value = pickLocale(locale, item.value_zh, item.value_en) ?? "";
                  return (
                    <tr key={`${name}-${idx}`} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                      <td className="px-5 py-3 font-medium text-slate-900">{name || "—"}</td>
                      <td className="px-5 py-3 text-slate-700">{value || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 特点与应用场景 */}
      <section className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {isZh ? "产品特点" : "Key Features"}
          </h2>
          <div className="prose prose-slate mt-5 max-w-none">
            {Array.isArray(features) && features.length ? (
              <PortableText value={features as any} />
            ) : (
              <p className="text-slate-600">{isZh ? "暂无特点内容。" : "No feature details yet."}</p>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {isZh ? "应用场景" : "Applications"}
          </h2>
          {applications?.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {applications.map((a) => (
                <li key={a} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  {a}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-slate-600">{isZh ? "暂无应用场景。" : "No applications yet."}</p>
          )}
        </div>
      </section>

      {/* 文档下载区 */}
      <section className="mt-14">
        <h2 className="text-xl font-bold text-slate-900">
          {isZh ? "资料下载" : "Downloads"}
        </h2>
        {documents.filter((d) => d?.url).length ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {documents
              .filter((d) => d?.url)
              .map((doc, idx) => (
                <a
                  key={`${doc.url}-${idx}`}
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-200 hover:shadow-md"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {doc.name || (isZh ? "PDF 文档" : "PDF Document")}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{isZh ? "点击下载/打开" : "Open / Download"}</p>
                  </div>
                  <span className="rounded-xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition group-hover:bg-sky-500">
                    {isZh ? "下载" : "Download"}
                  </span>
                </a>
              ))}
          </div>
        ) : (
          <p className="mt-5 text-slate-600">{isZh ? "暂无可下载文档。" : "No documents yet."}</p>
        )}
      </section>

      {/* 相关产品推荐 */}
      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">
            {isZh ? "相关产品推荐" : "Related Products"}
          </h2>
          <Link href="/products" className="text-sm font-semibold text-sky-600 hover:text-sky-700">
            {isZh ? "查看全部" : "View all"} →
          </Link>
        </div>

        {!related?.length ? (
          <p className="mt-5 text-slate-600">{isZh ? "暂无相关产品。" : "No related products."}</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => {
              const rSlug = (p.slug as string) ?? "";
              const rTitle = pickLocale(locale, p.title_zh, p.title_en) as string;
              const rCat = p.category as { title_zh?: string; title_en?: string } | undefined;
              const rCatName = rCat ? (pickLocale(locale, rCat.title_zh, rCat.title_en) as string) : "";
              const rImages = p.images as SanityImage[] | undefined;
              const rImg = rImages?.[0];
              const rUrl = rImg ? urlFor(rImg)?.width(600).height(450).url() : null;

              return (
                <Link
                  key={(p._id as string) ?? rSlug}
                  href={rSlug ? `/products/${rSlug}` : "/products"}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
                >
                  <div className="aspect-[4/3] w-full bg-slate-100">
                    {rUrl ? (
                      <img src={rUrl} alt="" className="h-full w-full object-cover transition group-hover:opacity-95" />
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
                  <div className="p-4">
                    {rCatName && (
                      <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                        {rCatName}
                      </span>
                    )}
                    <h3 className="mt-2 text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-sky-700">
                      {rTitle}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 固定浮动询盘按钮（右下角） */}
      <Link
        href="/contact"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
      >
        <span>{isZh ? "获取报价" : "Get a Quote"}</span>
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12l-7.5 7.5M3 12h18" />
        </svg>
      </Link>
    </article>
  );
}
