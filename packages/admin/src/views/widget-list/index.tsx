import { isLeft } from "fp-ts/lib/Either";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { useObservable } from "../../observable";
import { widgetService, WidgetStates } from "../../services";
import { Routes } from "../../config";
import { Errors, Url } from "@huckleberrylabs/ping-core";

// UI
import { WidgetCard } from "../../components/widget-card";
import { Modal } from "../../components/modal";
import { Loading } from "../../components/loading";
import { ErrorButton } from "../../components/error-button";
import { UrlField } from "../../components/url-field";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import "./style.css";

export const Widgets = () => {
  const history = useHistory();
  const state = useObservable(widgetService.state);
  const map = useObservable(widgetService.map);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [homePage, setHomePage] = useState<Url.T>();
  if (state === WidgetStates.IDLE)
    return (
      <div className="widgets">
        <div className="widgets-controls">
          <h1>Widgets</h1>
          <p>
            {map.size} widget
            {map.size > 1 ? "s" : ""} found
          </p>
        </div>
        <div className="widgets-grid">
          {Array.from(map.entries()).map(([id, widget]) => (
            <WidgetCard key={id} widget={widget} />
          ))}
          <div key="create-widget" className="create-widget">
            <Button
              label="New Widget"
              icon="add"
              outlined
              onClick={() => setOpen(true)}
            />
            <Modal open={open} onClose={() => setOpen(false)}>
              <div className="create-widget-modal">
                <div>
                  <h3>Create Widget</h3>
                  <UrlField
                    label="homepage url"
                    disabled={loading}
                    required
                    onSelect={(value) => {
                      setHomePage(value);
                    }}
                  />
                </div>
                <div className="create-widget-modal-buttons">
                  <Button danger onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      if (!Url.Is(homePage)) {
                        toast.warn(
                          "Please specify the url of the website you would to add a widget to."
                        );
                      } else {
                        setLoading(true);
                        const result = await widgetService.createWidget(
                          homePage
                        );
                        setLoading(false);
                        if (isLeft(result)) {
                          toast.error(result.left.userMessage);
                        } else {
                          toast.success("Widget created successfully.");
                          history.push(Routes.widgets + "/" + result.right);
                        }
                      }
                    }}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    );
  if (state === WidgetStates.UNINITIALIZED) widgetService.getByAccount();
  if (Errors.Is(state)) {
    toast.error(state.userMessage);
    return <ErrorButton />;
  }
  // WidgetStates.LOADING
  return <Loading />;
};
