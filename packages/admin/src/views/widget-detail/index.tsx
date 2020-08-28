import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useHistory } from "react-router";
import { isLeft } from "fp-ts/lib/Either";
import { toast } from "react-toastify";
import { Routes } from "../../config";
import { useObservable } from "../../observable";
import { widgetService, WidgetStates } from "../../services";
import { UUID, Widget, Url, Errors } from "@huckleberrylabs/ping-core";

// UI
import { DeleteWidget } from "../widget-delete";
import { WidgetCodeSnippet } from "../../components/code-snippet";
import { ForwardButton } from "../../components/forward-button";
import { ErrorButton } from "../../components/error-button";
import { Loading } from "../../components/loading";
import { UrlField } from "../../components/url-field";
import { ColorField } from "../../components/color-field";
import { IconField } from "../../components/icon-field";
import { Switch } from "@rmwc/switch";
import "@rmwc/switch/styles";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { Select } from "@rmwc/select";
import "@rmwc/select/styles";
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/styles";
import "./style.css";
import { Router } from "../router";

const UpdateForm = (props: { original: Widget.Settings.Model.T }) => {
  const [original, setOriginal] = useState<Widget.Settings.Model.T>(
    props.original
  );
  const [modified, setModified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(original.enabled);
  const toggleEnabled = () => setEnabled(!enabled);
  const [homePage, setHomePage] = useState<Url.T>(original.homePage);
  const [color, setColor] = useState<Widget.Values.Color.T>(original.color);
  const [icon, setIcon] = useState<Widget.Values.Icon.T>(original.icon);
  const [animation, setAnimation] = useState<Widget.Values.Animation.T>(
    original.animation
  );
  const [buttonText, setButtonText] = useState<Widget.Values.ButtonText.T>(
    original.buttonText
  );
  const [xOffset, setXOffset] = useState<Widget.Values.Offset.T>(
    original.xOffset
  );
  const [yOffset, setYOffset] = useState<Widget.Values.Offset.T>(
    original.yOffset
  );

  const onSubmit = async () => {
    const widget = {
      ...original,
      enabled,
      homePage,
      color,
      icon,
      animation,
      buttonText,
      xOffset,
      yOffset,
    };
    setLoading(true);
    const result = await widgetService.updateWidget(widget);
    setLoading(false);
    if (isLeft(result)) {
      toast.error(result.left.userMessage);
    } else {
      toast.success("Widget updated succesfully.");
      setOriginal(widget);
      setModified(false);
    }
  };

  return (
    <div className="update-widget">
      <h1>Widget</h1>
      <div className="update-widget-inner">
        <div className="update-widget-fields">
          <h2>Settings</h2>
          <div className="update-widget-enabled">
            <h3>Enable</h3>
            <Switch
              checked={enabled}
              disabled={loading}
              onChange={() => {
                setModified(enabled === original.enabled || modified); // about to be different
                toggleEnabled();
              }}
              theme={"primary"}
            />
          </div>
          <div className="update-widget-home-page">
            <h3>Home Page</h3>
            <UrlField
              label="homepage url"
              disabled={loading}
              required
              initialValue={original.homePage}
              onSelect={(value) => {
                setModified(value !== original.homePage || modified);
                setHomePage(value);
              }}
            />
          </div>
          <div>
            <h3>Color</h3>
            <ColorField
              initialValue={original.color}
              disabled={loading}
              onSelect={(value) => {
                setModified(value !== original.color || modified);
                setColor(value);
              }}
            />
          </div>
          <div>
            <h3>Icon</h3>
            <IconField
              initialValue={original.icon}
              disabled={loading}
              color={color}
              onSelect={(value) => {
                setModified(value !== original.icon || modified);
                setIcon(value);
              }}
            />
          </div>
          <div>
            <h3>Animation</h3>
            <Select
              label="Animation"
              disabled={loading}
              enhanced
              options={Widget.Values.Animation.Array}
              value={animation}
              onChange={(event) => {
                const value = (event.target as HTMLInputElement)
                  .value as Widget.Values.Animation.T;
                setModified(value !== original.animation || modified);
                setAnimation(value);
              }}
            />
          </div>
          <div>
            <h3>Button Text</h3>
            <Select
              label="Text"
              disabled={loading}
              enhanced
              options={Widget.Values.ButtonText.Array}
              value={buttonText}
              onChange={(event) => {
                const value = (event.target as HTMLInputElement)
                  .value as Widget.Values.ButtonText.T;
                setModified(value !== original.buttonText || modified);
                setButtonText(value);
              }}
            />
          </div>
          <div className="update-widget-offsets">
            <h3>Offset</h3>
            <div>
              <TextField
                outlined
                disabled={loading}
                label="x-axis (pixels)"
                value={xOffset}
                type="number"
                min="0"
                step="1"
                invalid={!Widget.Values.Offset.Is(Number(xOffset))}
                onChange={(event) => {
                  const value = Number(
                    (event.target as HTMLInputElement).value
                  ) as Widget.Values.Offset.T;
                  setModified(value !== original.xOffset || modified);
                  setXOffset(value);
                }}
              />
              <TextField
                outlined
                disabled={loading}
                label="y-axis (pixels)"
                value={yOffset}
                type="number"
                min="0"
                step="1"
                invalid={!Widget.Values.Offset.Is(Number(yOffset))}
                onChange={(event) => {
                  const value = Number(
                    (event.target as HTMLInputElement).value
                  ) as Widget.Values.Offset.T;
                  setModified(value !== original.yOffset || modified);
                  setYOffset(value);
                }}
              />
            </div>
          </div>
          <div className="update-widget-save">
            <ForwardButton
              label={loading ? "loading..." : "save"}
              icon={loading ? <CircularProgress /> : "keyboard_arrow_right"}
              disabled={!modified || loading}
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
          <WidgetCodeSnippet id={original.id} />
          <div>
            <h2>Routing</h2>
            <Router channel={original.id} />
          </div>
          <div>
            <h2>Analytics</h2>
            <Link to={`/analytics/${original.id}`}>
              <Button raised>View</Button>
            </Link>
          </div>
          <div className="delete-container">
            <DeleteWidget id={original.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const WidgetDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const state = useObservable(widgetService.state);
  const map = useObservable(widgetService.map);
  const widget = map.get(id);

  if (!UUID.Is(id)) history.push(Routes.widgets);
  if (widget) return <UpdateForm original={widget} />;
  if (state === WidgetStates.UNINITIALIZED) widgetService.get(id);
  if (Errors.Is(state)) {
    toast.error(state.userMessage);
    return <ErrorButton />;
  }
  if (state === WidgetStates.IDLE) widgetService.get(id);
  // WidgetStates.LOADING
  return <Loading />;
};
