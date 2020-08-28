import { isRight, isLeft } from "fp-ts/lib/Either";
import React, { useState, FunctionComponent } from "react";
import { Country, PhoneWithCountry } from "@huckleberrylabs/ping-core";

// UI
import ReactFlagsSelect from "react-flags-select";
import "react-flags-select/css/react-flags-select.css";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import "./style.css";

type Props = {
  label?: string;
  disabled?: boolean;
  required?: boolean;
  initialPhone?: PhoneWithCountry.T;
  showSelectedLabel?: boolean;
  onSelect: (value: PhoneWithCountry.T) => void;
};
export const PhoneCountryField: FunctionComponent<Props> = ({
  label,
  disabled = false,
  required = false,
  initialPhone,
  showSelectedLabel,
  onSelect,
}) => {
  const [changed, setChanged] = useState<boolean>(false);
  const [country, setCountry] = useState<Country.T>(
    initialPhone?.country || Country.DEFAULT
  );
  const [phone, setPhone] = useState<string>(initialPhone?.number || "");
  return (
    <div className="phone-country-field">
      <ReactFlagsSelect
        searchable={true}
        defaultCountry={initialPhone?.country || Country.DEFAULT}
        showSelectedLabel={showSelectedLabel}
        countries={Object.keys(Country.Countries)}
        onSelect={(country) => setCountry(country as Country.T)}
      />
      <TextField
        outlined
        label={label || "phone"}
        placeholder={"+1 123 456 7890"}
        disabled={disabled}
        required={required}
        value={phone}
        invalid={
          (required && changed && isLeft(PhoneWithCountry.C(phone, country))) ||
          (phone !== "" && isLeft(PhoneWithCountry.C(phone, country)))
        }
        onChange={(event) => {
          const value = (event.target as HTMLInputElement).value;
          setPhone(value);
          setChanged(true);
          const phoneWithCounty = PhoneWithCountry.C(value, country);
          if (isRight(phoneWithCounty)) {
            onSelect(phoneWithCounty.right);
          }
        }}
      />
    </div>
  );
};
