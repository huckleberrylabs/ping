import React, { Component } from "react";
import { isLeft } from "fp-ts/lib/Either";

// Router
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  RouteComponentProps
} from "react-router-dom";

// Toasts
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Loading
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/circular-progress.css";

// UI Components
import {
  UpdateAccountForm,
  LoginForm,
  RegisterAccountForm
} from "../../account";
import { WidgetList, UpdateWidgetForm, AddWidgetForm } from "../../widget";
import { LandingPage } from "../../landing-page";
import { AppBar } from "../bar";
import { AppMenu } from "../menu";

// Style
import "./style.css";

// Services
import * as Auth from "../../../services/authentication";

// Domain
import { UUID } from "@huckleberryai/core";
import {
  Account as PingAccount,
  PrivateSDK,
  Widget
} from "@huckleberryai/ping";

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

export const AuthApp = (account: PingAccount.T, reload: () => void) => (
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
              widget => widget.id === id
            )[0];
            if (widget)
              return UpdateWidgetForm({
                ...props,
                widget,
                onSave: async (widget: Widget.T) => {
                  const result = await sdk.Widget.Update(
                    account.id,
                    widget,
                    UUID.C()
                  );
                  reload();
                  return result;
                }
              });
            return <div>widget not found</div>;
          }}
        />
        <Route
          path="/account"
          component={() => UpdateAccountForm({ account, reload })}
        />
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
      <Route component={LandingPage} />
    </Switch>
  </div>
);

export const ProvidersHoC = (props: JSX.Element) => <Router>{props}</Router>;
type State = {
  account: PingAccount.T | undefined;
  loading: boolean;
};
type Props = {};

const corr = UUID.C(); // TODO add corr id to all SDK calls
const sdk = PrivateSDK.C();

export class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      account: undefined,
      loading: true
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
    const accountMaybe = await sdk.Account.Get(id, corr);
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
      PingAccount.Is(this.state.account) ? (
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
