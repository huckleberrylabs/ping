import React from "react";
import { Link } from "react-router-dom";

// UI
import { Card, CardMedia, CardPrimaryAction } from "@rmwc/card";
import "@rmwc/card/styles";
import "./style.css";
import { Widget } from "@huckleberrylabs/ping-core";

type Props = {
  widget: Widget.Settings.Model.T;
};

export const WidgetCard = (props: Props) => (
  <Link to={`/widgets/${props.widget.id}`}>
    <Card className="widget-card">
      <CardPrimaryAction>
        <CardMedia className="widget-card-image" sixteenByNine />
        <div className="widget-card-description">
          <h2>{new URL(props.widget.homePage).host}</h2>
        </div>
      </CardPrimaryAction>
    </Card>
  </Link>
);
