import React, { useState } from "react";

// TextField
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";

// Style
import "./style.css";

type Props = {
  label?: string;
  disabled?: boolean;
  required?: boolean;
  initialValue?: string;
  onSelect: (input: string) => void;
};

const IsURL = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch (error) {
    return false;
  }
};

export const UrlField = ({
  label,
  disabled,
  required,
  initialValue,
  onSelect,
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
        invalid={required && IsURL(url) && changed}
        onChange={(event) => {
          const value = (event.target as HTMLInputElement).value;
          updateChanged(true);
          updateUrl(value);
          if (IsURL(value)) onSelect(value);
        }}
      />
    </div>
  );
};
