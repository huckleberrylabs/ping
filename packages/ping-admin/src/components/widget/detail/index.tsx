import React from "react";
import { RouteComponentProps } from "react-router";
import { isLeft } from "fp-ts/lib/Either";

// Color
import { ChromePicker } from "react-color";

// TextField
import { TextField } from "@rmwc/textfield";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";

// Button
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";

// Switch
import { Switch } from "@rmwc/switch";
import "@material/switch/dist/mdc.switch.css";
import "@material/form-field/dist/mdc.form-field.css";

// Toast
import { toast } from "react-toastify";

// Style
import "./style.css";

import { WidgetCodeSnippet } from "../code-snippet";

// Domain
import { Widget, PrivateSDK, PublicSDK } from "@huckleberryai/ping";
import { Color, UUID, Phone, Url } from "@huckleberryai/core";

interface Props extends RouteComponentProps<{ id: UUID.T }> {}
type State = {
  error: boolean;
  displayColorPicker: boolean;
  widget: Widget.T | undefined;
  hasChanged: boolean;
};

const accountID = "8bb3ea37-fb26-499d-ab1c-37901cc9d609" as UUID.T; // localStorage.getItem("accountID");

export class WidgetViewer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: false,
      displayColorPicker: false,
      widget: undefined,
      hasChanged: false
    };
  }

  onGoBack = () => this.props.history.goBack();

  onToggleEnabled = () =>
    this.setState(prevState => {
      const newState = { ...prevState };
      if (newState.widget && prevState.widget)
        newState.widget.enabled = !prevState.widget.enabled;
      newState.hasChanged = true;
      return newState;
    });

  onDomainChange = (input: string) =>
    this.setState(prevState => {
      const newState = { ...prevState };
      if (newState.widget) newState.widget.homePage = input as Url.T;
      newState.hasChanged = true;
      return newState;
    });

  onPhoneChange = (input: string) =>
    this.setState(prevState => {
      const newState = { ...prevState };
      if (newState.widget) newState.widget.phone = input as Phone.T;
      newState.hasChanged = true;
      return newState;
    });

  onToggleColorPicker = () =>
    this.setState(prevState => ({
      displayColorPicker: !prevState.displayColorPicker
    }));

  onChangeColor = (input: string) => {
    if (Color.Is(input)) {
      this.setState(prevState => {
        const newState = { ...prevState };
        if (newState.widget) newState.widget.color = input as Color.T;
        newState.hasChanged = true;
        return newState;
      });
    }
  };

  /* onDeleteWidget = () => null; */
  onSaveChanges = async () => {
    if (!this.state.widget) return;
    const { homePage, phone, color } = this.state.widget;
    if (!Url.Is(homePage)) {
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
    if (!Phone.Is(phone)) {
      toast.warn("Invalid Phone", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return;
    }
    if (!Color.Is(color)) {
      toast.warn("Invalid Color", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      return;
    }
    const sdk = PrivateSDK.C();
    const maybeUpdated = await sdk.Widget.Update(
      accountID,
      this.state.widget,
      UUID.C()
    );
    if (isLeft(maybeUpdated)) {
      this.setState({ error: true });
      return;
    }
    this.setState({ hasChanged: false });
  };

  async componentDidMount() {
    // TODO replace with widget passed through props
    const sdk = PublicSDK.C(this.props.match.params.id, UUID.C());
    const settingsMaybe = await sdk.Widget.Get();
    if (isLeft(settingsMaybe)) {
      this.setState({ error: true });
      return;
    }
    this.setState({ widget: settingsMaybe.right });
  }
  render() {
    const { widget, error, displayColorPicker } = this.state;
    if (widget) {
      return (
        <div className="detail-container">
          <div className="controls-container">
            <Button
              onClick={this.onGoBack}
              icon="keyboard_arrow_left"
              theme={["textPrimaryOnLight"]}
            >
              Back
            </Button>
          </div>
          <h1>Widget Settings</h1>
          <div>
            <h2>Setup</h2>
            {/* <div className="verified-container">
              <label>Installation Verified</label>
              <Icon
                icon={{ icon: "check", size: "small" }}
                theme="textPrimaryOnDark"
                className="verified"
              />
            </div> */}
            <WidgetCodeSnippet id={widget.id} />
          </div>

          <div className="configuration-container">
            <h2>Configuration</h2>
            <div className="enabled-container">
              <label>Enabled</label>
              <Switch
                checked={widget.enabled}
                onChange={() => this.onToggleEnabled()}
                theme={"primary"}
              />
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
            <div className="url-container">
              <TextField
                outlined
                label="Home Page"
                value={widget.homePage}
                placeholder={"https://example.com"}
                onChange={event =>
                  this.onDomainChange((event.target as HTMLInputElement).value)
                }
              />
            </div>
            <div className="phone-container">
              <TextField
                outlined
                label="Phone"
                value={widget.phone}
                placeholder={"+1 123 456 7890"}
                onChange={event =>
                  this.onPhoneChange((event.target as HTMLInputElement).value)
                }
              />
            </div>
          </div>

          <div>
            <h2>Style</h2>
            <div className="color-container">
              <Button
                onClick={this.onToggleColorPicker}
                raised
                dense
                style={{
                  backgroundColor: widget.color,
                  color: Color.IsLight(widget.color) ? "black" : "white"
                }}
              >
                Change Color
              </Button>
              {displayColorPicker ? (
                <div className="color-picker-popover">
                  <div
                    className="color-picker-cover"
                    onClick={this.onToggleColorPicker}
                  />
                  <ChromePicker
                    color={widget.color as string}
                    onChangeComplete={(input: { hex: string }) =>
                      this.onChangeColor(input.hex)
                    }
                  />
                </div>
              ) : null}
            </div>
          </div>

          {/* <div className="delete-container">
            <h2>Danger Zone</h2>
            <Button onClick={this.onDeleteWidget} outlined danger>
              Delete
            </Button>
          </div> */}
          <br />
          <br />
          <div className="controls-container">
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
