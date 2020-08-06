import React, { Component } from "react";
import { isLeft } from "fp-ts/lib/Either";

// Router
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  RouteComponentProps,
} from "react-router-dom";

// Toasts
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Stripe
import { StripeProvider } from "react-stripe-elements";

// Loading
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/circular-progress.css";

// UI Components
import { UpdateAccountForm, LoginForm, RegisterAccountForm } from "../account";
import { WidgetList, UpdateWidgetForm, AddWidgetForm } from "../widget";
import { AppBar } from "../bar";
import { AppMenu } from "../menu";

// Style
import "./style.css";

// Services
import * as Auth from "../../services/auth";

// Config
import { StripKey } from "../../config";

// Domain
import { UUID, Widget, IAM } from "@huckleberrylabs/ping-core";
import { Billing } from "../billing/container";
import { SDK } from "../../sdk";

const ToastProvider = ({ appBar }: { appBar?: boolean }) => (
  <ToastContainer
    className={appBar ? "toastify-with-app-bar" : ""}
    position="top-right"
    autoClose={3500}
    hideProgressBar
    newestOnTop={false}
    closeOnClick
    rtl={false}
    draggable
    pauseOnHover
  />
);

export const AuthApp = (account: IAM.Account.Model.T, reload: () => void) => (
  <>
    <AppBar logout={() => Auth.logout(account.id)} loggedIn fixed />
    <ToastProvider appBar />
    <div className="app-container">
      <AppMenu />
      <Switch>
        <Route
          path="/"
          exact
          component={() => WidgetList({ widgets: account.widgets })}
        />
        <Route
          path="/widgets"
          exact
          component={() => WidgetList({ widgets: account.widgets })}
        />
        <Route
          path="/add-widget"
          component={(props: RouteComponentProps) =>
            AddWidgetForm({ ...props, accountID: account.id, reload })
          }
        />
        <Route
          path="/widgets/:id"
          component={(props: RouteComponentProps<{ id: UUID.T }>) => {
            const id = props.match.params.id;
            const widget = account.widgets.filter(
              (widget) => widget.id === id
            )[0];
            if (widget)
              return UpdateWidgetForm({
                ...props,
                widget,
                onSave: async (widget: Widget.Settings.Model.T) => {
                  const result = await SDK.Widget.Update(account.id, widget);
                  reload();
                  return result;
                },
              });
            return <div>widget not found</div>;
          }}
        />
        <Route
          path="/account"
          component={() => UpdateAccountForm({ account, reload })}
        />
        <Route
          path="/analytics"
          component={() => (
            <div>
              <h1>analytics</h1>
              <br />
              <p>
                analytics are actively under development, please check back
                later.
              </p>
            </div>
          )}
        />
        <Route path="/billing" component={() => <Billing />} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </div>
  </>
);

const UnAuthApp = () => (
  <div>
    <ToastProvider />
    <Switch>
      <Route path="/register" component={RegisterAccountForm} />
      <Route path="/login" component={LoginForm} />
      <Route component={LoginForm} />
    </Switch>
  </div>
);

export const ProvidersHoC = (props: JSX.Element) => (
  <StripeProvider apiKey={StripKey}>
    <Router>{props}</Router>
  </StripeProvider>
);
type State = {
  account: IAM.Account.Model.T | undefined;
  loading: boolean;
};
type Props = {};

export class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      account: undefined,
      loading: true,
    };
  }
  componentDidMount() {
    this.onAccountUpdated();
  }
  async onAccountUpdated() {
    this.setState({ loading: true });
    const idMaybe = Auth.isLoggedIn();
    if (isLeft(idMaybe)) {
      this.setState({ loading: false });
      return;
    }
    const id = idMaybe.right;
    const accountMaybe = await SDK.Account.Get(id);
    if (isLeft(accountMaybe)) {
      Auth.logout(id); // Unauthenticated clean up and auto redirect
      this.setState({ loading: false });
      return;
    }
    const account = accountMaybe.right;
    this.setState({ account, loading: false });
  }
  render() {
    return ProvidersHoC(
      IAM.Account.Model.Is(this.state.account) ? (
        AuthApp(this.state.account, () => this.onAccountUpdated())
      ) : this.state.loading ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        UnAuthApp()
      )
    );
  }
}
