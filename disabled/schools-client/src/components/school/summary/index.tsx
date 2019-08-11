import React from "react";
import { Link } from "react-router-dom";
import "@material/card/dist/mdc.card.css";
import "@material/button/dist/mdc.button.css";
import "@material/icon-button/dist/mdc.icon-button.css";
import "@material/typography/dist/mdc.typography.css";
import {
  Card,
  CardPrimaryAction,
  CardMedia,
  CardActions,
  CardActionButtons,
  CardActionButton,
  CardActionIcons,
  CardActionIcon,
} from "@rmwc/card";
import { Typography } from "@rmwc/typography";
import { School } from "@huckleberry/schools";

type Props = {
  school: School;
};

export const SchoolSummary = (props: Props) => (
  <Card style={{ width: "21rem" }}>
    <CardPrimaryAction>
      <CardMedia
        sixteenByNine
        style={{
          backgroundImage: "url(images/backgrounds/mb-bg-fb-16.png)",
        }}
      />
      <div style={{ padding: "0 1rem 1rem 1rem" }}>
        <Typography use="headline6" tag="h2">
          {props.school.name}
        </Typography>
        <Typography
          use="subtitle2"
          tag="h3"
          theme="textSecondaryOnBackground"
          style={{ marginTop: "-1rem" }}
        >
          {props.school.address}
        </Typography>
        <Typography use="body1" tag="div" theme="textSecondaryOnBackground">
          Rating: {props.school.rating} <br />
          {props.school.type}
        </Typography>
      </div>
    </CardPrimaryAction>
    <CardActions>
      <CardActionButtons>
        <Link to={`/schools/${props.school.id}`}>
          <CardActionButton>Details</CardActionButton>
        </Link>
      </CardActionButtons>
      <CardActionIcons>
        <CardActionIcon onIcon="favorite" icon="favorite_border" />
      </CardActionIcons>
    </CardActions>
  </Card>
);
