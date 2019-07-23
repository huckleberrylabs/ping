import React from "react";
import "@material/toolbar/dist/mdc.toolbar.css";
import { Toolbar, ToolbarRow, ToolbarSection } from "@rmwc/toolbar";
import { FilterMenu } from "../filter-menu";
import {
  SchoolExplorerViewSelector,
  SchoolExplorerViewModes
} from "../view-selector";

type Props = {
  currentViewMode: SchoolExplorerViewModes;
  onChangeViewMode: (mode: SchoolExplorerViewModes) => void;
};

export const SchoolExplorerBar = (props: Props) => {
  return (
    <Toolbar theme="secondaryBg">
      <ToolbarRow>
        <ToolbarSection alignStart>
          <SchoolExplorerViewSelector
            currentViewMode={props.currentViewMode}
            onChangeViewMode={props.onChangeViewMode}
          />
        </ToolbarSection>
        <ToolbarSection alignEnd>
          <FilterMenu />
        </ToolbarSection>
      </ToolbarRow>
    </Toolbar>
  );
};
