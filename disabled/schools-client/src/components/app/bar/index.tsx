import React from "react";
import "@material/top-app-bar/dist/mdc.top-app-bar.css";
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle
} from "@rmwc/top-app-bar";
import { SearchBar } from "../../search/bar";
import { AppMenu } from "../menu";

export const AppBar = () => {
  return (
    <TopAppBar fixed>
      <TopAppBarRow>
        <TopAppBarSection alignStart>
          <TopAppBarTitle>Huckleberry School Explorer</TopAppBarTitle>
        </TopAppBarSection>
        <TopAppBarSection alignEnd>
          <SearchBar />
          <AppMenu />
        </TopAppBarSection>
      </TopAppBarRow>
    </TopAppBar>
  );
};
