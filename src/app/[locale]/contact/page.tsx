import { setRequestLocale } from "next-intl/server";
import { getProductCategories } from "sanity/lib/queries";
import ContactFormClient from "./ContactFormClient";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isZh = locale === "zh";
  const categories = await getProductCategories();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {isZh ? "联系我们" : "Contact Us"}
        </h1>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {/* 左侧联系信息 */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-bold text-slate-900">{isZh ? "联系信息" : "Contact Information"}</h2>
            <dl className="mt-5 space-y-4 text-sm text-slate-700">
              <div>
                <dt className="font-semibold text-slate-900">{isZh ? "公司地址" : "Address"}</dt>
                <dd className="mt-1">{isZh ? "中国 · 深圳市南山区科技园" : "Nanshan Tech Park, Shenzhen, China"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">{isZh ? "电话" : "Phone"}</dt>
                <dd className="mt-1">+86 400-123-4567</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">{isZh ? "邮箱" : "Email"}</dt>
                <dd className="mt-1">sales@scaletech.com</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">{isZh ? "工作时间" : "Working Hours"}</dt>
                <dd className="mt-1">{isZh ? "周一至周五 09:00 - 18:00" : "Mon - Fri, 09:00 - 18:00"}</dd>
              </div>
            </dl>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <iframe
              title={isZh ? "公司位置地图" : "Company location map"}
              src="https://maps.google.com/maps?q=Shenzhen&t=&z=12&ie=UTF8&iwloc=&output=embed"
              className="h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* 右侧询盘表单 */}
        <ContactFormClient locale={locale} categories={categories as any} />
      </div>
    </section>
  );
}
