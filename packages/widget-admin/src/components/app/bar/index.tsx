import React from "react";
import "@material/top-app-bar/dist/mdc.top-app-bar.css";
import "@material/button/dist/mdc.button.css";
import { Button } from "@rmwc/button";
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle
} from "@rmwc/top-app-bar";
import "./style.css";

export const AppBar = (props: { logout: () => void }) => (
  <TopAppBar fixed className="app-bar">
    <TopAppBarRow>
      <TopAppBarSection alignStart>
        <TopAppBarTitle>ping</TopAppBarTitle>
      </TopAppBarSection>
      <TopAppBarSection alignEnd>
        <Button onClick={props.logout} outlined theme={["onPrimary"]}>
          Logout
        </Button>
      </TopAppBarSection>
    </TopAppBarRow>
  </TopAppBar>
);
