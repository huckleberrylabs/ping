import React from "react";
import { Link } from "react-router-dom";
import "@material/card/dist/mdc.card.css";
import "@material/button/dist/mdc.button.css";
import "@material/icon-button/dist/mdc.icon-button.css";
import "@material/typography/dist/mdc.typography.css";
import { Card, CardPrimaryAction, CardMedia } from "@rmwc/card";
import { Typography } from "@rmwc/typography";
import { Settings } from "@huckleberryai/widget";

type Props = {
  widget: Settings.T;
};

export const WidgetSummary = (props: Props) => (
  <Card style={{ width: "21rem" }}>
    <Link to={`/widgets/${props.widget.id}`}>
      <CardPrimaryAction>
        <CardMedia
          sixteenByNine
          style={{
            backgroundImage:
              "url(https://files.slack.com/files-pri/TGZ5VJ67K-FP9NPVB0B/screen_shot_2019-10-21_at_12.46.54_pm.png)"
          }}
        />
        <div style={{ padding: "0 1rem 1rem 1rem" }}>
          <Typography use="headline6" tag="h2">
            {new URL(props.widget.homePage).host}
          </Typography>
        </div>
      </CardPrimaryAction>
    </Link>
  </Card>
);
