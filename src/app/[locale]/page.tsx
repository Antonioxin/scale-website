import { setRequestLocale } from "next-intl/server";
import HeroSection from "@/components/home/HeroSection";
import ProductCategoriesSection from "@/components/home/ProductCategoriesSection";
import StatsSection from "@/components/home/StatsSection";
import ClientsSection from "@/components/home/ClientsSection";
import NewsSection from "@/components/home/NewsSection";
import CtaSection from "@/components/home/CtaSection";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <ProductCategoriesSection locale={locale} />
      <StatsSection />
      <ClientsSection />
      <NewsSection locale={locale} />
      <CtaSection />
    </>
  );
}
