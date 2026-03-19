import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { getPostBySlug } from "sanity/lib/queries";
import { urlFor } from "sanity/lib/image";
import { Link } from "@/i18n/navigation";

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

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/news" className="text-sm font-medium text-sky-600 hover:text-sky-700">
        ← {locale === "zh" ? "返回新闻" : "Back to News"}
      </Link>
      {imageUrl && (
        <div className="mt-6 aspect-video overflow-hidden rounded-xl bg-slate-200">
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        </div>
      )}
      <time className="mt-6 block text-sm text-slate-500" dateTime={(post.publishedAt as string) ?? undefined}>
        {formatDate(post.publishedAt as string, locale)}
      </time>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
      {excerpt && <p className="mt-4 text-lg text-slate-600">{excerpt}</p>}
      <div className="prose prose-slate mt-8">
        {/* TODO: 使用 @portabletext/react 渲染 body_zh/body_en */}
        <p className="text-slate-600">{locale === "zh" ? "正文内容可在后续接入 Portable Text 渲染。" : "Body content can be rendered with Portable Text later."}</p>
      </div>
    </article>
  );
}
