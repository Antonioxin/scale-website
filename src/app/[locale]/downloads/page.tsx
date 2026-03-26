import { setRequestLocale } from "next-intl/server";
import { getCompanyInfo, getProducts } from "sanity/lib/queries";

type Props = { params: Promise<{ locale: string }> };

function pickLocale<T>(locale: string, zh: T, en: T): T {
  return locale === "zh" ? zh : en;
}

type ProductDoc = {
  name?: string;
  url?: string;
};

type DownloadItem = {
  id: string;
  name: string;
  url: string;
  category: "catalog" | "tech" | "cert";
  description: string;
  fileType: string;
};

function inferFileType(url: string): string {
  const lower = url.toLowerCase();
  if (lower.endsWith(".pdf")) return "PDF";
  if (lower.endsWith(".doc") || lower.endsWith(".docx")) return "DOC";
  if (lower.endsWith(".xls") || lower.endsWith(".xlsx")) return "XLS";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".webp")) return "IMG";
  return "FILE";
}

function inferDocCategory(name: string): "catalog" | "tech" {
  const n = name.toLowerCase();
  if (n.includes("catalog") || n.includes("目录") || n.includes("手册") || n.includes("brochure")) {
    return "catalog";
  }
  return "tech";
}

export default async function DownloadsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isZh = locale === "zh";

  const [products, companyInfo] = await Promise.all([getProducts(), getCompanyInfo()]);

  const docsFromProducts: DownloadItem[] = (products ?? []).flatMap((p) => {
    const productTitle = pickLocale(locale, p.title_zh, p.title_en) as string;
    const docs = (p.documents as ProductDoc[] | undefined) ?? [];
    return docs
      .filter((d) => d?.url)
      .map((d, idx) => {
        const name = d.name || (isZh ? `${productTitle} 文档` : `${productTitle} Document`);
        const category = inferDocCategory(name);
        return {
          id: `${p._id}-${idx}-${d.url}`,
          name,
          url: d.url as string,
          category,
          description:
            category === "catalog"
              ? isZh
                ? `来自产品 ${productTitle} 的目录资料`
                : `Catalog document from product ${productTitle}`
              : isZh
                ? `来自产品 ${productTitle} 的技术文档`
                : `Technical document from product ${productTitle}`,
          fileType: inferFileType(d.url as string),
        };
      });
  });

  const certs = ((companyInfo?.certifications as Array<{ _key?: string; url?: string }> | undefined) ?? [])
    .filter((c) => c?.url)
    .map((c, idx) => ({
      id: c._key ?? `cert-${idx}`,
      name: isZh ? `资质证书 ${idx + 1}` : `Certification ${idx + 1}`,
      url: c.url as string,
      category: "cert" as const,
      description: isZh ? "公司资质认证文件" : "Company certification file",
      fileType: inferFileType(c.url as string),
    }));

  const dedupMap = new Map<string, DownloadItem>();
  [...docsFromProducts, ...certs].forEach((item) => {
    if (!dedupMap.has(item.url)) dedupMap.set(item.url, item);
  });
  const all = Array.from(dedupMap.values());

  const groups = {
    catalog: all.filter((x) => x.category === "catalog"),
    tech: all.filter((x) => x.category === "tech"),
    cert: all.filter((x) => x.category === "cert"),
  };

  const sections = [
    {
      key: "catalog",
      title: isZh ? "产品目录" : "Product Catalogs",
      items: groups.catalog,
    },
    {
      key: "tech",
      title: isZh ? "技术文档" : "Technical Documents",
      items: groups.tech,
    },
    {
      key: "cert",
      title: isZh ? "资质证书" : "Certifications",
      items: groups.cert,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {isZh ? "下载中心" : "Download Center"}
        </h1>
      </header>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.key}>
            <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
            {!section.items.length ? (
              <p className="mt-4 text-slate-600">{isZh ? "暂无文档" : "No documents yet."}</p>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((doc) => (
                  <article
                    key={doc.id}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700">
                        {doc.fileType}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900">{doc.name}</h3>
                    </div>
                    <p className="mt-3 flex-1 text-sm text-slate-600">{doc.description}</p>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      {isZh ? "下载" : "Download"}
                    </a>
                  </article>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </section>
  );
}

