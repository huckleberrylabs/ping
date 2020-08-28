import React, { useState } from "react";
import { Widget, Color } from "@huckleberrylabs/ping-core";

// UI
import { ChromePicker } from "react-color";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import "./style.css";

type Props = {
  label?: string;
  disabled?: boolean;
  initialValue?: Color.T;
  onSelect: (input: Color.T) => void;
};

export const ColorField = ({
  label,
  disabled,
  initialValue = Widget.Values.Color.DEFAULT,
  onSelect,
}: Props) => {
  const [showColorPicker, updateColorPicker] = useState(false);
  const toggleColorPicker = () => updateColorPicker(!showColorPicker);
  const [color, setColor] = useState<Color.T>(initialValue);
  return (
    <div className="color-field">
      <Button
        className="color-field-button"
        raised
        style={{
          backgroundColor: color,
          color: Color.IsLight(color) ? "black" : "white",
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
              const color = input.hex as Color.T;
              setColor(color);
              onSelect(color);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
