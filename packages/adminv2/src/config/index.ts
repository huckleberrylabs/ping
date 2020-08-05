export const Routes = {
  account: "/account",
  contacts: "/contacts",
  conversations: "/conversations",
  widgets: "/widgets",
  analytics: "/analytics",
  routers: "/routers",
  sendLoginEmail: "/login",
  loginWithToken: "/login-with-token",
  register: "/register",
};

export const PrimaryDomain = "ping.buzz";
export const SupportEmail = "help@" + PrimaryDomain;

export const InsertScriptID = "huckleberry-ping-insert-script";

export const InsertScriptURL =
  process.env.NODE_ENV === "production"
    ? "https://client.ping.buzz/ping.min.js"
    : "file:///Users/dado/Projects/ping/packages/client/dist/ping.min.js";
