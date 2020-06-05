import React, { useState } from "react";

// TextField
import { TextField } from "@rmwc/textfield";
import "@material/textfield/dist/mdc.textfield.css";
import "@material/floating-label/dist/mdc.floating-label.css";
import "@material/notched-outline/dist/mdc.notched-outline.css";
import "@material/line-ripple/dist/mdc.line-ripple.css";

// Style
import "./style.css";

// Domain
import { Phone } from "@huckleberrylabs/core";

type Props = {
  label?: string;
  disabled?: boolean;
  required?: boolean;
  initialValue?: Phone.T;
  onSelect: (input: Phone.T) => void;
};

export const PhoneField = ({
  label,
  disabled,
  required,
  initialValue,
  onSelect,
}: Props) => {
  const [changed, updateChanged] = useState<boolean>(false);
  const [phone, updatePhone] = useState<string>(initialValue || "");
  return (
    <div className="phone-field">
      <TextField
        outlined
        label={label || "phone"}
        placeholder={"+1 123 456 7890"}
        disabled={disabled}
        value={phone}
        invalid={required && !Phone.Is(phone) && changed}
        onChange={(event) => {
          const value = (event.target as HTMLInputElement).value;
          updateChanged(true);
          updatePhone(value);
          if (Phone.Is(value)) onSelect(value);
        }}
      />
    </div>
  );
};
