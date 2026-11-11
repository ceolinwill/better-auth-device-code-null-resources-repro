import { DEVICE_CODE_GRANT_TYPE } from "@better-auth/oauth-provider";
import { auth, prisma } from "./auth.ts";

const { headers: signUpHeaders } = await auth.api.signUpEmail({
  body: { email: `${crypto.randomUUID()}@example.com`, password: "password1234", name: "Repro" },
  returnHeaders: true,
});
const headers = new Headers({ cookie: signUpHeaders.get("set-cookie") ?? "" });

const client = await auth.api.adminCreateOAuthClient({
  headers,
  body: {
    client_name: "CLI",
    token_endpoint_auth_method: "none",
    grant_types: [DEVICE_CODE_GRANT_TYPE],
    scope: "openid",
    skip_consent: true,
  },
});
console.log(`Registered public client ${client.client_id}`);

const response = await auth.handler(
  new Request("http://localhost:3000/api/auth/device/code", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: client.client_id, scope: "openid" }),
  }),
);

console.log(`POST /api/auth/device/code -> ${response.status}`);
console.log(await response.text());

await prisma.$disconnect();

if (response.status !== 200) {
  console.error("\nBUG: requesting a device code without a resource failed.");
  process.exit(1);
}
console.log("\nOK: device code issued.");
