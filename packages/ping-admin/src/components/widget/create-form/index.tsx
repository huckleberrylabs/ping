import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import { IconPropT } from "@rmwc/types";

// Form Fields
import { CountryField, DefaultCountry } from "../../form-fields/country-field";
import { PhoneField } from "../../form-fields/phone-field";
import { UrlField } from "../../form-fields/url-field";
import { ColorField, DefaultColor } from "../../form-fields/color-field";
import { IconField, DefaultIcon } from "../../form-fields/icon-field";
import { BackButton } from "../../form-fields/back-button";
import { ForwardButton } from "../../form-fields/forward-button";

// Style
import "./style.css";

// Domain
import { Phone, Url, Color } from "@huckleberryai/core";
import { Widget, Icon, Country } from "@huckleberryai/ping";

type Props = RouteComponentProps & {
  disabled?: boolean;
  title?: string;
  showBackButton?: boolean;
  forwardButtonLabel?: string;
  forwardButtonIcon?: IconPropT;
  onSubmit: (widget: Widget.T) => void;
};

export const CreateWidgetForm = ({
  history,
  disabled,
  title,
  showBackButton,
  forwardButtonLabel,
  forwardButtonIcon,
  onSubmit
}: Props) => {
  const [country, updateCountry] = useState<Country.T>(DefaultCountry);
  const [phone, updatePhone] = useState<Phone.T>();
  const [homePage, updateHomePage] = useState<Url.T>();
  const [color, updateColor] = useState<Color.T>(DefaultColor);
  const [icon, updateIcon] = useState<Icon.T>(DefaultIcon);
  const valid =
    Country.Is(country) &&
    Phone.Is(phone) &&
    Url.Is(homePage) &&
    Color.Is(color) &&
    Icon.Is(icon);

  return (
    <div className="create-widget-form">
      {title ? <h1>{title}</h1> : null}
      <div className="create-widget-inputs">
        <h2>configure</h2>
        <div className="create-widget-country-phone">
          <CountryField
            showSelectedLabel={false}
            className="create-widget-country"
            onSelect={updateCountry}
          />
          <PhoneField
            disabled={disabled}
            required
            onSelect={updatePhone}
          ></PhoneField>
        </div>
        <UrlField
          label="homepage url"
          disabled={disabled}
          required
          onSelect={updateHomePage}
        />
        <h2>design</h2>
        <ColorField
          disabled={disabled}
          initialValue={color}
          onSelect={updateColor}
        />
        <IconField
          disabled={disabled}
          initialValue={icon}
          color={color}
          onSelect={updateIcon}
        />
      </div>
      <div className="create-widget-buttons">
        <BackButton onClick={() => history.goBack()} show={showBackButton} />
        <ForwardButton
          label={forwardButtonLabel}
          icon={forwardButtonIcon}
          disabled={disabled || !valid}
          onClick={() => {
            onSubmit(
              Widget.C(
                phone as Phone.T,
                country,
                homePage as Url.T,
                color,
                icon
              )
            );
          }}
        />
      </div>
    </div>
  );
};
