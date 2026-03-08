"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-700/50 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* 公司信息 */}
          <div>
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-white"
            >
              ScaleTech
            </Link>
            <p className="mt-3 text-sm leading-relaxed">
              {t("companyIntro")}
            </p>
          </div>

          {/* 产品链接 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("products")}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm transition hover:text-sky-400"
                >
                  {t("products")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("quickLinks")}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm transition hover:text-sky-400"
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm transition hover:text-sky-400"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-sm transition hover:text-sky-400"
                >
                  {t("news")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm transition hover:text-sky-400"
                >
                  {t("contactUs")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("contact")}
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <span className="font-medium text-slate-400">{t("address")}:</span>
                <br />
                <span>{t("addressValue")}</span>
              </li>
              <li>
                <span className="font-medium text-slate-400">{t("phone")}:</span>
                <br />
                <span>+86 400-XXX-XXXX</span>
              </li>
              <li>
                <span className="font-medium text-slate-400">{t("email")}:</span>
                <br />
                <a
                  href="mailto:contact@scaletech.com"
                  className="transition hover:text-sky-400"
                >
                  contact@scaletech.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 版权 */}
        <div className="mt-12 border-t border-slate-700/50 pt-8 text-center text-sm text-slate-500">
          {t("copyright", { year })}
        </div>
      </div>
    </footer>
  );
}
