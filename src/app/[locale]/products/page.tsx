import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { getProducts, getProductCategories } from "sanity/lib/queries";
import ProductsClient from "./ProductsClient";

type Props = { params: Promise<{ locale: string }> };

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getTranslations("ProductsPage");
  const [products, categories] = await Promise.all([
    getProducts(),
    getProductCategories(),
  ]);

  if (process.env.NODE_ENV === "development") {
    console.log("[ProductsPage] locale:", locale, "products:", products?.length, "categories:", categories?.length);
  }

  return (
    <ProductsClient
      locale={locale}
      products={products as any}
      categories={categories as any}
    />
  );
}
