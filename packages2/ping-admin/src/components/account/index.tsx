import React from "react";
import { RouteComponentProps } from "react-router";
// import { isLeft } from "fp-ts/lib/Either";
import "@material/ripple/dist/mdc.ripple.css";
import "@material/switch/dist/mdc.switch.css";
import "@material/form-field/dist/mdc.form-field.css";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";
import "@material/button/dist/mdc.button.css";
import "@rmwc/icon/icon.css";
import { Button } from "@rmwc/button";
import { TextField } from "@rmwc/textfield";
import { toast } from "react-toastify";
import "./style.css";
import { AdminSDK, Interfaces } from "@huckleberryai/ping";
import { UUID, Url } from "@huckleberryai/core";

interface Props extends RouteComponentProps<{ id: UUID.T }> {}
type State = {
  sdk: Interfaces.SDK;
  error: boolean;
  account: { [key: string]: any } | undefined;
  hasChanged: boolean;
};

export class Account extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sdk: AdminSDK.C(this.props.match.params.id, UUID.C()),
      error: false,
      account: {
        email: ""
      },
      hasChanged: false
    };
  }

  onEmailChange = (input: string) =>
    this.setState(prevState => {
      const newState = { ...prevState };
      if (newState.account) newState.account.email = input as Url.T;
      newState.hasChanged = true;
      return newState;
    });

  /* onCloseAccount = () => null; */
  onSaveChanges = async () => {
    if (!this.state.account) return;
    const { email } = this.state.account;
    if (!Url.Is(email)) {
      toast.warn("Invalid Home Page URL", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return;
    }
    /*  const updatedMaybe = await this.state.sdk.Settings.Update(
      this.state.widget
    );
    if (isLeft(updatedMaybe)) {
      this.setState({ error: true });
      return;
    }
    this.setState({ hasChanged: false }); */
  };

  /* async componentDidMount() {
    const accountMaybe = await this.state.sdk.Account.Get();
    if (isLeft(accountMaybe)) {
      this.setState({ error: true });
      return;
    }
    this.setState({ account: accountMaybe.right });
  } */
  render() {
    const { account, error } = this.state;
    if (account) {
      return (
        <div className="account-container">
          <h1>Account</h1>
          <div className="configuration-container">
            <h2>Configuration</h2>
            <div className="email-container">
              <TextField
                outlined
                label="Email"
                value={account.email}
                placeholder={"email@example.com"}
                // @ts-ignore
                onChange={evt => this.onEmailChange(evt.target.value)}
              />
            </div>
          </div>
          {/* <div className="close-container">
            <h2>Danger Zone</h2>
            <Button onClick={this.onCloseAccount} outlined danger>
              Close Account
            </Button>
          </div> */}
          <br />
          <br />
          <div className="save-changes-container">
            <Button
              onClick={this.onSaveChanges}
              raised
              disabled={!this.state.hasChanged}
            >
              Save Changes
            </Button>
          </div>
        </div>
      );
    }
    if (error) {
      return <div>An error occured, please try again later</div>;
    }
    return <div>Loading...</div>;
  }
}
