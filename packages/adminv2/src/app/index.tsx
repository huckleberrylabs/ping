import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Providers and Services
import { useObservable } from "../observable";
import { authService } from "../services";
import { RouterProvider, StripeProvider, ToastProvider } from "../providers";

// Loading Spinner
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/circular-progress.css";

// Top Level Navigation
import { NavBar } from "../components/navbar";
import { DrawerMenu } from "../components/drawer-menu";

// Routes
import { Routes } from "../config";

// Views
import { SendLoginEmail } from "../views/send-login-email";
import { LoginWithToken } from "../views/login-with-token";

import "./style.css";

const PublicRoutes = () => [
  <Route path={Routes.sendLoginEmail} component={SendLoginEmail} />,
  <Route path={Routes.loginWithToken} component={LoginWithToken} />,
  <Route render={() => <Redirect to={Routes.sendLoginEmail} />} />,
];

const PrivateRoutes = () => [<Route render={() => <Redirect to="/" />} />];

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
          <div className="app-container">
            {isLoggedIn ? <DrawerMenu /> : null}
            <Switch>{isLoggedIn ? PrivateRoutes() : PublicRoutes()}</Switch>
          </div>
        </>
      )
    );
};
