import React, { useState } from "react";

// Color Picker
import { ChromePicker } from "react-color";

// Button
import { Button } from "@rmwc/button";
import "@material/button/dist/mdc.button.css";

// Style
import "./style.css";

// Domain
import { Color } from "@huckleberrylabs/core";

type Props = {
  label?: string;
  disabled?: boolean;
  initialValue?: Color.T;
  onSelect: (input: Color.T) => void;
};

export const DefaultColor = "#0087ff" as Color.T;

export const ColorField = ({
  label,
  disabled,
  initialValue,
  onSelect,
}: Props) => {
  const [showColorPicker, updateColorPicker] = useState(false);
  const toggleColorPicker = () => updateColorPicker(!showColorPicker);
  const [color, updateColor] = useState<string>(initialValue || DefaultColor);
  return (
    <div className="color-field">
      <Button
        className="color-field-button"
        raised
        style={{
          backgroundColor: color,
          color: Color.IsLight(color as Color.T) ? "black" : "white",
        }}
        disabled={disabled}
        onClick={toggleColorPicker}
      >
        {label || "color"}
      </Button>
      {showColorPicker ? (
        <div className="color-field-popover">
          <div className="color-field-cover" onClick={toggleColorPicker} />
          <ChromePicker
            color={color}
            onChangeComplete={(input: { hex: string }) => {
              updateColor(input.hex);
              onSelect(input.hex as Color.T);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
