import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPostsForList } from "sanity/lib/queries";
import NewsClient from "./NewsClient";

type Props = { params: Promise<{ locale: string }> };

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getTranslations("NewsPage");
  const posts = await getPostsForList(100);
  return <NewsClient locale={locale} posts={posts as any} />;
}
