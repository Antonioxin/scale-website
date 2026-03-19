import { defineField, defineType } from "sanity";

export const productSpecItem = defineType({
  name: "productSpecItem",
  title: "Spec Item",
  type: "object",
  fields: [
    defineField({ name: "name_zh", title: "Name (ZH)", type: "string" }),
    defineField({ name: "name_en", title: "Name (EN)", type: "string" }),
    defineField({ name: "value_zh", title: "Value (ZH)", type: "string" }),
    defineField({ name: "value_en", title: "Value (EN)", type: "string" }),
  ],
});

export const productDocument = defineType({
  name: "productDocument",
  title: "Document",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Document Name", type: "string" }),
    defineField({
      name: "file",
      title: "File (PDF)",
      type: "file",
      options: { accept: ".pdf" },
    }),
  ],
});

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "title_zh",
      title: "Title (ZH)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title_en",
      title: "Title (EN)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title_en", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "productCategory" }],
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "description_zh",
      title: "Description (ZH)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "description_en",
      title: "Description (EN)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "specs",
      title: "Specs",
      type: "array",
      of: [{ type: "productSpecItem" }],
    }),
    defineField({
      name: "features_zh",
      title: "Features (ZH)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "features_en",
      title: "Features (EN)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "applications_zh",
      title: "Applications (ZH)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "applications_en",
      title: "Applications (EN)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "documents",
      title: "Documents",
      type: "array",
      of: [{ type: "productDocument" }],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title_zh: "title_zh", title_en: "title_en", media: "images.0" },
    prepare({ title_zh, title_en, media }) {
      return {
        title: title_en || title_zh || "Product",
        media,
      };
    },
  },
});
