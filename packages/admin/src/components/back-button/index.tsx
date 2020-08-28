import React from "react";

// UI
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";

type Props = {
  label?: string;
  show?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export const BackButton = ({
  label,
  show = true,
  disabled,
  onClick,
}: Props) => (
  <div className="back-button">
    {show ? (
      <Button
        icon="keyboard_arrow_left"
        theme={["textPrimaryOnLight"]}
        disabled={disabled}
        onClick={onClick}
      >
        {label || "back"}
      </Button>
    ) : null}
  </div>
);
