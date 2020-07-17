import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Providers and Services
import { useObservable } from "../observable";
import { authService } from "../services";
import { RouterProvider, StripeProvider, ToastProvider } from "../providers";

// Loading Spinner
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/styles";

// Top Level Navigation
import { NavBar } from "../components/navbar";
import { DrawerMenu } from "../components/drawer-menu";

// Routes
import { Routes } from "../config";

// Views
import { SendLoginEmail } from "../views/send-login-email";
import { LoginWithToken } from "../views/login-with-token";
import { Account } from "../views/account";
import { Contacts } from "../views/contacts";
import { Conversations } from "../views/conversations";
import { ConversationDetail } from "../views/conversation-detail";
import { Widgets } from "../views/widgets";
import { Analytics } from "../views/analytics";

import "./style.css";

const PublicRoutes = () => [
  <Route
    key={Routes.sendLoginEmail}
    path={Routes.sendLoginEmail}
    component={SendLoginEmail}
  />,
  <Route
    key={Routes.loginWithToken}
    path={Routes.loginWithToken}
    component={LoginWithToken}
  />,
  <Route key="/" render={() => <Redirect to={Routes.sendLoginEmail} />} />,
];

const PrivateRoutes = () => [
  <Route key={Routes.account} path={Routes.account} component={Account} />,
  <Route key={Routes.contacts} path={Routes.contacts} component={Contacts} />,
  <Route
    key={Routes.conversations}
    path={Routes.conversations}
    component={Conversations}
    exact
  />,
  <Route
    key={`${Routes.conversations}/:id`}
    path={`${Routes.conversations}/:id`}
    component={ConversationDetail}
  />,
  <Route
    key={Routes.widgets}
    path={Routes.widgets}
    component={Widgets}
    exact
  />,
  <Route
    key={Routes.analytics}
    path={Routes.analytics}
    component={Analytics}
  />,
  <Route key="/" render={() => <Redirect to="/" />} />,
];

export const App = () => {
  const loading = useObservable(authService.loading);
  const isLoggedIn = useObservable(authService.isLoggedIn);
  if (loading)
    return (
      <div className="app-loading-container">
        <CircularProgress size="xlarge" />
      </div>
    );
  else
    return StripeProvider(
      RouterProvider(
        <>
          {isLoggedIn ? <NavBar /> : null}
          <ToastProvider offset={isLoggedIn} />
          <div className={isLoggedIn ? "app-container" : ""}>
            {isLoggedIn ? <DrawerMenu /> : null}
            <Switch>{isLoggedIn ? PrivateRoutes() : PublicRoutes()}</Switch>
          </div>
        </>
      )
    );
};
