import React from "react";
import { RouteComponentProps } from "react-router";
import { ChromePicker } from "react-color";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
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
import { Icon } from "@rmwc/icon";
import { Ripple } from "@rmwc/ripple";
import { Switch } from "@rmwc/switch";
import { TextField } from "@rmwc/textfield";
import "./style.css";
import {
  IWidgetSettings,
  /*   WidgetGetSettingsQuery,
  IsWidgetSettings, */
  WidgetSettings
  generateHTML, 
  generateCSS,
  ELEMENT_IDs
} from "@huckleberryai/widget";
import { IsColor, UUID } from "@huckleberryai/core";
//import { postEvent } from "../../../api";


interface Props extends RouteComponentProps {}
type State = {
  error: boolean;
  displayColorPicker: boolean;
  widget: IWidgetSettings | undefined;
};

const codeString = (id: UUID) =>
  `
  <script src="https://static.huckleberry.app/text.min.js?widget_id=${id}" id="huckleberry-text-insert-script"></script>
  `;

export class WidgetDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: false,
      displayColorPicker: false,
      widget: undefined
    };
  }

  onToggleEnabled = (input: boolean) =>
    this.setState(prevState => {
      const newState = { ...prevState };
      if (newState.widget && prevState.widget)
        newState.widget.enabled = !prevState.widget.enabled;
      return newState;
    });

  onClickCodeSnippet = (codeString: string) => {
    let textarea = document.createElement("textarea");
    textarea.setAttribute("type", "hidden");
    textarea.textContent = codeString;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
  };

  onDomainChange = (input: string) =>
    this.setState(prevState => {
      const newState = { ...prevState };
      if (newState.widget) newState.widget.phone = input;
      return newState;
    });

  onPhoneChange = (input: string) =>
    this.setState(prevState => {
      const newState = { ...prevState };
      if (newState.widget) newState.widget.phone = input;
      return newState;
    });

  onOpenColorPicker = () =>
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  onCloseColorPicker = () => this.setState({ displayColorPicker: false });
  onChangeColor = (input: string) => {
    console.log(input);
    if (IsColor(input)) {
      this.setState(prevState => {
        const newState = { ...prevState };
        if (newState.widget) newState.widget.color = input;
        return newState;
      });
    }
  };

  onGoBack = () => this.props.history.goBack();
  onSaveChanges = () => null;
  onDeleteWidget = () => null;

  async componentDidMount() {
    this.setState({ widget: WidgetSettings("+1 647 295 1647") });
  }
  render() {
    console.log(this.props);
    const { widget, error, displayColorPicker } = this.state;
    if (widget) {
      return (
        <div className="detail-container">
          <h1>Widget Settings</h1>
          <div className="configuration-container">
            <h2>Configuration</h2>
            <div className="enabled-container">
              <label>Enabled</label>
              <Switch
                checked={widget.enabled}
                // @ts-ignore
                onChange={evt =>
                  this.onToggleEnabled(evt.currentTarget.checked)
                }
                theme={"primary"}
              />
            </div>
            <br />
            <div className="url-container">
              <label>Homepage</label>
              <TextField
                value={"https://"}
                placeholder={"https://example.com"}
                fullwidth
                // @ts-ignore
                onChange={evt => this.onDomainChange(evt.target.value)}
              />
            </div>
            <br />
            <div className="phone-container">
              <TextField
                outlined
                label="Phone"
                value={widget.phone}
                placeholder={"+1 123 456 7890"}
                // @ts-ignore
                onChange={evt => this.onPhoneChange(evt.target.value)}
              />
            </div>
          </div>

          <div className="code-snippet-container">
            <h2>Setup</h2>
            <div className="verified-container">
              <label>Installation Verified</label>
              <Icon
                icon={{ icon: "check", size: "small" }}
                theme="textPrimaryOnDark"
                className="verified"
              />
            </div>
            <p>
              Copy this code and insert it as high as possible inside the head
              tag of your website. If you'd like assistance, please reach out to
              us!
            </p>
            <Ripple primary>
              <div
                className="code-snippet-inner-container"
                onClick={() => this.onClickCodeSnippet(codeString(widget.id))}
              >
                <SyntaxHighlighter language="html" style={docco}>
                  {codeString(widget.id)}
                </SyntaxHighlighter>
                <Icon
                  className="code-snippet-copy-icon"
                  icon="file_copy"
                  theme="textSecondaryOnLight"
                />
              </div>
            </Ripple>
          </div>

          <div>
            <h2>Style</h2>
            <div className="color-container">
              <Button onClick={this.onOpenColorPicker} raised dense>
                Change Color
              </Button>
              {displayColorPicker ? (
                <div className="color-picker-popover">
                  <div
                    className="color-picker-cover"
                    onClick={this.onCloseColorPicker}
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

          <div className="delete-container">
            <Button onClick={this.onDeleteWidget} outlined danger>
              Delete
            </Button>
          </div>

          <div className="controls-container">
            <Button
              onClick={this.onGoBack}
              icon="keyboard_arrow_left"
              theme={["textPrimaryOnLight"]}
            >
              Back
            </Button>
            <Button onClick={this.onSaveChanges} outlined>
              Save Changes
            </Button>
          </div>
        </div>
      );
    } else if (error) {
      return <div>An error occured, please try again later</div>;
    }
    return <div>Loading...</div>;
  }
}

/* 
live widget
replace phone with user
*/
