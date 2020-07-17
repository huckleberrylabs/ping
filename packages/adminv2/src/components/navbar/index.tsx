import React from "react";

// Auth Service
import { authService } from "../../services";

// Top App Bar
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from "@rmwc/top-app-bar";
import "@rmwc/top-app-bar/styles";

// Button
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";

// Logo
import LightLogo from "../../media/logo-white.png";
import DarkLogo from "../../media/logo.png";

// Style
import "./style.css";

type Props = {
  fixed?: boolean;
  transparent?: boolean;
};

export const NavBar = ({ fixed, transparent }: Props) => (
  <TopAppBar
    fixed={fixed}
    scrollTarget={null}
    className={`nav-bar ${transparent ? "nav-bar-transparent" : ""}`}
  >
    <TopAppBarRow>
      <TopAppBarSection alignStart>
        <TopAppBarTitle>
          <img
            src={transparent ? DarkLogo : LightLogo}
            className="nav-bar-logo"
            alt="Ping"
          />
        </TopAppBarTitle>
      </TopAppBarSection>
      <TopAppBarSection alignEnd>
        <Button onClick={() => authService.logout()} unelevated={!transparent}>
          Logout
        </Button>
      </TopAppBarSection>
    </TopAppBarRow>
  </TopAppBar>
);
