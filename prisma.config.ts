import { defineConfig } from "prisma/config";
import { databaseUrl } from "./src/database-url.ts";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url: databaseUrl },
});
