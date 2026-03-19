import { defineField, defineType } from "sanity";

export const productCategory = defineType({
  name: "productCategory",
  title: "Product Category",
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
      name: "description_zh",
      title: "Description (ZH)",
      type: "text",
    }),
    defineField({
      name: "description_en",
      title: "Description (EN)",
      type: "text",
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      options: { hotspot: true },
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
    select: { title_zh: "title_zh", title_en: "title_en" },
    prepare({ title_zh, title_en }) {
      return { title: title_en || title_zh || "Category" };
    },
  },
});
