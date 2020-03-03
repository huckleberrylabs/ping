import { EmailAddress, Env } from "@huckleberryai/core";

// Domains and URLs

export const PrimaryDomain = "ping.buzz";
export const AdminDomain = "app.ping.buzz";
export const HuckleberryDomain = "huckleberry.app";

export const PingAdminURL =
  Env.Get() === "development"
    ? "http://localhost:3000"
    : `https://${AdminDomain}`;

export const PrimaryURL = `https://${PrimaryDomain}`;

export const HuckleberryURL = `https://${HuckleberryDomain}`;

// Emails

export const NoReplyEmail = ("no-reply@" + PrimaryDomain) as EmailAddress.T;
export const SupportEmail = ("help@" + PrimaryDomain) as EmailAddress.T;

export const InsertScriptID = "huckleberry-ping-insert-script";

// TODO developent url shouldn't be machine specific
export const InsertScriptURL =
  Env.Get() === "production"
    ? "https://client.ping.buzz/ping.min.js"
    : "file:///Users/dado/Projects/monorepo/packages/ping-client/dist/ping.min.js";

export const CloseAccountFormURL =
  "https://huckleberryai.typeform.com/to/To6SXb";

export const SecretDeveloperMessage = `Ping. Made with <3 in Waterloo, Canada by Huckleberry. ${PrimaryURL}`;
