import { setRequestLocale } from "next-intl/server";
import { PortableText } from "@portabletext/react";
import { getCompanyInfo } from "sanity/lib/queries";
import StatsSection from "@/components/home/StatsSection";
import CtaSection from "@/components/home/CtaSection";
import CertificationsGallery from "./CertificationsGallery";

type Props = { params: Promise<{ locale: string }> };

function pickLocale<T>(locale: string, zh: T, en: T): T {
  return locale === "zh" ? zh : en;
}

type Milestone = {
  _key?: string;
  year?: string;
  title_zh?: string;
  title_en?: string;
  description_zh?: string;
  description_en?: string;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isZh = locale === "zh";
  const companyInfo = await getCompanyInfo();

  const about = companyInfo
    ? pickLocale(locale, companyInfo.about_zh, companyInfo.about_en)
    : null;
  const milestones = (companyInfo?.milestones as Milestone[] | undefined) ?? [];
  const certifications =
    (companyInfo?.certifications as Array<{ _key?: string; url?: string }> | undefined) ?? [];

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* 顶部简介 */}
        <header className="max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {isZh ? "关于我们" : "About Us"}
          </h1>
          <div className="prose prose-slate mt-6 max-w-none">
            {Array.isArray(about) && about.length ? (
              <PortableText value={about as any} />
            ) : (
              <p className="text-slate-600">
                {isZh
                  ? "公司简介暂未录入，请在 Sanity Studio 的 Company Info 中补充内容。"
                  : "Company introduction is not available yet. Please fill it in Company Info in Sanity Studio."}
              </p>
            )}
          </div>
        </header>

        {/* 时间线 */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-slate-900">
            {isZh ? "发展历程" : "Milestones"}
          </h2>

          {!milestones.length ? (
            <p className="mt-5 text-slate-600">
              {isZh ? "暂无里程碑数据。" : "No milestones yet."}
            </p>
          ) : (
            <ol className="mt-8 space-y-8">
              {milestones.map((item, idx) => {
                const title = pickLocale(locale, item.title_zh, item.title_en);
                const desc = pickLocale(locale, item.description_zh, item.description_en);
                return (
                  <li
                    key={item._key ?? `${item.year}-${idx}`}
                    className="grid gap-4 border-l-2 border-slate-200 pl-6 sm:grid-cols-[120px_1fr] sm:gap-8 sm:pl-8"
                  >
                    <div className="relative text-sm font-semibold text-sky-700">
                      <span className="absolute -left-[39px] top-0 inline-block h-4 w-4 rounded-full border-2 border-sky-400 bg-white" />
                      {item.year || "—"}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {title || (isZh ? "里程碑事件" : "Milestone Event")}
                      </h3>
                      <p className="mt-2 text-slate-600">{desc || "—"}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        {/* 资质认证 */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-slate-900">
            {isZh ? "资质认证" : "Certifications"}
          </h2>
          <CertificationsGallery items={certifications} locale={locale} />
        </section>
      </section>

      {/* 企业优势区（复用首页统计） */}
      <StatsSection />

      {/* 底部 CTA */}
      <CtaSection />
    </>
  );
}
