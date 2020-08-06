import React from "react";

// Top App Bar
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from "@rmwc/top-app-bar";
import "@material/top-app-bar/dist/mdc.top-app-bar.css";

// Button
import "@material/button/dist/mdc.button.css";
import { Button } from "@rmwc/button";

// Logo
import LightLogo from "../../media/logo-white.png";
import DarkLogo from "../../media/logo.png";

// Style
import "./style.css";

type Props = {
  loggedIn?: boolean;
  fixed?: boolean;
  transparent?: boolean;
  logout?: () => void;
};

export const AppBar = ({ loggedIn, fixed, transparent, logout }: Props) => (
  <TopAppBar
    fixed={fixed}
    scrollTarget={null}
    className={`app-bar ${transparent ? "transparent" : ""}`}
  >
    <TopAppBarRow>
      <TopAppBarSection alignStart>
        <TopAppBarTitle>
          <img
            src={transparent ? DarkLogo : LightLogo}
            className="app-bar-logo"
            alt="Ping"
          />
        </TopAppBarTitle>
      </TopAppBarSection>
      <TopAppBarSection alignEnd>
        <Button
          onClick={() =>
            loggedIn && logout ? logout() : window.location.replace("/login")
          }
          unelevated={!transparent}
        >
          {loggedIn ? "logout" : "login"}
        </Button>
      </TopAppBarSection>
    </TopAppBarRow>
  </TopAppBar>
);
