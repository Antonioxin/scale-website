"use client";

import { useState } from "react";

type Cert = {
  _key?: string;
  url?: string;
};

type Props = {
  items: Cert[];
  locale: string;
};

export default function CertificationsGallery({ items, locale }: Props) {
  const valid = items.filter((x) => x?.url);
  const [active, setActive] = useState<string | null>(null);
  const isZh = locale === "zh";

  if (!valid.length) {
    return (
      <p className="mt-5 text-slate-600">
        {isZh ? "暂无资质认证图片。" : "No certification images yet."}
      </p>
    );
  }

  return (
    <>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {valid.map((cert, idx) => (
          <button
            key={cert._key ?? cert.url ?? idx}
            type="button"
            onClick={() => setActive(cert.url ?? null)}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
          >
            <div className="aspect-[4/3] w-full bg-slate-100">
              <img
                src={cert.url}
                alt={isZh ? `资质证书 ${idx + 1}` : `Certification ${idx + 1}`}
                className="h-full w-full object-cover transition group-hover:opacity-95"
              />
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-5 top-5 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-800"
          >
            {isZh ? "关闭" : "Close"}
          </button>
          <img
            src={active}
            alt={isZh ? "证书预览" : "Certificate preview"}
            className="max-h-[90vh] max-w-[92vw] rounded-xl bg-white object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

