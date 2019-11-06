import React from "react";

// Button
import "@material/button/dist/mdc.button.css";
import { Button } from "@rmwc/button";

// Top App Bar
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle
} from "@rmwc/top-app-bar";
import "@material/top-app-bar/dist/mdc.top-app-bar.css";

// Logo
import Logo from "../../../media/logo-white.png";

// Style
import "./style.css";

type Props = {
  isLoggedIn: boolean;
  fixed: boolean;
  logout?: () => void;
};

export const AppBar = (props: Props) => (
  <TopAppBar fixed={props.fixed} className="app-bar">
    <TopAppBarRow>
      <TopAppBarSection alignStart>
        <TopAppBarTitle>
          <img src={Logo} className="app-bar-logo" />
        </TopAppBarTitle>
      </TopAppBarSection>
      <TopAppBarSection alignEnd>
        <Button
          onClick={() =>
            props.isLoggedIn && props.logout
              ? props.logout()
              : window.location.replace("/login")
          }
          outlined
          theme={["onPrimary"]}
        >
          {props.isLoggedIn ? "Logout" : "Login"}
        </Button>
      </TopAppBarSection>
    </TopAppBarRow>
  </TopAppBar>
);
