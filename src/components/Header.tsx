"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

const navItems = [
  { href: "/", key: "home" },
  { href: "/products", key: "products" },
  { href: "/about", key: "about" },
  { href: "/news", key: "news" },
  { href: "/contact", key: "contact" },
] as const;

export default function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-white transition hover:text-slate-200"
        >
          {t("logo")}
        </Link>

        {/* Desktop nav - center */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navItems.map(({ href, key }) => {
            const isActive =
              (href === "/" && pathname === "/") ||
              (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={key}
                href={href}
                className={`text-sm font-medium transition ${
                  isActive
                    ? "text-sky-400"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        {/* Right: language + CTA - desktop */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex rounded-lg border border-slate-600 bg-slate-800/80 p-0.5">
            <Link
              href={pathname}
              locale="zh"
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                locale === "zh"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              中
            </Link>
            <Link
              href={pathname}
              locale="en"
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                locale === "en"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              EN
            </Link>
          </div>
          <Link
            href="/contact"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500"
          >
            {t("getQuote")}
          </Link>
        </div>

        {/* Mobile: hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white md:hidden"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`border-t border-slate-700/50 bg-slate-900 md:hidden ${
          mobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile">
          {navItems.map(({ href, key }) => {
            const isActive =
              (href === "/" && pathname === "/") ||
              (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={key}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-lg px-4 py-3 text-base font-medium transition ${
                  isActive
                    ? "bg-slate-800 text-sky-400"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
          <div className="mt-4 flex items-center gap-3 border-t border-slate-700/50 pt-4">
            <div className="flex rounded-lg border border-slate-600 bg-slate-800/80 p-0.5">
              <Link
                href={pathname}
                locale="zh"
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  locale === "zh" ? "bg-slate-700 text-white" : "text-slate-400"
                }`}
              >
                中
              </Link>
              <Link
                href={pathname}
                locale="en"
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  locale === "en" ? "bg-slate-700 text-white" : "text-slate-400"
                }`}
              >
                EN
              </Link>
            </div>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 rounded-lg bg-sky-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-sky-500"
            >
              {t("getQuote")}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
