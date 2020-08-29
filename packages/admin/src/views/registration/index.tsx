import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { isLeft } from "fp-ts/lib/Either";
import { Link } from "react-router-dom";

import {
  Url,
  UUID,
  PhoneWithCountry,
  EmailAddress,
  Config,
  Customers,
  Billing,
  StatusCode,
  Errors,
} from "@huckleberrylabs/ping-core";

// UI
import { ForwardButton } from "../../components/forward-button";
import { PhoneCountryField } from "../../components/phone-country-field";
import { WidgetCodeSnippet } from "../../components/code-snippet";
import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/styles";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import "./style.css";

export const Registration = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [website, setWebsite] = useState<string>("");
  const [widgetID, setWidgetID] = useState<UUID.T>();
  const [phone, setPhone] = useState<PhoneWithCountry.T>();
  const [email, setEmail] = useState<string>("");
  const [promoCode, setPromoCode] = useState<string>("");
  const onSubmit = async () => {
    setLoading(true);
    if (!Url.Is(website)) {
      toast.warn(
        "please indicate which website you would like to add Ping to."
      );
      setLoading(false);
      return;
    }
    if (!PhoneWithCountry.Is(phone)) {
      toast.warn(
        "please indicate which phone number to send your messages to."
      );
      setLoading(false);
      return;
    }
    if (!EmailAddress.Is(email)) {
      toast.warn("please indicate which email you wish to login with.");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post(
        Config.GetEndpoint(Customers.UseCases.Register.Route),
        Customers.UseCases.Register.Command.Encode(
          Customers.UseCases.Register.Command.C(
            website,
            phone,
            email,
            Billing.Values.PromoCode.Is(promoCode) ? promoCode : undefined
          )
        ),
        {
          withCredentials: true,
          validateStatus: () => true,
        }
      );
      if (res.status === StatusCode.OK) {
        const uuidMaybe = UUID.Decode(res.data);
        if (isLeft(uuidMaybe)) {
          toast.error("There was an error on our end, please try again later.");
          setLoading(false);
        } else {
          toast.success("Account created successfully!");
          setLoading(false);
          setWidgetID(uuidMaybe.right);
        }
      } else {
        const error = Errors.FromStatusCode(res.status, res.data);
        toast.warn(error.userMessage);
        setLoading(false);
      }
    } catch (err) {
      const error = Errors.Adapter.C("Registration", err.message);
      toast.warn(error.userMessage);
      setLoading(false);
    }
  };
  if (!widgetID)
    return (
      <div className="registration">
        <div>
          <h1>
            The Rundown{" "}
            <span role="img" aria-label="running person">
              🏃‍♂
            </span>
          </h1>
          <p>
            Hi there! See that button at the bottom right of your screen? That's
            Ping - a minimalist floating action button (FAB) for your website.
            With ping your website visitors can start a text messaging
            conversation with you, instantly.
            <br />
            <br />
            Ping costs 20 bucks a year, for an unlimited number of websites. You
            can try it without a credit card for 30 days. Not only that, but you
            can use Ping at a discount (or even free) if need be. Email Mossab,
            our one-man customer service department at mossab@ping.buzz and
            he'll get you sorted. To help keep the phone bill low, the
            conversations expire after 4 hours of inactivity - we may change
            this as we learn more about your needs.
            <br />
            <br />
            The ping button can be customized. You may view engagement
            analytics, track conversations and route messages as you wish. To
            protect your privacy, provide a fluid experience, and support
            advanced use cases that fit your needs, the conversation is proxied
            through an endless pool of local phone numbers.
            <br />
            <br />
            Ping works with any website, just copy and paste one line of code
            into the header of your html. If you dont know how to do that, no
            problem! Dragos, our one man software department will help you out,
            just shoot him an email at dragos@ping.buzz.
            <br />
            <br />
            Right now, we only offer our service in Canada and the United
            States. We strive to be leaders in data privacy and stewardship, if
            you have any suggestions or concerns please reach out.
          </p>
          <h2>Give It A Go </h2>
          <TextField
            outlined
            required
            label="Website"
            value={website}
            invalid={!Url.Is(website) && website !== ""}
            onChange={(event) =>
              setWebsite((event.target as HTMLInputElement).value)
            }
            onKeyPress={(event) => {
              if (event.key === "Enter") onSubmit();
            }}
          />
          <PhoneCountryField
            onSelect={setPhone}
            showSelectedLabel={false}
            required
          />
          <TextField
            outlined
            label="Email"
            value={email}
            required
            invalid={!EmailAddress.Is(email) && email !== ""}
            onChange={(event) =>
              setEmail((event.target as HTMLInputElement).value)
            }
            onKeyPress={(event) => {
              if (event.key === "Enter") onSubmit();
            }}
          />
          <TextField
            outlined
            label="Promo Code"
            value={promoCode}
            invalid={
              !Billing.Values.PromoCode.Is(promoCode) && promoCode !== ""
            }
            onChange={(event) =>
              setPromoCode((event.target as HTMLInputElement).value)
            }
            onKeyPress={(event) => {
              if (event.key === "Enter") onSubmit();
            }}
          />
          <div className="button-div">
            <ForwardButton
              label={loading ? "Loading..." : "Lets Go!"}
              icon={loading ? <CircularProgress /> : "keyboard_arrow_right"}
              disabled={
                !Url.Is(website) ||
                !PhoneWithCountry.Is(phone) ||
                !EmailAddress.Is(email) ||
                loading
              }
              onClick={onSubmit}
            />
          </div>
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    );
  else
    return (
      <div className="registration">
        <div id="registration-complete">
          {/* The id above is used for conversion tracking */}
          <h1>
            Welcome to Ping {"   "}
            <span role="img" aria-label="rocket ship">
              🚀
            </span>
          </h1>
          <WidgetCodeSnippet id={widgetID} />
          <p>Alternatively, you may login to customize and explore.</p>
          <div className="register-account-login-button">
            <Link to="/login">
              <ForwardButton
                label="Login"
                icon="keyboard_arrow_right"
                onClick={() => {}}
              />
            </Link>
          </div>
          <br />
          <br />
          <br />
        </div>
      </div>
    );
};
