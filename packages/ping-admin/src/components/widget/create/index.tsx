import React, { useState } from "react";
import { RouteComponentProps } from "react-router";

// Country Select
import ReactFlagsSelect from "react-flags-select";
import "react-flags-select/css/react-flags-select.css";

// Color Picker
import { ChromePicker } from "react-color";

// Button
import { Button } from "@rmwc/button";
import { IconPropT } from "@rmwc/types";
import "@material/button/dist/mdc.button.css";

// TextField
import { TextField } from "@rmwc/textfield";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";

// Style
import "./style.css";

// Domain
import { Phone, Url, Color } from "@huckleberryai/core";
import { Widget, Plan } from "@huckleberryai/ping";

type Props = RouteComponentProps & {
  disabled: boolean;
  title?: string;
  showBackButton: boolean;
  submitButtonText: string;
  submitButtonIcon: IconPropT;
  onSubmit: (widget: Widget.T) => void;
};

export const CreateWidget = (props: Props) => {
  const defaultCountry = "US";
  const [showColorPicker, toggleColorPicker] = useState(false);
  const [homePage, updateHomePage] = useState<string>();
  const [phone, updatePhone] = useState<string>();
  const [country, updateCountry] = useState<string>(defaultCountry);
  const [color, updateColor] = useState<string>("#0087ff");

  return (
    <div className="create-widget-container">
      {props.showBackButton ? (
        <div>
          <Button
            disabled={props.disabled}
            onClick={() => props.history.goBack()}
            icon="keyboard_arrow_left"
            theme={["textPrimaryOnLight"]}
          >
            Back
          </Button>
        </div>
      ) : null}
      {props.title ? <h1>{props.title}</h1> : null}
      <div className="create-widget-inner-container">
        <TextField
          outlined
          label="Home Page"
          required
          value={homePage}
          placeholder={"https://example.com"}
          disabled={props.disabled}
          invalid={homePage !== undefined && !Url.Is(homePage)}
          onChange={event =>
            updateHomePage((event.target as HTMLInputElement).value)
          }
        />
        <ReactFlagsSelect
          defaultCountry={defaultCountry}
          searchable={true}
          countries={["US", "CA"]}
          onSelect={country => updateCountry(country)}
        />
        <TextField
          outlined
          label="Phone"
          required
          value={phone}
          disabled={props.disabled}
          placeholder={"+1 123 456 7890"}
          invalid={phone !== undefined && !Phone.Is(phone)}
          onChange={event =>
            updatePhone((event.target as HTMLInputElement).value)
          }
        />
        <div>
          <Button
            disabled={props.disabled}
            onClick={() => toggleColorPicker(!showColorPicker)}
            raised
            dense
            style={{
              backgroundColor: color,
              color: Color.IsLight(color as Color.T) ? "black" : "white"
            }}
          >
            Pick a Color
          </Button>
          {showColorPicker ? (
            <div className="create-widget-color-picker-popover">
              <div
                className="create-widget-color-picker-cover"
                onClick={() => toggleColorPicker(!showColorPicker)}
              />
              <ChromePicker
                color={color}
                onChangeComplete={(input: { hex: string }) =>
                  updateColor(input.hex)
                }
              />
            </div>
          ) : null}
        </div>
        <Button
          raised
          className="create-widget-submit-button"
          disabled={
            props.disabled ||
            (!Phone.Is(phone) ||
              !Plan.Country.Is(country) ||
              !Url.Is(homePage) ||
              !Color.Is(color))
          }
          onClick={() =>
            props.onSubmit(
              Widget.C(
                phone as Phone.T,
                country as Plan.Country.T,
                homePage as Url.T,
                color as Color.T
              )
            )
          }
          icon={props.submitButtonIcon}
        >
          {props.submitButtonText}
        </Button>
      </div>
    </div>
  );
};
