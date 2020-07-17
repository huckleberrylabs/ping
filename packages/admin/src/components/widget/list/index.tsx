import React /* , { useState } */ from "react";
import { Link } from "react-router-dom";

// Button
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";

// Select
// import { Select } from "@rmwc/select";
import "@material/select/dist/mdc.select.css";

// UI Components
import { WidgetCard } from "../card";

// Style
import "./style.css";

// Domain
import { Widget } from "@huckleberrylabs/ping-core";

type Props = {
  widgets: Widget.Settings.Model.T[];
};

export const WidgetList = (props: Props) => {
  return (
    <div className="widget-list-container">
      <div className="widget-list-controls">
        <h1>widgets</h1>
        <p>
          {props.widgets.length} widget{props.widgets.length > 1 ? "s" : ""}{" "}
          found
        </p>
      </div>
      <div className="widget-list-grid">
        {props.widgets
          //.slice(0, page * RESULTS_PER_PAGE)
          .map((widget) => (
            <WidgetCard key={widget.id} widget={widget} />
          ))}
        <Link key="new" to={`/add-widget`}>
          <div className="new-widget-button-container">
            <Button
              className="new-widget-button"
              label="new widget"
              icon="add"
              outlined
            />
          </div>
        </Link>
      </div>
    </div>
  );
};
