import React, { useState } from "react";
import { toast } from "react-toastify";

// Text Field
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";

// Select Field
import { Select } from "@rmwc/select";
import "@rmwc/select/styles";

// Button
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";

// Payment Card Field
import {
  injectStripe,
  Elements,
  CardElement,
  ReactStripeElements,
} from "react-stripe-elements";

// Style
import "./style.css";

enum Countries {
  ca = "Canada",
  us = "United States",
}

const CountriesNameList: Countries[] = Object.values(Countries);
const CountriesISOList = Object.keys(Countries);

const provinceLabel = (country: Countries) =>
  ({
    Canada: "Province",
    "United States": "State",
  }[country]);

console.log(CountriesNameList, CountriesISOList);

type Props = {
  stripe: ReactStripeElements.StripeProps;
};

export const UpdateBillingInner = (props: Props) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [country, setCountry] = useState<Countries>(Countries.ca);
  const [postalCode, setPostalCode] = useState<string>("");
  const [card, setCard] = useState<stripe.elements.ElementChangeResponse>();

  return (
    <>
      <h2>Billing</h2>
      <TextField
        outlined
        label="Organization Name"
        value={name}
        invalid={name === ""}
        onChange={(event) => {
          const value = (event.target as HTMLInputElement).value;
          setName(value);
        }}
      />
      <TextField
        outlined
        label="Billing Email"
        value={email}
        placeholder={"email@example.com"}
        invalid={email !== "" && email.indexOf("@") < 1}
        onChange={(event) => {
          const value = (event.target as HTMLInputElement).value;
          setEmail(value);
        }}
      />
      <TextField
        outlined
        label="Address"
        value={address}
        invalid={address !== ""}
        onChange={(event) => {
          const value = (event.target as HTMLInputElement).value;
          setAddress(value);
        }}
      />
      <TextField
        outlined
        label="City"
        value={city}
        invalid={city !== ""}
        onChange={(event) => {
          const value = (event.target as HTMLInputElement).value;
          setCity(value);
        }}
      />
      <TextField
        outlined
        label={provinceLabel(country)}
        value={province}
        invalid={province !== ""}
        onChange={(event) => {
          const value = (event.target as HTMLInputElement).value;
          setProvince(value);
        }}
      />
      <Select
        label="Country"
        enhanced
        options={CountriesNameList}
        value={country}
        onChange={(event) => {
          const value = (event.target as HTMLInputElement).value as Countries;
          setCountry(value);
        }}
      />
      <TextField
        outlined
        label={country === "United States" ? "Zip Code" : "Postal Code"}
        value={postalCode}
        invalid={postalCode !== ""}
        onChange={(event) => {
          const value = (event.target as HTMLInputElement).value;
          setPostalCode(value);
        }}
      />
      <CardElement
        hidePostalCode={true}
        placeholderCountry="ca"
        supportedCountries={CountriesISOList}
        classes={{
          base: "update-billing-stripe mdc-ripple-surface",
        }}
        onChange={(change) => setCard(change)}
      />
      <Button
        raised
        onClick={() => {
          toast.success("login settings updated successfully");
          console.log(card);
        }}
      >
        Save
      </Button>
    </>
  );
};

const WithStripe = injectStripe(UpdateBillingInner);

export const UpdateBilling = (props: any) => (
  <Elements>{<WithStripe {...props} />}</Elements>
);
