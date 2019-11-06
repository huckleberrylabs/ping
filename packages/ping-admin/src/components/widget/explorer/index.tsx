import React from "react";
import { Widget } from "@huckleberryai/ping";
import { WidgetList } from "../list";
import "./style.css";

type Props = { widgets: Widget.T[] };

export const WidgetExplorer = (props: Props) => (
  <div className="explorer-container">
    <WidgetList widgets={props.widgets} />
  </div>
);
