import { client } from "./client";

/** 开发环境禁用缓存以实时看到 Sanity 数据；生产可按需改为 revalidate: 60 等 */
const fetchOptions = { next: { revalidate: 0 } as { revalidate: number } };

const productCategoryFields = `
  _id,
  title_zh,
  title_en,
  "slug": slug.current,
  description_zh,
  description_en,
  icon,
  order
`;

const productFields = `
  _id,
  title_zh,
  title_en,
  "slug": slug.current,
  category->{ ${productCategoryFields} },
  images,
  description_zh,
  description_en,
  specs,
  features_zh,
  features_en,
  applications_zh,
  applications_en,
  documents[]{
    name,
    "url": file.asset->url
  },
  featured,
  order
`;

const postFields = `
  _id,
  title_zh,
  title_en,
  "slug": slug.current,
  category,
  coverImage,
  publishedAt,
  excerpt_zh,
  excerpt_en,
  body_zh,
  body_en
`;

/** 获取所有产品分类（按 order 排序） */
export async function getProductCategories() {
  const result = await client.fetch<Array<{
    _id: string;
    title_zh: string;
    title_en: string;
    slug: string;
    description_zh?: string;
    description_en?: string;
    icon?: { _type: string; asset: { _ref: string } };
    order?: number;
  }>>(
    `*[_type == "productCategory"] | order(order asc) { ${productCategoryFields} }`,
    {},
    fetchOptions
  );
  if (process.env.NODE_ENV === "development") {
    console.log("[Sanity] getProductCategories count:", result?.length ?? 0, "sample:", result?.[0]?.title_zh);
  }
  return result;
}

/** 获取所有产品，支持按分类 slug 筛选 */
export async function getProducts(categorySlug?: string) {
  const filter = categorySlug
    ? `&& category->slug.current == $categorySlug`
    : "";
  const result = await client.fetch<Array<Record<string, unknown>>>(
    `*[_type == "product" ${filter}] | order(order asc) { ${productFields} }`,
    categorySlug ? { categorySlug } : {},
    fetchOptions
  );
  if (process.env.NODE_ENV === "development") {
    console.log("[Sanity] getProducts count:", result?.length ?? 0);
  }
  return result;
}

/** 根据 slug 获取单个产品详情 */
export async function getProductBySlug(slug: string) {
  return client.fetch<Record<string, unknown> | null>(
    `*[_type == "product" && slug.current == $slug][0] { ${productFields} }`,
    { slug },
    fetchOptions
  );
}

/** 获取同分类相关产品（排除当前产品），最多 N 个 */
export async function getRelatedProductsByCategorySlug(options: {
  categorySlug: string;
  excludeSlug: string;
  limit?: number;
}) {
  const { categorySlug, excludeSlug, limit = 4 } = options;
  return client.fetch<Array<Record<string, unknown>>>(
    `*[_type == "product" && slug.current != $excludeSlug && category->slug.current == $categorySlug]
      | order(order asc) [0...$limit] {
        _id,
        title_zh,
        title_en,
        "slug": slug.current,
        category->{ ${productCategoryFields} },
        images,
        description_zh,
        description_en
      }`,
    { categorySlug, excludeSlug, limit },
    fetchOptions
  );
}

/** 获取最新 N 篇文章 */
export async function getLatestPosts(limit: number = 3) {
  const result = await client.fetch<Array<Record<string, unknown>>>(
    `*[_type == "post"] | order(publishedAt desc) [0...$limit] { ${postFields} }`,
    { limit },
    fetchOptions
  );
  if (process.env.NODE_ENV === "development") {
    console.log("[Sanity] getLatestPosts count:", result?.length ?? 0, "sample:", result?.[0]?.title_zh);
  }
  return result;
}

/** 根据 slug 获取单篇文章 */
export async function getPostBySlug(slug: string) {
  return client.fetch<Record<string, unknown> | null>(
    `*[_type == "post" && slug.current == $slug][0] { ${postFields} }`,
    { slug },
    fetchOptions
  );
}

/** 获取推荐产品（首页等） */
export async function getFeaturedProducts(limit: number = 6) {
  return client.fetch<Array<Record<string, unknown>>>(
    `*[_type == "product" && featured == true] | order(order asc) [0...$limit] { ${productFields} }`,
    { limit },
    fetchOptions
  );
}
