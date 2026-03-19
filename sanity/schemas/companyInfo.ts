import { defineField, defineType } from "sanity";

export const milestone = defineType({
  name: "milestone",
  title: "Milestone",
  type: "object",
  fields: [
    defineField({ name: "year", title: "Year", type: "string" }),
    defineField({ name: "title_zh", title: "Title (ZH)", type: "string" }),
    defineField({ name: "title_en", title: "Title (EN)", type: "string" }),
    defineField({ name: "description_zh", title: "Description (ZH)", type: "text" }),
    defineField({ name: "description_en", title: "Description (EN)", type: "text" }),
  ],
});

export const companyInfo = defineType({
  name: "companyInfo",
  title: "Company Info",
  type: "document",
  fields: [
    defineField({
      name: "about_zh",
      title: "About (ZH)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "about_en",
      title: "About (EN)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "milestones",
      title: "Milestones",
      type: "array",
      of: [{ type: "milestone" }],
    }),
    defineField({
      name: "certifications",
      title: "Certifications",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Company Info" };
    },
  },
});
