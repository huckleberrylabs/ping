import React from "react";
import "@material/radio/dist/mdc.radio.css";
import "@material/form-field/dist/mdc.form-field.css";
import { Radio } from "@rmwc/radio";

export enum SchoolExplorerViewModes {
  MAP = "MAP",
  LIST = "LIST"
}

type Props = {
  currentViewMode: SchoolExplorerViewModes;
  onChangeViewMode: (mode: SchoolExplorerViewModes) => void;
};

export const SchoolExplorerViewSelector = (props: Props) => {
  return (
    <>
      <Radio
        value={SchoolExplorerViewModes.LIST}
        checked={props.currentViewMode === SchoolExplorerViewModes.LIST}
        onChange={evt => props.onChangeViewMode(evt.currentTarget.value)}
      >
        List
      </Radio>

      <Radio
        value={SchoolExplorerViewModes.MAP}
        checked={props.currentViewMode === SchoolExplorerViewModes.MAP}
        onChange={evt => props.onChangeViewMode(evt.currentTarget.value)}
      >
        Map
      </Radio>
    </>
  );
};
