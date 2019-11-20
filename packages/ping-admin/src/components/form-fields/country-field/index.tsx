import React from "react";

// Country Select
import ReactFlagsSelect from "react-flags-select";
import "react-flags-select/css/react-flags-select.css";

// Style
import "./style.css";

// Domain
import { Country } from "@huckleberryai/ping/lib/plan";

export const DefaultCountry: Country.T = "CA";
export const Countries: Country.T[] = ["US", "CA", "GB"];

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
  onSelect
}: Props) => (
  <div className={`country-field ${className}`}>
    <ReactFlagsSelect
      searchable={true}
      defaultCountry={initialValue}
      showSelectedLabel={showSelectedLabel}
      countries={Countries}
      onSelect={country => onSelect(country as Country.T)}
    />
  </div>
);
