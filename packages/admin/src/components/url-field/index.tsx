import React, { useState } from "react";
import { Url } from "@huckleberrylabs/ping-core";

// UI
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import "./style.css";

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
  required = false,
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
        invalid={
          (required && changed && !Url.Is(url)) || (url !== "" && !Url.Is(url))
        }
        onChange={(event) => {
          const value = (event.target as HTMLInputElement).value;
          updateChanged(true);
          updateUrl(value);
          if (Url.Is(value)) onSelect(value);
        }}
      />
    </div>
  );
};
