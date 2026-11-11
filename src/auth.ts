import { oauthDeviceAuthorization, oauthProvider } from "@better-auth/oauth-provider";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { PrismaPg } from "@prisma/adapter-pg";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { databaseUrl } from "./database-url.ts";
import { PrismaClient } from "./generated/prisma/client.ts";

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

export const auth = betterAuth({
  baseURL: "http://localhost:3000",
  secret: "3f1c9a7e5b2d8046c1e7a9f3b5d2c8e0",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  plugins: [
    jwt(),
    oauthProvider({ loginPage: "/sign-in", consentPage: "/consent" }),
    oauthDeviceAuthorization(),
  ],
});
