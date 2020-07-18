import React, { useState } from "react";
import ColorLib from "color";

// Color Picker
import { ChromePicker } from "react-color";

// Button
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";

// Style
import "./style.css";

const DefaultColor = "#0087ff";

type Props = {
  label?: string;
  disabled?: boolean;
  initialValue?: string;
  onSelect: (input: string) => void;
};

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
          color: ColorLib(color).isLight() ? "black" : "white",
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
              onSelect(input.hex);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
