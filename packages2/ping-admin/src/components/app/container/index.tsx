import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { ThemeProvider } from "@rmwc/theme";
import { ToastContainer } from "react-toastify";
import "@material/theme/dist/mdc.theme.css";
import "react-toastify/dist/ReactToastify.css";

import { WidgetExplorer, WidgetDetail } from "../../widget";
import { Account } from "../../account";
import { SignUp } from "../../sign-up";

import { Login } from "../../login";
import { AppBar } from "../bar";
import { AppMenu } from "../menu";
import "./style.css";

const AuthApp = () => (
  <>
    <AppBar
      logout={() => {
        localStorage.removeItem("accountID");
        window.location.reload();
        console.log("Woot");
      }}
    />
    <div className="app-container">
      <AppMenu />
      <Switch>
        <Route path="/" exact component={WidgetExplorer} />
        <Route path="/widgets" exact component={WidgetExplorer} />
        <Route path="/widgets/:id" component={WidgetDetail} />
        <Route path="/account" component={Account} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  </>
);

const UnAuthApp = () => (
  <Switch>
    <Route path="/sign-up" component={SignUp} />
    <Route path="/login" component={Login} />
    <Route render={() => <Redirect to="login" />} />
  </Switch>
);

export const ProviderHoC = (props: JSX.Element) => {
  return (
    <ThemeProvider
      options={{
        primary: "#0087ff",
        secondary: "#e1f5fe",
        error: "#f44336",
        background: "white",
        surface: "#fafafa",
        onPrimary: "rgba(255, 255, 255, 1)",
        onSecondary: "rgba(0, 0, 0, 0.87)",
        onSurface: "rgba(0, 0, 0, 0.87)",
        onError: "#f44336",
        textPrimaryOnBackground: "rgba(0, 0, 0, 0.87)",
        textSecondaryOnBackground: "rgba(0, 0, 0, 0.54)",
        textHintOnBackground: "rgba(0, 0, 0, 0.38)",
        textDisabledOnBackground: "rgba(0, 0, 0, 0.38)",
        textIconOnBackground: "rgba(0, 0, 0, 0.38)",
        textPrimaryOnLight: "rgba(0, 0, 0, 0.87)",
        textSecondaryOnLight: "rgba(0, 0, 0, 0.54)",
        textHintOnLight: "rgba(0, 0, 0, 0.38)",
        textDisabledOnLight: "rgba(0, 0, 0, 0.38)",
        textIconOnLight: "rgba(0, 0, 0, 0.38)",
        textPrimaryOnDark: "white",
        textSecondaryOnDark: "rgba(255, 255, 255, 0.7)",
        textHintOnDark: "rgba(255, 255, 255, 0.5)",
        textDisabledOnDark: "rgba(255, 255, 255, 0.5)",
        textIconOnDark: "rgba(255, 255, 255, 0.5)"
      }}
    >
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
      <Router>{props}</Router>
    </ThemeProvider>
  );
};

export const App = () => {
  const accountID = localStorage.getItem("accountID");
  return ProviderHoC(accountID ? AuthApp() : UnAuthApp());
};
