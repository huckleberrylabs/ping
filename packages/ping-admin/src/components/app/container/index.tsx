import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  RouteComponentProps
} from "react-router-dom";
import { ThemeProvider } from "@rmwc/theme";
import { ToastContainer } from "react-toastify";
import "@material/theme/dist/mdc.theme.css";
import "react-toastify/dist/ReactToastify.css";
import { StripeProvider } from "react-stripe-elements";

import { Account as PingAccount, PrivateSDK } from "@huckleberryai/ping";

import { AccountViewer, Login, RegisterAccount } from "../../account";
import { WidgetExplorer, WidgetViewer } from "../../widget";

import { AppBar } from "../bar";
import { AppMenu } from "../menu";
import "./style.css";
import { UUID } from "@huckleberryai/core";
import { isLeft } from "fp-ts/lib/Either";
import { AddWidget } from "../../widget";

export const AuthApp = (account: PingAccount.T, reload: () => void) => (
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
        <Route
          path="/"
          exact
          component={() => WidgetExplorer({ widgets: account.widgets })}
        />
        <Route
          path="/widgets"
          exact
          component={() => WidgetExplorer({ widgets: account.widgets })}
        />
        <Route
          path="/add-widget"
          component={(props: RouteComponentProps) =>
            AddWidget({ ...props, accountID: account.id })
          }
        />
        <Route path="/widgets/:id" component={WidgetViewer} />
        <Route
          path="/account"
          component={() => AccountViewer({ account, reload })}
        />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  </>
);

const UnAuthApp = () => (
  <Switch>
    <Route path="/register" component={RegisterAccount} />
    <Route path="/login" component={Login} />
    <Route render={() => <Redirect to="/login" />} />
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
      <StripeProvider apiKey="pk_test_yoFeO5x15PPlisJIQdFgoWbG005bjq8KtN">
        <Router>{props}</Router>
      </StripeProvider>
    </ThemeProvider>
  );
};

type State = {
  account: PingAccount.T | undefined;
};
type Props = {};

const corr = UUID.C();
const sdk = PrivateSDK.C();
const accountID = "8bb3ea37-fb26-499d-ab1c-37901cc9d609" as UUID.T; // localStorage.getItem("accountID");
if (!UUID.Is(accountID)) {
  localStorage.removeItem("accountID");
}

export class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      account: undefined
    };
  }
  async onAccountUpdated() {
    const accountMaybe = await sdk.Account.Get(accountID, corr);
    if (isLeft(accountMaybe)) {
      localStorage.removeItem("accountID");
      return;
    }
    const account = accountMaybe.right;
    this.setState({ account });
  }
  async componentDidMount() {
    const accountMaybe = await sdk.Account.Get(accountID, corr);
    if (isLeft(accountMaybe)) {
      localStorage.removeItem("accountID");
      return;
    }
    const account = accountMaybe.right;
    this.setState({ account });
  }
  render() {
    return ProviderHoC(UnAuthApp());
    /* return ProviderHoC(
      PingAccount.Is(this.state.account)
        ? AuthApp(this.state.account, () => this.onAccountUpdated())
        : UnAuthApp()
    ); */
  }
}
