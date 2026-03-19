"use client";

import { useMemo, useState } from "react";
import { urlFor } from "sanity/lib/image";

type SanityImage = { _type: string; asset?: { _ref: string } };

type Props = {
  images?: SanityImage[];
  title?: string;
};

export default function ProductGallery({ images, title }: Props) {
  const safeImages = useMemo(() => images?.filter(Boolean) ?? [], [images]);
  const [active, setActive] = useState(0);

  const urls = useMemo(() => {
    return safeImages
      .map((img) => urlFor(img)?.width(1400).height(1050).url() ?? null)
      .filter(Boolean) as string[];
  }, [safeImages]);

  const thumbUrls = useMemo(() => {
    return safeImages
      .map((img) => urlFor(img)?.width(240).height(180).url() ?? null)
      .filter(Boolean) as string[];
  }, [safeImages]);

  const activeUrl = urls[active] ?? urls[0] ?? null;

  if (!safeImages.length || !activeUrl) {
    return <div className="aspect-[4/3] w-full rounded-2xl bg-slate-200" />;
  }

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
        <div className="aspect-[4/3] w-full">
          <img
            src={activeUrl}
            alt={title ?? ""}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {thumbUrls.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-5">
          {thumbUrls.map((u, idx) => {
            const selected = idx === active;
            return (
              <button
                key={u}
                type="button"
                onClick={() => setActive(idx)}
                className={[
                  "overflow-hidden rounded-xl border bg-white transition",
                  "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2",
                  selected
                    ? "border-sky-400 ring-1 ring-sky-300"
                    : "border-slate-200 hover:border-sky-200",
                ].join(" ")}
                aria-label={`Image ${idx + 1}`}
              >
                <div className="aspect-[4/3] w-full bg-slate-100">
                  <img src={u} alt="" className="h-full w-full object-cover" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

