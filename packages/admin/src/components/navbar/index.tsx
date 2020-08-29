import React from "react";
import { authService } from "../../services";

// UI
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
} from "@rmwc/top-app-bar";
import "@rmwc/top-app-bar/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
//import LightLogo from "../../media/logo-white.png";
//import DarkLogo from "../../media/logo.png";
import "./style.css";

type Props = {
  fixed?: boolean;
  transparent?: boolean;
};

export const NavBar = ({ fixed, transparent }: Props) => (
  <TopAppBar
    fixed={fixed}
    scrollTarget={null}
    className={`nav-bar ${transparent ? "transparent" : ""}`}
  >
    <TopAppBarRow>
      <TopAppBarSection alignStart>
        <TopAppBarTitle>Ping</TopAppBarTitle>
      </TopAppBarSection>
      <TopAppBarSection alignEnd>
        <Button onClick={() => authService.logout()} unelevated={!transparent}>
          Logout
        </Button>
      </TopAppBarSection>
    </TopAppBarRow>
  </TopAppBar>
);
