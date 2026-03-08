import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function HeroSection() {
  const t = await getTranslations("HomeHero");

  return (
    <section
      className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
      aria-label="Hero"
    >
      {/* 深色渐变 + 工业风占位（网格/条纹叠加） */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.97) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(15, 23, 42, 0.97) 100%),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "100% 100%, 60px 60px, 60px 60px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {t("title")}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-300 sm:text-xl">
          {t("subtitle")}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/products"
            className="inline-flex rounded-lg bg-sky-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {t("viewProducts")}
          </Link>
          <Link
            href="/contact"
            className="inline-flex rounded-lg border-2 border-slate-400 bg-transparent px-6 py-3 text-base font-semibold text-white transition hover:border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {t("contactUs")}
          </Link>
        </div>
      </div>
    </section>
  );
}
