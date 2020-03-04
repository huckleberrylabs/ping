import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import { isLeft, Either } from "fp-ts/lib/Either";

// Form Fields
import { CountryField, DefaultCountry } from "../../form-fields/country-field";
import { PhoneField } from "../../form-fields/phone-field";
import { UrlField } from "../../form-fields/url-field";
import { ColorField } from "../../form-fields/color-field";
import { BackButton } from "../../form-fields/back-button";
import { ForwardButton } from "../../form-fields/forward-button";

// Switch
import { Switch } from "@rmwc/switch";
import "@material/switch/dist/mdc.switch.css";
import "@material/form-field/dist/mdc.form-field.css";

// Code Snippet
import { WidgetCodeSnippet } from "../code-snippet";

// Loading
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/circular-progress.css";

// Toast
import { toast } from "react-toastify";

// Style
import "./style.css";

// Domain
import { Phone, Url, Color, Errors } from "@huckleberryai/core";
import { Widget, Icon, Country } from "@huckleberryai/ping";
import { IconField } from "../../form-fields/icon-field";

type Props = RouteComponentProps & {
  widget: Widget.T;
  onSave: (widget: Widget.T) => Promise<Either<Errors.T, null>>;
};

export const UpdateWidgetForm = ({ history, widget, onSave }: Props) => {
  // UI
  const [loading, setLoading] = useState<boolean>(false);
  // Widget Properties
  const [enabled, updateEnabled] = useState<boolean>(widget.enabled);
  const toggleEnabled = () => updateEnabled(!enabled);

  const [homePage, updateHomePage] = useState<Url.T>(widget.homePage);
  const [phone, updatePhone] = useState<Phone.T>(widget.phone);
  const [country, updateCountry] = useState<Country.T>(DefaultCountry);
  const [color, updateColor] = useState<Color.T>(widget.color);
  const [icon, updateIcon] = useState<Icon.T>(widget.icon);

  const valid =
    Phone.Is(phone) &&
    Country.Is(country) &&
    Url.Is(homePage) &&
    Color.Is(color) &&
    Icon.Is(icon);
  const changed =
    widget.enabled !== enabled ||
    widget.phone !== phone ||
    widget.country !== country ||
    widget.homePage !== homePage ||
    widget.color !== color ||
    widget.icon !== icon;

  const onSubmit = async () => {
    if (!changed) return;
    if (!Url.Is(homePage)) {
      toast.warn("a valid home page url must be provided.");
      return;
    }
    if (!Phone.Is(phone)) {
      toast.warn("a valid phone must be provided.");
      return;
    }
    if (!Country.Is(country)) {
      toast.warn("a valid country must be provided.");
      return;
    }
    if (!Color.Is(color)) {
      toast.warn("a valid color must be provided.");
      return;
    }
    if (!Icon.Is(icon)) {
      toast.warn("a valid icon must be selected.");
      return;
    }
    setLoading(true);
    const newWidget: Widget.T = {
      ...widget,
      enabled,
      homePage,
      country,
      phone,
      color,
      icon
    };
    const maybeUpdated = await onSave(newWidget);
    setLoading(false);
    if (isLeft(maybeUpdated)) {
      toast.error("cannot update the widget at this time");
      return;
    }
    toast.success("widget updated.");
  };

  return (
    <div className="update-widget-form">
      <h1>widget settings</h1>
      <div className="update-widget-inner">
        <div className="update-widget-fields">
          <h2>configuration</h2>
          <div className="update-widget-enabled">
            <label>enable</label>
            <Switch
              disabled={loading}
              checked={enabled}
              onChange={toggleEnabled}
              theme={"primary"}
            />
          </div>
          <div className="update-widget-country-phone">
            <CountryField
              showSelectedLabel={false}
              className="update-widget-country"
              onSelect={updateCountry}
              initialValue={widget.country}
            />
            <PhoneField
              disabled={loading}
              required
              onSelect={updatePhone}
              initialValue={widget.phone}
            ></PhoneField>
          </div>
          <UrlField
            label="homepage url"
            disabled={loading}
            required
            initialValue={widget.homePage}
            onSelect={updateHomePage}
          />
          <h2>design</h2>
          <ColorField
            disabled={loading}
            initialValue={color}
            onSelect={updateColor}
          />
          <IconField
            disabled={loading}
            initialValue={icon}
            color={color}
            onSelect={updateIcon}
          />
          {/* <div className="delete-container">
            <h2>Danger Zone</h2>
            <Button onClick={this.onDeleteWidget} outlined danger>
              Delete
            </Button>
          </div> */}
        </div>
        <div className="update-widget-info">
          <h2>setup</h2>
          {/* <div className="update-widget-verified">
              <label>Installation Verified</label>
              <Icon
                icon={{ icon: "check", size: "small" }}
                theme="textPrimaryOnDark"
              />
            </div> */}
          <WidgetCodeSnippet id={widget.id} />
        </div>
      </div>
      <div className="update-widget-buttons">
        <BackButton onClick={() => history.goBack()} disabled={loading} />
        <ForwardButton
          label={loading ? "loading..." : "save"}
          icon={loading ? <CircularProgress /> : "keyboard_arrow_right"}
          disabled={loading || !changed || !valid}
          onClick={onSubmit}
        />
      </div>
    </div>
  );
};
