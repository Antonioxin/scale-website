"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  return (
    <div className="fixed inset-0 z-50 min-h-screen w-screen">
      <NextStudio config={config} />
    </div>
  );
}
