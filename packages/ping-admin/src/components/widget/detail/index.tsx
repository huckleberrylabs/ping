import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import { isLeft, Either } from "fp-ts/lib/Either";

// Country Select
import ReactFlagsSelect from "react-flags-select";
import "react-flags-select/css/react-flags-select.css";

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

// Code Snippet
import { WidgetCodeSnippet } from "../code-snippet";

// Domain
import { Widget, Plan } from "@huckleberryai/ping";
import { Color, Phone, Url, Errors } from "@huckleberryai/core";
import { CircularProgress } from "@rmwc/circular-progress";

type Props = RouteComponentProps & {
  widget: Widget.T;
  onSave: (widget: Widget.T) => Promise<Either<Errors.T, null>>;
};

export const WidgetViewer = (props: Props) => {
  // UI
  const [loading, setLoading] = useState<boolean>(false);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const onToggleColorPicker = () => setShowColorPicker(!showColorPicker);
  const onGoBack = () => props.history.goBack();

  // Widget Properties
  const [enabled, setEnabled] = useState<boolean>(props.widget.enabled);
  const onToggleEnabled = () => setEnabled(!enabled);

  const defaultCountry = "US";
  const [country, updateCountry] = useState<string>(defaultCountry);

  const [homePage, setHomePage] = useState<string>(props.widget.homePage);
  const [phone, setPhone] = useState<string>(props.widget.phone);
  const [color, setColor] = useState<string>(props.widget.color);

  const hasChanged =
    props.widget.enabled !== enabled ||
    props.widget.homePage !== homePage ||
    props.widget.homePage !== homePage ||
    props.widget.color !== color;

  const onSubmit = async () => {
    if (!hasChanged) return;
    if (!Url.Is(homePage)) {
      toast.warn("A valid home page url must be provided.");
      return;
    }
    if (!Phone.Is(phone)) {
      toast.warn("A valid phone must be provided.");
      return;
    }
    if (!Plan.Country.Is(country)) {
      toast.warn("A valid country must be provided.");
      return;
    }
    if (!Color.Is(color)) {
      toast.warn("A valid color must be provided.");
      return;
    }
    setLoading(true);
    const newWidget: Widget.T = {
      ...props.widget,
      enabled,
      homePage,
      country,
      phone,
      color
    };
    const maybeUpdated = await props.onSave(newWidget);
    setLoading(false);
    if (isLeft(maybeUpdated)) {
      toast.error("Cannot update the widget at this time");
      return;
    }
    toast.success("Widget updated.");
  };

  return (
    <div className="detail-container">
      <div className="controls-container">
        <Button
          disabled={loading}
          onClick={onGoBack}
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
        <WidgetCodeSnippet id={props.widget.id} />
      </div>

      <div className="configuration-container">
        <h2>Configuration</h2>
        <div className="enabled-container">
          <label>Enabled</label>
          <Switch
            disabled={loading}
            checked={enabled}
            onChange={onToggleEnabled}
            theme={"primary"}
          />
        </div>
        <div className="url-container">
          <TextField
            disabled={loading}
            outlined
            label="Home Page"
            placeholder={"https://example.com"}
            required
            value={homePage}
            invalid={!Url.Is(homePage)}
            onChange={event => {
              const homePage = (event.target as HTMLInputElement).value;
              setHomePage(homePage);
            }}
          />
        </div>
        <div className="country-container">
          <label> Country </label>
          <ReactFlagsSelect
            defaultCountry={defaultCountry}
            searchable={true}
            countries={["US", "CA"]}
            onSelect={country => updateCountry(country)}
          />
        </div>
        <div className="phone-container">
          <TextField
            disabled={loading}
            outlined
            label="Phone"
            required
            value={phone}
            placeholder={"+1 123 456 7890"}
            invalid={!Phone.Is(phone)}
            onChange={event =>
              setPhone((event.target as HTMLInputElement).value)
            }
          />
        </div>
      </div>

      <div>
        <h2>Style</h2>
        <div className="color-container">
          <Button
            disabled={loading}
            onClick={onToggleColorPicker}
            raised
            dense
            style={{
              backgroundColor: color,
              color: Color.IsLight(color as Color.T) ? "black" : "white"
            }}
          >
            Change Color
          </Button>
          {showColorPicker ? (
            <div className="color-picker-popover">
              <div
                className="color-picker-cover"
                onClick={onToggleColorPicker}
              />
              <ChromePicker
                color={color}
                onChangeComplete={(input: { hex: string }) =>
                  setColor(input.hex)
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
          onClick={onSubmit}
          raised
          icon={loading ? <CircularProgress /> : "keyboard_arrow_right"}
          disabled={
            !Phone.Is(phone) ||
            !Plan.Country.Is(country) ||
            !Url.Is(homePage) ||
            !Color.Is(color) ||
            !hasChanged ||
            loading
          }
        >
          {loading ? "Loading" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
