import React, { useState } from "react";
import { toast } from "react-toastify";

// UI
import { ForwardButton } from "../../components/forward-button";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { Select } from "@rmwc/select";
import "@rmwc/select/styles";
import { Card } from "@rmwc/card";
import "@rmwc/card/styles";
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/styles";
import { loadStripe, StripeCardElementChangeEvent } from "@stripe/stripe-js";
import { Elements, CardElement } from "@stripe/react-stripe-js";
import "./style.css";

enum Countries {
  ca = "Canada",
  us = "United States",
}

const CountriesNameList: Countries[] = Object.values(Countries);
export const CountriesISOList = Object.keys(Countries);

const provinceLabel = (country: Countries) =>
  ({
    Canada: "Province",
    "United States": "State",
  }[country]);

const StripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY
  ? process.env.REACT_APP_STRIPE_PUBLIC_KEY
  : "pk_test_yoFeO5x15PPlisJIQdFgoWbG005bjq8KtN";
const stripePromise = loadStripe(StripePublicKey);

export const UpdateBilling = () => {
  const [loading] = useState<boolean>(false);
  const [name, setName] = useState<string>("Huckleberry Labs");
  const [email, setEmail] = useState<string>("finance@huckleberry.app");
  const [address, setAddress] = useState<string>("173 Roger Street");
  const [city, setCity] = useState<string>("Waterloo");
  const [province, setProvince] = useState<string>("Ontario");
  const [country, setCountry] = useState<Countries>(Countries.ca);
  const [postalCode, setPostalCode] = useState<string>("N2J 1B1");
  const [changeCard, setChangeCard] = useState<boolean>(false);
  const toggleChangeCard = () => setChangeCard(!changeCard);
  const [card, setCard] = useState<StripeCardElementChangeEvent>();
  return (
    <div className="update-billing">
      <h2>Billing</h2>
      <div className="update-billing-inner">
        <TextField
          outlined
          label="Legal Name"
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
          invalid={address === ""}
          onChange={(event) => {
            const value = (event.target as HTMLInputElement).value;
            setAddress(value);
          }}
        />
        <div className="update-billing-city-province">
          <TextField
            outlined
            label="City"
            value={city}
            invalid={city === ""}
            onChange={(event) => {
              const value = (event.target as HTMLInputElement).value;
              setCity(value);
            }}
          />
          <TextField
            outlined
            label={provinceLabel(country)}
            value={province}
            invalid={province === ""}
            onChange={(event) => {
              const value = (event.target as HTMLInputElement).value;
              setProvince(value);
            }}
          />
        </div>
        <div className="update-billing-country-postal">
          <Select
            label="Country"
            enhanced
            options={CountriesNameList}
            value={country}
            onChange={(event) => {
              const value = (event.target as HTMLInputElement)
                .value as Countries;
              setCountry(value);
            }}
          />
          <TextField
            outlined
            label={country === "United States" ? "Zip Code" : "Postal Code"}
            value={postalCode}
            invalid={postalCode === ""}
            onChange={(event) => {
              const value = (event.target as HTMLInputElement).value;
              setPostalCode(value);
            }}
          />
        </div>
        <div>
          {changeCard ? (
            <div className="update-billing-stripe-container">
              <Elements stripe={stripePromise}>
                <CardElement
                  onChange={(change) => {
                    if (change) setCard(change);
                  }}
                  options={{
                    hidePostalCode: true,
                    classes: {
                      base: "update-billing-stripe mdc-ripple-surface",
                    },
                  }}
                />
              </Elements>
              <Button onClick={toggleChangeCard}>Cancel</Button>
            </div>
          ) : (
            <Card className="update-billing-cc-number-card">
              <h4>Visa ending in 3333</h4>
              <Button onClick={toggleChangeCard}>Change</Button>
            </Card>
          )}
        </div>
        <div className="update-billing-save">
          <ForwardButton
            label={loading ? "loading..." : "save"}
            icon={loading ? <CircularProgress /> : "keyboard_arrow_right"}
            disabled={loading}
            onClick={() => {
              toast.success("Billing details updated successfully.");
            }}
          />
        </div>
      </div>
    </div>
  );
};
