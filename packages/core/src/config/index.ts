import { EmailAddress, Env, Url } from "../values";

export const DefaultAPIURL = "http://localhost:8000";

// Domains and URLs

export const GetAPIURL = () =>
  process.env.API_URL
    ? process.env.API_URL
    : process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL
    : DefaultAPIURL;

export const GetEndpoint = (input: string) => {
  const api = GetAPIURL();
  const url = new URL(api);
  url.pathname = input;
  return url.toString() as Url.T;
};

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
    : "file:///Users/dado/Projects/ping/packages/client/dist/ping.min.js";

export const CloseAccountFormURL =
  "https://huckleberrylabs.typeform.com/to/To6SXb";

export const SecretDeveloperMessage = `Ping. Made with <3 in Waterloo, Canada by Huckleberry. ${PrimaryURL}`;
