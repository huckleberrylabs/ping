import React from "react";

// Button
import { Button } from "@rmwc/button";
import { IconPropT } from "@rmwc/types";
import "@material/button/dist/mdc.button.css";

// Style
import "./style.css";

type Props = {
  label?: string;
  icon?: IconPropT;
  show?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export const ForwardButton = ({
  label,
  icon,
  show = true,
  disabled,
  onClick
}: Props) => (
  <div className="forward-button">
    {show ? (
      <Button
        raised
        trailingIcon={icon || "keyboard_arrow_right"}
        theme={["textPrimaryOnLight"]}
        disabled={disabled}
        onClick={onClick}
      >
        {label || "submit"}
      </Button>
    ) : null}
  </div>
);
