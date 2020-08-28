import React from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { isLeft } from "fp-ts/lib/Either";
import { UUID, NonEmptyString } from "@huckleberrylabs/ping-core";
import { useObservable } from "../observable";
import { Routes } from "../config";
import { toast } from "react-toastify";
import { authService, AuthStates } from "../services";
import { RouterProvider, ToastProvider } from "../providers";

// UI
import { NavBar } from "../components/navbar";
import { DrawerMenu } from "../components/drawer-menu";
import { Loading } from "../components/loading";
import "./style.css";

// Views
import { SendLoginEmail } from "../views/send-login-email";
import { Account } from "../views/account";
import { Contacts } from "../views/contact-list";
import { Conversations } from "../views/conversation-list";
import { ConversationDetail } from "../views/conversation-detail";
import { Widgets } from "../views/widget-list";
import { WidgetDetail } from "../views/widget-detail";
import { Analytics } from "../views/analytics";
import { Registration } from "../views/registration";

const PublicRoutes = () => (
  <Switch>
    <Route
      key={Routes.register}
      path={Routes.register}
      component={Registration}
    />
    ,
    <Route
      key={Routes.sendLoginEmail}
      path={Routes.sendLoginEmail}
      component={SendLoginEmail}
    />
    ,
    <Route key="/" render={() => <Redirect to={Routes.sendLoginEmail} />} />,
  </Switch>
);
const PrivateRoutes = () => (
  <Switch>
    <Route key={Routes.account} path={Routes.account} component={Account} />,
    <Route key={Routes.contacts} path={Routes.contacts} component={Contacts} />,
    <Route
      key={Routes.conversations}
      path={Routes.conversations}
      component={Conversations}
      exact
    />
    ,
    <Route
      key={`${Routes.conversations}/:id`}
      path={`${Routes.conversations}/:id`}
      component={ConversationDetail}
    />
    ,
    <Route
      key={Routes.widgets}
      path={Routes.widgets}
      component={Widgets}
      exact
    />
    ,
    <Route
      key={`${Routes.widgets}/:id`}
      path={`${Routes.widgets}/:id`}
      component={WidgetDetail}
    />
    ,
    <Route
      key={`${Routes.analytics}/:id`}
      path={`${Routes.analytics}/:id`}
      component={Analytics}
    />
    ,
    <Route key="/" render={() => <Redirect to={Routes.widgets} />} />,
  </Switch>
);

const AuthApp = () => {
  const history = useHistory();
  const authState = useObservable(authService.state);

  if (UUID.Is(authState))
    return (
      <>
        <NavBar />
        <ToastProvider offset={true} />
        <div className="app">
          <DrawerMenu />
          <Switch>{PrivateRoutes()}</Switch>
        </div>
      </>
    );
  if (authState === AuthStates.UNAUTHENTICATED)
    return (
      <>
        <ToastProvider />
        {PublicRoutes()}
      </>
    );
  if (authState === AuthStates.UNINITIALIZED) {
    const query = new URLSearchParams(history.location.search);
    const token = query.get("token");

    if (NonEmptyString.Is(token)) {
      authService.loginWithToken(token).then(async (result) => {
        if (isLeft(result)) {
          toast.warn(result.left.userMessage);
          history.push(Routes.sendLoginEmail);
        } else {
          history.push("/");
          toast.success("Login successful.");
        }
      });
    } else {
      authService.getAccountID();
    }
  }
  // AuthStates.LOADING
  return (
    <div className="app-loading">
      <Loading />
    </div>
  );
};

export const App = () => RouterProvider(<AuthApp />);
