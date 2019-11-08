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
import { Url } from "@huckleberryai/core";

type Props = {
  label?: string;
  disabled?: boolean;
  required?: boolean;
  initialValue?: Url.T;
  onSelect: (input: Url.T) => void;
};

export const UrlField = ({
  label,
  disabled,
  required,
  initialValue,
  onSelect
}: Props) => {
  const [changed, updateChanged] = useState<boolean>(false);
  const [url, updateUrl] = useState<string>(initialValue || "");
  return (
    <div className="url-field">
      <TextField
        outlined
        label={label || "url"}
        placeholder={"https://example.com"}
        disabled={disabled}
        value={url}
        invalid={required && !Url.Is(url) && changed}
        onChange={event => {
          const value = (event.target as HTMLInputElement).value;
          updateChanged(true);
          updateUrl(value);
          if (Url.Is(value)) onSelect(value);
        }}
      />
    </div>
  );
};
