import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const COMPANY_INFO_ID = "companyInfo";

export default defineConfig({
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Company Info")
              .child(
                S.document()
                  .schemaType("companyInfo")
                  .documentId(COMPANY_INFO_ID)
              ),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== COMPANY_INFO_ID
            ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
