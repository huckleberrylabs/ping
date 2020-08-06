import React, { useState } from "react";

import { ForwardButton } from "../../components/forward-button";
import { WidgetCodeSnippet } from "../../components/code-snippet";
import { UrlField } from "../../components/url-field";
import { ColorField } from "../../components/color-field";
import { IconField } from "../../components/icon-field";

// Switch
import { Switch } from "@rmwc/switch";
import "@rmwc/switch/styles";

// Text Field
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";

// Select Field
import { Select } from "@rmwc/select";
import "@rmwc/select/styles";

// Loading
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/styles";

// Style
import "./style.css";
import { DeleteWidget } from "../delete-widget";

type Widget = {
  id: string;
  enabled: boolean;
  homePage: string;
  color: string;
  icon: 1 | 2;
  animation: Animation;
  buttonText: ButtonText;
  xOffset: number;
  yOffset: number;
};

type ButtonText = "Ping" | "Ping Me" | "Ping Us";
const ButtonTextList: ButtonText[] = ["Ping", "Ping Me", "Ping Us"];

type Animation = "Wiggle" | "Pulse" | "Jolt" | "None";
const Animations: Animation[] = ["Wiggle", "Pulse", "Jolt", "None"];

export const IsWholeNumber = (input: unknown): boolean =>
  typeof input === "number" && input.valueOf() >= 0 && Number.isInteger(input);

export const UpdateWidget = () => {
  const widget: Widget = {
    id: "123",
    enabled: true,
    homePage: "https://ping.buzz",
    color: "#0087ff",
    icon: 1,
    animation: "None",
    buttonText: "Ping",
    xOffset: 20,
    yOffset: 20,
  };
  const [loading] = useState<boolean>(false);
  const [enabled, updateEnabled] = useState<boolean>(widget.enabled);
  const toggleEnabled = () => updateEnabled(!enabled);
  const [homePage, updateHomePage] = useState<string>(widget.homePage);
  const [color, updateColor] = useState<string>(widget.color);
  const [icon, updateIcon] = useState<1 | 2>(widget.icon);
  const [animation, updateAnimation] = useState<Animation>(widget.animation);
  const [buttonText, updateButtonText] = useState<ButtonText>(
    widget.buttonText
  );
  const [xOffset, updateXOffset] = useState<string>(widget.xOffset.toString());
  const [yOffset, updateYOffset] = useState<string>(widget.yOffset.toString());

  const valid = true;
  const changed =
    widget.enabled !== enabled ||
    widget.homePage !== homePage ||
    widget.color !== color ||
    widget.icon !== icon ||
    widget.animation !== animation ||
    widget.buttonText !== buttonText ||
    widget.xOffset !== parseInt(xOffset) ||
    widget.yOffset !== parseInt(yOffset);

  const onSubmit = async () => {};

  return (
    <div className="update-widget">
      <h1>Widget</h1>
      <div className="update-widget-inner">
        <div className="update-widget-fields">
          <h2>Settings</h2>
          <div className="update-widget-enabled">
            <h3>Enable</h3>
            <Switch
              disabled={loading}
              checked={enabled}
              onChange={toggleEnabled}
              theme={"primary"}
            />
          </div>
          <div className="update-widget-home-page">
            <h3>Home Page</h3>
            <UrlField
              label="homepage url"
              disabled={loading}
              required
              initialValue={homePage}
              onSelect={updateHomePage}
            />
          </div>
          <div>
            <h3>Color</h3>
            <ColorField
              disabled={loading}
              initialValue={color}
              onSelect={updateColor}
            />
          </div>
          <div>
            <h3>Icon</h3>
            <IconField
              disabled={loading}
              initialValue={icon}
              color={color}
              onSelect={updateIcon}
            />
          </div>
          <div>
            <h3>Animation</h3>
            <Select
              label="Animation"
              enhanced
              options={Animations}
              value={animation}
              onChange={(event) => {
                const value = (event.target as HTMLInputElement)
                  .value as Animation;
                updateAnimation(value);
              }}
            />
          </div>
          <div>
            <h3>Button Text</h3>
            <Select
              label="Text"
              enhanced
              options={ButtonTextList}
              value={buttonText}
              onChange={(event) => {
                const value = (event.target as HTMLInputElement)
                  .value as ButtonText;
                updateButtonText(value);
              }}
            />
          </div>
          <div className="update-widget-offsets">
            <h3>Offset</h3>
            <div>
              <TextField
                outlined
                label="x-axis (pixels)"
                value={xOffset}
                type="number"
                min="0"
                step="1"
                invalid={!IsWholeNumber(Number(xOffset))}
                onChange={(event) => {
                  const value = (event.target as HTMLInputElement).value;
                  updateXOffset(value);
                }}
              />
              <TextField
                outlined
                label="y-axis (pixels)"
                value={yOffset}
                type="number"
                min="0"
                step="1"
                invalid={!IsWholeNumber(Number(yOffset))}
                onChange={(event) => {
                  const value = (event.target as HTMLInputElement).value;
                  updateYOffset(value);
                }}
              />
            </div>
          </div>
          <div className="update-widget-save">
            <ForwardButton
              label={loading ? "loading..." : "save"}
              icon={loading ? <CircularProgress /> : "keyboard_arrow_right"}
              disabled={loading || !changed || !valid}
              onClick={onSubmit}
            />
          </div>
        </div>
        <div className="update-widget-info">
          <h2>Setup</h2>
          {/* <div className="update-widget-verified">
              <label>Installation Verified</label>
              <Icon
                icon={{ icon: "check", size: "small" }}
                theme="textPrimaryOnDark"
              />
            </div> */}
          <WidgetCodeSnippet id={widget.id} />
          <div className="delete-container">
            <DeleteWidget />
          </div>
        </div>
      </div>
    </div>
  );
};
