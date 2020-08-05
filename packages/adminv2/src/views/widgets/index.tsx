import React from "react";
import { Link } from "react-router-dom";

// Button
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";

import { WidgetCard } from "../../components/widget-card";
import "./style.css";

type Widget = {
  id: string;
  homePage: string;
};

const widgets: Widget[] = [
  {
    id: "2324",
    homePage: "https://ping.buzz",
  },
];

export const Widgets = () => {
  return (
    <div className="widgets-container">
      <div className="widgets-controls">
        <h1>Widgets</h1>
        <p>
          {widgets.length} widget{widgets.length > 1 ? "s" : ""} found
        </p>
      </div>
      <div className="widgets-grid">
        {widgets.map((widget: Widget) => (
          <WidgetCard key={widget.id} widget={widget} />
        ))}
        <Link key="new" to={`/add-widget`}>
          <div className="new-widget-button-container">
            <Button
              className="new-widget-button"
              label="New Widget"
              icon="add"
              outlined
            />
          </div>
        </Link>
      </div>
    </div>
  );
};
