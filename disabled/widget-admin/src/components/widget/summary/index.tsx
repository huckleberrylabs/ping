import React from "react";
import { Link } from "react-router-dom";
import "@material/card/dist/mdc.card.css";
import "@material/button/dist/mdc.button.css";
import "@material/icon-button/dist/mdc.icon-button.css";
import "@material/typography/dist/mdc.typography.css";
import { Card, CardPrimaryAction, CardMedia } from "@rmwc/card";
import { Typography } from "@rmwc/typography";
import { IWidgetSettings } from "@huckleberryai/widget";

type Props = {
  widget: IWidgetSettings;
};

export const WidgetSummary = (props: Props) => (
  <Card style={{ width: "21rem" }}>
    <Link to={`/widgets/${props.widget.id}`}>
      <CardPrimaryAction>
        <CardMedia
          sixteenByNine
          style={{
            backgroundImage:
              "url(https://lh3.googleusercontent.com/4hZCrzldrLs4n0raLZo2-wmZXR8J8MKpIm3QM7i3bhaUtzwmyjj_xd6QrA8qCEmnyZSzfRWA6tMYEjNl--5ZsD-2GQligxIm2FEzqcY)"
          }}
        />
        <div style={{ padding: "0 1rem 1rem 1rem" }}>
          <Typography use="headline6" tag="h2">
            google.com
          </Typography>
        </div>
      </CardPrimaryAction>
    </Link>
  </Card>
);
