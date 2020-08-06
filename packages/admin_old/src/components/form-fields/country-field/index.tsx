import React from "react";

// Country Select
import ReactFlagsSelect from "react-flags-select";
import "react-flags-select/css/react-flags-select.css";

// Style
import "./style.css";

// Domain
import { DefaultCountry } from "../../../config";
import { Country } from "@huckleberrylabs/ping-core";

type Props = {
  className?: string;
  showSelectedLabel?: boolean;
  initialValue?: Country.T;
  onSelect: (input: Country.T) => void;
};

export const CountryField = ({
  className = "",
  showSelectedLabel = true,
  initialValue = DefaultCountry,
  onSelect,
}: Props) => (
  <div className={`country-field ${className}`}>
    <ReactFlagsSelect
      searchable={true}
      defaultCountry={initialValue}
      showSelectedLabel={showSelectedLabel}
      countries={Object.keys(Country.Countries)}
      onSelect={(country) => onSelect(country as Country.T)}
    />
  </div>
);
